import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { refundPagoparOrder } from '@/lib/payments/pagopar/refund'
import { transitionStatus, CheckoutError } from '@/lib/commerce/orders'

export const runtime = 'nodejs'

const BodySchema = z.object({
  reason: z.string().max(500).optional(),
  /**
   * markOnly = true ⇒ flip order to refunded in our DB without calling the
   * provider. Useful when the merchant already refunded in the Pagopar
   * dashboard or issued a bank transfer.
   */
  markOnly: z.boolean().optional(),
})

export const POST = withRequestLog<{ businessId: string; id: string }>(async (req, { log }, { businessId, id }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown = {}
  try {
    json = await req.json()
  } catch {
    /* empty body is fine */
  }
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // Find the successful transaction for this order so we know the hash_pedido.
  const { data: tx } = await supabase
    .from('storefront_transactions')
    .select('id, provider, provider_payment_id')
    .eq('business_id', businessId)
    .eq('order_id', id)
    .in('status', ['approved', 'authorized'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!tx && !parsed.data.markOnly) {
    return NextResponse.json(
      { error: 'no_paid_transaction', message: 'No hay transacción aprobada para esta orden.' },
      { status: 404 },
    )
  }

  let providerResult: { success: boolean; message?: string; fallbackManual?: boolean } = { success: true }

  if (!parsed.data.markOnly && tx?.provider === 'pagopar' && tx.provider_payment_id) {
    providerResult = await refundPagoparOrder({
      hashPedido: tx.provider_payment_id,
      reason: parsed.data.reason,
    })
  }

  // Drive the order state machine regardless — merchant can retry the
  // gateway reverse later via Pagopar's own dashboard if needed.
  try {
    await transitionStatus(businessId, id, 'refunded')
  } catch (err) {
    if (err instanceof CheckoutError && err.code === 'order_not_found') {
      return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
    }
    // State-machine rejection (e.g., wrong starting state) — let admin decide
    log.warn('admin.commerce.refund.state_transition_failed', {
      businessId,
      orderId: id,
      error: err instanceof Error ? err.message : String(err),
    })
  }

  // Update the tx row (if we have one) to refunded for attribution.
  if (tx?.id) {
    await supabase
      .from('storefront_transactions')
      .update({ status: 'refunded' })
      .eq('id', tx.id)
  }

  log.info('admin.commerce.refund.done', {
    businessId,
    orderId: id,
    providerSuccess: providerResult.success,
    markOnly: !!parsed.data.markOnly,
  })

  return NextResponse.json({
    ok: true,
    providerRefunded: providerResult.success,
    fallbackManual: providerResult.fallbackManual ?? false,
    message: providerResult.message,
  })
})
