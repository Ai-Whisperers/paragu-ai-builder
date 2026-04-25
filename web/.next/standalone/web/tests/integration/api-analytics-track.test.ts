/**
 * Tests for /api/analytics/track. Closes BUG_HUNT_500 #423 + #460.
 *
 * Coverage:
 *   - 400 on missing/invalid event type
 *   - 200 happy path returns event id + session id
 *   - supabase client is created exactly once across N requests (proves
 *     the module-scoped cache works — was the cold-start bug)
 *   - 401 on GET when checkAdmin returns unauthenticated
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Select chain supports both .select().single() (single-insert path) and
// .select() (batch-insert path) — the route resolves a Promise directly off
// the select() call in batch mode. Make the chain awaitable + single-capable.
const mockSelect = vi.fn(() => {
  const p = Promise.resolve({ data: [{ id: 'evt-1' }], error: null })
  return Object.assign(p, {
    single: vi.fn(async () => ({ data: { id: 'evt-1' }, error: null })),
  })
})
const mockFrom = vi.fn(() => ({
  insert: () => ({ select: mockSelect }),
}))
const createClientSpy = vi.fn(() => ({ from: mockFrom }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: (...args: unknown[]) => createClientSpy(...args),
}))

const mockCheckAdmin = vi.fn()
vi.mock('@/lib/auth/admin', () => ({
  checkAdmin: () => mockCheckAdmin(),
}))

const ORIGINAL_ENV = { ...process.env }

describe('/api/analytics/track POST', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-test',
    }
    // Reset module cache so each test gets a fresh module-scoped client.
    vi.resetModules()
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 400 when eventType is missing', async () => {
    const { POST } = await import('@/app/api/analytics/track/route')
    const req = new Request('http://localhost/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid event type', async () => {
    const { POST } = await import('@/app/api/analytics/track/route')
    const req = new Request('http://localhost/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ eventType: 'definitely-not-a-real-event' }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('returns 200 + event id on the happy path', async () => {
    const { POST } = await import('@/app/api/analytics/track/route')
    const req = new Request('http://localhost/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ eventType: 'page_view', pageUrl: '/' }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.eventId).toBe('evt-1')
    expect(body.sessionId).toMatch(/^sess_/)
  })

  it('accepts web_vital event (RUM beacon from WebVitalsReporter)', async () => {
    const { POST } = await import('@/app/api/analytics/track/route')
    const req = new Request('http://localhost/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        eventType: 'web_vital',
        pageUrl: '/',
        metadata: { name: 'LCP', value: 2100, rating: 'good' },
      }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('accepts batched events and returns accepted count', async () => {
    const { POST } = await import('@/app/api/analytics/track/route')
    const req = new Request('http://localhost/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        batch: true,
        events: [
          { eventType: 'page_view', pageUrl: '/' },
          { eventType: 'button_click', metadata: { buttonId: 'hero-cta' } },
        ],
      }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.accepted).toBe(1) // mockSelect returns 1-element array regardless of input length
  })

  it('rejects batch when every event has an invalid eventType', async () => {
    const { POST } = await import('@/app/api/analytics/track/route')
    const req = new Request('http://localhost/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        batch: true,
        events: [
          { eventType: 'totally-bogus' },
          { eventType: 'also-bogus' },
        ],
      }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.rejected).toHaveLength(2)
  })

  it('creates the Supabase client exactly once across many requests (cache works)', async () => {
    const { POST } = await import('@/app/api/analytics/track/route')
    for (let i = 0; i < 5; i++) {
      const req = new Request('http://localhost/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ eventType: 'page_view' }),
      })
      await POST(req as never)
    }
    // 5 POSTs, only 1 createClient call — module-scoped cache hits 4 times.
    expect(createClientSpy).toHaveBeenCalledTimes(1)
  })
})

describe('/api/analytics/track GET', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-test',
    }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 401 when checkAdmin reports unauthenticated', async () => {
    mockCheckAdmin.mockResolvedValueOnce({ ok: false, status: 401, reason: 'unauthenticated' })
    const { GET } = await import('@/app/api/analytics/track/route')
    const req = new Request('http://localhost/api/analytics/track', { method: 'GET' })
    const res = await GET(req as never)
    expect(res.status).toBe(401)
  })

  it('returns 403 when checkAdmin reports forbidden', async () => {
    mockCheckAdmin.mockResolvedValueOnce({ ok: false, status: 403, reason: 'forbidden' })
    const { GET } = await import('@/app/api/analytics/track/route')
    const req = new Request('http://localhost/api/analytics/track', { method: 'GET' })
    const res = await GET(req as never)
    expect(res.status).toBe(403)
  })
})
