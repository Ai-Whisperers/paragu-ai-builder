import { getBancardCredentials } from './client'
import { getConfirmation, initSingleBuy, mapBancardStatus, orderToShopProcessId } from './transactions'
import { verifyBancardWebhook, type BancardWebhookPayload } from './webhooks'
import type { PaymentProviderAdapter } from '../types'

/**
 * Bancard vPOS 2.0 adapter — matches the same PaymentProviderAdapter
 * interface as pagopar. Router + failover + reconcile don't need to
 * know anything provider-specific beyond what this surface exposes.
 *
 * Scope of this adapter:
 *   - Single-buy (one-shot card payment)
 *   - Get confirmation (pull source-of-truth)
 *   - Webhook verify + normalize
 *   - Refund/rollback handled in refund.ts (called directly by admin UI,
 *     not via the adapter surface — same shape as pagopar/refund.ts)
 *
 * NOT in this adapter (deliberate, Phase-4 scope):
 *   - Tokenization (cards_new + charge)
 *   - Recurring billing (billingClientInfo + billingCancel)
 *   - Pre-authorization
 *   These have adapters on Bancard's SDK side, but paragu-ai-builder
 *   doesn't have the domain model for saved cards / subscriptions yet.
 *   When it does, add stored-card helpers in tokens.ts alongside
 *   transactions.ts.
 */
export const bancardAdapter: PaymentProviderAdapter = {
  name: 'bancard',

  async createCheckoutSession(order, opts) {
    const credentials = getBancardCredentials()

    const successReturn = opts.returnUrl.includes('?')
      ? `${opts.returnUrl}&status=success`
      : `${opts.returnUrl}?status=success`
    const cancelReturn = opts.returnUrl.includes('?')
      ? `${opts.returnUrl}&status=failure`
      : `${opts.returnUrl}?status=failure`

    const { shopProcessId, iframeUrl } = await initSingleBuy(order, {
      credentials,
      returnUrl: successReturn,
      cancelUrl: cancelReturn,
    })

    return {
      // Bancard's hosted-checkout URL works as a top-level redirect
      // target too — merchants that don't want the iframe overlay can
      // just redirect the shopper here.
      redirectUrl: iframeUrl,
      // providerRef stores shop_process_id (numeric) as a string so the
      // DB column stays text-stable and reconcile paths stay uniform.
      // The Bancard-issued process_id alias is recoverable from the
      // raw_payload stored on the transaction row if we ever need it.
      providerRef: String(shopProcessId),
      sandbox: credentials.environment !== 'production',
    }
  },

  async verifyWebhook(_request, rawBody) {
    const { privateKey } = getBancardCredentials()
    let payload: BancardWebhookPayload
    try {
      payload = JSON.parse(rawBody) as BancardWebhookPayload
    } catch {
      return { valid: false, eventId: '', resourceId: '', eventType: 'unknown', reason: 'invalid_json' }
    }

    const v = verifyBancardWebhook(payload, privateKey)
    // Bancard doesn't emit a distinct event id per notification; a given
    // shop_process_id only gets one terminal status. Append the status
    // so a later refund webhook doesn't collide on dedup.
    const eventId = `${v.shopProcessId}:${v.status}`
    return {
      valid: v.valid,
      eventId,
      resourceId: v.shopProcessId,
      eventType: `payment.${v.status}`,
      reason: v.reason,
    }
  },

  async fetchPayment(providerPaymentId) {
    const credentials = getBancardCredentials()
    const shopProcessId = Number(providerPaymentId)
    if (!Number.isFinite(shopProcessId)) {
      throw new Error(`bancard_invalid_shop_process_id:${providerPaymentId}`)
    }

    const confirmation = await getConfirmation(shopProcessId, credentials)
    const status = mapBancardStatus(confirmation)

    // Confirmation.amount is a 2-decimal string — parse back to integer
    // cents using the same rule the webhook uses.
    const raw = confirmation.amount
    let amountCents = 0
    if (raw) {
      const num = Number(raw)
      if (!Number.isNaN(num)) {
        amountCents = Math.round(num) // PYG stores whole guaraníes
      }
    }

    return {
      providerPaymentId: String(shopProcessId),
      status,
      amountCents,
      currency: 'PYG',
      externalReference: confirmation.authorization_number ?? confirmation.ticket_number,
      rawPayload: confirmation as unknown as Record<string, unknown>,
    }
  },
}

// Re-export helpers so callers (admin refund flow, tests) don't need to
// reach into internal file paths.
export { orderToShopProcessId }
