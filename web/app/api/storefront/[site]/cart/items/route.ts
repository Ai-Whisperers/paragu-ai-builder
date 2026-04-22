import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { ensureSessionToken } from '@/lib/commerce/session'
import { getOrCreateCart, addItem } from '@/lib/commerce/cart'
import { AddToCartSchema } from '@/lib/schemas/commerce/cart'
import { recordCommerceFunnelEvent } from '@/lib/commerce/funnel'

export const runtime = 'nodejs'

export const POST = withRequestLog<{ site: string }>(async (req, { log }, { site }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = AddToCartSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  const sessionToken = await ensureSessionToken()
  const cart = await getOrCreateCart(business.id, { sessionToken, currency: business.currency })

  try {
    const updated = await addItem(business.id, cart.id, parsed.data.productId, parsed.data.quantity)
    log.info('commerce.cart.item_added', { siteSlug: site, productId: parsed.data.productId })
    void recordCommerceFunnelEvent({
      businessId: business.id,
      eventType: 'cart_item_added',
      sessionToken,
      cartId: cart.id,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
    })
    return NextResponse.json({ cart: updated })
  } catch (err) {
    const code = err instanceof Error ? err.message : 'add_item_failed'
    const status = code === 'out_of_stock' ? 409 : code === 'product_not_found' || code === 'product_inactive' ? 404 : 400
    return NextResponse.json({ error: code }, { status })
  }
})
