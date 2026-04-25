/**
 * Resend webhook receiver. Captures email lifecycle events (delivered,
 * bounced, complained, opened, clicked) into `webhook_events` for audit
 * and per-recipient triage.
 *
 * Closes BUG_HUNT_500 #443.
 *
 * Resend uses Svix under the hood. Each webhook carries:
 *   - svix-id          unique event id (use as provider_event_id for dedup)
 *   - svix-timestamp   request timestamp (s) — used in the signed string
 *   - svix-signature   `v1,<base64-hmac-sha256>` (one or more, space-delimited)
 *
 * Configure in Resend dashboard → Webhooks → endpoint URL:
 *   https://paragu-ai.com/api/webhooks/resend
 * Subscribe to at least: email.delivered, email.bounced, email.complained.
 *
 * Required env:
 *   RESEND_WEBHOOK_SECRET   the `whsec_...` value Resend shows after creating
 *                           the endpoint. Without it, every request is
 *                           rejected as 401 — fail closed.
 *
 * Returns:
 *   200 on success or replay (dedup)
 *   400 if body is unparseable
 *   401 if signature missing or invalid
 *   500 if storage fails (Resend retries)
 */
import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

interface ResendEvent {
  type?: string
  data?: {
    email_id?: string
    to?: string[] | string
    subject?: string
    bounce?: { type?: string }
  }
}

/**
 * Verify a Svix-style signature header. Returns true if any of the
 * comma/space-separated v1 signatures matches.
 *
 * Signed payload format: `${id}.${timestamp}.${rawBody}` HMAC-SHA256 with
 * the raw secret (after stripping the `whsec_` prefix and base64-decoding).
 */
function verifySvixSignature(
  rawBody: string,
  id: string,
  timestamp: string,
  signatureHeader: string,
  whsecSecret: string,
): boolean {
  const secret = whsecSecret.startsWith('whsec_') ? whsecSecret.slice(6) : whsecSecret
  let secretBytes: Buffer
  try {
    secretBytes = Buffer.from(secret, 'base64')
  } catch {
    return false
  }
  const signedPayload = `${id}.${timestamp}.${rawBody}`
  const expected = createHmac('sha256', secretBytes).update(signedPayload).digest('base64')

  // Header is space-separated `v1,<sig>` entries — accept any matching v1.
  for (const entry of signatureHeader.split(' ')) {
    const [version, sig] = entry.split(',')
    if (version !== 'v1' || !sig) continue
    try {
      const a = Buffer.from(sig)
      const b = Buffer.from(expected)
      if (a.length === b.length && timingSafeEqual(a, b)) return true
    } catch {
      // length mismatch or invalid — try next entry
    }
  }
  return false
}

export const POST = withRequestLog(async (request, { log }) => {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    log.warn('resend.webhook.not_configured')
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 401 })
  }

  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'missing_signature_headers' }, { status: 401 })
  }

  const rawBody = await request.text()
  const valid = verifySvixSignature(rawBody, svixId, svixTimestamp, svixSignature, secret)
  if (!valid) {
    log.warn('resend.webhook.signature_invalid', { svixId })
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  let event: ResendEvent
  try {
    event = JSON.parse(rawBody) as ResendEvent
  } catch (err) {
    log.warn('resend.webhook.bad_json', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { error: insertError } = await supabase.from('webhook_events').insert({
    provider: 'resend',
    provider_event_id: svixId,
    event_type: event.type || 'unknown',
    signature_valid: true,
    payload: event,
  })

  if (insertError) {
    if (insertError.code === '23505') {
      // Replay — already ingested. Resend retries on non-2xx so respond 200.
      log.info('resend.webhook.duplicate', { svixId, type: event.type })
      return NextResponse.json({ deduplicated: true })
    }
    log.error('resend.webhook.insert_failed', new Error(insertError.message))
    return NextResponse.json({ error: 'ingest_failed' }, { status: 500 })
  }

  // Surface bounce/complaint events at warn level so they show up in
  // observability searches alongside other delivery failures.
  if (event.type === 'email.bounced' || event.type === 'email.complained') {
    const recipients = Array.isArray(event.data?.to) ? event.data?.to : [event.data?.to]
    log.warn('resend.webhook.delivery_failure', {
      type: event.type,
      to: recipients,
      bounceType: event.data?.bounce?.type,
      subject: event.data?.subject,
    })
  } else {
    log.info('resend.webhook.received', { type: event.type })
  }

  return NextResponse.json({ ok: true })
})
