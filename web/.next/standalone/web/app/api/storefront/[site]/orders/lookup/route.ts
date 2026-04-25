import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const LookupSchema = z.object({
  email: z.string().email(),
  orderNumber: z.string().trim().min(3).max(40),
})

/**
 * POST /api/storefront/[site]/orders/lookup
 *
 * Confirms a (customer_email, order_number) pair belongs to this business
 * and returns the order id so the client can navigate to /orden/[id].
 *
 * Returns 404 for both "not found" and "wrong email" so we don't help an
 * attacker enumerate which order numbers exist for a tenant. Cooldown is
 * not implemented here — order_number is structured (BIZxx-YYMMDD-NNNN
 * shape per the seed) so brute-forcing the right one for a given email
 * is already impractical.
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
  const parsed = LookupSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .eq('business_id', business.id)
    .eq('order_number', parsed.data.orderNumber)
    .ilike('customer_email', parsed.data.email)
    .limit(1)
    .maybeSingle()

  if (error) {
    log.error('commerce.order.lookup_failed', new Error(error.message))
    return NextResponse.json({ error: 'lookup_failed' }, { status: 500 })
  }

  if (!data) {
    // Generic 404 — same response whether the order doesn't exist or the
    // email doesn't match. Keeps the endpoint useless for enumeration.
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  log.info('commerce.order.lookup_match', { businessId: business.id, orderId: data.id })
  return NextResponse.json({ orderId: data.id })
})
