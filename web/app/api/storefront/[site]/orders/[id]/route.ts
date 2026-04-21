import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { getOrder, CheckoutError } from '@/lib/commerce/orders'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ site: string; id: string }>(async (_req, _ctx, { site, id }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  try {
    const order = await getOrder(business.id, id)
    return NextResponse.json({ order })
  } catch (err) {
    if (err instanceof CheckoutError && err.code === 'order_not_found') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    throw err
  }
})
