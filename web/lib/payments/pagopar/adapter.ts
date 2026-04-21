import type { PaymentProviderAdapter } from '../types'

/**
 * Pagopar adapter — STUB ONLY (PR 1 of 5).
 *
 * PR 2 (feat/pagopar-adapter) will implement:
 *   - createCheckoutSession: POST /api/comercios/2.0/iniciar-transaccion
 *   - verifyWebhook: SHA1 token validation against (privateKey + orderHash)
 *   - fetchPayment: GET status for an order hash
 *
 * This stub exists so the PaymentProviderAdapter registry compiles + the
 * CHECK constraint on storefront_transactions.provider accepts 'pagopar'
 * from the migration shipping in this PR.
 */
export const pagoparAdapter: PaymentProviderAdapter = {
  name: 'pagopar',

  async createCheckoutSession() {
    throw new Error('pagopar_adapter_not_implemented: ship PR 2 before enabling checkout')
  },

  async verifyWebhook() {
    return {
      valid: false,
      eventId: '',
      resourceId: '',
      eventType: 'unknown',
      reason: 'pagopar_adapter_not_implemented',
    }
  },

  async fetchPayment() {
    throw new Error('pagopar_adapter_not_implemented: ship PR 2 before processing webhooks')
  },
}
