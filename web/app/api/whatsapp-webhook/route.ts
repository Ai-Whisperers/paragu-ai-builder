/**
 * GET + POST /api/whatsapp-webhook — Meta WhatsApp Business API webhook.
 * GET handles Meta's verify-token challenge.
 * POST parses inbound text messages and inserts them into leads.
 * Multi-tenant routing key: we prefix the business phone number (pnid)
 * so ops can map it to a site_slug via env.WHATSAPP_PHONE_SITE_MAP
 * (JSON map, e.g. {"595...":"nexa-paraguay"}).
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

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
  const body = (await req.json().catch(() => ({}))) as WhatsAppPayload
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
