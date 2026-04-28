import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireTenant()
    const { id } = await params
    const supabase = await createClient('service_role')
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('business_id', session.businessId)
      .single()
    if (error || !post) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    return NextResponse.json({ post })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireTenant()
    const { id } = await params
    const body = await request.json()
    const allowed = ['title', 'content', 'excerpt', 'category', 'status', 'scheduled_at', 'cover_image_url', 'locale', 'author']
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }
    if (body.status === 'published' && !body.scheduled_at) {
      updates.published_at = new Date().toISOString()
    }
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'no_valid_fields' }, { status: 400 })

    const supabase = await createClient('service_role')
    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .eq('business_id', session.businessId)
      .select()
      .single()
    if (error) return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 })
    return NextResponse.json({ post })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireTenant()
    const { id } = await params
    const supabase = await createClient('service_role')
    const { error } = await supabase.from('blog_posts').delete().eq('id', id).eq('business_id', session.businessId)
    if (error) return NextResponse.json({ error: 'delete_failed' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
