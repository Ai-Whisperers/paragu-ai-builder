/**
 * GET + POST /api/whatsapp-webhook — Meta WhatsApp Business API webhook.
 * GET handles Meta's verify-token challenge.
 * POST parses inbound text messages and inserts them into leads.
 *
 * POST signature verification: Meta signs the raw body with HMAC-SHA256
 * using `WHATSAPP_APP_SECRET` and sends `x-hub-signature-256: sha256=...`.
 * Without `WHATSAPP_APP_SECRET` configured the route fail-closes (401).
 * Previously the route accepted any POST → anyone could inject fake
 * inbound messages into the leads table.
 *
 * Multi-tenant routing key: we prefix the business phone number (pnid)
 * so ops can map it to a site_slug via env.WHATSAPP_PHONE_SITE_MAP
 * (JSON map, e.g. {"595...":"nexa-paraguay"}).
 */

import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Verify Meta's `x-hub-signature-256` header against the raw request body.
 * Header format: `sha256=<hex-hmac>`.
 */
function verifyMetaSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header || !header.startsWith('sha256=')) return false
  const provided = header.slice(7)
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  if (provided.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

interface WhatsAppPayload {
  object?: string
  entry?: Array<{
    id?: string
    changes?: Array<{
      field?: string
      value?: {
        metadata?: { phone_number_id?: string; display_phone_number?: string }
        contacts?: Array<{ profile?: { name?: string }; wa_id?: string }>
        messages?: Array<{
          from?: string
          id?: string
          timestamp?: string
          type?: string
          text?: { body?: string }
        }>
      }
    }>
  }>
}

function resolveSiteSlug(pnid?: string): string {
  if (!pnid) return 'unknown'
  try {
    const map = JSON.parse(process.env.WHATSAPP_PHONE_SITE_MAP || '{}') as Record<string, string>
    return map[pnid] || 'unknown'
  } catch {
    return 'unknown'
  }
}

export const GET = withRequestLog(async (req) => {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge || '', { status: 200 })
  }
  return NextResponse.json({ error: 'forbidden' }, { status: 403 })
})

export const POST = withRequestLog(async (req, { log }) => {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret) {
    log.warn('whatsapp.webhook.not_configured')
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 401 })
  }

  const rawBody = await req.text()
  const valid = verifyMetaSignature(rawBody, req.headers.get('x-hub-signature-256'), secret)
  if (!valid) {
    log.warn('whatsapp.webhook.signature_invalid')
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  let body: WhatsAppPayload
  try {
    body = JSON.parse(rawBody) as WhatsAppPayload
  } catch (err) {
    log.warn('whatsapp.webhook.bad_json', { error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }
  log.info('whatsapp inbound', { object: body.object, entries: body.entry?.length ?? 0 })

  const supabase = await createClient('service_role')
  let inserted = 0

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const pnid = change.value?.metadata?.phone_number_id
      const siteSlug = resolveSiteSlug(pnid)
      const contacts = change.value?.contacts || []
      for (const msg of change.value?.messages || []) {
        if (msg.type !== 'text' || !msg.from) continue
        const name = contacts[0]?.profile?.name || `WA ${msg.from}`
        const { error } = await supabase.from('leads').insert({
          site_slug: siteSlug,
          locale: 'es',
          name,
          email: `${msg.from}@whatsapp.local`,
          phone: msg.from,
          source: 'whatsapp',
          referer: msg.text?.body?.slice(0, 500) || null,
        })
        if (error && !/does not exist|relation|duplicate key/.test(error.message)) {
          log.warn('whatsapp lead insert failed', { error: error.message, pnid })
        } else if (!error) {
          inserted += 1
        }
      }
    }
  }

  return NextResponse.json({ ok: true, inserted })
})
