import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')
    const { data: business, error } = await supabase
      .from('businesses')
      .select('data_json')
      .eq('id', session.businessId)
      .single()
    if (error || !business) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    return NextResponse.json({ content: business.data_json ?? {} })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireTenant()
    const body = await request.json()
    if (!body || typeof body.content !== 'object') {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }
    const supabase = await createClient('service_role')
    const { data: business, error } = await supabase
      .from('businesses')
      .update({ data_json: body.content })
      .eq('id', session.businessId)
      .select('data_json')
      .single()
    if (error) {
      return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 })
    }
    return NextResponse.json({ content: business?.data_json ?? {} })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
