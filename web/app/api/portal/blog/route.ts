import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, category, status, excerpt, published_at, scheduled_at, created_at, locale')
      .eq('business_id', session.businessId)
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })
    return NextResponse.json({ posts: posts ?? [] })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireTenant()
    const body = await request.json()
    const { title, content, excerpt, category, status, scheduled_at, cover_image_url, locale } = body
    if (!title || !content) return NextResponse.json({ error: 'title_and_content_required' }, { status: 400 })

    const slug = (body.slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 120)

    const supabase = await createClient('service_role')
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('business_id', session.businessId)
      .eq('slug', slug)
      .maybeSingle()
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug

    const now = new Date().toISOString()
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        business_id: session.businessId,
        slug: finalSlug,
        title,
        content,
        excerpt: excerpt || null,
        category: category || null,
        status: status || 'draft',
        scheduled_at: scheduled_at || null,
        published_at: status === 'published' ? now : null,
        cover_image_url: cover_image_url || null,
        locale: locale || 'es',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'create_failed', detail: error.message }, { status: 500 })
    return NextResponse.json({ post })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
