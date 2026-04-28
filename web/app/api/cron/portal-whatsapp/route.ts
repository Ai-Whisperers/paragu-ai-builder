import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBookingReminder } from '@/lib/portal/whatsapp-notify'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expected = `Bearer ${process.env.CRON_SECRET}`
  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = await createClient('service_role')

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dateStr = tomorrow.toISOString().slice(0, 10)

  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, business_id, customer_name, customer_phone, booking_date, booking_time')
    .eq('booking_date', dateStr)
    .eq('status', 'confirmed')

  let sent = 0
  for (const b of bookings ?? []) {
    try {
      await sendBookingReminder(b.business_id, b)
      sent++
    } catch (err) {
      logger.error('[cron:portal-whatsapp] reminder failed', { bookingId: b.id, error: String(err) })
    }
  }

  logger.info('[cron:portal-whatsapp] reminders sent', { sent, total: (bookings ?? []).length })
  return NextResponse.json({ ok: true, remindersSent: sent, totalBookings: (bookings ?? []).length })
}
