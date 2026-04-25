import {
  bancardFetch,
  formatBancardAmount,
  refundToken,
  type BancardCredentials,
} from './client'

/**
 * Bancard vPOS 2.0 — Refund (partial or full).
 *
 * Unlike rollback (same-business-day authorization reversal), refund
 * creates a NEW transaction that credits the original card. It
 * settles separately on the merchant's statement.
 *
 * Amount is sent as a 2-decimal string; pass cents and let
 * formatBancardAmount scale.
 */
export async function refundTransaction(
  shopProcessId: number,
  amountCents: number,
  currency: string,
  credentials: BancardCredentials,
): Promise<{ authorizationNumber?: string; ticketNumber?: string }> {
  const amount = formatBancardAmount(amountCents, currency)
  const token = refundToken(credentials.privateKey, shopProcessId, amount)

  const body = {
    public_key: credentials.publicKey,
    operation: { token, shop_process_id: shopProcessId, amount },
  }

  const response = await bancardFetch<{
    authorization_number?: string
    ticket_number?: string
  }>(
    credentials.environment,
    '/vpos/api/0.3/single_buy/refund',
    { method: 'POST', body: JSON.stringify(body) },
  )

  if (response.status !== 'success') {
    const msg = response.messages?.[0]?.dsc ?? 'refund_failed'
    throw new Error(`bancard_refund_failed:${msg}`)
  }

  return {
    authorizationNumber: response.confirmation?.authorization_number,
    ticketNumber: response.confirmation?.ticket_number,
  }
}
