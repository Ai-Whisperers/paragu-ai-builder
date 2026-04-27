import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ZodErrorLike = { errors: Array<{ path: (string | number)[]; message: string }> }

export type ApiResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string }

export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status })
}

export function fail(message: string, status = 400, code?: string): NextResponse {
  logger.warn('API error', { message, status, code })
  return NextResponse.json({ ok: false, error: message, code }, { status })
}

export function validationError(errors: ZodErrorLike): NextResponse {
  return fail(
    errors.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; '),
    422,
    'VALIDATION_ERROR',
  )
}

export function notFound(message = 'Not found'): NextResponse {
  return fail(message, 404, 'NOT_FOUND')
}

export function serverError(err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : 'Internal server error'
  logger.error('API unhandled error', { error: String(err) })
  return NextResponse.json({ ok: false, error: message, code: 'INTERNAL_ERROR' }, { status: 500 })
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return fail(message, 401, 'UNAUTHORIZED')
}
