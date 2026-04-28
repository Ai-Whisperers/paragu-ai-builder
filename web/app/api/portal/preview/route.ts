import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PUT(request: Request) {
  try {
    const session = await requireTenant()
    const body = await request.json()
    if (!body || typeof body.content !== 'object') {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }
    const supabase = await createClient('service_role')
    const { data: business } = await supabase
      .from('businesses')
      .select('slug')
      .eq('id', session.businessId)
      .single()
    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    await supabase.from('businesses')
      .update({ data_json: { ...body.content, _draft: true } })
      .eq('id', session.businessId)
    return NextResponse.json({ previewUrl: `/api/portal/preview/render` })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
