/**
 * Tests for /api/calendly-webhook. Closes part of BUG_HUNT_500 #476.
 *
 * Coverage:
 *   - 401 when CALENDLY_SIGNING_KEY unset (fail-closed)
 *   - 401 when calendly-webhook-signature header missing
 *   - 401 when signature has wrong format
 *   - 401 when timestamp is too old (replay protection)
 *   - 401 when v1 signature mismatches
 *   - 200 + lead inserted on valid signed `invitee.created`
 *   - 200 + log on valid signed `invitee.canceled` (no lead insert)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHmac } from 'crypto'

const mockInsert = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: () => ({ insert: (row: unknown) => mockInsert(row) }),
  })),
}))

const ORIGINAL_ENV = { ...process.env }
const SECRET = 'calendly-test-secret'

function signedRequest(rawBody: string, secret = SECRET, ageSec = 0) {
  const t = String(Math.floor(Date.now() / 1000) - ageSec)
  const v1 = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex')
  return new Request('http://localhost/api/calendly-webhook', {
    method: 'POST',
    headers: { 'calendly-webhook-signature': `t=${t},v1=${v1}` },
    body: rawBody,
  })
}

describe('/api/calendly-webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...ORIGINAL_ENV, CALENDLY_SIGNING_KEY: SECRET }
    mockInsert.mockReset()
    mockInsert.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when CALENDLY_SIGNING_KEY is unset (fail closed)', async () => {
    delete process.env.CALENDLY_SIGNING_KEY
    const { POST } = await import('@/app/api/calendly-webhook/route')
    const req = new Request('http://localhost/api/calendly-webhook', {
      method: 'POST',
      body: '{}',
    })
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 401 when signature header is missing', async () => {
    const { POST } = await import('@/app/api/calendly-webhook/route')
    const req = new Request('http://localhost/api/calendly-webhook', {
      method: 'POST',
      body: '{}',
    })
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 401 when signature has the wrong format', async () => {
    const { POST } = await import('@/app/api/calendly-webhook/route')
    const req = new Request('http://localhost/api/calendly-webhook', {
      method: 'POST',
      headers: { 'calendly-webhook-signature': 'not-a-real-signature' },
      body: '{}',
    })
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 401 when timestamp is older than freshness window (replay)', async () => {
    const { POST } = await import('@/app/api/calendly-webhook/route')
    // 600s old → outside the 300s default freshness window
    const req = signedRequest('{}', SECRET, 600)
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 401 when v1 signature mismatches', async () => {
    const { POST } = await import('@/app/api/calendly-webhook/route')
    const t = String(Math.floor(Date.now() / 1000))
    const req = new Request('http://localhost/api/calendly-webhook', {
      method: 'POST',
      headers: {
        'calendly-webhook-signature': `t=${t},v1=${'a'.repeat(64)}`,
      },
      body: '{"event":"invitee.created"}',
    })
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 200 + inserts lead on valid invitee.created', async () => {
    const { POST } = await import('@/app/api/calendly-webhook/route')
    const payload = JSON.stringify({
      event: 'invitee.created',
      payload: {
        event: { start_time: '2026-04-30T15:00:00Z', uri: 'https://api.calendly.com/...' },
        invitee: { email: 'lead@example.com', name: 'Lead Maria', text_reminder_number: '+595981000000' },
        tracking: { utm_source: 'salon-maria', utm_medium: 'whatsapp' },
      },
    })
    const req = signedRequest(payload)
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.received).toBe('invitee.created')
    expect(mockInsert).toHaveBeenCalledTimes(1)
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        site_slug: 'salon-maria',
        email: 'lead@example.com',
        name: 'Lead Maria',
        source: 'calendly',
      }),
    )
  })

  it('returns 200 + does not insert on invitee.canceled', async () => {
    const { POST } = await import('@/app/api/calendly-webhook/route')
    const payload = JSON.stringify({
      event: 'invitee.canceled',
      payload: { invitee: { email: 'lead@example.com' }, cancellation: { reason: 'no longer needed' } },
    })
    const req = signedRequest(payload)
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    expect(mockInsert).not.toHaveBeenCalled()
  })
})
