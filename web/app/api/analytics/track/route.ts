/**
 * Analytics Track API Route
 * Win 68: Page view tracking API
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

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

// Valid event types
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

/**
 * POST /api/analytics/track
 * Track an analytics event
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const body: TrackEventBody = await request.json()
    
    // Validate required fields
    if (!body.eventType) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: eventType' },
        { status: 400 }
      )
    }
    
    // Validate event type
    if (!VALID_EVENT_TYPES.includes(body.eventType)) {
      return NextResponse.json(
        { success: false, error: `Invalid event type: ${body.eventType}` },
        { status: 400 }
      )
    }
    
    // Get request metadata
    const headers = request.headers
    const userAgent = body.userAgent || headers.get('user-agent') || 'unknown'
    const referrer = body.referrer || headers.get('referer') || 'direct'
    
    // Get IP (respecting privacy - hash it)
    const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'
    const ipHash = await hashIp(ip)
    
    // Build event record
    const event = {
      event_type: body.eventType,
      business_id: body.businessId || null,
      lead_id: body.leadId || null,
      page_url: body.pageUrl || null,
      section_id: body.sectionId || null,
      metadata: body.metadata || {},
      session_id: body.sessionId || generateSessionId(),
      ip_hash: ipHash,
      user_agent: userAgent.slice(0, 200), // Limit length
      referrer: referrer.slice(0, 500),
      created_at: new Date().toISOString(),
    }
    
    // Insert event
    const { data, error } = await supabase
      .from('analytics_events')
      .insert(event)
      .select('id')
      .single()
    
    if (error) {
      logger.error('Failed to track analytics event', {
        action: 'analytics.track',
        error: error.message,
      })
      return NextResponse.json(
        { success: false, error: 'Failed to track event' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      eventId: data.id,
      sessionId: event.session_id,
    })

  } catch (error) {
    logger.error('Unhandled error in analytics track', {
      action: 'analytics.track',
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/analytics/track
 * Get tracking stats (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getSupabase()

    // Parse time range from query params
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const eventType = searchParams.get('eventType')

    // Build query
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
      logger.error('Failed to get analytics stats', {
        action: 'analytics.getStats',
        error: error.message,
      })
      return NextResponse.json(
        { success: false, error: 'Failed to get stats' },
        { status: 500 }
      )
    }
    
    // Aggregate by event type
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
    
  } catch (error) {
    logger.error('Unhandled error in analytics stats', {
      action: 'analytics.getStats',
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
