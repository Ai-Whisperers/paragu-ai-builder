import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { pagoparAdapter } from '@/lib/payments/pagopar/adapter'
import { reconcileFromProvider } from '@/lib/payments/reconcile'

export const runtime = 'nodejs'

/**
 * Pagopar calls this endpoint after payment state changes. The payload carries
 * a SHA-1 token = sha1(private_token + hash_pedido). We must:
 *   1. Verify that token or reject with 401 (never touches order state).
 *   2. Write the event to webhook_events keyed by (pagopar, hash+status)
 *      for replay dedup.
 *   3. Drive the order state machine via reconcileFromProvider.
 *
 * Pagopar retries every 10 min on non-200 responses. Return 200 for dedup
 * hits and for ignored event types; return 500 for transient internal errors
 * so the retry loop kicks in.
 */
export const POST = withRequestLog(async (request, { log }) => {
  const rawBody = await request.text()

  const verification = await pagoparAdapter.verifyWebhook(request, rawBody)
  const supabase = await createAdminClient()

  const { error: insertError, data: inserted } = await supabase
    .from('webhook_events')
    .insert({
      provider: 'pagopar',
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
    .eq('provider', 'pagopar')
    .eq('provider_preference_id', verification.resourceId)
    .maybeSingle()

  if (!tx?.business_id || !tx?.order_id) {
    log.warn('commerce.webhook.no_matching_tx', { hashPedido: verification.resourceId })
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
      provider: 'pagopar',
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
