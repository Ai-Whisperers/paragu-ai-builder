import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export interface MonthlyReport {
  businessName: string
  month: string
  stats: {
    totalVisits: number
    totalLeads: number
    totalBookings: number
    totalOrders: number
    revenueCents: number
    topEventTypes: Array<{ event_type: string; count: number }>
  }
}

export async function generateMonthlyReport(businessId: string): Promise<MonthlyReport | null> {
  const supabase = await createClient('service_role')

  const { data: biz } = await supabase.from('businesses').select('name').eq('id', businessId).single()
  if (!biz) return null

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthStartIso = monthStart.toISOString()
  const monthEndIso = new Date().toISOString()

  const prevMonthStart = new Date(monthStart)
  prevMonthStart.setMonth(prevMonthStart.getMonth() - 1)
  const prevMonthStartIso = prevMonthStart.toISOString()

  const month = monthStart.toLocaleDateString('es-PY', { month: 'long', year: 'numeric' })

  const [{ count: totalVisits }, { count: totalLeads }, { count: totalBookings }, { count: totalOrders }, { data: events }, { data: orders }] = await Promise.all([
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('business_id', businessId).gte('created_at', monthStartIso),
    supabase.from('site_leads').select('id', { count: 'exact', head: true }).eq('site_slug', biz.name.toLowerCase().replace(/\s+/g, '-')).gte('created_at', monthStartIso),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('business_id', businessId).gte('created_at', monthStartIso),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', businessId).gte('created_at', monthStartIso),
    supabase.from('analytics_events').select('event_type').eq('business_id', businessId).gte('created_at', monthStartIso),
    supabase.from('orders').select('total_cents').eq('business_id', businessId).in('status', ['paid', 'completed']).gte('created_at', monthStartIso),
  ])

  const eventCounts: Record<string, number> = {}
  for (const e of events ?? []) {
    eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1
  }

  const revenueCents = (orders ?? []).reduce((sum, o) => sum + (o.total_cents ?? 0), 0)

  return {
    businessName: biz.name,
    month,
    stats: {
      totalVisits: totalVisits ?? 0,
      totalLeads: totalLeads ?? 0,
      totalBookings: totalBookings ?? 0,
      totalOrders: totalOrders ?? 0,
      revenueCents,
      topEventTypes: Object.entries(eventCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([event_type, count]) => ({ event_type, count })),
    },
  }
}

export function formatReportMessage(report: MonthlyReport): string {
  const s = report.stats
  const revenue = s.revenueCents >= 1000
    ? `Gs ${(s.revenueCents / 1000).toFixed(0)}.${String(s.revenueCents % 1000).padStart(3, '0')}`
    : `Gs ${s.revenueCents}`

  return `📊 *Resumen mensual — ${report.businessName}*
${report.month}

━━━━━━━━━━━━━━━
👁️ Visitas: ${s.totalVisits}
💬 Consultas: ${s.totalLeads}
📅 Reservas: ${s.totalBookings}
🛒 Pedidos: ${s.totalOrders}
💰 Ingresos: ${revenue}
━━━━━━━━━━━━━━━

Seguí gestionando tu negocio desde tu panel:
https://paragu-ai.com/dashboard`
}
