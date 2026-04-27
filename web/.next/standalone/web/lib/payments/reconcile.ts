import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { getAdapter } from './registry'
import { transitionStatus } from '@/lib/commerce/orders'
import type { NormalizedPayment } from './types'
import type { OrderStatus } from '@/lib/schemas/commerce/order'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'

/**
 * Reconciles one payment: writes a transaction row + drives the order state
 * machine. Called from the webhook handler after signature verification.
 * Idempotent: repeated calls with the same providerPaymentId upsert the tx
 * and skip re-transitioning if the target status is already set.
 */
export async function reconcilePayment(opts: {
  businessId: string
  orderId: string
  provider: PaymentProvider
  providerPreferenceId?: string | null
  payment: NormalizedPayment
}): Promise<void> {
  const supabase = await createAdminClient()

  const txRecord = {
    business_id: opts.businessId,
    order_id: opts.orderId,
    provider: opts.provider,
    provider_payment_id: opts.payment.providerPaymentId,
    provider_preference_id: opts.providerPreferenceId ?? null,
    status: opts.payment.status,
    amount_cents: opts.payment.amountCents,
    currency: opts.payment.currency,
    raw_payload: opts.payment.rawPayload,
  }

  const { error: txError } = await supabase
    .from('storefront_transactions')
    .upsert(txRecord, { onConflict: 'provider,provider_payment_id' })

  if (txError) {
    logger.error('[commerce] reconcile upsert failed', {
      action: 'commerce.reconcile.tx_upsert_failed',
      businessId: opts.businessId,
      orderId: opts.orderId,
      error: txError.message,
    })
    throw new Error('tx_upsert_failed')
  }

  const nextOrderStatus = mapToOrderStatus(opts.payment.status)
  if (nextOrderStatus) {
    try {
      await transitionStatus(opts.businessId, opts.orderId, nextOrderStatus)
    } catch (err) {
      // Invalid transition or order-not-found — log but do not crash the webhook
      // reply, since the tx row has already been written for audit.
      logger.warn('[commerce] reconcile transition skipped', {
        action: 'commerce.reconcile.transition_skipped',
        businessId: opts.businessId,
        orderId: opts.orderId,
        nextOrderStatus,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
}

function mapToOrderStatus(txStatus: NormalizedPayment['status']): OrderStatus | null {
  switch (txStatus) {
    case 'approved':
      return 'paid'
    case 'rejected':
    case 'failed':
      return 'failed'
    case 'cancelled':
      return 'cancelled'
    case 'refunded':
      return 'refunded'
    default:
      return null // pending / in_process / authorized → no order-level change yet
  }
}

/** Convenience: full webhook→reconcile path for MP given a resource id. */
export async function reconcileFromProvider(opts: {
  businessId: string
  orderId: string
  provider: PaymentProvider
  providerPaymentId: string
  providerPreferenceId?: string | null
}): Promise<void> {
  const adapter = getAdapter(opts.provider)
  const payment = await adapter.fetchPayment(opts.providerPaymentId)
  await reconcilePayment({
    businessId: opts.businessId,
    orderId: opts.orderId,
    provider: opts.provider,
    providerPreferenceId: opts.providerPreferenceId,
    payment,
  })
}
