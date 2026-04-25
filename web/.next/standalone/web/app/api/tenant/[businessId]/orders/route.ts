import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireTenant } from '@/lib/auth/tenant'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params
  const tenant = await requireTenant()
  if (tenant.businessId !== businessId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  return NextResponse.json({ orders })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ businessId: string; id?: string }> }
) {
  const { businessId } = await params
  const tenant = await requireTenant()
  if (tenant.businessId !== businessId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const url = new URL(req.url)
  const orderId = url.pathname.split('/').pop()
  const body = await req.json()
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status: body.status })
    .eq('id', orderId)
    .eq('business_id', businessId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
