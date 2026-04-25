import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { quoteShippingForAddress } from '@/lib/commerce/shipping-zones'

export const runtime = 'nodejs'

// Client-side shipping estimator. The checkout form calls this as the
// shopper types city/department so "Envío: Gs 15.000" shows before
// they click Confirmar — removes sticker-shock at the final step.
//
// Public endpoint, no auth. Rate limiting is handled at the platform
// edge (Cloudflare); the computation is already cheap (zone lookup +
// tier pick) so abuse-risk is low.
const BodySchema = z.object({
  country: z.string().min(2).max(2),
  region: z.string().max(80).optional(),
  subtotalCents: z.number().int().nonnegative(),
})

export const POST = withRequestLog<{ site: string }>(async (req, _ctx, { site }) => {
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
    return NextResponse.json({ error: 'validation' }, { status: 400 })
  }

  const quote = await quoteShippingForAddress({
    businessId: business.id,
    country: parsed.data.country,
    region: parsed.data.region,
    subtotalCents: parsed.data.subtotalCents,
  })

  return NextResponse.json({
    amountCents: quote.amountCents,
    zoneId: quote.zoneId,
    currency: business.currency,
  })
})
