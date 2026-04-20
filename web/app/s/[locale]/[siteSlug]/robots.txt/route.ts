/** Per-tenant robots.txt — allows everything + references the tenant sitemap. */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ locale: string; siteSlug: string }> },
) {
  const { locale, siteSlug } = await ctx.params
  const sitePath = resolve(process.cwd(), '..', 'sites', siteSlug, 'site.json')
  if (!existsSync(sitePath)) return new Response('not found', { status: 404 })
  const site = JSON.parse(readFileSync(sitePath, 'utf-8')) as { domain?: string }
  const base = site.domain ? `https://${site.domain}` : ''

  const body = `User-agent: *
Allow: /

Sitemap: ${base}/s/${locale}/${siteSlug}/sitemap.xml
`
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
