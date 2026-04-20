import { describe, it, expect, vi } from 'vitest'

// sentry.ts checks process.env.NEXT_PUBLIC_SENTRY_DSN at module-load time.
// We want the no-op path here — leave the env var unset.

describe('sentry wrapper (DSN unset)', () => {
  it('captureException does not throw when DSN is absent', async () => {
    vi.resetModules()
    delete process.env.NEXT_PUBLIC_SENTRY_DSN
    const { captureException, sentryEnabled } = await import('@/lib/obs/sentry')
    expect(sentryEnabled()).toBe(false)
    expect(() => captureException(new Error('test'))).not.toThrow()
  })

  it('captureMessage does not throw when DSN is absent', async () => {
    vi.resetModules()
    delete process.env.NEXT_PUBLIC_SENTRY_DSN
    const { captureMessage } = await import('@/lib/obs/sentry')
    expect(() => captureMessage('test', { level: 'info' })).not.toThrow()
  })

  it('setUser / setTag are no-ops', async () => {
    vi.resetModules()
    delete process.env.NEXT_PUBLIC_SENTRY_DSN
    const { setUser, setTag } = await import('@/lib/obs/sentry')
    expect(() => setUser({ id: 'u1' })).not.toThrow()
    expect(() => setTag('env', 'test')).not.toThrow()
  })
})
