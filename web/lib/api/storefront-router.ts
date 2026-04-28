/**
 * Storefront API route factory. Eliminates ~5 lines of boilerplate
 * from every /api/storefront/[site]/* route.
 *
 * Usage:
 *   import { storefrontRoute } from '@/lib/api/storefront-router'
 *   export const GET = storefrontRoute(async (req, { business, log, params }) => {
 *     // business is already resolved — no need to call resolveBusinessBySlug
 *     return NextResponse.json({ ... })
 *   })
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from './with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'

type RouteHandler<T extends Record<string, string>> = (
  request: Request,
  ctx: {
    business: { id: string; name: string; whatsappNumber?: string; type: string; currency: string }
    log: { info: (msg: string, data?: Record<string, unknown>) => void; warn: (msg: string, data?: Record<string, unknown>) => void; error: (msg: string, data?: Record<string, unknown>) => void }
    params: T
  },
) => Promise<Response>

export function storefrontRoute<T extends Record<string, string>>(handler: RouteHandler<T>) {
  return withRequestLog<T>(async (request, { log }, params) => {
    const site = (params as Record<string, string>).site
    const business = await resolveBusinessBySlug(site)
    if (!business) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    return handler(request, { business, log, params })
  })
}
