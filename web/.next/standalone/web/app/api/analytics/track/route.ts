/**
 * Analytics Track API Route
 *
 * - POST: public, ingests one analytics event per request
 * - GET: admin-only, returns aggregate stats for the dashboard
 *
 * GET auth was previously gated only on `authHeader.startsWith('Bearer ')`
 * which validates nothing — any literal `Bearer foo` passed. Now `checkAdmin()`.
 */
import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { withRequestLog } from '@/lib/api/with-request-log'
import { checkAdmin } from '@/lib/auth/admin'

// Module-scoped, memoized client. First request pays the init cost (~tens
// of ms — just wrapper construction, no network); every subsequent request
// reuses the same instance. Previous implementation created a fresh client
// per request, which shows up as cold-start latency on the first POST
// after a container restart.
//
// Not memoized at module top-level because `next build` page-data collection
// runs without Supabase env vars — would throw there.
let cachedClient: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase credentials')
  cachedClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return cachedClient
}

// Valid event types. `web_vital` is emitted by WebVitalsReporter on every
// page load (LCP/CLS/INP/TTFB/FCP) — keep it in the whitelist so RUM data
// isn't dropped with a 400.
const VALID_EVENT_TYPES = [
  'page_view',
  'section_view',
  'button_click',
  'form_submit',
  'phone_click',
  'whatsapp_click',
  'email_click',
  'social_click',
  'booking_initiated',
  'booking_completed',
  'outreach_sent',
  'demo_generated',
  'lead_created',
  'conversion',
  'web_vital',
] as const

type EventType = typeof VALID_EVENT_TYPES[number]

interface TrackEventBody {
  eventType: EventType
  businessId?: string
  leadId?: string
  pageUrl?: string
  sectionId?: string
  metadata?: Record<string, unknown>
  sessionId?: string
  referrer?: string
  userAgent?: string
}

interface TrackBatchBody {
  batch: true
  events: Array<TrackEventBody & { timestamp?: string }>
}

/**
 * POST /api/analytics/track
 * Track an analytics event. Public — no auth (events come from browsers).
 *
 * Accepts two payload shapes:
 *   - Single:  { eventType, ... }
 *   - Batched: { batch: true, events: [{ eventType, ... }, ...] }
 *
 * The client emitter (`lib/analytics/events.ts`) buffers events and flushes
 * them as batches; the Core Web Vitals reporter sends single events per
 * metric via `navigator.sendBeacon`. Supporting both here avoids dropping
 * legitimate data with a 400.
 */
export const POST = withRequestLog(async (request, { log }) => {
  let supabase: SupabaseClient
  try { supabase = getSupabase() } catch {
    return NextResponse.json({ ok: false, reason: 'env_not_configured' }, { status: 200 })
  }
  const rawBody = (await request.json().catch(() => ({}))) as
    | Partial<TrackEventBody & TrackBatchBody>
    | Record<string, never>

  const isBatch =
    rawBody && (rawBody as TrackBatchBody).batch === true && Array.isArray((rawBody as TrackBatchBody).events)

  const headers = request.headers
  const ua = headers.get('user-agent') || 'unknown'
  const ref = headers.get('referer') || 'direct'
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'
  const ipHash = await hashIp(ip)
  const sessionIdDefault = generateSessionId()

  if (isBatch) {
    const events = (rawBody as TrackBatchBody).events
    if (events.length === 0) {
      return NextResponse.json({ success: true, accepted: 0 })
    }

    const rejected: Array<{ index: number; reason: string }> = []
    const rows: Array<Record<string, unknown>> = []

    events.forEach((e, i) => {
      if (!e?.eventType) {
        rejected.push({ index: i, reason: 'missing eventType' })
        return
      }
      if (!VALID_EVENT_TYPES.includes(e.eventType)) {
        rejected.push({ index: i, reason: `invalid eventType: ${e.eventType}` })
        return
      }
      rows.push({
        event_type: e.eventType,
        business_id: e.businessId || null,
        lead_id: e.leadId || null,
        page_url: e.pageUrl || null,
        section_id: e.sectionId || null,
        metadata: e.metadata || {},
        session_id: e.sessionId || sessionIdDefault,
        ip_hash: ipHash,
        user_agent: (e.userAgent || ua).slice(0, 200),
        referrer: (e.referrer || ref).slice(0, 500),
        created_at: new Date().toISOString(),
      })
    })

    if (rows.length === 0) {
      // Entire batch invalid — don't hit the DB, but surface a 400 so
      // the client sees this during development.
      log.warn('analytics.track.batch_all_rejected', { rejected: rejected.length })
      return NextResponse.json(
        { success: false, error: 'All events rejected', rejected },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('analytics_events')
      .insert(rows)
      .select('id')

    if (error) {
      log.error('analytics.track.batch_insert_failed', new Error(error.message))
      return NextResponse.json({ success: false, error: 'Failed to track events' }, { status: 500 })
    }

    if (rejected.length > 0) {
      log.warn('analytics.track.batch_partial_reject', { accepted: data?.length ?? 0, rejected: rejected.length })
    }

    return NextResponse.json({
      success: true,
      accepted: data?.length ?? 0,
      rejected: rejected.length > 0 ? rejected : undefined,
    })
  }

  // Single-event path
  const body = rawBody as TrackEventBody
  if (!body.eventType) {
    return NextResponse.json(
      { success: false, error: 'Missing required field: eventType' },
      { status: 400 },
    )
  }
  if (!VALID_EVENT_TYPES.includes(body.eventType)) {
    return NextResponse.json(
      { success: false, error: `Invalid event type: ${body.eventType}` },
      { status: 400 },
    )
  }

  const event = {
    event_type: body.eventType,
    business_id: body.businessId || null,
    lead_id: body.leadId || null,
    page_url: body.pageUrl || null,
    section_id: body.sectionId || null,
    metadata: body.metadata || {},
    session_id: body.sessionId || sessionIdDefault,
    ip_hash: ipHash,
    user_agent: (body.userAgent || ua).slice(0, 200),
    referrer: (body.referrer || ref).slice(0, 500),
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('analytics_events')
    .insert(event)
    .select('id')
    .single()

  if (error) {
    log.error('analytics.track.insert_failed', new Error(error.message))
    return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 })
  }

  return NextResponse.json({ success: true, eventId: data.id, sessionId: event.session_id })
})

/**
 * GET /api/analytics/track
 * Get tracking stats. Admin-only via checkAdmin().
 */
export const GET = withRequestLog(async (request, { log }) => {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.reason }, { status: auth.status })
  }

  const supabase = getSupabase()
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7')
  const eventType = searchParams.get('eventType')

  let query = supabase
    .from('analytics_events')
    .select('*', { count: 'exact' })
    .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

  if (eventType) {
    query = query.eq('event_type', eventType)
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    log.error('analytics.stats.failed', new Error(error.message))
    return NextResponse.json({ success: false, error: 'Failed to get stats' }, { status: 500 })
  }

  const byType = (data || []).reduce((acc: Record<string, number>, event: { event_type: string }) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1
    return acc
  }, {})

  return NextResponse.json({
    success: true,
    totalCount: count,
    period: `${days} days`,
    byType,
    recentEvents: data,
  })
})

// Helper functions
async function hashIp(ip: string): Promise<string> {
  // Salt for k-anonymity. Operator precedence: + binds tighter than ||,
  // so the previous `ip + process.env.SALT || 'paragu-ai'` always took
  // the first operand (a non-empty string), making the fallback dead.
  const salt = process.env.ANALYTICS_SALT || 'paragu-ai'
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16)
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}
