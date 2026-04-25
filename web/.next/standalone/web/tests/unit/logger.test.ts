import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, createRequestLogger, createPerformanceTracker } from '@/lib/logger'

describe('logger', () => {
  const origEnv = { ...process.env }
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
    process.env = { ...origEnv }
  })

  it('emits structured JSON in prod + json mode', () => {
    logger.info('hello', { businessId: 'biz-1', action: 'test' })
    expect(logSpy).toHaveBeenCalledOnce()
    const payload = JSON.parse(logSpy.mock.calls[0][0] as string)
    // ECS-aligned top-level keys
    expect(payload['log.level']).toBe('info')
    expect(payload.message).toBe('hello')
    expect(payload['@timestamp']).toMatch(/\d{4}-\d{2}-\d{2}T/)
    expect(payload['service.name']).toBeTruthy()
    // Legacy field passed through (+ ECS-alias copy)
    expect(payload.businessId).toBe('biz-1')
    expect(payload['labels.business_id']).toBe('biz-1')
    expect(payload.action).toBe('test')
    expect(payload['event.action']).toBe('test')
  })

  it('routes warn to console.warn and error to console.error', () => {
    logger.warn('heads up', { foo: 1 })
    logger.error('boom', new Error('kaboom'))
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(errorSpy).toHaveBeenCalledOnce()
    const warn = JSON.parse(warnSpy.mock.calls[0][0] as string)
    expect(warn['log.level']).toBe('warn')
    expect(warn.message).toBe('heads up')
    const err = JSON.parse(errorSpy.mock.calls[0][0] as string)
    expect(err['log.level']).toBe('error')
    expect(err.error.message).toBe('kaboom')
  })

  it('respects LOG_LEVEL filtering', () => {
    process.env.LOG_LEVEL = 'warn'
    logger.debug('noise')
    logger.info('also noise')
    logger.warn('kept')
    expect(logSpy).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledOnce()
  })

  it('createRequestLogger attaches a stable requestId and request context', () => {
    const req = new Request('https://example.com/api/test?x=1', {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    })
    const log = createRequestLogger(req)
    expect(log.requestId).toMatch(/^[0-9a-f]{8}-/)
    log.info('inside route', { siteSlug: 'nexa-paraguay' })
    const payload = JSON.parse(logSpy.mock.calls[0][0] as string)
    // Fields are now flat on the entry, aliased to ECS names.
    expect(payload['trace.id']).toBe(log.requestId)
    expect(payload['http.method']).toBe('POST')
    expect(payload['url.path']).toBe('/api/test')
    expect(payload['client.ip']).toBe('1.2.3.4')
    expect(payload['labels.site_slug']).toBe('nexa-paraguay')
  })

  it('request logger error accepts Error instances directly', () => {
    const req = new Request('https://example.com/x')
    const log = createRequestLogger(req)
    log.error('failed', new Error('boom'))
    const payload = JSON.parse(errorSpy.mock.calls[0][0] as string)
    expect(payload.error.name).toBe('Error')
    expect(payload.error.message).toBe('boom')
    expect(payload['trace.id']).toBe(log.requestId)
  })

  it('performance tracker emits warn above SLOW_REQUEST_THRESHOLD_MS', async () => {
    process.env.SLOW_REQUEST_THRESHOLD_MS = '1'
    const tracker = createPerformanceTracker('req-test')
    tracker.checkpoint('a')
    await new Promise((r) => setTimeout(r, 10))
    tracker.checkpoint('b')
    const duration = tracker.finish({ action: 'test' })
    expect(duration).toBeGreaterThan(0)
    // Slow warning lands on console.warn since we're above threshold
    expect(warnSpy).toHaveBeenCalled()
    const payload = JSON.parse(warnSpy.mock.calls[0][0] as string)
    expect(payload.message).toBe('Slow request detected')
    expect(payload.checkpoints).toHaveLength(2)
  })
})
