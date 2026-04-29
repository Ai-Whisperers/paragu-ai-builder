import { NextResponse } from 'next/server'
import { loadSite } from '@/lib/engine/site-loader'
import { getAppUrl } from '@/lib/env'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; site: string }> },
) {
  const { locale, site: slug } = await params
  try { loadSite(slug) } catch { return new NextResponse('Not found', { status: 404 }) }
  const base = getAppUrl()
  // Disallow rules per playbook §5.4 / §6:
  // - View-only params (sort/view/per_page) generate duplicate content.
  // - Cart/checkout/account are session pages, never index.
  const body = `User-agent: *
Allow: /
Disallow: /s/${locale}/${slug}/cart
Disallow: /s/${locale}/${slug}/checkout
Disallow: /s/${locale}/${slug}/account
Disallow: /*?sort=
Disallow: /*&sort=
Disallow: /*?view=
Disallow: /*&view=
Disallow: /*?per_page=
Disallow: /*&per_page=
Sitemap: ${base}/s/${locale}/${slug}/sitemap.xml
`
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
