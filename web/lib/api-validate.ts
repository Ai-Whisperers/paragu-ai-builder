import { z } from 'zod'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { validationError, serverError, success } from './api-utils'
import { logger } from './logger'

type Handler<T> = (body: T, req: NextRequest) => Promise<Response> | Response

export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: Handler<T>,
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    try {
      const raw = await req.json()
      const parsed = schema.safeParse(raw)
      if (!parsed.success) return validationError(parsed.error as unknown as { errors: Array<{ path: Array<string | number>; message: string }> })
      return handler(parsed.data, req)
    } catch (err) {
      if (err instanceof SyntaxError) {
        return NextResponse.json(
          { ok: false, error: 'Invalid JSON body', code: 'PARSE_ERROR' },
          { status: 400 },
        )
      }
      logger.error('Validation middleware error', { error: String(err) })
      return serverError(err)
    }
  }
}
