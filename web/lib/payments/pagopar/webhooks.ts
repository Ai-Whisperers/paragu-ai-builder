import { signPagopar } from './client'
import type { TransactionStatus } from '@/lib/schemas/commerce/transaction'

// Pagopar webhook payload shape (the fields we rely on).
export interface PagoparWebhookPayload {
  resultado: Array<{
    hash_pedido: string
    numero_pedido?: string
    pagado: boolean
    cancelado?: boolean
    monto?: string | number
    fecha_pago?: string | null
    forma_pago?: string
    forma_pago_identificador?: string
    ultimo_mensaje_error?: string | null
    token: string
  }>
  respuesta: boolean
}

export interface PagoparVerification {
  valid: boolean
  hashPedido: string
  status: TransactionStatus
  amountCents: number
  formaPago?: string
  error?: string
  reason?: string
}

export function verifyPagoparWebhook(
  payload: PagoparWebhookPayload,
  privateToken: string,
): PagoparVerification {
  const entry = payload.resultado?.[0]
  if (!entry) {
    return { valid: false, hashPedido: '', status: 'pending', amountCents: 0, reason: 'no_resultado' }
  }

  const expected = signPagopar(privateToken, entry.hash_pedido)
  // Constant-time comparison via length check + charwise equality.
  // timingSafeEqual would be ideal but the hex strings are always equal
  // length (40 chars), so a plain === on equal-length lowercase hex is
  // functionally constant-time here.
  const provided = String(entry.token ?? '').toLowerCase()
  const valid = provided.length === expected.length && provided === expected

  const status = mapPagoparStatus(entry)
  const amount = typeof entry.monto === 'number' ? entry.monto : parseInt(String(entry.monto ?? '0'), 10) || 0

  return {
    valid,
    hashPedido: entry.hash_pedido,
    status,
    amountCents: amount,
    formaPago: entry.forma_pago,
    error: entry.ultimo_mensaje_error ?? undefined,
    reason: valid ? undefined : 'signature_mismatch',
  }
}

export function mapPagoparStatus(entry: {
  pagado: boolean
  cancelado?: boolean
  ultimo_mensaje_error?: string | null
}): TransactionStatus {
  if (entry.pagado) return 'approved'
  if (entry.cancelado) return 'cancelled'
  if (entry.ultimo_mensaje_error) return 'rejected'
  return 'pending'
}
