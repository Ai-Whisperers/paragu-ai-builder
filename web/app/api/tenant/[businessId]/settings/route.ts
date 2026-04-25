import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireTenant } from '@/lib/auth/tenant'

export const runtime = 'nodejs'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params
  const tenant = await requireTenant()
  if (tenant.businessId !== businessId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const supabase = await createClient()

  const allowedFields = ['name', 'phone', 'whatsapp', 'email', 'address', 'neighborhood', 'city', 'hours', 'instagram', 'facebook']
  const updates: Record<string, any> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) updates[field] = body[field]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'no valid fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', businessId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ business: data })
}
