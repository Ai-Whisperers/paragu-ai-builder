/**
 * Tests for /api/cron/health. Closes BUG_HUNT_500 #436.
 *
 * Coverage:
 *   - 403 when x-cron-secret mismatches
 *   - 200 + ok:true when all required env vars are set
 *   - 503 + ok:false when any cron's required env is missing
 *   - GET aliases POST
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

const ORIGINAL_ENV = { ...process.env }

const FULL_ENV: Record<string, string> = {
  CRON_SECRET: 's',
  RESEND_API_KEY: 're_test',
  LEADS_DIGEST_FROM: 'leads@paragu-ai.com',
  LEADS_DIGEST_TO: 'a@example.com',
  COMMERCE_EMAIL_FROM: 'commerce@paragu-ai.com',
}

describe('/api/cron/health', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, ...FULL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 403 when x-cron-secret mismatches', async () => {
    const { POST } = await import('@/app/api/cron/health/route')
    const req = new Request('http://localhost/api/cron/health', {
      method: 'POST',
      headers: { 'x-cron-secret': 'wrong' },
    })
    const res = await POST(req as never)
    expect(res.status).toBe(403)
  })

  it('returns 200 + ok:true when all required env is configured', async () => {
    const { POST } = await import('@/app/api/cron/health/route')
    const req = new Request('http://localhost/api/cron/health', {
      method: 'POST',
      headers: { 'x-cron-secret': 's' },
    })
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.crons).toHaveLength(5)
    expect(body.crons.every((c: { status: string }) => c.status === 'ok')).toBe(true)
  })

  it('returns 503 + ok:false + missing env list when any cron is misconfigured', async () => {
    delete process.env.RESEND_API_KEY
    const { POST } = await import('@/app/api/cron/health/route')
    const req = new Request('http://localhost/api/cron/health', {
      method: 'POST',
      headers: { 'x-cron-secret': 's' },
    })
    const res = await POST(req as never)
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.ok).toBe(false)
    // Both leads-digest and commerce-email-flush require RESEND_API_KEY.
    const degraded = body.crons.filter((c: { status: string }) => c.status !== 'ok')
    expect(degraded.length).toBeGreaterThanOrEqual(2)
    expect(degraded.every((c: { missing: string[] }) => c.missing.includes('RESEND_API_KEY'))).toBe(true)
  })

  it('GET aliases POST', async () => {
    const mod = await import('@/app/api/cron/health/route')
    expect(mod.GET).toBe(mod.POST)
  })
})
