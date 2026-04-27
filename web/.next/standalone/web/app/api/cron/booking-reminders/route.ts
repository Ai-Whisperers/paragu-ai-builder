import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { sendBookingReminder } from '@/lib/integrations/whatsapp/evolution'

export const runtime = 'nodejs'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: Request) {
  try {
    if (CRON_SECRET && request.headers.get('x-cron-secret') !== CRON_SECRET) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    let supabase
    try { supabase = await createAdminClient() } catch {
      return NextResponse.json({ ok: false, reason: 'env_not_configured' }, { status: 200 })
    }
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Fetch all confirmed bookings for tomorrow with business info
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id, customer_name, customer_phone, booking_date, booking_time,
        business:business_id(id, name, whatsapp_instance)
      `)
      .eq('booking_date', tomorrow)
      .eq('status', 'confirmed')
      .not('business_id', 'is', null)

    if (error) {
      logger.error('Booking reminders: query failed', { error: String(error) })
      return NextResponse.json({ error: 'Query failed' }, { status: 500 })
    }

    let sent = 0
    let skipped = 0

    for (const booking of bookings || []) {
      const biz = Array.isArray(booking.business) ? (booking.business[0] as Record<string, unknown>) : undefined
      const waInstance = biz?.whatsapp_instance as string | undefined
      const bizName = biz?.name as string || ''

      if (!waInstance || !booking.customer_phone) {
        skipped++
        continue
      }

      try {
        await sendBookingReminder(
          waInstance,
          booking.customer_phone,
          booking.customer_name,
          booking.booking_date,
          booking.booking_time?.slice(0, 5) || '',
        )
        sent++

        logger.info('Booking reminder sent', {
          booking_id: booking.id,
          business: bizName,
          customer: booking.customer_name,
        })
      } catch (err) {
        logger.warn('Booking reminder failed', {
          booking_id: booking.id,
          error: String(err),
        })
        skipped++
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      skipped,
      date: tomorrow,
      message: `Sent ${sent} reminders for ${tomorrow}, skipped ${skipped}`,
    })
  } catch (error) {
    logger.error('Booking reminders cron failed', { error: String(error) })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
