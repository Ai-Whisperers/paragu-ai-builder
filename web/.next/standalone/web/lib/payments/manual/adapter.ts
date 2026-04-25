import type { PaymentProviderAdapter } from '../types'

/**
 * Offline "pay by bank transfer + WhatsApp comprobante" flow. No gateway
 * integration — the shopper is redirected to a page with the tenant's bank
 * details and a WhatsApp deep link. The order sits in `awaiting_payment`
 * until the merchant clicks "Confirmar pago recibido" in the admin.
 *
 * This is the right fit for Paraguayan SMBs that don't yet have a Pagopar
 * merchant account — the same manual flow Ivan already uses for his own
 * SaaS billing.
 */
export const manualAdapter: PaymentProviderAdapter = {
  name: 'manual',

  async createCheckoutSession(order, opts) {
    // The checkout route passes returnUrl = `${appUrl}/s/{locale}/{site}/orden/{id}`.
    // We piggy-back on that to derive the transfer instructions page URL without
    // needing to thread the site slug through the adapter interface.
    const redirectUrl = opts.returnUrl.replace('/orden/', '/checkout/transfer/')

    return {
      redirectUrl,
      providerRef: `MANUAL-${order.id}`,
      sandbox: false,
    }
  },

  async verifyWebhook() {
    // Manual transfers have no webhook — the merchant confirms in admin.
    return {
      valid: false,
      eventId: '',
      resourceId: '',
      eventType: 'unsupported',
      reason: 'manual_has_no_webhook',
    }
  },

  async fetchPayment(providerPaymentId) {
    // No gateway to query; we just echo back a pending status. The order's
    // own DB row is the source of truth; the admin flips it to `paid`.
    return {
      providerPaymentId,
      status: 'pending',
      amountCents: 0,
      currency: 'PYG',
      externalReference: providerPaymentId,
      rawPayload: { note: 'manual_transfer_pending_merchant_confirmation' },
    }
  },
}
