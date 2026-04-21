import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { reconcileFromProvider } from '@/lib/payments/reconcile'

export const runtime = 'nodejs'

/**
 * Catches orders stuck in awaiting_payment > 6 hours and re-queries the
 * payment provider to drive them to a terminal state. Webhooks are usually
 * reliable; this is the safety net.
 */
export const POST = withRequestLog(async (request, { log }) => {
  if (process.env.CRON_SECRET && request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createAdminClient()
  const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()

  const { data: stuckOrders } = await supabase
    .from('orders')
    .select('id, business_id, placed_at')
    .eq('status', 'awaiting_payment')
    .lt('placed_at', cutoff)
    .limit(50)

  const rows = Array.isArray(stuckOrders) ? stuckOrders : []
  let reconciled = 0
  let skipped = 0
  let errored = 0

  for (const order of rows) {
    const { data: tx } = await supabase
      .from('storefront_transactions')
      .select('provider, provider_payment_id, provider_preference_id')
      .eq('order_id', order.id)
      .not('provider_payment_id', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!tx?.provider_payment_id || !tx?.provider) {
      skipped++
      continue
    }

    try {
      await reconcileFromProvider({
        businessId: order.business_id,
        orderId: order.id,
        provider: tx.provider,
        providerPaymentId: tx.provider_payment_id,
        providerPreferenceId: tx.provider_preference_id,
      })
      reconciled++
    } catch (err) {
      errored++
      log.warn('commerce.cron.reconcile.order_failed', {
        orderId: order.id,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  log.info('commerce.cron.reconcile.done', { reconciled, skipped, errored, total: rows.length })
  return NextResponse.json({ reconciled, skipped, errored, total: rows.length })
})
