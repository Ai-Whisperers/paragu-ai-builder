import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { subscribeBackInStock } from '@/lib/commerce/back-in-stock'

export const runtime = 'nodejs'

const BodySchema = z.object({
  productId: z.string().uuid(),
  email: z.string().email().max(200),
  locale: z.string().min(2).max(8).optional(),
})

/**
 * POST /api/storefront/[site]/back-in-stock
 *
 * Shopper subscribes to a back-in-stock notification. No auth — gated
 * by the opaque product_id UUID plus the DB unique constraint
 * (business_id, product_id, email) so the worst abuse is a duplicate
 * that no-ops. The notification email always goes to the submitted
 * address, never to a caller-inferred one.
 */
export const POST = withRequestLog<{ site: string }>(async (req, { log }, { site }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  const result = await subscribeBackInStock({
    businessId: business.id,
    productId: parsed.data.productId,
    email: parsed.data.email,
    locale: parsed.data.locale,
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.code }, { status: result.code === 'invalid_email' ? 400 : 500 })
  }

  log.info('commerce.back_in_stock.subscribed', {
    businessId: business.id,
    productId: parsed.data.productId,
  })
  return NextResponse.json({ ok: true })
})
