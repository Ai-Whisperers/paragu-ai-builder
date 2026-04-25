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
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  return NextResponse.json({ products })
}

export async function POST(
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

  const { data, error } = await supabase
    .from('products')
    .insert({ ...body, business_id: businessId })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ product: data })
}
