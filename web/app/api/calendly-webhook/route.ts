/**
 * POST /api/calendly-webhook — receives Calendly booking events.
 * Persists `invitee.created` as a lead (source=calendly). `invitee.canceled`
 * is logged (future: mark the lead row cancelled once we persist the
 * calendly event_uri on the lead).
 *
 * Signature verification: Calendly signs each webhook with HMAC-SHA256.
 * The `calendly-webhook-signature` header has the format
 * `t=<unix-timestamp>,v1=<hex-hmac>`. Signed payload is
 * `${timestamp}.${rawBody}`. Without `CALENDLY_SIGNING_KEY` configured
 * the route fail-closes (401) — previously the route accepted any
 * payload with any header value (TODO had been left open).
 */

import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Verify Calendly's `calendly-webhook-signature` header.
 * Header format: `t=<unix-timestamp>,v1=<hex-hmac>`.
 * Returns true on a valid v1 signature within the freshness window.
 */
function verifyCalendlySignature(
  rawBody: string,
  header: string | null,
  secret: string,
  freshnessSeconds = 300,
): boolean {
  if (!header) return false
  const parts = header.split(',').reduce<Record<string, string>>((acc, kv) => {
    const [k, v] = kv.split('=')
    if (k && v) acc[k.trim()] = v.trim()
    return acc
  }, {})
  const t = parts.t
  const v1 = parts.v1
  if (!t || !v1) return false

  // Reject replays older than the freshness window.
  const ts = Number(t)
  if (!Number.isFinite(ts)) return false
  const ageSec = Math.abs(Date.now() / 1000 - ts)
  if (ageSec > freshnessSeconds) return false

  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex')
  if (v1.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

interface CalendlyEvent {
  event?: string
  payload?: {
    event?: { start_time?: string; end_time?: string; uri?: string }
    invitee?: {
      email?: string
      name?: string
      text_reminder_number?: string
    }
    tracking?: {
      utm_source?: string
      utm_medium?: string
      utm_campaign?: string
    }
    cancellation?: { reason?: string; canceled_by?: string }
  }
}

export const POST = withRequestLog(async (req, { log }) => {
  const secret = process.env.CALENDLY_SIGNING_KEY
  if (!secret) {
    log.warn('calendly.webhook.not_configured')
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 401 })
  }

  const rawBody = await req.text()
  const valid = verifyCalendlySignature(rawBody, req.headers.get('calendly-webhook-signature'), secret)
  if (!valid) {
    log.warn('calendly.webhook.signature_invalid')
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  let body: CalendlyEvent
  try {
    body = JSON.parse(rawBody) as CalendlyEvent
  } catch (err) {
    log.warn('calendly.webhook.bad_json', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }
  const kind = body.event
  const invitee = body.payload?.invitee
  log.info('calendly webhook received', {
    type: kind,
    email: invitee?.email,
    start: body.payload?.event?.start_time,
  })

  if (kind === 'invitee.created' && invitee?.email) {
    const supabase = await createClient('service_role')
    const siteSlug = body.payload?.tracking?.utm_source || 'unknown'
    const { error } = await supabase.from('leads').insert({
      site_slug: siteSlug,
      locale: 'es',
      name: invitee.name || invitee.email,
      email: invitee.email,
      phone: invitee.text_reminder_number || null,
      source: 'calendly',
      utm: body.payload?.tracking || {},
      program_interest: body.payload?.event?.uri || null,
    })
    if (error && !/does not exist|relation|duplicate key/.test(error.message)) {
      log.warn('calendly lead insert failed', { error: error.message })
    }
  }

  if (kind === 'invitee.canceled') {
    log.info('calendly cancellation', {
      reason: body.payload?.cancellation?.reason,
      email: invitee?.email,
    })
  }

  return NextResponse.json({ ok: true, received: kind })
})
