/**
 * Cron route tests for /api/cron/leads-digest.
 * Closes BUG_HUNT_500 #475.
 *
 * Coverage:
 *   - 403 when x-cron-secret mismatch
 *   - skipped:true when required env missing
 *   - sends one email per recipient when events exist
 *   - filters analytics_events by metadata.source = 'demo_qualifier'
 *   - tolerates a malformed referrer URL (no crash)
 *   - 500 path when supabase read errors
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockSendTransactional = vi.fn()
const mockSelect = vi.fn()
const mockFrom = vi.fn(() => ({ select: mockSelect }))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(async () => ({ from: mockFrom })),
}))

vi.mock('@/lib/integrations/email/resend', () => ({
  resendAdapter: { sendTransactional: mockSendTransactional },
}))

vi.mock('@/lib/landing/marketing-data', () => ({
  TEMPLATES: [
    { id: 'peluqueria', name: 'Peluquería' },
    { id: 'gimnasio', name: 'Gimnasio' },
  ],
}))

// Build the chained query mock that route code uses.
function chainable(rows: unknown[], error: unknown = null) {
  const final = { data: rows, error }
  const limit = vi.fn(() => final)
  const order = vi.fn(() => ({ limit }))
  const gte = vi.fn(() => ({ order }))
  const eq = vi.fn(() => ({ gte }))
  return { eq }
}

describe('/api/cron/leads-digest POST', () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 403 when x-cron-secret mismatches', async () => {
    process.env.CRON_SECRET = 'expected-secret'
    const { POST } = await import('@/app/api/cron/leads-digest/route')
    const req = new Request('http://localhost/api/cron/leads-digest', {
      method: 'POST',
      headers: { 'x-cron-secret': 'wrong' },
    })
    const res = await POST(req, {} as never)
    expect(res.status).toBe(403)
  })

  it('returns skipped when required env missing', async () => {
    process.env.CRON_SECRET = 's'
    delete process.env.RESEND_API_KEY
    delete process.env.LEADS_DIGEST_FROM
    delete process.env.LEADS_DIGEST_TO
    const { POST } = await import('@/app/api/cron/leads-digest/route')
    const req = new Request('http://localhost/api/cron/leads-digest', {
      method: 'POST',
      headers: { 'x-cron-secret': 's' },
    })
    const res = await POST(req, {} as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ skipped: true })
  })

  it('sends one email per recipient when events exist', async () => {
    process.env.CRON_SECRET = 's'
    process.env.RESEND_API_KEY = 're_test'
    process.env.LEADS_DIGEST_FROM = 'leads@paragu-ai.com'
    process.env.LEADS_DIGEST_TO = 'a@example.com, b@example.com'

    mockFrom.mockReturnValue({
      select: vi.fn(() =>
        chainable([
          {
            id: '1',
            lead_id: 'lead-1',
            created_at: new Date().toISOString(),
            metadata: { source: 'demo_qualifier', rubro: 'peluqueria', size: 'small', presence: 'none' },
            referrer: 'https://paragu-ai.com/demo',
          },
          {
            id: '2',
            lead_id: 'lead-2',
            created_at: new Date().toISOString(),
            metadata: { source: 'organic_form' }, // should be filtered out
            referrer: null,
          },
        ]),
      ),
    } as never)

    mockSendTransactional.mockResolvedValue({ ok: true })

    const { POST } = await import('@/app/api/cron/leads-digest/route')
    const req = new Request('http://localhost/api/cron/leads-digest', {
      method: 'POST',
      headers: { 'x-cron-secret': 's' },
    })
    const res = await POST(req, {} as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    // Only the demo_qualifier row should be counted.
    expect(body.leads).toBe(1)
    // One send per recipient.
    expect(mockSendTransactional).toHaveBeenCalledTimes(2)
  })

  it('tolerates malformed referrer URLs', async () => {
    process.env.CRON_SECRET = 's'
    process.env.RESEND_API_KEY = 're_test'
    process.env.LEADS_DIGEST_FROM = 'leads@paragu-ai.com'
    process.env.LEADS_DIGEST_TO = 'a@example.com'

    mockFrom.mockReturnValue({
      select: vi.fn(() =>
        chainable([
          {
            id: '1',
            lead_id: 'lead-1',
            created_at: new Date().toISOString(),
            metadata: { source: 'demo_qualifier' },
            referrer: 'not-a-valid-url at all', // would throw `new URL(...)`
          },
        ]),
      ),
    } as never)
    mockSendTransactional.mockResolvedValue({ ok: true })

    const { POST } = await import('@/app/api/cron/leads-digest/route')
    const req = new Request('http://localhost/api/cron/leads-digest', {
      method: 'POST',
      headers: { 'x-cron-secret': 's' },
    })
    const res = await POST(req, {} as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.leads).toBe(1)
  })

  it('returns 500 when supabase read fails', async () => {
    process.env.CRON_SECRET = 's'
    process.env.RESEND_API_KEY = 're_test'
    process.env.LEADS_DIGEST_FROM = 'leads@paragu-ai.com'
    process.env.LEADS_DIGEST_TO = 'a@example.com'

    mockFrom.mockReturnValue({
      select: vi.fn(() => chainable([], { message: 'connection refused' })),
    } as never)

    const { POST } = await import('@/app/api/cron/leads-digest/route')
    const req = new Request('http://localhost/api/cron/leads-digest', {
      method: 'POST',
      headers: { 'x-cron-secret': 's' },
    })
    const res = await POST(req, {} as never)
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('read_failed')
    expect(mockSendTransactional).not.toHaveBeenCalled()
  })
})
