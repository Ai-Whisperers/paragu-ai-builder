import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { bancardAdapter } from '@/lib/payments/bancard/adapter'
import { reconcileFromProvider } from '@/lib/payments/reconcile'

export const runtime = 'nodejs'

/**
 * Bancard vPOS 2.0 webhook receiver.
 *
 * Bancard fires a POST to the `return_url_after_payment` (configured at
 * merchant-portal level, not per-transaction) whenever a shop_process_id
 * reaches a terminal status. The body carries `operation.token`, which
 * is md5(private_key + shop_process_id + "get_confirmation") — the same
 * template the pull endpoint uses, so verification is a straight re-hash.
 *
 *   1. Verify signature (reject with 401 if mismatch).
 *   2. Insert into webhook_events keyed by (bancard, shop_process_id:status)
 *      for dedup. Bancard retries on non-2xx, so the unique-violation
 *      path must return 200.
 *   3. Drive reconcileFromProvider which pulls fresh state via
 *      adapter.fetchPayment — the webhook itself is not authoritative.
 *
 * The code path mirrors /api/webhooks/pagopar so behavior is uniform
 * regardless of which provider fired the event.
 */
export const POST = withRequestLog(async (request, { log }) => {
  const rawBody = await request.text()

  const verification = await bancardAdapter.verifyWebhook(request, rawBody)
  const supabase = await createAdminClient()

  const { error: insertError, data: inserted } = await supabase
    .from('webhook_events')
    .insert({
      provider: 'bancard',
      provider_event_id: verification.eventId || `unknown-${Date.now()}`,
      event_type: verification.eventType,
      signature_valid: verification.valid,
      payload: rawBody ? JSON.parse(rawBody) : {},
    })
    .select('id')
    .maybeSingle()

  if (insertError) {
    if (insertError.code === '23505') {
      log.info('commerce.webhook.duplicate', { eventId: verification.eventId })
      return NextResponse.json({ deduplicated: true })
    }
    log.error('commerce.webhook.insert_failed', new Error(insertError.message))
    return NextResponse.json({ error: 'ingest_failed' }, { status: 500 })
  }

  if (!verification.valid) {
    log.warn('commerce.webhook.signature_failed', {
      eventId: verification.eventId,
      reason: verification.reason,
    })
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  const { data: tx } = await supabase
    .from('storefront_transactions')
    .select('business_id, order_id, provider_preference_id')
    .eq('provider', 'bancard')
    .eq('provider_preference_id', verification.resourceId)
    .maybeSingle()

  if (!tx?.business_id || !tx?.order_id) {
    log.warn('commerce.webhook.no_matching_tx', { shopProcessId: verification.resourceId })
    await supabase
      .from('webhook_events')
      .update({ processed_at: new Date().toISOString(), error_message: 'no_matching_tx' })
      .eq('id', inserted?.id)
    return NextResponse.json({ ignored: true })
  }

  try {
    await reconcileFromProvider({
      businessId: tx.business_id,
      orderId: tx.order_id,
      provider: 'bancard',
      providerPaymentId: verification.resourceId,
      providerPreferenceId: tx.provider_preference_id,
    })
    await supabase
      .from('webhook_events')
      .update({
        processed_at: new Date().toISOString(),
        business_id: tx.business_id,
        order_id: tx.order_id,
      })
      .eq('id', inserted?.id)
    log.info('commerce.webhook.reconciled', {
      eventId: verification.eventId,
      orderId: tx.order_id,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    log.error('commerce.webhook.reconcile_failed', err instanceof Error ? err : new Error(message))
    await supabase
      .from('webhook_events')
      .update({ error_message: message })
      .eq('id', inserted?.id)
    return NextResponse.json({ error: 'reconcile_failed' }, { status: 500 })
  }
})
