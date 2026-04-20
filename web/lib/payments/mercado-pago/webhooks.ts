import { createHmac, timingSafeEqual } from 'crypto'
import { getMpWebhookSecret } from './client'
import type { WebhookVerification } from '../types'

/**
 * Verifies an MP webhook signature per MP's documented scheme.
 *
 * Headers:
 *   x-signature: "ts=<timestamp>,v1=<hex-hmac>"
 *   x-request-id: <uuid>
 *
 * Signed string template: "id:{data.id};request-id:{x-request-id};ts:{ts};"
 */
export function verifyMpSignature(opts: {
  signatureHeader: string | null
  requestIdHeader: string | null
  dataId: string
  secret?: string
}): { valid: boolean; reason?: string } {
  if (!opts.signatureHeader) return { valid: false, reason: 'missing_signature' }
  if (!opts.requestIdHeader) return { valid: false, reason: 'missing_request_id' }
  if (!opts.dataId) return { valid: false, reason: 'missing_data_id' }

  const parts = Object.fromEntries(
    opts.signatureHeader.split(',').map((p) => {
      const [k, v] = p.split('=').map((s) => s.trim())
      return [k, v]
    }),
  )
  const ts = parts.ts
  const v1 = parts.v1
  if (!ts || !v1) return { valid: false, reason: 'malformed_signature' }

  const secret = opts.secret ?? getMpWebhookSecret()
  const template = `id:${opts.dataId};request-id:${opts.requestIdHeader};ts:${ts};`
  const expected = createHmac('sha256', secret).update(template).digest('hex')

  try {
    const a = Buffer.from(expected, 'hex')
    const b = Buffer.from(v1, 'hex')
    if (a.length !== b.length) return { valid: false, reason: 'signature_mismatch' }
    return { valid: timingSafeEqual(a, b), reason: undefined }
  } catch {
    return { valid: false, reason: 'signature_parse_failed' }
  }
}

export async function parseAndVerifyWebhook(request: Request, rawBody: string): Promise<WebhookVerification> {
  const parsed = JSON.parse(rawBody) as { id?: string | number; type?: string; action?: string; data?: { id: string | number } }
  const dataId = String(parsed.data?.id ?? '')
  const eventId = String(parsed.id ?? dataId)
  const eventType = parsed.type ?? parsed.action ?? 'unknown'

  const { valid, reason } = verifyMpSignature({
    signatureHeader: request.headers.get('x-signature'),
    requestIdHeader: request.headers.get('x-request-id'),
    dataId,
  })

  return { valid, eventId, resourceId: dataId, eventType, reason }
}
