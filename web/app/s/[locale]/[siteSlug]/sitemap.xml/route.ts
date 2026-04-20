/**
 * GET /s/:locale/:siteSlug/sitemap.xml — per-locale per-tenant sitemap.
 * Enumerates every authored page for the tenant at the given locale.
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ locale: string; siteSlug: string }> },
) {
  const { locale, siteSlug } = await ctx.params
  const sitePath = resolve(process.cwd(), '..', 'sites', siteSlug, 'site.json')
  const pagesDir = resolve(process.cwd(), '..', 'sites', siteSlug, 'pages')

  if (!existsSync(sitePath)) return new Response('not found', { status: 404 })
  const site = JSON.parse(readFileSync(sitePath, 'utf-8')) as { locales?: string[]; domain?: string }
  if (!site.locales?.includes(locale)) return new Response('locale not enabled', { status: 404 })

  const base = site.domain ? `https://${site.domain}` : `https://example.test`
  const pages = existsSync(pagesDir)
    ? readdirSync(pagesDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
    : []

  const urls = pages.map((p) => {
    const path = p === 'home' ? '' : p
    return `<url><loc>${base}/s/${locale}/${siteSlug}${path ? '/' + path : ''}</loc></url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
