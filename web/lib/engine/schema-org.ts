/**
 * schema.org JSON-LD generator for tenant sites. Emits LocalBusiness +
 * Service + FAQPage structured data based on the resolved page content.
 */
import type { ResolvedPage } from './site-types'

export interface JsonLdItem { '@context': string; '@type': string; [k: string]: unknown }

export function jsonLdForPage(page: ResolvedPage, baseUrl: string): JsonLdItem[] {
  const items: JsonLdItem[] = []
  items.push(localBusiness(page, baseUrl))
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
