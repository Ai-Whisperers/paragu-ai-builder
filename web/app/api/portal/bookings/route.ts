import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, customer_name, customer_email, customer_phone, booking_date, booking_time, duration_minutes, status, created_at')
      .eq('business_id', session.businessId)
      .order('booking_date', { ascending: false })
      .order('booking_time', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: 'query_failed', detail: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookings: bookings ?? [] })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
