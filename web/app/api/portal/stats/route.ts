import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: business, error: bizErr } = await supabase
      .from('businesses')
      .select('slug, name, type, status')
      .eq('id', session.businessId)
      .single()

    if (bizErr || !business) {
      return NextResponse.json({ error: 'business_not_found' }, { status: 404 })
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()
    const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()

    const [
      { count: totalSiteLeads },
      { count: totalBookings },
      { count: totalOrders },
      { count: visitsLast30Days },
      { count: recentLeads },
      { data: pendingBookingsData },
      { data: pendingOrdersData },
    ] = await Promise.all([
      supabase.from('site_leads').select('id', { count: 'exact', head: true }).eq('site_slug', business.slug),
      supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('business_id', session.businessId),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', session.businessId),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('business_id', session.businessId).gte('created_at', thirtyDaysAgo),
      supabase.from('site_leads').select('id', { count: 'exact', head: true }).eq('site_slug', business.slug).gte('created_at', sevenDaysAgo),
      supabase.from('bookings').select('id').eq('business_id', session.businessId).in('status', ['pending', 'confirmed']),
      supabase.from('orders').select('id').eq('business_id', session.businessId).in('status', ['pending', 'awaiting_payment']),
    ])

    return NextResponse.json({
      business,
      stats: {
        totalSiteLeads: totalSiteLeads ?? 0,
        totalBookings: totalBookings ?? 0,
        totalOrders: totalOrders ?? 0,
        visitsLast30Days: visitsLast30Days ?? 0,
        recentLeads: recentLeads ?? 0,
        pendingBookings: (pendingBookingsData ?? []).length,
        pendingOrders: (pendingOrdersData ?? []).length,
      },
    })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
