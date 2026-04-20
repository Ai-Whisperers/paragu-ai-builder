import { describe, it, expect } from 'vitest'
import { createHmac } from 'crypto'
import { verifyMpSignature } from '@/lib/payments/mercado-pago/webhooks'

const SECRET = 'test_secret_123'

function sign({ dataId, requestId, ts }: { dataId: string; requestId: string; ts: string }): string {
  const template = `id:${dataId};request-id:${requestId};ts:${ts};`
  const hex = createHmac('sha256', SECRET).update(template).digest('hex')
  return `ts=${ts},v1=${hex}`
}

describe('verifyMpSignature', () => {
  it('accepts a correctly signed webhook', () => {
    const ts = '1700000000'
    const header = sign({ dataId: '123', requestId: 'req-1', ts })
    const result = verifyMpSignature({
      signatureHeader: header,
      requestIdHeader: 'req-1',
      dataId: '123',
      secret: SECRET,
    })
    expect(result.valid).toBe(true)
  })

  it('rejects a tampered signature', () => {
    const header = 'ts=1700000000,v1=deadbeef'
    const result = verifyMpSignature({
      signatureHeader: header,
      requestIdHeader: 'req-1',
      dataId: '123',
      secret: SECRET,
    })
    expect(result.valid).toBe(false)
  })

  it('rejects missing headers', () => {
    expect(verifyMpSignature({ signatureHeader: null, requestIdHeader: 'r', dataId: '1', secret: SECRET }).valid).toBe(false)
    expect(verifyMpSignature({ signatureHeader: 'ts=1,v1=aa', requestIdHeader: null, dataId: '1', secret: SECRET }).valid).toBe(false)
  })

  it('rejects malformed signature header', () => {
    const result = verifyMpSignature({
      signatureHeader: 'garbage',
      requestIdHeader: 'r',
      dataId: '1',
      secret: SECRET,
    })
    expect(result.valid).toBe(false)
    expect(result.reason).toBe('malformed_signature')
  })
})
