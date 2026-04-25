/**
 * API route wrapper.
 *
 * Eliminates the boilerplate every API route was repeating:
 *   - create a request-scoped logger (with requestId/method/path)
 *   - create a performance tracker
 *   - stamp `x-request-id` on every response
 *   - catch unhandled errors, log them, and return a structured 500
 *
 * Example:
 *   export const POST = withRequestLog(async (request, { log, perf }) => {
 *     const body = await request.json()
 *     perf.checkpoint('parse')
 *     ...
 *     return NextResponse.json({ ok: true })
 *   })
 */
import { NextResponse } from 'next/server'
import { createRequestLogger, createPerformanceTracker } from '@/lib/logger'
import { withLoggerContext } from '@/lib/obs/context'
import { correlationFromRequest } from '@/lib/obs/request-id'
import { captureException } from '@/lib/obs/sentry'

export interface RequestContext {
  log: ReturnType<typeof createRequestLogger>
  perf: ReturnType<typeof createPerformanceTracker>
  requestId: string
}

export type RouteHandler<TParams = Record<string, string>> = (
  request: Request,
  ctx: RequestContext,
  routeParams: TParams,
) => Promise<Response>

/**
 * Wrap an API route handler so it automatically gets a request logger,
 * perf tracker, and request-id-stamped responses — including on error.
 *
 * Non-dynamic routes: `export const POST = withRequestLog(async (req, ctx) => ...)`
 * Dynamic routes:    `export const GET = withRequestLog<{ id: string }>(async (req, ctx, { id }) => ...)`
 */
export function withRequestLog<TParams extends Record<string, string> = Record<string, string>>(
  handler: RouteHandler<TParams>,
): (
  request: Request,
  // Next.js v15+ passes `{ params: Promise<...> }` as the second arg.
  routeArg?: { params: Promise<TParams> },
) => Promise<Response> {
  return async (request, routeArg) => {
    const log = createRequestLogger(request)
    const perf = createPerformanceTracker(log.requestId)
    const ctx: RequestContext = { log, perf, requestId: log.requestId }
    const correlation = correlationFromRequest(request)
    const url = new URL(request.url)

    // Resolve Next.js dynamic params (they come as a Promise in v15+).
    let routeParams: TParams = {} as TParams
    if (routeArg && typeof routeArg === 'object' && 'params' in routeArg) {
      const p = routeArg.params
      routeParams = (p instanceof Promise ? await p : p) as TParams
    }

    // Seed AsyncLocalStorage so any nested call can `logger.info(...)` and
    // pick up trace.id / http.method / url.path automatically.
    return withLoggerContext(
      {
        'trace.id': correlation.traceId,
        'span.id': correlation.spanId,
        'http.method': request.method,
        'url.path': url.pathname,
      },
      async () => {
        try {
          const response = await handler(request, ctx, routeParams)
          if (!response.headers.get('x-request-id')) {
            response.headers.set('x-request-id', log.requestId)
          }
          return response
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error))
          log.error('Unhandled error in API route', err)
          captureException(err, {
            tags: {
              route: url.pathname,
              method: request.method,
            },
            extra: { requestId: log.requestId },
          })
          return NextResponse.json(
            {
              error: 'internal_error',
              message: 'Error interno del servidor',
              requestId: log.requestId,
            },
            {
              status: 500,
              headers: { 'x-request-id': log.requestId },
            },
          )
        }
      },
    )
  }
}
