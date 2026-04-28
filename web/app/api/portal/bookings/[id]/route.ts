import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireTenant()
    const { id } = await params
    const body = await request.json()
    const { status, internal_notes } = body

    if (!status || !['confirmed', 'completed', 'cancelled', 'no_show'].includes(status)) {
      return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
    }

    const supabase = await createClient('service_role')
    const { data: existing } = await supabase
      .from('bookings')
      .select('id, business_id')
      .eq('id', id)
      .single()

    if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    if (existing.business_id !== session.businessId) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const updates: Record<string, unknown> = { status }
    if (status === 'confirmed') updates.confirmed_at = new Date().toISOString()
    if (status === 'cancelled') updates.cancelled_at = new Date().toISOString()
    if (internal_notes !== undefined) updates.internal_notes = internal_notes

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 })
    return NextResponse.json({ booking })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
