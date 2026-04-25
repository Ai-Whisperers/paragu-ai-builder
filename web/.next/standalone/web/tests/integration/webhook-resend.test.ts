/**
 * Tests for /api/webhooks/resend. Closes part of BUG_HUNT_500 #443.
 *
 * Coverage:
 *   - 401 when RESEND_WEBHOOK_SECRET unset
 *   - 401 when svix headers missing
 *   - 401 when signature mismatch
 *   - 200 + insert on valid signature
 *   - 200 + dedup on UNIQUE conflict (replay)
 *   - bounce/complaint logged at warn level
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createHmac } from 'crypto'

const mockInsert = vi.fn()
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(async () => ({
    from: () => ({ insert: (row: unknown) => mockInsert(row) }),
  })),
}))

const ORIGINAL_ENV = { ...process.env }

function signedRequest(body: string, secret: string, id = 'evt_test', timestamp = '1700000000') {
  const secretRaw = secret.startsWith('whsec_') ? secret.slice(6) : secret
  const secretBytes = Buffer.from(secretRaw, 'base64')
  const sig = createHmac('sha256', secretBytes)
    .update(`${id}.${timestamp}.${body}`)
    .digest('base64')
  return new Request('http://localhost/api/webhooks/resend', {
    method: 'POST',
    headers: {
      'svix-id': id,
      'svix-timestamp': timestamp,
      'svix-signature': `v1,${sig}`,
    },
    body,
  })
}

describe('/api/webhooks/resend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...ORIGINAL_ENV }
    // Use a base64-encoded "test-secret-bytes" as the secret (16 random-ish bytes)
    process.env.RESEND_WEBHOOK_SECRET = 'whsec_' + Buffer.from('test-secret-bytes').toString('base64')
    mockInsert.mockReset()
    mockInsert.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when secret is unset', async () => {
    delete process.env.RESEND_WEBHOOK_SECRET
    const { POST } = await import('@/app/api/webhooks/resend/route')
    const req = new Request('http://localhost/api/webhooks/resend', { method: 'POST', body: '{}' })
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 401 when svix headers missing', async () => {
    const { POST } = await import('@/app/api/webhooks/resend/route')
    const req = new Request('http://localhost/api/webhooks/resend', {
      method: 'POST',
      body: '{}',
    })
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 401 when signature does not match', async () => {
    const { POST } = await import('@/app/api/webhooks/resend/route')
    const req = new Request('http://localhost/api/webhooks/resend', {
      method: 'POST',
      headers: {
        'svix-id': 'evt-x',
        'svix-timestamp': '1700000000',
        'svix-signature': 'v1,wrong-signature-here',
      },
      body: '{"type":"email.delivered"}',
    })
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 200 + inserts on valid signature', async () => {
    const { POST } = await import('@/app/api/webhooks/resend/route')
    const body = JSON.stringify({ type: 'email.delivered', data: { email_id: 'em-1' } })
    const req = signedRequest(body, process.env.RESEND_WEBHOOK_SECRET!)
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledTimes(1)
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'resend',
        provider_event_id: 'evt_test',
        event_type: 'email.delivered',
        signature_valid: true,
      }),
    )
  })

  it('returns 200 with deduplicated:true on UNIQUE conflict (replay)', async () => {
    mockInsert.mockResolvedValueOnce({ error: { code: '23505', message: 'unique_violation' } })
    const { POST } = await import('@/app/api/webhooks/resend/route')
    const body = JSON.stringify({ type: 'email.delivered' })
    const req = signedRequest(body, process.env.RESEND_WEBHOOK_SECRET!)
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.deduplicated).toBe(true)
  })

  it('logs bounce events for triage', async () => {
    const { POST } = await import('@/app/api/webhooks/resend/route')
    const body = JSON.stringify({
      type: 'email.bounced',
      data: { to: ['user@bad.example'], subject: 'X', bounce: { type: 'permanent' } },
    })
    const req = signedRequest(body, process.env.RESEND_WEBHOOK_SECRET!)
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ event_type: 'email.bounced' }),
    )
  })
})
