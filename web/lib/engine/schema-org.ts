/**
 * schema.org JSON-LD generator for tenant sites.
 *
 * Emits, per page:
 *   - LocalBusiness  (every page — the tenant itself)
 *   - FAQPage        (pages whose schemaType is "FAQPage")
 *   - Service        (pages whose schemaType is "Service")
 *   - BreadcrumbList (every non-home page — helps Google display the
 *                     path crumb in SERP)
 */
import type { ResolvedPage } from './site-types'

export interface JsonLdItem { '@context': string; '@type': string; [k: string]: unknown }

export function jsonLdForPage(page: ResolvedPage, baseUrl: string): JsonLdItem[] {
  const items: JsonLdItem[] = []
  items.push(localBusiness(page, baseUrl))

  const crumbs = extractBreadcrumbs(page, baseUrl)
  if (crumbs) items.push(crumbs)

  if (page.meta.schemaType === 'FAQPage') {
    const faq = extractFaq(page)
    if (faq) items.push(faq)
  }
  if (page.meta.schemaType === 'Service') {
    const services = extractServices(page, baseUrl)
    items.push(...services)
  }
  return items
}

function localBusiness(page: ResolvedPage, baseUrl: string): JsonLdItem {
  const site = page.site
  const siteContent = page.page.slug ? null : page
  const siteName = (siteContent ? (page.sections[0]?.props as Record<string, unknown>)?.businessName : undefined) || site.slug
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: String(siteName || site.slug),
    url: `${baseUrl}${page.meta.path}`,
    areaServed: site.country,
    email: site.contact?.email,
    telephone: site.contact?.phone || site.contact?.whatsapp,
    inLanguage: page.locale,
    description: page.meta.description,
  }
}

function extractFaq(page: ResolvedPage): JsonLdItem | null {
  const faq = page.sections.find((s) => s.id === 'faq')
  if (!faq) return null
  const items = (faq.props as Record<string, unknown>).items as Array<{ q: string; a: string }> | undefined
  if (!items || items.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

function extractServices(page: ResolvedPage, baseUrl: string): JsonLdItem[] {
  const comp = page.sections.find((s) => s.id === 'programs-comparison')
  if (!comp) return []
  const tiers = (comp.props as Record<string, unknown>).tiers as Array<Record<string, unknown>> | undefined
  if (!tiers) return []
  return tiers.map((t) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: String(t.name),
    description: String(t.description || ''),
    offers: t.price
      ? { '@type': 'Offer', price: String(t.price), priceCurrency: 'USD' }
      : undefined,
    url: `${baseUrl}${page.meta.path}#${String(t.id)}`,
  }))
}

/**
 * Breadcrumb list — Home > <page title>. Only emitted for non-home pages
 * (home's breadcrumb is itself, which Google treats as redundant).
 *
 * The site's home URL is derived from the current page's path by stripping
 * the trailing page slug; for a page at `/s/es/nexa-paraguay/programas`
 * the home is `/s/es/nexa-paraguay`.
 */
function extractBreadcrumbs(page: ResolvedPage, baseUrl: string): JsonLdItem | null {
  const path = page.meta.path
  if (!path) return null // home has empty path component
  const homePath = path.substring(0, path.lastIndexOf('/')) || path.replace(/\/[^/]+$/, '')
  const siteName = (page.sections[0]?.props as Record<string, unknown>)?.businessName as string | undefined
  const pageTitle = page.meta.title || page.page.slug || 'Page'
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: siteName || 'Home',
        item: `${baseUrl}${homePath}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageTitle,
        item: `${baseUrl}${path}`,
      },
    ],
  }
}
