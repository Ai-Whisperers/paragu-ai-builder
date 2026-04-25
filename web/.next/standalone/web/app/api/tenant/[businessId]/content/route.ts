import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireTenant } from '@/lib/auth/tenant'

export const runtime = 'nodejs'

export async function PUT(
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

  const { data: business } = await supabase
    .from('businesses')
    .select('data_json')
    .eq('id', businessId)
    .single()

  const existing = (business?.data_json as any) || {}
  const updated = {
    ...existing,
    content: { ...(existing.content || {}), ...body },
  }

  const { error } = await supabase
    .from('businesses')
    .update({ data_json: updated })
    .eq('id', businessId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
