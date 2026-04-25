import {
  bancardFetch,
  confirmationToken,
  formatBancardAmount,
  rollbackToken,
  singleBuyToken,
  type BancardCredentials,
} from './client'
import type { Order } from '@/lib/schemas/commerce/order'

/**
 * Bancard vPOS 2.0 — Single Buy flow.
 *
 *   1. POST /vpos/api/0.3/single_buy   → returns `process_id` (alias token
 *                                       the shopper will use in the iframe)
 *   2. Shopper enters card in Bancard's iframe / hosted page using process_id
 *   3. Bancard fires an optional callback to our webhook URL
 *   4. We verify via POST /vpos/api/0.3/single_buy/get_confirmation
 *
 * shop_process_id is OUR order identifier — must be numeric and unique
 * across our account. We use a deterministic hash of the order.id UUID
 * to get a stable 10-digit integer, so retries are idempotent.
 */

export interface SingleBuyResponse {
  process_id: string
  return_url?: string
}

export async function initSingleBuy(
  order: Order,
  opts: {
    credentials: BancardCredentials
    returnUrl: string
    cancelUrl: string
    description?: string
  },
): Promise<{ processId: string; shopProcessId: number; iframeUrl: string }> {
  if (!order.items || order.items.length === 0) {
    throw new Error('order_has_no_items')
  }
  if (order.currency !== 'PYG') {
    throw new Error(`bancard_currency_not_supported:${order.currency}`)
  }

  const shopProcessId = orderToShopProcessId(order.id)
  const amount = formatBancardAmount(order.totalCents, order.currency)
  const token = singleBuyToken(opts.credentials.privateKey, shopProcessId, amount, order.currency)

  const body = {
    public_key: opts.credentials.publicKey,
    operation: {
      token,
      shop_process_id: shopProcessId,
      amount,
      currency: order.currency,
      additional_data: order.orderNumber,
      description: opts.description || `Orden ${order.orderNumber}`,
      return_url: opts.returnUrl,
      cancel_url: opts.cancelUrl,
    },
  }

  const response = await bancardFetch<SingleBuyResponse>(
    opts.credentials.environment,
    '/vpos/api/0.3/single_buy',
    { method: 'POST', body: JSON.stringify(body) },
  )

  if (response.status !== 'success' || !response.confirmation?.process_id) {
    const msg = response.messages?.[0]?.dsc ?? response.messages?.[0]?.key ?? 'unknown_error'
    throw new Error(`bancard_single_buy_failed:${msg}`)
  }

  const processId = response.confirmation.process_id
  // Hosted checkout page Bancard provides — alternative to iframe
  // integration. The shopper never sees our keys; only process_id.
  const iframeUrl = `${response.confirmation.return_url || ''}` || buildHostedCheckoutUrl(processId, opts.credentials.environment)

  return { processId, shopProcessId, iframeUrl }
}

/**
 * Poll-based confirmation.
 *
 * Bancard sends webhook callbacks when the shopper completes payment,
 * but callbacks can drop. This endpoint is the source of truth — safe
 * to call on every status-page load. It's the same pattern Pagopar uses
 * with /traer-pedido.
 */
export interface ConfirmationResponse {
  shop_process_id: number
  response: 'S' | 'N' // S = success, N = not
  response_details?: string
  amount?: string
  number?: string          // authorization number
  authorization_number?: string
  ticket_number?: string
  response_code?: string
  response_description?: string
  security_information?: {
    customer_ip?: string
    card_source?: string
    card_country?: string
    risk_index?: string
  }
  response_date?: string
}

export async function getConfirmation(
  shopProcessId: number,
  credentials: BancardCredentials,
): Promise<ConfirmationResponse> {
  const token = confirmationToken(credentials.privateKey, shopProcessId)
  const body = {
    public_key: credentials.publicKey,
    operation: { token, shop_process_id: shopProcessId },
  }
  const response = await bancardFetch<ConfirmationResponse>(
    credentials.environment,
    '/vpos/api/0.3/single_buy/confirmations',
    { method: 'POST', body: JSON.stringify(body) },
  )
  if (!response.confirmation) {
    const msg = response.messages?.[0]?.dsc ?? 'no_confirmation_returned'
    throw new Error(`bancard_confirmation_failed:${msg}`)
  }
  return response.confirmation
}

/**
 * Rollback — reverses an authorized but uncaptured transaction.
 *
 * Window: same business day only. Outside that window, refund() is the
 * correct call (separate authorization path, settles differently).
 */
export async function rollbackTransaction(
  shopProcessId: number,
  credentials: BancardCredentials,
): Promise<void> {
  const token = rollbackToken(credentials.privateKey, shopProcessId)
  const body = {
    public_key: credentials.publicKey,
    operation: { token, shop_process_id: shopProcessId },
  }
  const response = await bancardFetch(
    credentials.environment,
    '/vpos/api/0.3/single_buy/rollback',
    { method: 'POST', body: JSON.stringify(body) },
  )
  if (response.status !== 'success') {
    const msg = response.messages?.[0]?.dsc ?? 'rollback_failed'
    throw new Error(`bancard_rollback_failed:${msg}`)
  }
}

/**
 * Map Bancard's raw confirmation response to our normalized TransactionStatus.
 */
export function mapBancardStatus(c: ConfirmationResponse): 'approved' | 'rejected' | 'pending' | 'cancelled' {
  if (c.response === 'S') return 'approved'
  if (c.response === 'N' && c.response_code) return 'rejected'
  if (!c.response) return 'pending'
  return 'rejected'
}

/**
 * Stable numeric shop_process_id from the order UUID.
 *
 * Bancard requires `shop_process_id` to be numeric and unique per
 * merchant. We derive it from order.id via a simple hash truncated to
 * 10 digits — collisions are effectively impossible at the order
 * volumes we'll see pre-IPO.
 */
export function orderToShopProcessId(orderId: string): number {
  // FNV-1a 32-bit — stable, no crypto import needed
  let h = 0x811c9dc5
  for (let i = 0; i < orderId.length; i++) {
    h ^= orderId.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  // Force positive, cap to 10 digits
  const positive = Math.abs(h >>> 0)
  return positive % 10_000_000_000
}

function buildHostedCheckoutUrl(processId: string, env: BancardCredentials['environment']): string {
  const base = env === 'production'
    ? 'https://vpos.infonet.com.py'
    : 'https://vpos.infonet.com.py:8888'
  return `${base}/checkout/new?process_id=${encodeURIComponent(processId)}`
}
