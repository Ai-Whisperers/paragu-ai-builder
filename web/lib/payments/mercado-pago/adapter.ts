import { mpFetch } from './client'
import { createPreference } from './preferences'
import { parseAndVerifyWebhook } from './webhooks'
import { MP_STATUS_MAP, MpPaymentResourceSchema } from '@/lib/schemas/commerce/transaction'
import type { PaymentProviderAdapter } from '../types'

export const mercadoPagoAdapter: PaymentProviderAdapter = {
  name: 'mercado_pago',

  async createCheckoutSession(order, opts) {
    const pref = await createPreference(order, {
      returnBaseUrl: opts.returnUrl,
      webhookUrl: opts.webhookUrl,
      idempotencyKey: `order:${order.id}`,
    })
    const sandbox = process.env.NODE_ENV !== 'production'
    return {
      redirectUrl: sandbox ? pref.sandbox_init_point : pref.init_point,
      providerRef: pref.id,
      sandbox,
    }
  },

  async verifyWebhook(request, rawBody) {
    return parseAndVerifyWebhook(request, rawBody)
  },

  async fetchPayment(providerPaymentId) {
    const raw = await mpFetch<unknown>(`/v1/payments/${providerPaymentId}`)
    const parsed = MpPaymentResourceSchema.parse(raw)
    const status = MP_STATUS_MAP[parsed.status] ?? 'pending'
    // MP's transaction_amount is in the currency unit (e.g. PYG whole guaraníes).
    // PYG has no subunit → integer already; other currencies × 100 to cents.
    const currency = parsed.currency_id.toUpperCase()
    const amountCents = currency === 'PYG' ? Math.round(parsed.transaction_amount) : Math.round(parsed.transaction_amount * 100)

    return {
      providerPaymentId: parsed.id,
      status,
      amountCents,
      currency,
      externalReference: parsed.external_reference,
      rawPayload: raw as Record<string, unknown>,
    }
  },
}
