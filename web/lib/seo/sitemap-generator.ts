import type { SiteDefinition } from '@/lib/engine/site-types'

export function generateSitemap(
  siteSlug: string,
  baseUrl: string,
  locales: string[] = ['es', 'en', 'nl', 'de'],
  routes: string[] = ['/', '/comparacion', '/precios', '/sobre', '/faq', '/contacto', '/blog'],
) {
  const urls: { url: string; changefreq: string; priority: string }[] = []

  const priority: Record<string, string> = {
    '/': '1.0',
    '/comparacion': '0.9',
    '/precios': '0.9',
    '/sobre': '0.8',
    '/faq': '0.8',
    '/contacto': '0.7',
    '/blog': '0.8',
  }

  for (const route of routes) {
    for (const locale of locales) {
      urls.push({
        url: `${baseUrl}/${locale}${route}`,
        changefreq: 'weekly',
        priority: priority[route],
      })
    }
    // Non-locale-prefixed version (fallback)
    urls.push({
      url: `${baseUrl}${route === '/' ? '' : route}`,
      changefreq: 'weekly',
      priority: priority[route],
    })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${urls
    .map(
      (u) => `
  <url>
    <loc>${u.url}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join('')}
</urlset>`

  return xml
}

export function generateRobotsTxt({
  disallowPaths = [],
  sitemapUrl = '',
}: {
  disallowPaths?: string[]
  sitemapUrl?: string
} = {}) {
  const disallow = disallowPaths.length ? disallowPaths.join('\n  ') : 'private/'
  const sitemap = sitemapUrl ? `\nSitemap: ${sitemapUrl}` : ''
  return `User-agent: *
Disallow: /${disallow}${sitemap}`
}

export type { SiteDefinition }

export default { generateSitemap, generateRobotsTxt }