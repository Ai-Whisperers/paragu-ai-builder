import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, status, total_cents, currency, customer_name, customer_email, created_at')
      .eq('business_id', session.businessId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: 'query_failed', detail: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders: orders ?? [] })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
