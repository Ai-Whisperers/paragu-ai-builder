import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')
    const { data: notifications, error } = await supabase
      .from('portal_notifications')
      .select('*')
      .eq('business_id', session.businessId)
      .order('created_at', { ascending: false })
      .limit(30)
    if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })
    return NextResponse.json({ notifications: notifications ?? [] })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')
    const body = await request.json()
    if (body.markAll) {
      await supabase.from('portal_notifications').update({ read: true }).eq('business_id', session.businessId)
    } else if (body.id) {
      await supabase.from('portal_notifications').update({ read: true }).eq('id', body.id).eq('business_id', session.businessId)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
