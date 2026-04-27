import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { findPendingBackInStockNotifications, markNotified } from '@/lib/commerce/back-in-stock'
import { backInStockEmail } from '@/lib/commerce/email-templates'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Cron — dispatch back-in-stock notifications.
 *
 * Scans subscriptions whose target product is active AND back in stock
 * (policy=continue OR qty>0). Enqueues an email per subscription into
 * commerce_email_outbox and marks notified. The email-flush cron picks
 * the row up on its next tick.
 *
 * Idempotent: markNotified sets notified_at so the row won't match on
 * the next run. Email deduping is handled by the outbox itself if the
 * sender decides to skip duplicates; we already set notified_at before
 * returning so a re-run while this runs is safe.
 */
export const GET = withRequestLog<Record<string, never>>(async (_req, { log }) => {
  const pending = await findPendingBackInStockNotifications(50)
  if (pending.length === 0) {
    return NextResponse.json({ processed: 0 })
  }

  let supabase
try { supabase = await createAdminClient() } catch {
  return NextResponse.json({ ok: false, reason: 'env_not_configured' }, { status: 200 })
}

  // Look up business names in one query so we don't N+1 it in the loop.
  const businessIds = Array.from(new Set(pending.map((p) => p.businessId)))
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name')
    .in('id', businessIds)
  const nameById = new Map<string, string>()
  for (const b of (Array.isArray(businesses) ? businesses : []) as Array<{ id: string; name: string }>) {
    nameById.set(b.id, b.name)
  }

  let enqueued = 0
  for (const p of pending) {
    const businessName = nameById.get(p.businessId) ?? 'Tu tienda'
    const rendered = backInStockEmail({
      productName: p.productName,
      productUrl: p.productUrl,
      businessName,
    })
    const { error } = await supabase.from('commerce_email_outbox').insert({
      business_id: p.businessId,
      template: 'back_in_stock',
      recipient_email: p.email,
      subject: rendered.subject,
      html_body: rendered.html,
    })
    if (error) {
      logger.warn('[cron/back-in-stock] outbox insert failed', {
        action: 'commerce.back_in_stock.outbox_insert_failed',
        subscriptionId: p.subscriptionId,
        error: error.message,
      })
      continue
    }
    await markNotified(p.subscriptionId)
    enqueued += 1
  }

  log.info('commerce.back_in_stock.cron_run', { scanned: pending.length, enqueued })
  return NextResponse.json({ processed: pending.length, enqueued })
})
