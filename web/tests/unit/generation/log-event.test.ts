import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { recordGenerationEvent } from '@/lib/generation/log-event'

const origEnv = { ...process.env }
const origFetch = globalThis.fetch

describe('recordGenerationEvent', () => {
  let logSpy: ReturnType<typeof vi.spyOn>
  let warnSpy: ReturnType<typeof vi.spyOn>
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    process.env.NODE_ENV = 'production'
    process.env.LOG_FORMAT = 'json'
    process.env.LOG_LEVEL = 'debug'
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    warnSpy.mockRestore()
    errorSpy.mockRestore()
    globalThis.fetch = origFetch
    process.env = { ...origEnv }
  })

  it('logs the event via the structured logger', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    await recordGenerationEvent({
      businessId: 'biz-1',
      siteId: 'site-1',
      step: 'compose',
      status: 'completed',
      durationMs: 120,
    })
    expect(logSpy).toHaveBeenCalled()
    const payload = JSON.parse(logSpy.mock.calls[0][0] as string)
    expect(payload.message).toMatch(/completed/)
    expect(payload.businessId).toBe('biz-1')
    expect(payload.step).toBe('compose')
  })

  it('logs failures at error level', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    await recordGenerationEvent({
      businessId: 'biz-2',
      siteId: 'site-2',
      step: 'render',
      status: 'failed',
      error: 'template missing',
    })
    expect(errorSpy).toHaveBeenCalled()
    const payload = JSON.parse(errorSpy.mock.calls[0][0] as string)
    expect(payload['log.level']).toBe('error')
    // `error` is extracted from context and serialized into its own field.
    expect(payload.error.message).toBe('template missing')
    expect(payload.step).toBe('render')
  })

  it('posts to generation_logs when Supabase is configured', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://demo.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key'
    const fetchSpy = vi.fn(async () => new Response('', { status: 201 }))
    // @ts-expect-error — test stub
    globalThis.fetch = fetchSpy

    await recordGenerationEvent({
      businessId: 'biz-3',
      siteId: 'site-3',
      step: 'publish',
      status: 'started',
    })

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/rest/v1/generation_logs')
    expect(init.method).toBe('POST')
    const body = JSON.parse(init.body as string)
    expect(body).toMatchObject({
      business_id: 'biz-3',
      site_id: 'site-3',
      step: 'publish',
      status: 'started',
    })
  })

  it('warns (but does not throw) when Supabase rejects the insert', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://demo.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key'
    // @ts-expect-error — test stub
    globalThis.fetch = vi.fn(async () => new Response('forbidden', { status: 403 }))

    await expect(
      recordGenerationEvent({
        businessId: 'biz-4',
        siteId: 'site-4',
        step: 'persist',
        status: 'completed',
      }),
    ).resolves.toBeUndefined()

    // Should have logged both the event and the warn about the rejection
    const warnPayloads = warnSpy.mock.calls.map((c) => JSON.parse(c[0] as string))
    const rejectionWarn = warnPayloads.find((p) => p.message.includes('rejected'))
    expect(rejectionWarn).toBeDefined()
    expect(rejectionWarn.httpStatus).toBe(403)
  })

  it('warns (but does not throw) when fetch itself blows up', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://demo.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc-key'
    // @ts-expect-error — test stub
    globalThis.fetch = vi.fn(async () => {
      throw new Error('network unreachable')
    })

    await expect(
      recordGenerationEvent({
        businessId: 'biz-5',
        siteId: 'site-5',
        step: 'persist',
        status: 'completed',
      }),
    ).resolves.toBeUndefined()

    const warnPayloads = warnSpy.mock.calls.map((c) => JSON.parse(c[0] as string))
    const dropped = warnPayloads.find((p) => p.message.includes('dropped'))
    expect(dropped).toBeDefined()
    // The helper passes `error` as a string field; logger routes that through
    // the Error extractor, so it ends up on payload.error.message.
    expect(dropped.error.message).toMatch(/network unreachable/)
  })
})
