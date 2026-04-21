import { describe, it, expect } from 'vitest'
import { createHash } from 'crypto'
import { verifyBancardWebhook, type BancardWebhookPayload } from '@/lib/payments/bancard/webhooks'

const PRIVATE = 'test_private_key_12345'

function confirmationHash(shopProcessId: number | string): string {
  return createHash('md5').update(`${PRIVATE}${shopProcessId}get_confirmation`).digest('hex')
}

function buildPayload({
  shopProcessId = 1234567890,
  response = 'S' as 'S' | 'N' | undefined,
  amount = '50000.00',
  currency = 'PYG',
  tokenOverride,
  authorizationNumber = 'AUTH123',
  responseCode = '00',
  responseDescription,
}: {
  shopProcessId?: number | string
  response?: 'S' | 'N' | undefined
  amount?: string
  currency?: string
  tokenOverride?: string
  authorizationNumber?: string
  responseCode?: string
  responseDescription?: string
} = {}): BancardWebhookPayload {
  const token = tokenOverride ?? confirmationHash(shopProcessId)
  return {
    operation: {
      token,
      shop_process_id: shopProcessId,
      response,
      response_code: responseCode,
      response_description: responseDescription,
      authorization_number: authorizationNumber,
      amount,
      currency,
    },
  }
}

describe('verifyBancardWebhook', () => {
  it('accepts a correctly signed approval callback', () => {
    const v = verifyBancardWebhook(buildPayload(), PRIVATE)
    expect(v.valid).toBe(true)
    expect(v.status).toBe('approved')
    expect(v.shopProcessId).toBe('1234567890')
    expect(v.amountCents).toBe(50000)
    expect(v.authorizationNumber).toBe('AUTH123')
  })

  it('rejects a tampered token', () => {
    const v = verifyBancardWebhook(
      buildPayload({ tokenOverride: 'deadbeefdeadbeefdeadbeefdeadbeef' }),
      PRIVATE,
    )
    expect(v.valid).toBe(false)
    expect(v.reason).toBe('signature_mismatch')
  })

  it('maps response=N to rejected', () => {
    const v = verifyBancardWebhook(
      buildPayload({
        response: 'N',
        responseCode: '05',
        responseDescription: 'Denied by issuer',
      }),
      PRIVATE,
    )
    expect(v.valid).toBe(true)
    expect(v.status).toBe('rejected')
    expect(v.error).toBe('Denied by issuer')
  })

  it('maps missing response field to pending', () => {
    // Build payload manually — the buildPayload helper's default param
    // `response = 'S'` swallows an explicit `undefined`, so we bypass it.
    const shopProcessId = 1234567890
    const payload: BancardWebhookPayload = {
      operation: {
        token: confirmationHash(shopProcessId),
        shop_process_id: shopProcessId,
      },
    }
    const v = verifyBancardWebhook(payload, PRIVATE)
    expect(v.valid).toBe(true)
    expect(v.status).toBe('pending')
  })

  it('rejects when operation is missing', () => {
    const v = verifyBancardWebhook({} as BancardWebhookPayload, PRIVATE)
    expect(v.valid).toBe(false)
    expect(v.reason).toBe('no_operation')
  })

  it('rejects when shop_process_id is missing', () => {
    const v = verifyBancardWebhook(
      {
        operation: { token: 'x', shop_process_id: '' },
      } as unknown as BancardWebhookPayload,
      PRIVATE,
    )
    expect(v.valid).toBe(false)
    expect(v.reason).toBe('no_shop_process_id')
  })

  it('parses PYG amount as whole guaraníes (no ×100 scaling)', () => {
    const v = verifyBancardWebhook(buildPayload({ amount: '99999.00', currency: 'PYG' }), PRIVATE)
    expect(v.amountCents).toBe(99999)
  })

  it('parses USD amount as ×100 cents', () => {
    const v = verifyBancardWebhook(buildPayload({ amount: '10.50', currency: 'USD' }), PRIVATE)
    expect(v.amountCents).toBe(1050)
  })

  it('produces distinct event ids for different terminal states on the same shop_process_id', () => {
    // The adapter uses `${shopProcessId}:${status}` as the dedup key so a
    // later refund webhook doesn't collide with the original approval.
    // Here we just assert the verifier returns the shopProcessId intact
    // for both — composition lives in the adapter.
    const approved = verifyBancardWebhook(buildPayload({ response: 'S' }), PRIVATE)
    const rejected = verifyBancardWebhook(buildPayload({ response: 'N', responseCode: '05' }), PRIVATE)
    expect(approved.shopProcessId).toBe(rejected.shopProcessId)
    expect(approved.status).not.toBe(rejected.status)
  })
})
