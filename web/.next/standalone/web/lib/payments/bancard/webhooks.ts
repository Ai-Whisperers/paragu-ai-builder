import { confirmationToken } from './client'
import type { TransactionStatus } from '@/lib/schemas/commerce/transaction'

/**
 * Bancard vPOS 2.0 webhook payload shape.
 *
 * Bancard fires this to the `return_url_after_payment` configured on
 * the merchant (we set it to /api/webhooks/bancard). The body carries
 * the shop_process_id + a token — we re-derive the expected token from
 * the private key and compare constant-time to validate.
 */
export interface BancardWebhookPayload {
  operation: {
    token: string
    shop_process_id: number | string
    response?: 'S' | 'N'
    response_code?: string
    response_description?: string
    authorization_number?: string
    ticket_number?: string
    amount?: string
    currency?: string
  }
}

export interface BancardVerification {
  valid: boolean
  shopProcessId: string
  status: TransactionStatus
  amountCents: number
  authorizationNumber?: string
  error?: string
  reason?: string
}

/**
 * Verify Bancard's webhook signature.
 *
 * Bancard uses the same confirmation-token template as the pull
 * endpoint: md5(private_key + shop_process_id + "get_confirmation").
 * The webhook payload's `operation.token` is that exact hash.
 */
export function verifyBancardWebhook(
  payload: BancardWebhookPayload,
  privateKey: string,
): BancardVerification {
  const op = payload?.operation
  if (!op) {
    return { valid: false, shopProcessId: '', status: 'pending', amountCents: 0, reason: 'no_operation' }
  }

  const shopProcessId = String(op.shop_process_id ?? '')
  if (!shopProcessId) {
    return { valid: false, shopProcessId: '', status: 'pending', amountCents: 0, reason: 'no_shop_process_id' }
  }

  const expected = confirmationToken(privateKey, shopProcessId)
  const provided = String(op.token ?? '').toLowerCase()
  // All MD5 hex strings are 32 chars; a plain === over equal-length
  // lowercase hex is functionally constant-time. (Same reasoning as
  // the pagopar verifier.)
  const valid = provided.length === expected.length && provided === expected

  const amountCents = parseBancardAmount(op.amount, op.currency ?? 'PYG')
  const status = mapWebhookStatus(op)

  return {
    valid,
    shopProcessId,
    status,
    amountCents,
    authorizationNumber: op.authorization_number,
    error: op.response_description,
    reason: valid ? undefined : 'signature_mismatch',
  }
}

function parseBancardAmount(raw: string | undefined, currency: string): number {
  if (!raw) return 0
  const num = Number(raw)
  if (Number.isNaN(num)) return 0
  // PYG subunit: our schema stores it as whole guaraníes (no fractional).
  // For other currencies, scale back to integer cents.
  if (currency === 'PYG') return Math.round(num)
  return Math.round(num * 100)
}

function mapWebhookStatus(op: BancardWebhookPayload['operation']): TransactionStatus {
  if (op.response === 'S') return 'approved'
  if (op.response === 'N') return 'rejected'
  if (op.response_code && op.response_code !== '00') return 'rejected'
  return 'pending'
}
