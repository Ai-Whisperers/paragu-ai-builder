import { NextResponse } from 'next/server'
import { loadSite, listPageSlugs, loadPage } from '@/lib/engine/site-loader'
import { listBlogSlugs } from '@/lib/engine/blog-loader'
import { buildLocaleUrl, type Locale } from '@/lib/i18n/routing'
import { isLocale } from '@/lib/i18n/config'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; site: string }> },
) {
  const { locale, site: slug } = await params
  if (!isLocale(locale)) return new NextResponse('Not found', { status: 404 })

  let site
  try { site = loadSite(slug) } catch { return new NextResponse('Not found', { status: 404 }) }

  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://paragu-ai.com'

  const pages = listPageSlugs(slug)
  const blogs = listBlogSlugs(slug, locale as Locale)

  const urls: Array<{ loc: string; alternates: Array<{ hreflang: string; href: string }> }> = []

  for (const page of pages) {
    // Skip pages that explicitly opt out of the sitemap (e.g. ad landings
    // that must only be reached via attribution URLs).
    const def = loadPage(slug, page)
    if (def?.hiddenFromSitemap) continue
    const pathPart = page === 'home' ? '' : page
    const alternates = site.locales.map((l) => ({
      hreflang: l,
      href: `${base}${buildLocaleUrl(l, slug, pathPart)}`,
    }))
    urls.push({
      loc: `${base}${buildLocaleUrl(locale as Locale, slug, pathPart)}`,
      alternates,
    })
  }
  // The /blog and /prensa routes are file-based, so they won't show up in
  // listPageSlugs(). Include them explicitly when the site's content /
  // navigation references them — nav includes both for all Nexa tenants.
  const navPaths = new Set((site.navigation || []).map((n) => n.path))
  const extraRoutes: string[] = []
  if (blogs.length > 0 || navPaths.has('blog')) extraRoutes.push('blog')
  if (navPaths.has('prensa')) extraRoutes.push('prensa')
  for (const extra of extraRoutes) {
    const alternates = site.locales.map((l) => ({
      hreflang: l,
      href: `${base}${buildLocaleUrl(l, slug, extra)}`,
    }))
    urls.push({
      loc: `${base}${buildLocaleUrl(locale as Locale, slug, extra)}`,
      alternates,
    })
  }
  for (const post of blogs) {
    const pathPart = `blog/${post}`
    const alternates = site.locales.map((l) => ({
      hreflang: l,
      href: `${base}${buildLocaleUrl(l, slug, pathPart)}`,
    }))
    urls.push({
      loc: `${base}${buildLocaleUrl(locale as Locale, slug, pathPart)}`,
      alternates,
    })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    ({ loc, alternates }) => `  <url>
    <loc>${loc}</loc>
${alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`).join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
