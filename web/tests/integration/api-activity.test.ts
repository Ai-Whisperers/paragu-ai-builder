/**
 * Smoke test for /api/activity — verifies the route is wrapped in
 * withRequestLog (gets x-request-id stamped) and returns the expected shape.
 * Closes part of #392.
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/landing/marketing-data', () => ({
  REAL_CLIENTS: [
    { slug: 'a', name: 'A', href: '/casos/a', vertical: 'V1' },
    { slug: 'b', name: 'B', href: '/casos/b', vertical: 'V2' },
  ],
}))

describe('/api/activity GET', () => {
  it('returns entries with the expected shape', async () => {
    const { GET } = await import('@/app/api/activity/route')
    const req = new Request('http://localhost/api/activity', { method: 'GET' })
    const res = await GET(req, {} as never)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.entries).toHaveLength(2)
    expect(body.entries[0]).toMatchObject({
      slug: 'a',
      name: 'A',
      href: '/casos/a',
      context: 'V1',
      ago: 'hoy',
    })
  })

  it('stamps x-request-id (proof withRequestLog is active)', async () => {
    const { GET } = await import('@/app/api/activity/route')
    const req = new Request('http://localhost/api/activity', { method: 'GET' })
    const res = await GET(req, {} as never)
    expect(res.headers.get('x-request-id')).toBeTruthy()
  })
})
