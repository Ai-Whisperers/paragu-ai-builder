import { logger } from '@/lib/logger'
import { getAdapter } from './registry'
import type { Order } from '@/lib/schemas/commerce/order'
import type { PaymentProvider } from '@/lib/schemas/commerce/transaction'
import type { CheckoutSession } from './types'

export class NoAvailableProviderError extends Error {
  constructor(public attempted: PaymentProvider[]) {
    super(`all_providers_failed:${attempted.join(',')}`)
    this.name = 'NoAvailableProviderError'
  }
}

/**
 * Heuristic: a "gateway error" is a 5xx, fetch timeout, network failure,
 * or "not_implemented" from a stub adapter — anything that says "this
 * provider is sick, try another one." A 4xx (validation, unauthorized) is
 * NOT a gateway error and bubbles up as a real failure.
 */
function isGatewayError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const m = err.message
  if (m.includes('not_implemented')) return true
  if (m.includes('fetch failed') || m.includes('ETIMEDOUT') || m.includes('ECONNRESET')) return true
  // Provider-specific 5xx markers (mp_api_error:5xx:..., pagopar_api_error:5xx:..., etc.)
  if (/_api_error:5\d\d:/.test(m)) return true
  return false
}

export interface FailoverAttempt {
  provider: PaymentProvider
  error: string
}

export interface FailoverResult {
  session: CheckoutSession
  provider: PaymentProvider
  attempted: FailoverAttempt[]
}

/**
 * Walk providers best-first. Return on first success. Skip on gateway
 * errors. Bubble on real validation errors.
 */
export async function createCheckoutWithFailover(
  order: Order,
  providers: PaymentProvider[],
  opts: { returnUrl: string; webhookUrlFor: (provider: PaymentProvider) => string },
): Promise<FailoverResult> {
  const attempted: FailoverAttempt[] = []

  for (const provider of providers) {
    try {
      const adapter = getAdapter(provider)
      const session = await adapter.createCheckoutSession(order, {
        returnUrl: opts.returnUrl,
        webhookUrl: opts.webhookUrlFor(provider),
      })
      if (attempted.length > 0) {
        logger.warn('commerce.payments.failover_recovered', {
          orderId: order.id,
          chosen: provider,
          attemptedCount: attempted.length,
        })
      }
      return { session, provider, attempted }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      attempted.push({ provider, error: message })
      if (isGatewayError(err)) {
        logger.warn('commerce.payments.failover_skip', { orderId: order.id, provider, error: message })
        continue
      }
      // Real failure (validation, unauthorized, business rule) — stop.
      throw err
    }
  }

  throw new NoAvailableProviderError(providers)
}
