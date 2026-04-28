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

    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type, created_at')
      .eq('business_id', session.businessId)
      .gte('created_at', thirtyDaysAgo)

    const days: Record<string, Record<string, number>> = {}
    for (const e of events ?? []) {
      const day = new Date(e.created_at).toISOString().slice(0, 10)
      if (!days[day]) days[day] = {}
      days[day][e.event_type] = (days[day][e.event_type] || 0) + 1
    }

    const sortedDays = Object.entries(days).sort(([a], [b]) => a.localeCompare(b))

    const eventTypes = [...new Set((events ?? []).map((e) => e.event_type))]

    const series = eventTypes.map((type) => ({
      event_type: type,
      data: sortedDays.map(([date, counts]) => ({
        date,
        count: counts[type] || 0,
      })),
    }))

    return NextResponse.json({ series, totalDays: sortedDays.map(([d]) => d) })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
