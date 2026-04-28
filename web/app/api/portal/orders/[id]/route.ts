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

    const supabase = await createClient('service_role')
    const { data: existing } = await supabase
      .from('orders')
      .select('id, business_id, status')
      .eq('id', id)
      .single()
    if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    if (existing.business_id !== session.businessId) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const updates: Record<string, unknown> = {}
    if (body.status) {
      const validTransitions: Record<string, string[]> = {
        pending: ['confirmed', 'cancelled'],
        awaiting_payment: ['paid', 'cancelled'],
        paid: ['processing', 'refunded'],
        processing: ['shipped', 'cancelled'],
        shipped: ['delivered'],
      }
      const allowed = validTransitions[existing.status] ?? []
      if (!allowed.includes(body.status)) {
        return NextResponse.json({ error: 'invalid_transition', from: existing.status, to: body.status }, { status: 400 })
      }
      updates.status = body.status
      if (body.status === 'paid') updates.paid_at = new Date().toISOString()
      if (body.status === 'shipped') updates.shipped_at = new Date().toISOString()
      if (body.status === 'delivered') updates.delivered_at = new Date().toISOString()
      if (body.status === 'cancelled') updates.cancelled_at = new Date().toISOString()
    }
    if (body.tracking_number) updates.tracking_number = body.tracking_number
    if (body.tracking_carrier) updates.tracking_carrier = body.tracking_carrier
    if (body.tracking_url) updates.tracking_url = body.tracking_url
    if (body.notes !== undefined) updates.notes = body.notes

    const { data: order, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 })
    return NextResponse.json({ order })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
