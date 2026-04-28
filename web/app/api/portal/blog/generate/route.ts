import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { generatePostTitle, generatePostContent, generateServices } from '@/lib/portal/content-generator'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: business } = await supabase
      .from('businesses')
      .select('name, type, slug')
      .eq('id', session.businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const title = generatePostTitle(business.type, Date.now() % 5)
    const content = generatePostContent(title, business.name, business.type)
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('business_id', session.businessId)
      .eq('slug', slug)
      .maybeSingle()

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug

    const { data: post, error } = await supabase.from('blog_posts').insert({
      business_id: session.businessId,
      slug: finalSlug,
      title,
      content,
      excerpt: `Generado automáticamente para ${business.name}`,
      category: 'General',
      status: 'draft',
    }).select().single()

    if (error) return NextResponse.json({ error: 'create_failed', detail: error.message }, { status: 500 })

    return NextResponse.json({ post })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
