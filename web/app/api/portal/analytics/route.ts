import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()

    const { data: events, error } = await supabase
      .from('analytics_events')
      .select('event_type')
      .eq('business_id', session.businessId)
      .gte('created_at', thirtyDaysAgo)

    if (error) {
      return NextResponse.json({ error: 'query_failed', detail: error.message }, { status: 500 })
    }

    const eventCounts: Record<string, number> = {}
    for (const e of events ?? []) {
      eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1
    }

    const eventsByType = Object.entries(eventCounts).map(([event_type, count]) => ({
      event_type,
      count,
    }))

    return NextResponse.json({
      events: eventsByType,
      totalEvents: (events ?? []).length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
