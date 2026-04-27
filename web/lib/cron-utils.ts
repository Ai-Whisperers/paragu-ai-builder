import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export interface CronResult {
  ok: boolean
  processed?: number
  skipped?: number
  errors?: number
}

/**
 * Wrap a cron handler with timing, error handling, timeout protection.
 * All cron routes should use this instead of raw handlers.
 */
export async function runCron(
  name: string,
  handler: () => Promise<CronResult>,
  options?: { timeout?: number },
): Promise<{ ok: boolean; durationMs: number; processed?: number }> {
  const start = performance.now()
  const timeout = options?.timeout ?? 30_000

  try {
    const result = await Promise.race([
      handler(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Cron "${name}" timed out after ${timeout}ms`)), timeout),
      ),
    ])

    const duration = Math.round(performance.now() - start)
    logger.info(`Cron "${name}" completed`, {
      cron: name,
      durationMs: duration,
      processed: result.processed,
      skipped: result.skipped,
      errors: result.errors,
    })
    return { ok: true, durationMs: duration, processed: result.processed }
  } catch (err) {
    const duration = Math.round(performance.now() - start)
    logger.error(`Cron "${name}" failed`, {
      cron: name,
      durationMs: duration,
      error: err instanceof Error ? err.message : String(err),
    })
    return { ok: false, durationMs: duration }
  }
}

/**
 * Verify that a cron request has the correct authorization header.
 * Always use this on every cron endpoint.
 */
export function isAuthenticatedCron(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const expected = process.env.CRON_SECRET
  if (!expected) {
    logger.warn('CRON_SECRET not set — cron endpoints are unprotected')
    return true
  }
  return authHeader === `Bearer ${expected}`
}

/**
 * Guard a cron route handler with auth check + runCron wrapper.
 */
export function cronRoute(
  name: string,
  handler: () => Promise<CronResult>,
  options?: { timeout?: number },
): (request: Request) => Promise<NextResponse> {
  return async (request: Request) => {
    if (!isAuthenticatedCron(request)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    const result = await runCron(name, handler, options)
    return NextResponse.json(result, { status: result.ok ? 200 : 500 })
  }
}
