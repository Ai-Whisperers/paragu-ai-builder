import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { ensureSessionToken } from '@/lib/commerce/session'
import { getOrCreateCart } from '@/lib/commerce/cart'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ site: string }>(async (_req, _ctx, { site }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const sessionToken = await ensureSessionToken()
  const cart = await getOrCreateCart(business.id, { sessionToken, currency: business.currency })
  return NextResponse.json({ cart })
})
