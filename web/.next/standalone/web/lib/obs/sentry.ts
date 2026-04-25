/**
 * Sentry wrapper — server-side.
 *
 * Thin facade around `@sentry/nextjs` so the rest of the codebase never
 * imports Sentry directly. If NEXT_PUBLIC_SENTRY_DSN is unset, all calls
 * become no-ops (useful for local dev and CI without cluttering logs).
 *
 * For init see `instrumentation.ts` (server) and `instrumentation-client.ts`
 * (browser).
 */
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
const isEnabled = typeof dsn === 'string' && dsn.length > 0

export interface CaptureContext {
  tags?: Record<string, string | number | boolean | undefined>
  extra?: Record<string, unknown>
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
  fingerprint?: string[]
}

export function captureException(error: unknown, ctx?: CaptureContext): void {
  if (!isEnabled) return
  Sentry.captureException(error, {
    tags: ctx?.tags as Record<string, string> | undefined,
    extra: ctx?.extra,
    level: ctx?.level,
    fingerprint: ctx?.fingerprint,
  })
}

export function captureMessage(message: string, ctx?: CaptureContext): void {
  if (!isEnabled) return
  Sentry.captureMessage(message, {
    tags: ctx?.tags as Record<string, string> | undefined,
    extra: ctx?.extra,
    level: ctx?.level || 'info',
  })
}

export function setUser(user: { id?: string; email?: string } | null): void {
  if (!isEnabled) return
  Sentry.setUser(user)
}

export function setTag(key: string, value: string | number | boolean): void {
  if (!isEnabled) return
  Sentry.setTag(key, value)
}

/** Returns whether Sentry is currently initialised — useful in tests. */
export function sentryEnabled(): boolean {
  return isEnabled
}
