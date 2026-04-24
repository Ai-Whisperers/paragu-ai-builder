import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { reviewRequestEmail } from '@/lib/commerce/email-templates'
import { getAppUrl } from '@/lib/env'

export const runtime = 'nodejs'

/**
 * Enqueue a review-request email for customers whose orders were
 * delivered ~7 days ago. One email per order with deep-links to each
 * product's PDP. Idempotent per order via a metadata check against
 * the outbox — we won't double-send on subsequent cron runs.
 *
 * Why a dedicated cron rather than on-transition (on `delivered`):
 * reviews land in the recipient's inbox a week after delivery, not
 * immediately after the admin marks the order shipped. Asking "how
 * was your product?" before they've used it = low signal + higher
 * unsubscribe rate.
 *
 * Scheduled: 14:00 UTC (11:00 Asunción) daily.
 */
interface DeliveredOrderRow {
  id: string
  business_id: string
  order_number: string
  customer_email: string
  customer_name: string
  delivered_at: string
}

interface OrderItemRow {
  product_id: string
  product_snapshot: { name: string | null } | null
}

interface ProductSlugRow {
  id: string
  slug: string
}

interface BusinessLookupRow {
  id: string
  slug: string
  name: string
}

export const POST = withRequestLog(async (request, { log }) => {
  if (process.env.CRON_SECRET && request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createAdminClient()

  const windowStart = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  const windowEnd = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, business_id, order_number, customer_email, customer_name, delivered_at')
    .eq('status', 'delivered')
    .gte('delivered_at', windowStart)
    .lte('delivered_at', windowEnd)
    .limit(500)

  const rows = (Array.isArray(orders) ? orders : []) as DeliveredOrderRow[]
  const appUrl = getAppUrl()

  let considered = 0
  let enqueued = 0
  let skippedAlreadySent = 0

  for (const o of rows) {
    considered++

    // Skip if we already enqueued a review_request for this order —
    // the cron can run on overlapping windows (08:00, 14:00) and
    // the 7-day window spans two days.
    const { count } = await supabase
      .from('commerce_email_outbox')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', o.business_id)
      .eq('order_id', o.id)
      .eq('template', 'review_request')
    if ((count ?? 0) > 0) {
      skippedAlreadySent++
      continue
    }

    // Fetch items + resolve product slugs for deep-linking.
    const { data: items } = await supabase
      .from('order_items')
      .select('product_id, product_snapshot')
      .eq('order_id', o.id)
    const itemRows = (items as OrderItemRow[] | null) ?? []
    if (itemRows.length === 0) continue

    const ids = Array.from(new Set(itemRows.map((it) => it.product_id)))
    const { data: slugs } = await supabase
      .from('products')
      .select('id, slug')
      .in('id', ids)
    const slugById = new Map<string, string>((((slugs as ProductSlugRow[] | null) ?? [])).map((r) => [r.id, r.slug]))

    const { data: biz } = await supabase
      .from('businesses')
      .select('id, slug, name')
      .eq('id', o.business_id)
      .maybeSingle()
    const business = biz as BusinessLookupRow | null
    if (!business) continue

    const products = itemRows
      .filter((it) => slugById.get(it.product_id))
      .map((it) => ({
        name: it.product_snapshot?.name ?? 'Producto',
        reviewUrl: `${appUrl}/s/es/${business.slug}/producto/${slugById.get(it.product_id)}#review-form`,
      }))
    if (products.length === 0) continue

    const rendered = reviewRequestEmail({
      customerName: o.customer_name,
      businessName: business.name,
      orderNumber: o.order_number,
      products,
    })

    const { error } = await supabase.from('commerce_email_outbox').insert({
      business_id: o.business_id,
      order_id: o.id,
      template: 'review_request',
      recipient_email: o.customer_email,
      subject: rendered.subject,
      html_body: rendered.html,
    })
    if (error) {
      log.warn('commerce.review_request.enqueue_failed', { orderId: o.id, error: error.message })
    } else {
      enqueued++
    }
  }

  log.info('commerce.cron.review_requests.done', { considered, enqueued, skippedAlreadySent })
  return NextResponse.json({ considered, enqueued, skippedAlreadySent })
})

export const GET = POST
