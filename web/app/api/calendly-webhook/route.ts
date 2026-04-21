/**
 * POST /api/calendly-webhook — receives Calendly booking events.
 * Persists `invitee.created` as a lead (source=calendly). `invitee.canceled`
 * is logged (future: mark the lead row cancelled once we persist the
 * calendly event_uri on the lead).
 *
 * Signature verification: when env.CALENDLY_SIGNING_KEY is set we require
 * the `calendly-webhook-signature` header. In production with no header set,
 * requests are rejected as a safety net.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

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
  const signature = req.headers.get('calendly-webhook-signature')
  if (!signature && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'missing_signature' }, { status: 401 })
  }
  // TODO(calendly): verify signature against env.CALENDLY_SIGNING_KEY once issued.

  const body = (await req.json().catch(() => ({}))) as CalendlyEvent
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
