/**
 * GET + POST /api/whatsapp-webhook — Meta WhatsApp Business API webhook.
 * GET handles Meta's verify-token challenge.
 * POST receives inbound messages and forwards them as leads.
 * Scaffold.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

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
  const body = await req.json().catch(() => ({}))
  log.info('whatsapp inbound', {
    object: (body as { object?: string }).object,
  })
  // TODO(whatsapp): parse body.entry[].changes[].value.messages[], route to /api/leads.
  return NextResponse.json({ ok: true, scaffolded: true })
})
