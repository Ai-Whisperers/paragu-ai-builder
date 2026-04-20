import { describe, it, expect, vi, afterEach } from 'vitest'
import { integrationFetch } from '@/lib/integrations/http'

const origFetch = globalThis.fetch

function mockFetch(impl: (url: string, init?: RequestInit) => Promise<Response>): ReturnType<typeof vi.fn> {
  const fn = vi.fn(impl)
  // @ts-expect-error — test stub
  globalThis.fetch = fn
  return fn
}

describe('integrationFetch', () => {
  afterEach(() => {
    globalThis.fetch = origFetch
  })

  it('parses JSON body on 2xx', async () => {
    mockFetch(async () => new Response(JSON.stringify({ id: 'x' }), { status: 200 }))
    const r = await integrationFetch<{ id: string }>('https://x.test', {
      adapter: 'test',
      method: 'GET',
    })
    expect(r.ok).toBe(true)
    expect(r.status).toBe(200)
    expect(r.data?.id).toBe('x')
  })

  it('surfaces HTTP status in error string on 4xx/5xx', async () => {
    mockFetch(async () => new Response('bad payload', { status: 400 }))
    const r = await integrationFetch('https://x.test', {
      adapter: 'test',
      method: 'POST',
      body: '{}',
    })
    expect(r.ok).toBe(false)
    expect(r.status).toBe(400)
    expect(r.error).toMatch(/test 400: bad payload/)
  })

  it('retries once on transport failure and returns structured error when both fail', async () => {
    const fn = mockFetch(async () => {
      throw new Error('ECONNRESET')
    })
    const r = await integrationFetch('https://x.test', {
      adapter: 'test',
      method: 'GET',
    })
    expect(fn).toHaveBeenCalledTimes(2)
    expect(r.ok).toBe(false)
    expect(r.status).toBe(0)
    expect(r.error).toMatch(/ECONNRESET/)
  })

  it('succeeds on retry after a single transport failure', async () => {
    let call = 0
    const fn = mockFetch(async () => {
      call += 1
      if (call === 1) throw new Error('reset')
      return new Response('{}', { status: 200 })
    })
    const r = await integrationFetch('https://x.test', {
      adapter: 'test',
      method: 'GET',
    })
    expect(fn).toHaveBeenCalledTimes(2)
    expect(r.ok).toBe(true)
  })

  it('does NOT retry on 4xx/5xx — those are deterministic', async () => {
    const fn = mockFetch(async () => new Response('nope', { status: 401 }))
    await integrationFetch('https://x.test', { adapter: 'test', method: 'GET' })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('honors retryOnNetworkError: false', async () => {
    const fn = mockFetch(async () => {
      throw new Error('boom')
    })
    const r = await integrationFetch('https://x.test', {
      adapter: 'test',
      method: 'GET',
      retryOnNetworkError: false,
    })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(r.ok).toBe(false)
  })

  it('aborts on timeout', async () => {
    mockFetch(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          )
        }),
    )
    const r = await integrationFetch('https://x.test', {
      adapter: 'test',
      method: 'GET',
      timeoutMs: 50,
      retryOnNetworkError: false,
    })
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/aborted/i)
  })

  it('returns ok for 2xx with empty body (no JSON parse)', async () => {
    // 204 No Content rejects a body in the Response constructor; use 200 + ''.
    mockFetch(async () => new Response('', { status: 200 }))
    const r = await integrationFetch('https://x.test', { adapter: 'test', method: 'DELETE' })
    expect(r.ok).toBe(true)
    expect(r.status).toBe(200)
    expect(r.data).toBeUndefined()
  })
})
