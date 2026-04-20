/**
 * Next.js server-side instrumentation hook.
 *
 * Runs once when the server (Node.js or Workers) starts up. Used here to:
 *   - Boot Sentry with the right runtime (nodejs / edge)
 *   - Set service-level tags (env, version)
 *
 * See docs/DEBUGGING.md for the observability architecture.
 */
import * as Sentry from '@sentry/nextjs'

export async function register(): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) return // Sentry off — fine for local dev + CI

  const commonOptions = {
    dsn,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_COMMIT_SHA || process.env.NEXT_PUBLIC_APP_VERSION,
    // Sample 10% of transactions for performance monitoring; tweak via env.
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      ...commonOptions,
      // No Node-specific options needed; integrations auto-detect.
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init(commonOptions)
  }
}

/**
 * Next.js server error hook. Forwards uncaught errors with rich request
 * context to Sentry so we get stack traces + grouping + release tracking
 * without duplicating `log.error` in every route.
 */
export async function onRequestError(
  error: unknown,
  request: { path: string; method: string; headers: Record<string, string | string[] | undefined> },
  context: { routerKind: 'Pages Router' | 'App Router'; routePath: string; routeType: 'render' | 'route' | 'action' | 'middleware' },
): Promise<void> {
  Sentry.captureRequestError(error, request, context)
}
