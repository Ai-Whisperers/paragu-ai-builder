import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { loadSite } from '@/lib/engine/site-loader'
import { loadSiteContent } from '@/lib/engine/site-loader'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await requireTenant()
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'es'

    const supabase = await createClient('service_role')
    const { data: business } = await supabase
      .from('businesses')
      .select('slug')
      .eq('id', session.businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    let content: Record<string, unknown> = {}
    try {
      const site = loadSite(business.slug)
      const siteContent = loadSiteContent(business.slug, locale as never)
      content = siteContent as Record<string, unknown>
    } catch {
      content = {}
    }

    return NextResponse.json({ content, locale })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
