/**
 * POST /api/calendly-webhook — receives Calendly booking events.
 * Scaffold — verifies signature stub, logs event, forwards to CRM via the
 * existing adapter registry. Full impl requires Calendly signing-key env var.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

interface CalendlyEvent {
  event?: string
  payload?: {
    event?: { start_time?: string; end_time?: string }
    invitee?: { email?: string; name?: string }
    tracking?: Record<string, string>
  }
}

export const POST = withRequestLog(async (req, { log }) => {
  const signature = req.headers.get('calendly-webhook-signature')
  if (!signature && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'missing_signature' }, { status: 401 })
  }
  // TODO: verify signature against env.CALENDLY_SIGNING_KEY

  const body = (await req.json().catch(() => ({}))) as CalendlyEvent
  log.info('calendly webhook received', {
    type: body.event,
    email: body.payload?.invitee?.email,
    start: body.payload?.event?.start_time,
  })

  // TODO(calendly): route `invitee.created` to lead adapter, `canceled` to Supabase.
  return NextResponse.json({ ok: true, received: body.event, scaffolded: true })
})
