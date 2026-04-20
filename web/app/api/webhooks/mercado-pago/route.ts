import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'
import { parseAndVerifyWebhook } from '@/lib/payments/mercado-pago/webhooks'
import { reconcileFromProvider } from '@/lib/payments/reconcile'

export const runtime = 'nodejs'

export const POST = withRequestLog(async (request, { log }) => {
  const rawBody = await request.text()

  // 1. Signature verification (always write to webhook_events, even if invalid)
  let verification
  try {
    verification = await parseAndVerifyWebhook(request, rawBody)
  } catch (err) {
    log.warn('commerce.webhook.parse_failed', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // 2. Dedup via UNIQUE(provider, provider_event_id)
  const { error: insertError, data: inserted } = await supabase
    .from('webhook_events')
    .insert({
      provider: 'mercado_pago',
      provider_event_id: verification.eventId,
      event_type: verification.eventType,
      signature_valid: verification.valid,
      payload: JSON.parse(rawBody || '{}'),
    })
    .select('id')
    .maybeSingle()

  if (insertError) {
    // Already processed (UNIQUE violation) → return 200 so MP stops retrying.
    if (insertError.code === '23505') {
      log.info('commerce.webhook.duplicate', { eventId: verification.eventId })
      return NextResponse.json({ deduplicated: true })
    }
    log.error('commerce.webhook.insert_failed', new Error(insertError.message))
    return NextResponse.json({ error: 'ingest_failed' }, { status: 500 })
  }

  if (!verification.valid) {
    log.warn('commerce.webhook.signature_failed', { eventId: verification.eventId, reason: verification.reason })
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  // 3. Only payment events drive reconcile. MP sends "payment" (IPN v1) and
  // "payment.created" / "payment.updated" (v2). Everything else (e.g.
  // "merchant_order") is acknowledged and ignored.
  const isPaymentEvent = verification.eventType === 'payment' || verification.eventType.startsWith('payment.')
  if (!isPaymentEvent) {
    await supabase.from('webhook_events').update({ processed_at: new Date().toISOString() }).eq('id', inserted?.id)
    return NextResponse.json({ ignored: true })
  }

  // 4. Find the order via storefront_transactions (populated at checkout)
  const { data: tx } = await supabase
    .from('storefront_transactions')
    .select('business_id, order_id, provider_preference_id')
    .eq('provider_payment_id', verification.resourceId)
    .maybeSingle()

  let businessId = tx?.business_id as string | undefined
  let orderId = tx?.order_id as string | undefined
  let preferenceId = tx?.provider_preference_id as string | null | undefined

  // If no tx row yet (first touch for this payment), look up by external_reference via MP
  if (!businessId || !orderId) {
    try {
      const { getAdapter } = await import('@/lib/payments/registry')
      const adapter = getAdapter('mercado_pago')
      const payment = await adapter.fetchPayment(verification.resourceId)
      if (!payment.externalReference) {
        log.warn('commerce.webhook.no_external_reference', { eventId: verification.eventId })
        await supabase.from('webhook_events').update({
          processed_at: new Date().toISOString(),
          error_message: 'no_external_reference',
        }).eq('id', inserted?.id)
        return NextResponse.json({ ignored: true })
      }
      const { data: order } = await supabase
        .from('orders')
        .select('id, business_id')
        .eq('id', payment.externalReference)
        .maybeSingle()
      if (!order) {
        log.warn('commerce.webhook.order_not_found', { externalReference: payment.externalReference })
        return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
      }
      businessId = order.business_id
      orderId = order.id
      preferenceId = null
    } catch (err) {
      log.error('commerce.webhook.fetch_payment_failed', err instanceof Error ? err : new Error(String(err)))
      return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
    }
  }

  try {
    await reconcileFromProvider({
      businessId: businessId!,
      orderId: orderId!,
      provider: 'mercado_pago',
      providerPaymentId: verification.resourceId,
      providerPreferenceId: preferenceId ?? null,
    })
    await supabase.from('webhook_events').update({
      processed_at: new Date().toISOString(),
      business_id: businessId,
      order_id: orderId,
    }).eq('id', inserted?.id)
    log.info('commerce.webhook.reconciled', { eventId: verification.eventId, orderId })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    log.error('commerce.webhook.reconcile_failed', err instanceof Error ? err : new Error(message))
    await supabase.from('webhook_events').update({ error_message: message }).eq('id', inserted?.id)
    return NextResponse.json({ error: 'reconcile_failed' }, { status: 500 })
  }
})
