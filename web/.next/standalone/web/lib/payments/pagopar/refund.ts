import { pagoparFetch, signPagopar, getPagoparTokens } from './client'
import { logger } from '@/lib/logger'

/**
 * Pagopar refund via the admin API. Token signs (privateToken + hash_pedido).
 *
 * Pagopar exposes refunds via /api/comercios/1.1/reversar-pedido (called
 * "reversión" in their terms). Partial refund is not supported for every
 * payment method — for unsupported cases we fall back to "mark refunded
 * in our DB, merchant handles the funds transfer manually". That matches
 * the memory note about keeping Pagopar primary but not blocking on gaps.
 */
export interface RefundResult {
  success: boolean
  providerReference?: string
  message?: string
  fallbackManual?: boolean
  rawPayload: Record<string, unknown>
}

interface PagoparReversalResponse {
  resultado?: Array<{ hash_pedido?: string; estado?: string; mensaje?: string }>
  respuesta: boolean
  mensajes?: Array<{ mensaje?: string; codigo?: string }>
}

export async function refundPagoparOrder(opts: {
  hashPedido: string
  reason?: string
}): Promise<RefundResult> {
  const { publicToken, privateToken } = getPagoparTokens()
  const token = signPagopar(privateToken, opts.hashPedido)

  try {
    const response = await pagoparFetch<PagoparReversalResponse>(
      '/api/comercios/1.1/reversar-pedido',
      {
        method: 'POST',
        body: JSON.stringify({
          token,
          public_key: publicToken,
          hash_pedido: opts.hashPedido,
          motivo: opts.reason ?? 'Reverso administrado desde Paragu-AI',
        }),
      },
    )

    if (response.respuesta === false) {
      const message = response.mensajes?.[0]?.mensaje ?? 'unknown_pagopar_error'
      logger.warn('[commerce] pagopar refund rejected', {
        action: 'commerce.refund.rejected',
        hashPedido: opts.hashPedido,
        message,
      })
      return {
        success: false,
        message,
        fallbackManual: true,
        rawPayload: response as unknown as Record<string, unknown>,
      }
    }

    const estado = response.resultado?.[0]?.estado
    return {
      success: true,
      providerReference: response.resultado?.[0]?.hash_pedido ?? opts.hashPedido,
      message: estado,
      rawPayload: response as unknown as Record<string, unknown>,
    }
  } catch (err) {
    // 404 / 405 etc — the endpoint may not exist on every Pagopar plan tier.
    // Fall back: admin marks order refunded, tells merchant to refund manually.
    const message = err instanceof Error ? err.message : String(err)
    logger.warn('[commerce] pagopar refund endpoint failed, fallback manual', {
      action: 'commerce.refund.endpoint_failed',
      hashPedido: opts.hashPedido,
      error: message,
    })
    return {
      success: false,
      message,
      fallbackManual: true,
      rawPayload: {},
    }
  }
}
