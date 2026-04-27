/**
 * Cron — dispatch post-fulfillment review requests.
 *
 * Finds orders that were shipped or delivered >= 3 days ago and haven't
 * yet received a review_request email. Enqueues one per order into
 * commerce_email_outbox; the email-flush cron sends it out.
 *
 * Idempotency: the check "no existing outbox row for this order with
 * template=review_request" is the dedupe. Safe to re-run.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { reviewRequestEmail } from '@/lib/commerce/email-templates'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface CandidateOrder {
  id: string
  business_id: string
  order_number: string
  customer_name: string | null
  customer_email: string
  customer_locale: string | null
  shipped_at: string | null
  fulfilled_at: string | null
}

interface OrderItem {
  order_id: string
  product_slug: string | null
  product_snapshot: { name?: string; slug?: string } | null
}

interface Business {
  id: string
  name: string
  slug: string
}

const REVIEW_DELAY_DAYS = 3
const MAX_ORDERS_PER_RUN = 50

export const GET = withRequestLog<Record<string, never>>(async (_req, { log }) => {
  let supabase
try { supabase = await createAdminClient() } catch {
  return NextResponse.json({ ok: false, reason: 'env_not_configured' }, { status: 200 })
}
  const threshold = new Date(Date.now() - REVIEW_DELAY_DAYS * 24 * 60 * 60 * 1000).toISOString()

  // Candidates: shipped/delivered orders, past the delay threshold.
  const { data: ordersRaw } = await supabase
    .from('orders')
    .select('id, business_id, order_number, customer_name, customer_email, customer_locale, shipped_at, fulfilled_at')
    .in('status', ['shipped', 'delivered'])
    .or(`shipped_at.lte.${threshold},fulfilled_at.lte.${threshold}`)
    .order('shipped_at', { ascending: false, nullsFirst: false })
    .limit(MAX_ORDERS_PER_RUN * 2)
  const candidates = (Array.isArray(ordersRaw) ? ordersRaw : []) as CandidateOrder[]
  if (candidates.length === 0) {
    return NextResponse.json({ processed: 0 })
  }

  // Dedupe: drop any order that already has a review_request in the outbox.
  const orderIds = candidates.map((o) => o.id)
  const { data: existing } = await supabase
    .from('commerce_email_outbox')
    .select('order_id')
    .eq('template', 'review_request')
    .in('order_id', orderIds)
  const alreadyAsked = new Set(
    (Array.isArray(existing) ? existing : []).map((r: { order_id: string }) => r.order_id),
  )
  const toProcess = candidates.filter((o) => !alreadyAsked.has(o.id)).slice(0, MAX_ORDERS_PER_RUN)
  if (toProcess.length === 0) {
    return NextResponse.json({ processed: 0 })
  }

  // Batch-load order_items + businesses so we avoid N+1.
  const [{ data: itemsRaw }, { data: bizRaw }] = await Promise.all([
    supabase
      .from('order_items')
      .select('order_id, product_snapshot')
      .in('order_id', toProcess.map((o) => o.id)),
    supabase
      .from('businesses')
      .select('id, name, slug')
      .in('id', Array.from(new Set(toProcess.map((o) => o.business_id)))),
  ])
  const itemsByOrder = new Map<string, OrderItem[]>()
  for (const it of (Array.isArray(itemsRaw) ? itemsRaw : []) as OrderItem[]) {
    const arr = itemsByOrder.get(it.order_id) ?? []
    arr.push(it)
    itemsByOrder.set(it.order_id, arr)
  }
  const bizById = new Map<string, Business>()
  for (const b of (Array.isArray(bizRaw) ? bizRaw : []) as Business[]) {
    bizById.set(b.id, b)
  }

  let enqueued = 0
  for (const order of toProcess) {
    const business = bizById.get(order.business_id)
    if (!business) continue
    const items = itemsByOrder.get(order.id) ?? []
    const products = items
      .map((it) => {
        const name = it.product_snapshot?.name ?? ''
        const slug = it.product_snapshot?.slug ?? ''
        if (!name || !slug) return null
        const locale = order.customer_locale ?? 'es'
        return {
          name,
          reviewUrl: `${env.APP_URL}/s/${locale}/${business.slug}/producto/${slug}#review-form-heading`,
        }
      })
      .filter((p): p is { name: string; reviewUrl: string } => p !== null)
    if (products.length === 0) continue

    const rendered = reviewRequestEmail({
      customerName: order.customer_name ?? 'Hola',
      businessName: business.name,
      orderNumber: order.order_number,
      products,
    })

    const { error } = await supabase.from('commerce_email_outbox').insert({
      business_id: order.business_id,
      order_id: order.id,
      template: 'review_request',
      recipient_email: order.customer_email,
      subject: rendered.subject,
      html_body: rendered.html,
    })
    if (error) {
      logger.warn('[cron/review-requests] outbox insert failed', {
        action: 'commerce.review_request.outbox_insert_failed',
        orderId: order.id,
        error: error.message,
      })
      continue
    }
    enqueued += 1
  }

  log.info('commerce.review_request.cron_run', {
    scanned: candidates.length,
    eligible: toProcess.length,
    enqueued,
  })
  return NextResponse.json({ processed: candidates.length, eligible: toProcess.length, enqueued })
})
