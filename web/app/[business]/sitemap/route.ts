/**
 * Per-tenant sitemap.xml at /[business]/sitemap.
 *
 * Pulls the tenant's actual pages (from the static-sites config) across
 * every locale plus, for commerce tenants, every category landing and
 * every active product page. Falls back to a minimal sitemap if the
 * tenant isn't found rather than 500ing.
 */
import { NextResponse } from 'next/server'
import { SITES } from '@/lib/engine/static-sites'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import {
  listActiveProducts,
  listDistinctCategories,
} from '@/lib/commerce/products'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1 hour — SEO crawls are infrequent enough

interface UrlEntry {
  loc: string
  lastmod?: string
  changefreq?: 'daily' | 'weekly' | 'monthly'
  priority?: number
}

function xmlEscape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]!))
}

function renderSitemap(entries: UrlEntry[]): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ]
  for (const e of entries) {
    lines.push('  <url>')
    lines.push(`    <loc>${xmlEscape(e.loc)}</loc>`)
    if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`)
    if (e.changefreq) lines.push(`    <changefreq>${e.changefreq}</changefreq>`)
    if (typeof e.priority === 'number') lines.push(`    <priority>${e.priority.toFixed(1)}</priority>`)
    lines.push('  </url>')
  }
  lines.push('</urlset>')
  return lines.join('\n')
}

export const GET = withRequestLog<{ business: string }>(async (_request, { log }, { business }) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://paragu-ai.com'
  const site = SITES[business as keyof typeof SITES]
  if (!site) {
    return new NextResponse(renderSitemap([]), {
      status: 404,
      headers: { 'Content-Type': 'application/xml' },
    })
  }

  const entries: UrlEntry[] = []
  const locales = site.locales.length > 0 ? site.locales : ['es']

  // Core pages — every locale, every page in the tenant's config.
  for (const locale of locales) {
    for (const page of site.pages) {
      const path = page === 'home' ? '' : `/${page}`
      entries.push({
        loc: `${baseUrl}/s/${locale}/${business}${path}`,
        changefreq: 'weekly',
        priority: page === 'home' ? 1.0 : 0.8,
      })
    }
  }

  // Commerce additions: categories + products (one locale; avoids duplicate-
  // content penalties when all the locales point at the same product slug).
  const canonicalLocale = site.defaultLocale ?? locales[0]
  try {
    const biz = await resolveBusinessBySlug(business)
    if (biz && (await isCommerceEnabled(biz.type))) {
      const [categories, products] = await Promise.all([
        listDistinctCategories(biz.id),
        // Cap at 2000 products; tenants beyond that should split into
        // multiple sitemaps (sitemap index). Not our problem today.
        listActiveProducts(biz.id, { limit: 2000, sort: 'newest' }),
      ])

      for (const cat of categories) {
        entries.push({
          loc: `${baseUrl}/s/${canonicalLocale}/${business}/tienda/categoria/${encodeURIComponent(cat)}`,
          changefreq: 'weekly',
          priority: 0.7,
        })
      }

      entries.push({
        loc: `${baseUrl}/s/${canonicalLocale}/${business}/tienda`,
        changefreq: 'daily',
        priority: 0.9,
      })

      for (const product of products) {
        entries.push({
          loc: `${baseUrl}/s/${canonicalLocale}/${business}/producto/${product.slug}`,
          lastmod: product.updatedAt.slice(0, 10),
          changefreq: 'weekly',
          priority: 0.6,
        })
      }
    }
  } catch (err) {
    log.warn('sitemap.commerce_section_failed', {
      business,
      error: err instanceof Error ? err.message : String(err),
    })
    // Keep whatever we already have in entries; don't fail the whole sitemap.
  }

  log.debug('sitemap.generated', { business, urlCount: entries.length })
  return new NextResponse(renderSitemap(entries), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
})
