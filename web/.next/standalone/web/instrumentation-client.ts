/**
 * Next.js browser-side instrumentation hook (client).
 *
 * Boots Sentry Browser so React render errors, uncaught promises, and
 * client navigation errors land in the same Sentry project as the server.
 * Fire-and-forget beacon — survives app-crash conditions where our own
 * API endpoints would be unreachable.
 */
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_COMMIT_SHA || process.env.NEXT_PUBLIC_APP_VERSION,
    tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    // Capture 10% of all sessions, 100% of sessions with errors.
    replaysSessionSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_RATE || '0.1'),
    replaysOnErrorSampleRate: 1.0,
  })
}
