/**
 * Report & Digest Generator — sends daily/weekly/monthly reports
 * to business owners via WhatsApp (Evolution API).
 */

import { createClient } from '@supabase/supabase-js'
import { sendText } from '@/lib/integrations/whatsapp/evolution'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

interface BusinessInfo {
  id: string
  name: string
  phone: string
  whatsapp_instance: string | null
  slug: string
}

async function getBusinessesWithWA(): Promise<BusinessInfo[]> {
  const { data } = await supabase
    .from('businesses')
    .select('id, name, phone, whatsapp_instance, slug')
    .not('whatsapp_instance', 'is', null)
    .not('phone', 'is', null)
  return (data || []) as BusinessInfo[]
}

async function getDailyStats(businessId: string) {
  const today = new Date().toISOString().split('T')[0]
  const [bookings, orders] = await Promise.all([
    supabase.from('bookings').select('id, customer_name, booking_time, status').eq('business_id', businessId).eq('booking_date', today),
    supabase.from('orders').select('id, total_cents, status').eq('business_id', businessId).gte('created_at', today),
  ])
  return {
    bookings: bookings.data || [],
    bookingCount: bookings.data?.length || 0,
    pendingCount: bookings.data?.filter(b => b.status === 'pending').length || 0,
    confirmedCount: bookings.data?.filter(b => b.status === 'confirmed').length || 0,
    orders: orders.data || [],
    orderCount: orders.data?.length || 0,
    revenueCents: orders.data?.reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0) || 0,
  }
}

async function getWeeklyStats(businessId: string) {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]
  const [bookings, orders] = await Promise.all([
    supabase.from('bookings').select('id, status').eq('business_id', businessId).gte('booking_date', weekAgo).lte('booking_date', today),
    supabase.from('orders').select('id, total_cents, status').eq('business_id', businessId).gte('created_at', weekAgo),
  ])
  return {
    totalBookings: bookings.data?.length || 0,
    completedBookings: bookings.data?.filter(b => b.status === 'completed').length || 0,
    cancelledBookings: bookings.data?.filter(b => b.status === 'cancelled').length || 0,
    noShow: bookings.data?.filter(b => b.status === 'no_show').length || 0,
    totalOrders: orders.data?.length || 0,
    revenueCents: orders.data?.reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0) || 0,
  }
}

async function getMonthlyStats(businessId: string) {
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]
  const [bookings, orders] = await Promise.all([
    supabase.from('bookings').select('id, status').eq('business_id', businessId).gte('booking_date', monthAgo).lte('booking_date', today),
    supabase.from('orders').select('id, total_cents, status').eq('business_id', businessId).gte('created_at', monthAgo),
  ])
  const monthBookings = bookings.data || []
  return {
    totalBookings: monthBookings.length,
    confirmedBookings: monthBookings.filter(b => b.status === 'confirmed').length,
    completedBookings: monthBookings.filter(b => b.status === 'completed').length,
    cancelledBookings: monthBookings.filter(b => b.status === 'cancelled').length,
    noShow: monthBookings.filter(b => b.status === 'no_show').length,
    totalOrders: orders.data?.length || 0,
    revenueCents: orders.data?.reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0) || 0,
    avgBookingPerDay: (monthBookings.length / 30).toFixed(1),
    conversionRate: monthBookings.length > 0
      ? ((monthBookings.filter(b => b.status === 'completed').length / monthBookings.length) * 100).toFixed(0)
      : '0',
  }
}

function formatGs(cents: number): string {
  return `Gs. ${(cents / 100).toLocaleString('es-PY')}`
}

function todayDate(): string {
  return new Date().toLocaleDateString('es-PY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Send daily digest to all businesses with connected WhatsApp.
 */
export async function sendDailyDigest(): Promise<{ sent: number; skipped: number }> {
  const businesses = await getBusinessesWithWA()
  let sent = 0
  let skipped = 0

  const today = new Date()
  const dayName = today.toLocaleDateString('es-PY', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('es-PY', { day: 'numeric', month: 'long', year: 'numeric' })

  for (const biz of businesses) {
    if (!biz.whatsapp_instance) { skipped++; continue }
    try {
      const stats = await getDailyStats(biz.id)
      const bookingLines = stats.bookings.slice(0, 8).map((b: any) =>
        `  ${b.booking_time?.slice(0,5)} - ${b.customer_name} (${b.status})`
      ).join('\n')

      const text = `📋 *Resumen diario - ${dayName}*
${biz.name}
${dateStr}

━━━━━━━━━━━━━━━━━━
*Reservas de hoy:* ${stats.bookingCount}
${stats.bookingCount > 0 ? `\n${bookingLines}` : '  No hay reservas para hoy'}
${stats.pendingCount > 0 ? `\n⚠️ ${stats.pendingCount} pendiente(s) de confirmar` : ''}

*Pedidos:* ${stats.orderCount}
*Ingresos:* ${formatGs(stats.revenueCents)}

━━━━━━━━━━━━━━━━━━
Ver mas en: https://paragu-ai.com/dashboard/${biz.slug}`

      await sendText(biz.whatsapp_instance, biz.phone || biz.phone, text)
      sent++
    } catch { skipped++ }
  }
  return { sent, skipped }
}

/**
 * Send weekly report to all businesses with connected WhatsApp.
 */
export async function sendWeeklyReport(): Promise<{ sent: number; skipped: number }> {
  const businesses = await getBusinessesWithWA()
  let sent = 0
  let skipped = 0
  const weekRange = `${new Date(Date.now() - 7 * 86400000).toLocaleDateString('es-PY')} - ${new Date().toLocaleDateString('es-PY')}`

  for (const biz of businesses) {
    if (!biz.whatsapp_instance) { skipped++; continue }
    try {
      const stats = await getWeeklyStats(biz.id)

      const text = `📊 *Informe semanal*
${biz.name}
${weekRange}

━━━━━━━━━━━━━━━━━━
📅 *Reservas*
  Total: ${stats.totalBookings}
  Completadas: ${stats.completedBookings}
  Canceladas: ${stats.cancelledBookings}
  No asistieron: ${stats.noShow}

💰 *Ingresos*
  Pedidos: ${stats.totalOrders}
  Total: ${formatGs(stats.revenueCents)}

━━━━━━━━━━━━━━━━━━
Gracias por confiar en Paragu-AI!`

      await sendText(biz.whatsapp_instance, biz.phone || biz.phone, text)
      sent++
    } catch { skipped++ }
  }
  return { sent, skipped }
}

/**
 * Send monthly report to all businesses with connected WhatsApp.
 */
export async function sendMonthlyReport(): Promise<{ sent: number; skipped: number }> {
  const businesses = await getBusinessesWithWA()
  let sent = 0
  let skipped = 0
  const month = new Date().toLocaleDateString('es-PY', { month: 'long', year: 'numeric' })

  for (const biz of businesses) {
    if (!biz.whatsapp_instance) { skipped++; continue }
    try {
      const stats = await getMonthlyStats(biz.id)

      const text = `📈 *Informe mensual - ${month}*
${biz.name}

━━━━━━━━━━━━━━━━━━
📅 *Reservas del mes*
  Total: ${stats.totalBookings}
  Confirmadas: ${stats.confirmedBookings}
  Completadas: ${stats.completedBookings}
  Canceladas: ${stats.cancelledBookings}
  No asistieron: ${stats.noShow}
  Promedio diario: ${stats.avgBookingPerDay}
  Conversion: ${stats.conversionRate}%

💰 *Ingresos*
  Pedidos: ${stats.totalOrders}
  Total mes: ${formatGs(stats.revenueCents)}

━━━━━━━━━━━━━━━━━━
Consejo del mes:
  Responder rapido a las consultas de WhatsApp
  aumenta tus ventas hasta 40%! 🚀

Seguimos trabajando para tu negocio!
Paragu-AI`

      await sendText(biz.whatsapp_instance, biz.phone || biz.phone, text)
      sent++
    } catch { skipped++ }
  }
  return { sent, skipped }
}

/**
 * Send a business message from Paragu-AI to all connected businesses.
 * Used for: tips, promotions, updates, reminders.
 */
export async function sendBusinessMessage(
  message: string,
  filterBusinessId?: string,
): Promise<{ sent: number }> {
  let businesses = await getBusinessesWithWA()
  if (filterBusinessId) businesses = businesses.filter(b => b.id === filterBusinessId)

  let sent = 0
  for (const biz of businesses) {
    if (!biz.whatsapp_instance) continue
    try {
      const fullMsg = `${message}\n\n— Paragu-AI 🤖`
      await sendText(biz.whatsapp_instance, biz.phone || biz.phone, fullMsg)
      sent++
    } catch { continue }
  }
  return { sent }
}
