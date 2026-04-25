/**
 * Template Composition Engine
 *
 * Takes a business type + business data and produces a fully composed page
 * by reading from the registry, content templates, and token files.
 *
 * Pipeline:
 *   registry/[type].type.json  → which sections, in what order
 *   content/[type].content.json → Spanish copy with {{placeholders}}
 *   tokens/[type].tokens.json  → visual theme
 *   + business data            → fills in placeholders
 *   = ComposedPage             → ready for rendering
 */

import type { BusinessType } from '@/lib/types'
import type { PageType } from '@/lib/types'
import { fillTemplate } from '@/lib/utils'
import { getRegistry, getContent } from './static-config'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/obs/metrics'

const PAGE_SLUG_MAP: Record<string, string> = {
  home: '',
  servicios: 'servicios',
  catalogo: 'catalogo',
  portafolio: 'portafolio',
  portfolio: 'portafolio',
  faq: 'faq',
  blog: 'blog',
  contacto: 'contacto',
  contact: 'contacto',
  about: 'sobre',
  sobre: 'sobre',
  terminos: 'terminos',
  terms: 'terminos',
  privacidad: 'privacidad',
}

function buildPageHref(siteSlug: string, label: string): string {
  const pageSlug = PAGE_SLUG_MAP[label.toLowerCase()] || label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (!pageSlug || pageSlug === 'home') {
    return `/s/es/${siteSlug}`
  }
  return `/s/es/${siteSlug}/${pageSlug}`
}
import { SECTION_BUILDERS } from './section-builders'

// TODO: Add caching layer for registry/content to reduce filesystem reads
// TODO: Implement incremental composition for preview mode
// TODO: Add A/B testing support for section variations

// Section types matching our component library
export type SectionType =
  | 'header'
  | 'hero'
  | 'services'
  | 'booking'
  | 'portfolio'
  | 'beforeAfter'
  | 'classSchedule'
  | 'membershipPlans'
  | 'roomBooking'
  | 'eventVenues'
  | 'quoteForm'
  | 'emergencyIndicator'
  | 'productCatalog'
  | 'featuredProducts'
  | 'commerceCatalog'
  | 'ageGate'
  | 'googleReviews'
  | 'packagesGiftcards'
  | 'branches'
  | 'gallery'
  | 'team'
  | 'testimonials'
  | 'contact'
  | 'faq'
  | 'ctaBanner'
  | 'footer'
  | 'whatsappFloat'
  // Service/Consulting business types
  | 'features'
  | 'pricing'
  | 'process'
  | 'savingsCalculator'
  // Sushi restaurant types
  | 'omakase'
  | 'sakeMenu'
  | 'conveyorBelt'
  // Egg farm / agriculture types
  | 'stockIndicator'
  | 'deliveryCalculator'
  | 'recipes'
  | 'reviews'
  | 'subscription'
  | 'referral'
  | 'priceList'
  | 'preorder'

export interface ComposedSection {
  type: SectionType
  order: number
  data: Record<string, unknown>
}

export interface BusinessData {
  name: string
  slug: string
  type: BusinessType
  tagline?: string
  city: string
  neighborhood?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  googleMapsUrl?: string
  hours?: Record<string, string>
  services?: Array<{
    name: string
    description?: string
    price?: string
    priceFrom?: string
    duration?: number
    imageUrl?: string
    category?: string
  }>
  products?: Array<{
    name: string
    description?: string
    price?: string
    imageUrl?: string
    category?: string
    available?: boolean
    stockCount?: number
    isPreorder?: boolean
    isB2B?: boolean
  }>
  team?: Array<{
    name: string
    role?: string
    bio?: string
    imageUrl?: string
    instagram?: string
  }>
  gallery?: Array<{
    src: string
    alt: string
    category?: string
  }>
  testimonials?: Array<{
    quote: string
    author: string
    role?: string
    rating?: number
    location?: string
    type?: string
  }>
  stats?: Array<{ value: string; label: string }>
  story?: {
    founded?: string
    mission?: string
    vision?: string
    values?: string[]
  }
  sustainability?: {
    composting?: boolean
    biogas?: boolean
    waterRecycling?: boolean
    organicFertilizer?: boolean
    description?: string
  }
  referralProgram?: {
    enabled?: boolean
    friendDiscount?: number
    referrerReward?: string
    description?: string
  }
  heroImage?: string
  classSchedule?: Array<{
    day: string
    classes: Array<{
      time: string
      name: string
      instructor?: string
      duration?: number
      spots?: number
    }>
  }>
  membershipPlans?: Array<{
    name: string
    price: string
    period?: string
    description?: string
    features: string[]
    popular?: boolean
    cta?: string
  }>
  pricingPlans?: Array<{
    name: string
    price?: string
    priceFrom?: string
    period?: string
    description?: string
    features: string[]
    featured?: boolean
    cta?: string
  }>
  faq?: Array<{
    q: string
    a: string
  }>
  // Relocation/Service business types
  features?: Array<{
    title: string
    description: string
    icon?: string
  }>
  processSteps?: Array<{
    number: number
    title: string
    description: string
  }>
  /**
   * When true, the rendered page shows a `<DemoBadge>` ribbon so prospects
   * know it's not a real client. Defaults false (real tenants).
   */
  isDemo?: boolean

  /**
   * Admin-edited content overrides. Populated from
   * `businesses.data_json.content` by the data-loader. Section builders
   * should prefer these over defaults when present. Shape matches
   * `lib/commerce/business-content.ts` — kept as unknown here to avoid a
   * circular type dependency.
   */
  contentOverrides?: {
    hero?: {
      headline?: string
      subheadline?: string
      ctaPrimaryText?: string
      ctaPrimaryHref?: string
      ctaSecondaryText?: string
      ctaSecondaryHref?: string
      backgroundImageUrl?: string
    }
    about?: { title?: string; body?: string; imageUrl?: string }
    testimonials?: {
      items?: Array<{ name: string; quote: string; photoUrl?: string; role?: string; rating?: number }>
    }
    faq?: { items?: Array<{ question: string; answer: string }> }
    contact?: {
      phone?: string
      whatsapp?: string
      email?: string
      address?: string
      city?: string
      googleMapsUrl?: string
      hours?: Array<{ day: string; open?: string; close?: string; closed?: boolean }>
    }
  }
}

export interface ComposedPage {
  business: BusinessData
  sections: ComposedSection[]
  meta: {
    title: string
    description: string
  }
  theme: {
    cssString: string
    googleFontsUrl: string
    isDark: boolean
  }
}

function loadRegistry(type: string): RegistryType | null {
  return getRegistry(type) as RegistryType | null
}

/**
 * Content resolution: try curated first, then walk the `extends:` chain
 * (so yoga/pilates inherit gimnasio's curated content rather than generic
 * synthesized copy), then fall back to defaultContentFor() as the floor.
 */
function loadContent(type: string): ContentTemplate | null {
  const curated = getContent(type) as ContentTemplate | null
  if (curated) return curated

  // Walk extends chain — each type.json may declare `extends: "<parent-id>"`.
  const seen = new Set<string>([type])
  let cursor = type
  for (let depth = 0; depth < 8; depth++) {
    const reg = getRegistry(cursor) as { extends?: string } | null
    const parent = reg?.extends
    if (!parent || seen.has(parent)) break
    seen.add(parent)
    const parentContent = getContent(parent) as ContentTemplate | null
    if (parentContent) return parentContent
    cursor = parent
  }

  // Floor: synthesize from registry data. Lazy-require avoids circular import
  // with content-defaults → static-config.
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Breaks cycle with content-defaults; ESM dynamic import would force this fn async.
  const { defaultContentFor } = require('./content-defaults') as typeof import('./content-defaults')
  return defaultContentFor(type)
}

export interface RegistryType {
  id: string
  pages: {
    homepage: {
      sections: string[]
      requiredSections: string[]
    }
    services?: {
      sections: string[]
      requiredSections: string[]
    }
    gallery?: {
      sections: string[]
      requiredSections: string[]
    }
    team?: {
      sections: string[]
      requiredSections: string[]
    }
    contact?: {
      sections: string[]
      requiredSections: string[]
    }
  }
  features: Record<string, { enabled: boolean }>
  nav: {
    items: string[]
    cta?: { text: string; action: string }
  }
  hero: {
    headlineTemplate: string
    subheadlineTemplate: string
    ctaPrimary: { text: string }
    ctaSecondary?: { text: string }
  }
  seo: {
    titleTemplate: string
    descriptionTemplate: string
  }
}

export interface ContentTemplate {
  hero: {
    headline: string
    subheadline: string
    ctaPrimary: string
    ctaSecondary?: string
  }
  servicesPage: {
    title: string
    categories?: Array<{
      key: string
      title: string
      description?: string
      defaultServices?: Array<{
        name: string
        price?: string | null
        priceFrom?: string | null
        duration?: number
        description?: string
      }>
    }>
  }
  teamPage?: { title: string }
  galleryPage?: { title: string; subtitle?: string }
  contactPage?: { title: string }
  faq?: Array<{ q: string; a: string }>
  productCatalogPage?: {
    title: string
    subtitle?: string
    orderButtonText?: string
    orderMessageTemplate?: string
    categories?: string[]
  }
  ctaBanner?: { title: string; buttonText: string }
  footer: {
    quickLinks: string[]
    copyright: string
  }
  whatsapp?: { defaultMessage: string }
  savingsCalculator?: {
    title?: string
    subtitle?: string
    disclaimer?: string
    tierOptions?: Array<{ key: string; label: string; monthlyGs: number }>
    inputs?: Record<string, string>
    outputs?: Record<string, string>
  }
}

// Map registry section names to our component types
export const SECTION_MAP: Record<string, SectionType> = {
  header: 'header',
  hero: 'hero',
  servicesPreview: 'services',
  serviceMenu: 'services',
  services: 'services',
  booking: 'booking',
  onlineBooking: 'booking',
  portfolio: 'portfolio',
  portfolioGallery: 'portfolio',
  beforeAfter: 'beforeAfter',
  coverUps: 'beforeAfter',
  classSchedule: 'classSchedule',
  schedule: 'classSchedule',
  membershipPlans: 'membershipPlans',
  memberships: 'membershipPlans',
  plans: 'membershipPlans',
  roomBooking: 'roomBooking',
  rooms: 'roomBooking',
  eventVenues: 'eventVenues',
  venues: 'eventVenues',
  quoteForm: 'quoteForm',
  presupuesto: 'quoteForm',
  consultationForm: 'quoteForm',
  emergencyIndicator: 'emergencyIndicator',
  emergency: 'emergencyIndicator',
  googleReviews: 'googleReviews',
  reviewsWidget: 'googleReviews',
  packagesGiftcards: 'packagesGiftcards',
  packages: 'packagesGiftcards',
  giftCards: 'packagesGiftcards',
  branches: 'branches',
  sucursales: 'branches',
  locations: 'branches',
  galleryPreview: 'gallery',
  gallery: 'gallery',
  team: 'team',
  teamProfiles: 'team',
  testimonial: 'testimonials',
  testimonials: 'testimonials',
  productCatalog: 'productCatalog',
  featuredProducts: 'featuredProducts',
  'featured-products': 'featuredProducts',
  commerceCatalog: 'commerceCatalog',
  'commerce-catalog': 'commerceCatalog',
  ageGate: 'ageGate',
  'age-gate': 'ageGate',
  locationBlock: 'contact',
  contactSplit: 'contact',
  contact: 'contact',
  faq: 'faq',
  ctaBanner: 'ctaBanner',
  footer: 'footer',
  whatsappFloat: 'whatsappFloat',
  savingsCalculator: 'savingsCalculator',
  // Egg farm sections
  stockIndicator: 'stockIndicator',
  deliveryCalculator: 'deliveryCalculator',
  recipes: 'recipes',
  reviews: 'reviews',
  subscription: 'subscription',
  referral: 'referral',
  priceList: 'priceList',
  preorder: 'preorder',
}

/**
 * Compose a full page for a business from its type registry and data.
 * Supports multiple page types: homepage, services, gallery, team, contact.
 */
export async function composePageForType(
  business: BusinessData,
  _pageType: PageType
): Promise<ComposedPage> {
  const start = performance.now()
  const baseContext = {
    action: 'composePageForType',
    businessType: business.type,
    businessSlug: business.slug,
    pageType: _pageType,
  }

  const registry = loadRegistry(business.type)
  let content = loadContent(business.type)

  // Merge DB-stored content overrides → static content. Tenant edits
  // saved via the content editor (businesses.data_json.content) take
  // precedence over the type-level default templates.
  if (content && business.contentOverrides) {
    content = deepMergeContent(content, business.contentOverrides)
  }

  if (!registry || !content) {
    logger.error('Composition failed — missing registry or content', {
      ...baseContext,
      registryLoaded: !!registry,
      contentLoaded: !!content,
    })
    throw new Error(
      `[Compose] Failed to load registry or content for business type: ${business.type}. ` +
      `Registry: ${registry ? 'OK' : 'MISSING'}, Content: ${content ? 'OK' : 'MISSING'}`
    )
  }

    logger.debug('Composition: registry + content loaded', {
    ...baseContext,
    registrySections: registry.pages[_pageType]?.sections.length ?? 0,
  })

  const templateData: Record<string, string | number> = {
    businessName: business.name,
    city: business.city,
    neighborhood: business.neighborhood || '',
    year: new Date().getFullYear(),
  }

  const navItems = registry.nav.items.map((label) => ({
    label,
    href: buildPageHref(business.slug, label),
  }))

  const sections: ComposedSection[] = []
  let order = 0

    const pageConfig = registry.pages[_pageType]
  if (!pageConfig) {
    logger.warn('No registry config for page type, falling back to homepage', {
      action: 'composePageForType',
      businessType: business.type,
      businessSlug: business.slug,
      requestedPageType: _pageType,
    })
    return composePage(business)
  }

  const registrySections = pageConfig.sections

  for (const sectionKey of registrySections) {
    const type = SECTION_MAP[sectionKey]
    if (!type) continue

    if (sections.some((s) => s.type === type)) continue

    const sectionData = buildSectionData(type, business, content, templateData, navItems, registry, _pageType)
    if (sectionData) {
      sections.push({ type, order: order++, data: sectionData })
    }
  }

  if (
    business.whatsapp &&
    registry.features?.whatsappFloat?.enabled &&
    !sections.some((s) => s.type === 'whatsappFloat')
  ) {
    const msg = content.whatsapp?.defaultMessage || 'Hola! Quisiera mas informacion'
    sections.push({
      type: 'whatsappFloat',
      order: order++,
      data: {
        phone: business.whatsapp,
        message: fillTemplate(msg, templateData),
      },
    })
  }

  const title = fillTemplate(registry.seo.titleTemplate, templateData)
  const description = fillTemplate(registry.seo.descriptionTemplate, templateData)

  const { resolveTokens } = await import('@/lib/tokens/resolver')
  const tokens = resolveTokens(business.type)

  const duration = Math.round(performance.now() - start)
  logger.info('Composition completed', {
    ...baseContext,
    sectionCount: sections.length,
    durationMs: duration,
  })
  metrics.timing('compose.duration', duration, {
    businessType: business.type,
    pageType: _pageType,
  })

  return {
    business,
    sections,
    meta: { title, description },
    theme: {
      cssString: tokens.cssString,
      googleFontsUrl: tokens.googleFontsUrl,
      isDark: tokens.theme === 'dark',
    },
  }
}

export async function composePage(business: BusinessData): Promise<ComposedPage> {
  return composePageForType(business, 'homepage')
}

/**
 * Dispatch a section's data-build to its registered builder. Each builder
 * lives in `section-builders.ts` — see that file to add/edit a section.
 *
 * Kept here (re-exporting from a one-line dispatcher) to preserve the old
 * signature callers and tests expect.
 */
export function buildSectionData(
  type: SectionType,
  business: BusinessData,
  content: ContentTemplate,
  templateData: Record<string, string | number>,
  navItems: Array<{ label: string; href: string }>,
  registry: RegistryType,
  pageType?: string
): Record<string, unknown> | null {
  const builder = SECTION_BUILDERS[type]
  if (!builder) return null
  return builder({ business, content, templateData, navItems, registry, pageType })
}

function deepMergeContent(base: ContentTemplate, overrides: Record<string, unknown>): ContentTemplate {
  const merged = { ...base }
  for (const [key, value] of Object.entries(overrides)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && typeof merged[key] === 'object') {
      merged[key] = { ...merged[key], ...value }
    } else if (value !== undefined && value !== null) {
      merged[key] = value as never
    }
  }
  return merged
}
