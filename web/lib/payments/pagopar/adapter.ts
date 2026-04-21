import { pagoparFetch, signPagopar, getPagoparTokens } from './client'
import { initTransaction } from './transactions'
import { verifyPagoparWebhook, mapPagoparStatus } from './webhooks'
import { loadCommissionConfig } from '@/lib/commerce/business-commission'
import { logger } from '@/lib/logger'
import type { PagoparWebhookPayload } from './webhooks'
import type { PaymentProviderAdapter } from '../types'

export const pagoparAdapter: PaymentProviderAdapter = {
  name: 'pagopar',

  async createCheckoutSession(order, opts) {
    const { publicToken, privateToken } = getPagoparTokens()
    const cancelUrl = opts.returnUrl.replace(/([?&])status=\w+/, '') + (opts.returnUrl.includes('?') ? '&' : '?') + 'status=failure'

    // Commission is loaded inside the adapter so the router/failover never
    // needs to know about billing rules. Failures fall back to "no commission"
    // rather than blocking the sale — better to miss a fee than lose a sale.
    let commission
    try {
      commission = await loadCommissionConfig(order.businessId)
    } catch (err) {
      logger.warn('[pagopar] commission config lookup failed, skipping commission', {
        action: 'pagopar.commission.lookup_failed',
        businessId: order.businessId,
        error: err instanceof Error ? err.message : String(err),
      })
      commission = undefined
    }

    const { hashPedido, checkoutUrl, commissionCents } = await initTransaction(order, {
      publicToken,
      privateToken,
      returnUrl: opts.returnUrl.includes('?') ? `${opts.returnUrl}&status=success` : `${opts.returnUrl}?status=success`,
      cancelUrl,
      webhookUrl: opts.webhookUrl,
      commission,
    })

    if (commissionCents > 0) {
      logger.info('[commerce] commission split configured', {
        action: 'commerce.commission.split',
        businessId: order.businessId,
        orderId: order.id,
        commissionCents,
        percent: commission?.percent,
      })
    }

    return {
      redirectUrl: checkoutUrl,
      providerRef: hashPedido,
      sandbox: (process.env.PAGOPAR_ENVIRONMENT ?? 'sandbox') !== 'production',
    }
  },

  async verifyWebhook(_request, rawBody) {
    const { privateToken } = getPagoparTokens()
    let payload: PagoparWebhookPayload
    try {
      payload = JSON.parse(rawBody) as PagoparWebhookPayload
    } catch {
      return { valid: false, eventId: '', resourceId: '', eventType: 'unknown', reason: 'invalid_json' }
    }

    const verification = verifyPagoparWebhook(payload, privateToken)
    // Pagopar doesn't send a distinct event id — the hash_pedido dedupes
    // by itself because a given order only fires one "pagado=true" event.
    // We append the status so a later refund webhook doesn't collide.
    const eventId = `${verification.hashPedido}:${verification.status}`
    return {
      valid: verification.valid,
      eventId,
      resourceId: verification.hashPedido,
      eventType: `payment.${verification.status}`,
      reason: verification.reason,
    }
  },

  async fetchPayment(providerPaymentId) {
    // providerPaymentId = hash_pedido. Pagopar's "traer-pedido" endpoint
    // returns the current state of the order. Token = sha1(private + hash).
    const { publicToken, privateToken } = getPagoparTokens()
    const token = signPagopar(privateToken, providerPaymentId)

    const response = await pagoparFetch<{
      resultado: Array<{
        hash_pedido: string
        pagado: boolean
        cancelado?: boolean
        monto?: string | number
        ultimo_mensaje_error?: string | null
        forma_pago_identificador?: string
      }>
      respuesta: boolean
    }>('/api/comercios/1.1/traer-pedido', {
      method: 'POST',
      body: JSON.stringify({ token, public_key: publicToken, hash_pedido: providerPaymentId }),
    })

    const entry = response.resultado?.[0]
    if (!entry) throw new Error('pagopar_order_not_found')

    const status = mapPagoparStatus(entry)
    const amount = typeof entry.monto === 'number' ? entry.monto : parseInt(String(entry.monto ?? '0'), 10) || 0

    return {
      providerPaymentId: entry.hash_pedido,
      status,
      amountCents: amount,
      currency: 'PYG',
      externalReference: entry.hash_pedido,
      rawPayload: response as unknown as Record<string, unknown>,
    }
  },
}
