/**
 * Cron route tests for /api/cron/sitemap-ping.
 * Closes BUG_HUNT_500 #475 (companion to leads-digest tests).
 *
 * Coverage:
 *   - 403 when x-cron-secret mismatch
 *   - GET aliases POST
 *   - 200 + per-target results when fetch succeeds
 *   - per-target error captured (no throw) when one fetch rejects
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('/api/cron/sitemap-ping POST', () => {
  const ORIGINAL_ENV = { ...process.env }
  const ORIGINAL_FETCH = global.fetch

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
    global.fetch = ORIGINAL_FETCH
  })

  it('returns 403 when x-cron-secret mismatches', async () => {
    process.env.CRON_SECRET = 'expected'
    const { POST } = await import('@/app/api/cron/sitemap-ping/route')
    const req = new Request('http://localhost/api/cron/sitemap-ping', {
      method: 'POST',
      headers: { 'x-cron-secret': 'wrong' },
    })
    const res = await POST(req, {} as never)
    expect(res.status).toBe(403)
  })

  it('pings all targets when secret matches', async () => {
    process.env.CRON_SECRET = 's'
    global.fetch = vi.fn(async () => new Response(null, { status: 200 })) as typeof global.fetch

    const { POST } = await import('@/app/api/cron/sitemap-ping/route')
    const req = new Request('http://localhost/api/cron/sitemap-ping', {
      method: 'POST',
      headers: { 'x-cron-secret': 's' },
    })
    const res = await POST(req, {} as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.results).toHaveLength(2)
    expect(body.results.every((r: { ok: boolean }) => r.ok)).toBe(true)
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('captures per-target failure without throwing', async () => {
    process.env.CRON_SECRET = 's'
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockRejectedValueOnce(new Error('DNS failure')) as typeof global.fetch

    const { POST } = await import('@/app/api/cron/sitemap-ping/route')
    const req = new Request('http://localhost/api/cron/sitemap-ping', {
      method: 'POST',
      headers: { 'x-cron-secret': 's' },
    })
    const res = await POST(req, {} as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.results).toHaveLength(2)
    const failed = body.results.find((r: { ok: boolean }) => !r.ok)
    expect(failed).toBeDefined()
    expect(failed.error).toMatch(/DNS failure/)
  })

  it('GET is the same handler as POST', async () => {
    const mod = await import('@/app/api/cron/sitemap-ping/route')
    expect(mod.GET).toBe(mod.POST)
  })
})
