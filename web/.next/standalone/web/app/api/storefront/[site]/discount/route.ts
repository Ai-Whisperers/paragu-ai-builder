import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { applyDiscount } from '@/lib/commerce/discounts'

export const runtime = 'nodejs'

const BodySchema = z.object({
  code: z.string().min(1).max(80),
  subtotalCents: z.number().int().nonnegative(),
  customerEmail: z.string().email().optional(),
})

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

  const result = await applyDiscount({
    businessId: business.id,
    code: parsed.data.code,
    subtotalCents: parsed.data.subtotalCents,
    customerEmail: parsed.data.customerEmail,
  })

  if (!result.valid) {
    log.info('storefront.discount.rejected', { siteSlug: site, code: parsed.data.code, reason: result.reason })
    return NextResponse.json({ valid: false, reason: result.reason }, { status: 200 })
  }

  log.info('storefront.discount.valid', { siteSlug: site, code: result.code, discountCents: result.discountCents })
  return NextResponse.json({
    valid: true,
    discountId: result.discountId,
    code: result.code,
    discountCents: result.discountCents,
    freeShipping: result.freeShipping,
  })
})
