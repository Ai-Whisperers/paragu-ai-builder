/**
 * POST /api/outreach/track
 *
 * Tracks outreach events (WhatsApp clicks, email opens, etc.) and
 * mutates `leads.status` for `whatsapp_sent` events.
 *
 * Auth: gated by `checkAdmin()` — was previously unauthenticated, which
 * meant anyone with a leadId could (a) flood the outreach_events table
 * and (b) flip any lead's status to 'contacted' just by knowing its UUID.
 */
import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'
import { checkAdmin } from '@/lib/auth/admin'

export const runtime = 'nodejs'

const VALID_EVENT_TYPES = [
  'whatsapp_sent', 'email_sent', 'demo_viewed', 'demo_shared',
  'onboarding_started', 'onboarding_completed', 'payment_initiated',
  'meeting_scheduled', 'meeting_completed', 'follow_up_sent',
] as const

type EventType = (typeof VALID_EVENT_TYPES)[number]

interface TrackBody {
  lead_id?: string
  event_type?: EventType
  channel?: string
  message_template?: string
  message_content?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export const POST = withRequestLog(async (request, { log }) => {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status })
  }

  const body = (await request.json().catch(() => ({}))) as TrackBody
  const { lead_id, event_type } = body

  if (!lead_id || !event_type) {
    return NextResponse.json(
      { error: 'Missing required fields: lead_id and event_type' },
      { status: 400 },
    )
  }

  if (!VALID_EVENT_TYPES.includes(event_type)) {
    return NextResponse.json(
      { error: `Invalid event_type. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` },
      { status: 400 },
    )
  }

  const supabase = await createClient()

  const ip_address =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  const user_agent = request.headers.get('user-agent') || ''
  const referrer = request.headers.get('referer') || ''

  const { data: event, error: insertError } = await supabase
    .from('outreach_events')
    .insert({
      lead_id,
      event_type,
      channel: body.channel || 'whatsapp',
      message_template: body.message_template,
      message_content: body.message_content,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      ip_address,
      user_agent,
      referrer,
    })
    .select()
    .single()

  if (insertError) {
    log.error('outreach.track.insert_failed', new Error(insertError.message))
    return NextResponse.json({ error: 'Failed to track outreach event' }, { status: 500 })
  }

  if (event_type === 'whatsapp_sent') {
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'contacted', last_contacted_at: new Date().toISOString() })
      .eq('id', lead_id)
    if (updateError) {
      log.warn('outreach.track.lead_status_update_failed', { lead_id, error: updateError.message })
      // Best-effort — keep the success response.
    }
  }

  log.info('outreach.track.success', { event_id: event.id, lead_id, event_type })
  return NextResponse.json({ success: true, event })
})
