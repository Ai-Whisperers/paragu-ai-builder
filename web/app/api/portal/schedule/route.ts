import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await requireTenant()
    const body = await request.json()
    const { title, content, scheduledDate } = body

    if (!title || !content || !scheduledDate) {
      return NextResponse.json({ error: 'title_content_date_required' }, { status: 400 })
    }

    if (new Date(scheduledDate) <= new Date()) {
      return NextResponse.json({ error: 'date_must_be_future' }, { status: 400 })
    }

    const supabase = await createClient('service_role')
    const { data: business } = await supabase
      .from('businesses')
      .select('slug')
      .eq('id', session.businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const { error } = await supabase.from('site_pages').insert({
      site_slug: business.slug,
      title,
      content: { body: content },
      status: 'scheduled',
      scheduled_at: new Date(scheduledDate).toISOString(),
    })

    if (error) {
      return NextResponse.json({ error: 'create_failed', detail: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')
    const { data: business } = await supabase.from('businesses').select('slug').eq('id', session.businessId).single()
    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const { data: pages, error } = await supabase
      .from('site_pages')
      .select('id, title, status, scheduled_at, published_at, created_at')
      .eq('site_slug', business.slug)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })
    return NextResponse.json({ pages: pages ?? [] })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
