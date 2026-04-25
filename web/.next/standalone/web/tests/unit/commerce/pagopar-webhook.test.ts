import { describe, it, expect } from 'vitest'
import { createHash } from 'crypto'
import { verifyPagoparWebhook, mapPagoparStatus } from '@/lib/payments/pagopar/webhooks'

const PRIVATE = 'test_private_token'

function buildPayload({
  hash = 'abc123hash',
  pagado = true,
  cancelado = false,
  error = null as string | null,
  monto = 150000,
  tokenOverride,
}: {
  hash?: string
  pagado?: boolean
  cancelado?: boolean
  error?: string | null
  monto?: number
  tokenOverride?: string
} = {}) {
  const validToken = createHash('sha1').update(PRIVATE + hash).digest('hex')
  return {
    respuesta: true,
    resultado: [
      {
        hash_pedido: hash,
        pagado,
        cancelado,
        ultimo_mensaje_error: error,
        monto,
        token: tokenOverride ?? validToken,
      },
    ],
  }
}

describe('verifyPagoparWebhook', () => {
  it('accepts a correctly signed callback', () => {
    const result = verifyPagoparWebhook(buildPayload(), PRIVATE)
    expect(result.valid).toBe(true)
    expect(result.status).toBe('approved')
    expect(result.amountCents).toBe(150000)
    expect(result.hashPedido).toBe('abc123hash')
  })

  it('rejects a tampered token', () => {
    const result = verifyPagoparWebhook(buildPayload({ tokenOverride: 'deadbeef' }), PRIVATE)
    expect(result.valid).toBe(false)
    expect(result.reason).toBe('signature_mismatch')
  })

  it('rejects an empty resultado', () => {
    const result = verifyPagoparWebhook({ respuesta: true, resultado: [] }, PRIVATE)
    expect(result.valid).toBe(false)
    expect(result.reason).toBe('no_resultado')
  })

  it('parses a string monto', () => {
    const result = verifyPagoparWebhook(
      { ...buildPayload(), resultado: [{ ...buildPayload().resultado[0], monto: '250000' as unknown as number }] },
      PRIVATE,
    )
    // Token regenerated for the same hash; signature should still match
    expect(result.valid).toBe(true)
    expect(result.amountCents).toBe(250000)
  })
})

describe('mapPagoparStatus', () => {
  it('maps pagado=true → approved', () => {
    expect(mapPagoparStatus({ pagado: true })).toBe('approved')
  })

  it('maps pagado=false + cancelado=true → cancelled', () => {
    expect(mapPagoparStatus({ pagado: false, cancelado: true })).toBe('cancelled')
  })

  it('maps pagado=false + ultimo_mensaje_error → rejected', () => {
    expect(mapPagoparStatus({ pagado: false, ultimo_mensaje_error: 'card declined' })).toBe('rejected')
  })

  it('maps pagado=false with no error or cancellation → pending', () => {
    expect(mapPagoparStatus({ pagado: false })).toBe('pending')
  })
})
