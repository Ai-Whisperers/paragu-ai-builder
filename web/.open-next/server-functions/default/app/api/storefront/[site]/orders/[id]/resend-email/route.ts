import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { getOrder, CheckoutError } from '@/lib/commerce/orders'
import { enqueueOrderEmail } from '@/lib/commerce/notifications'
import { createAdminClient } from '@/lib/supabase/admin'
import { env } from '@/lib/env'

export const runtime = 'nodejs'

/**
 * POST /api/storefront/[site]/orders/[id]/resend-email
 *
 * Re-enqueues the order_confirmation email for a shopper who lost or
 * never got the original (spam folder, typo on email at checkout that
 * was later corrected, etc.). Rate-limited to one resend per minute per
 * order to keep this from being a spam vector.
 *
 * No auth — the only thing protecting against abuse is "you need a
 * valid order id" (UUID, opaque) plus the per-order cooldown. The email
 * always goes to the address recorded on the order, never to a
 * caller-supplied address, so worst case is the legitimate shopper
 * gets a duplicate email.
 */
const COOLDOWN_MS = 60_000

export const POST = withRequestLog<{ site: string; id: string }>(async (_req, { log }, { site, id }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  let order
  try {
    order = await getOrder(business.id, id)
  } catch (err) {
    if (err instanceof CheckoutError && err.code === 'order_not_found') {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    throw err
  }

  // Cooldown: look at the most recent order_confirmation row in the outbox
  // for this order and refuse if it was queued in the last minute.
  const supabase = await createAdminClient()
  const { data: lastSent } = await supabase
    .from('commerce_email_outbox')
    .select('created_at')
    .eq('business_id', business.id)
    .eq('order_id', id)
    .eq('template', 'order_confirmation')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lastSent?.created_at) {
    const ageMs = Date.now() - new Date(lastSent.created_at).getTime()
    if (ageMs < COOLDOWN_MS) {
      const waitSeconds = Math.ceil((COOLDOWN_MS - ageMs) / 1000)
      return NextResponse.json({ error: 'rate_limited', retryAfterSeconds: waitSeconds }, { status: 429 })
    }
  }

  await enqueueOrderEmail({
    businessId: business.id,
    businessName: business.name,
    orderId: id,
    template: 'order_confirmation',
    order,
    storeUrl: `${env.APP_URL}/s/es/${site}/orden/${id}`,
  })

  log.info('commerce.order.email_resent', { businessId: business.id, orderId: id })
  return NextResponse.json({ ok: true, sentTo: maskEmail(order.customerEmail) })
})

/** Mask the email so the response can be logged safely. */
function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  if (!domain) return '***'
  const head = name.slice(0, 2)
  return `${head}***@${domain}`
}
