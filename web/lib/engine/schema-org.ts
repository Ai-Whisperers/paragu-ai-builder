/**
 * schema.org JSON-LD generator for tenant sites. Emits LocalBusiness +
 * Organization + Service + FAQPage + BreadcrumbList structured data based
 * on the resolved page content.
 *
 * Round 2: add Organization on every page (with logo from the images
 * manifest + sameAs from site.social), an ItemList of Services on
 * /programas, and a BreadcrumbList on non-home pages.
 */
import type { ResolvedPage } from './site-types'
import { loadImagesManifest } from './images-loader'
import { loadSiteContent } from './site-loader'
import {
  buildOrganization,
  buildService,
  buildServiceItemList,
  buildBreadcrumbList,
} from '@/lib/seo/json-ld'

export interface JsonLdItem { '@context': string; '@type': string; [k: string]: unknown }

export function jsonLdForPage(page: ResolvedPage, baseUrl: string): JsonLdItem[] {
  const items: JsonLdItem[] = []
  const site = page.site
  const manifest = loadImagesManifest(site.slug)
  const content = safeSiteContent(site.slug, page.locale)

  // 1. LocalBusiness (legacy, kept for backward compat — some tenants rely
  //    on it showing up in search).
  items.push(localBusiness(page, baseUrl))

  // 2. Organization — gives Google the logo + sameAs links. Worth emitting
  //    on every page; tenants without a logo or social will still get a
  //    minimal node.
  items.push(
    buildOrganization(
      {
        slug: site.slug,
        country: site.country,
        defaultLocale: site.defaultLocale,
        contact: site.contact,
        social: site.social,
      },
      content,
      manifest,
      baseUrl,
    ) as JsonLdItem,
  )

  // 3. Breadcrumb (skip on home). Uses the current page title + site name.
  if (page.page.slug && page.page.slug !== 'home') {
    const homeUrl = `${baseUrl}/s/${page.locale}/${site.slug}`
    const currentUrl = `${baseUrl}${page.meta.path}`
    items.push(
      buildBreadcrumbList([
        { name: content.siteName || site.slug, url: homeUrl },
        { name: page.meta.title, url: currentUrl },
      ]) as JsonLdItem,
    )
  }

  // 4. FAQ rich result.
  if (page.meta.schemaType === 'FAQPage') {
    const faq = extractFaq(page)
    if (faq) items.push(faq)
  }

  // 5. Service items — one Service per tier PLUS a wrapping ItemList so
  //    Google can surface the full programs directory as a single entity.
  if (page.meta.schemaType === 'Service') {
    const services = extractServices(page, baseUrl, {
      slug: site.slug,
      country: site.country,
      defaultLocale: site.defaultLocale,
    }, content)
    if (services.length > 0) {
      items.push(
        buildServiceItemList(
          services,
          page.meta.title,
          `${baseUrl}${page.meta.path}`,
        ) as JsonLdItem,
      )
      items.push(...(services as JsonLdItem[]))
    }
  }

  return items
}

function safeSiteContent(
  slug: string,
  locale: string,
): { siteName?: string; tagline?: string } {
  try {
    const raw = loadSiteContent(slug, locale as never) as Record<string, unknown>
    return {
      siteName: typeof raw.siteName === 'string' ? raw.siteName : undefined,
      tagline: typeof raw.tagline === 'string' ? raw.tagline : undefined,
    }
  } catch {
    return {}
  }
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

function extractServices(
  page: ResolvedPage,
  baseUrl: string,
  siteShape: { slug: string; country?: string; defaultLocale?: string },
  content: { siteName?: string; tagline?: string },
): JsonLdItem[] {
  const comp = page.sections.find((s) => s.id === 'programs-comparison')
  if (!comp) return []
  const tiers = (comp.props as Record<string, unknown>).tiers as Array<Record<string, unknown>> | undefined
  if (!tiers) return []
  return tiers.map((t) =>
    buildService(
      {
        id: typeof t.id === 'string' ? t.id : undefined,
        name: typeof t.name === 'string' ? t.name : undefined,
        description: typeof t.description === 'string' ? t.description : undefined,
        price: typeof t.price === 'string' ? t.price : undefined,
        priceNote: typeof t.priceNote === 'string' ? t.priceNote : undefined,
        included: Array.isArray(t.included)
          ? (t.included.filter((x) => typeof x === 'string') as string[])
          : undefined,
        ctaHref: typeof t.ctaHref === 'string' ? t.ctaHref : undefined,
        ctaLabel: typeof t.ctaLabel === 'string' ? t.ctaLabel : undefined,
      },
      siteShape,
      content,
      baseUrl,
      page.meta.path,
    ) as JsonLdItem,
  )
}
