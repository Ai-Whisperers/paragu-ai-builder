import { NextResponse } from 'next/server'
import { loadSite } from '@/lib/engine/site-loader'

export const runtime = 'edge'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; site: string }> },
) {
  const { locale, site: slug } = await params
  let site
  try { site = loadSite(slug) } catch { return new NextResponse('Not found', { status: 404 }) }
  const base = process.env.NEXT_PUBLIC_APP_URL || `https://${site.domain}`
  const body = `User-agent: *
Allow: /
Sitemap: ${base}/s/${locale}/${slug}/sitemap.xml
`
  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
