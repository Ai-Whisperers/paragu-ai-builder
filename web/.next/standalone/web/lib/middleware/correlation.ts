import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { correlationFromRequest, toTraceparent } from '@/lib/obs/request-id'

export async function correlationMiddleware(request: NextRequest, next: () => Promise<NextResponse>) {
  const correlation = correlationFromRequest(request)
  const requestId = correlation.traceId
  const traceparent = toTraceparent(correlation.traceId, correlation.spanId)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)
  requestHeaders.set('traceparent', traceparent)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  const response = await next()
  response.headers.set('x-request-id', requestId)
  response.headers.set('traceparent', traceparent)
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
}
