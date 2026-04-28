import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await requireTenant()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'analytics'
    const supabase = await createClient('service_role')

    if (type === 'bookings') {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', session.businessId)
        .order('booking_date', { ascending: false })
      const csv = [
        ['Cliente', 'Email', 'Teléfono', 'Fecha', 'Hora', 'Duración', 'Estado', 'Creado'],
        ...(bookings ?? []).map((b: Record<string, unknown>) => [
          b.customer_name, b.customer_email, b.customer_phone,
          b.booking_date, b.booking_time, b.duration_minutes,
          b.status, b.created_at,
        ]),
      ].map((r) => r.map((c) => `"${String(c ?? '')}"`).join(',')).join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="reservas.csv"',
        },
      })
    }

    if (type === 'orders') {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('business_id', session.businessId)
        .order('created_at', { ascending: false })
      const csv = [
        ['N° Pedido', 'Cliente', 'Email', 'Total', 'Moneda', 'Estado', 'Creado'],
        ...(orders ?? []).map((o: Record<string, unknown>) => [
          o.order_number, o.customer_name, o.customer_email,
          o.total_cents, o.currency, o.status, o.created_at,
        ]),
      ].map((r) => r.map((c) => `"${String(c ?? '')}"`).join(',')).join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="pedidos.csv"',
        },
      })
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type, page_url, created_at')
      .eq('business_id', session.businessId)
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })
    const csv = [
      ['Tipo', 'Página', 'Fecha'],
      ...(events ?? []).map((e: Record<string, unknown>) => [e.event_type, e.page_url, e.created_at]),
    ].map((r) => r.map((c) => `"${String(c ?? '')}"`).join(',')).join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="analitica.csv"',
      },
    })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
