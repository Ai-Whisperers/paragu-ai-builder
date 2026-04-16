/**
 * Section Registry — the single source of truth for every section kind.
 *
 * Each entry binds together:
 *   - the canonical section key used throughout the engine
 *   - which registry section names alias to it
 *   - the component that renders it
 *   - the builder that turns `BusinessData + ContentTemplate + RegistryType`
 *     into that component's props
 *
 * The previous design split these responsibilities across `compose.ts`
 * (SECTION_MAP + giant switch) and `renderer.tsx` (SECTION_COMPONENTS),
 * which had to be kept in sync by hand.
 */

import type { ComponentType } from 'react'
import type { RegistryType, ContentTemplate } from '@/lib/content/schemas'
import type { BusinessData } from './business'
import { fillTemplate } from '@/lib/utils'
import { generatePlaceholderGallery } from './placeholders'

import { HeaderSection } from '@/components/sections/header-section'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ProductCatalogSection } from '@/components/sections/product-catalog-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { TeamSection } from '@/components/sections/team-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ContactSection } from '@/components/sections/contact-section'
import { FAQSection } from '@/components/sections/faq-section'
import { CTABannerSection } from '@/components/sections/cta-banner-section'
import { FooterSection } from '@/components/sections/footer-section'
import { WhatsAppFloat } from '@/components/sections/whatsapp-float'

export type SectionType =
  | 'header'
  | 'hero'
  | 'services'
  | 'productCatalog'
  | 'gallery'
  | 'team'
  | 'testimonials'
  | 'contact'
  | 'faq'
  | 'ctaBanner'
  | 'footer'
  | 'whatsappFloat'

export interface NavItem {
  label: string
  href: string
}

export interface SectionBuildContext {
  business: BusinessData
  content: ContentTemplate
  registry: RegistryType
  templateData: Record<string, string | number>
  navItems: NavItem[]
}

export interface SectionDefinition<Props> {
  type: SectionType
  component: ComponentType<Props>
  /** Return `null` to skip this section entirely. */
  build(ctx: SectionBuildContext): Props | null
}

export interface ComposedSection {
  type: SectionType
  order: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous prop bags
  data: any
}

// Helper — typed shortcut so each entry keeps its per-section Props type.
function def<P>(d: SectionDefinition<P>): SectionDefinition<P> {
  return d
}

function showPricesFrom(registry: RegistryType): boolean {
  const flag = registry.features?.pricingDisplay?.enabled
  return typeof flag === 'boolean' ? flag : true
}

// ─── Section definitions ───────────────────────────────────────────────
const header = def({
  type: 'header',
  component: HeaderSection,
  build: ({ business, registry, navItems }) => ({
    businessName: business.name,
    navItems,
    ctaText: registry.nav.cta?.text,
    ctaHref: '#contacto',
  }),
})

const hero = def({
  type: 'hero',
  component: HeroSection,
  build: ({ business, content, templateData }) => ({
    headline: fillTemplate(content.hero.headline, templateData),
    subheadline: fillTemplate(content.hero.subheadline, templateData),
    ctaPrimaryText: content.hero.ctaPrimary,
    ctaPrimaryHref: '#contacto',
    ctaSecondaryText: content.hero.ctaSecondary,
    ctaSecondaryHref: '#servicios',
    backgroundImage: business.heroImage,
  }),
})

const services = def({
  type: 'services',
  component: ServicesSection,
  build: ({ business, content, registry }) => {
    const servicesPage = content.servicesPage
    let services = business.services ?? []
    if (services.length === 0 && servicesPage?.categories) {
      services = servicesPage.categories.flatMap((cat) =>
        (cat.defaultServices ?? []).map((s) => ({
          name: s.name,
          description: s.description,
          price: s.price ?? undefined,
          priceFrom: s.priceFrom ?? undefined,
          duration: s.duration,
          category: cat.title,
        }))
      )
    }
    // Nothing to show if we have neither business data nor a template.
    if (services.length === 0 && !servicesPage) return null
    return {
      title: servicesPage?.title ?? 'Servicios',
      services,
      showPrices: showPricesFrom(registry),
      showDuration: true,
    }
  },
})

const gallery = def({
  type: 'gallery',
  component: GallerySection,
  build: ({ business, content }) => {
    const images =
      business.gallery && business.gallery.length > 0
        ? business.gallery
        : generatePlaceholderGallery(business.type, business.name)
    return {
      title: content.galleryPage?.title ?? 'Galeria',
      subtitle: content.galleryPage?.subtitle,
      images,
      columns: 3 as const,
    }
  },
})

const team = def({
  type: 'team',
  component: TeamSection,
  build: ({ business, content }) => {
    if (!business.team || business.team.length === 0) return null
    return {
      title: content.teamPage?.title ?? 'Nuestro Equipo',
      members: business.team,
    }
  },
})

const testimonials = def({
  type: 'testimonials',
  component: TestimonialsSection,
  build: ({ business }) => {
    if (!business.testimonials || business.testimonials.length === 0) return null
    return {
      title: 'Lo Que Dicen Nuestros Clientes',
      testimonials: business.testimonials,
    }
  },
})

const contact = def({
  type: 'contact',
  component: ContactSection,
  build: ({ business, content }) => ({
    title: content.contactPage?.title ?? 'Contacto',
    address: business.address,
    neighborhood: business.neighborhood,
    city: business.city,
    phone: business.phone,
    email: business.email,
    whatsapp: business.whatsapp,
    googleMapsUrl: business.googleMapsUrl,
    hours: business.hours,
  }),
})

const productCatalog = def({
  type: 'productCatalog',
  component: ProductCatalogSection,
  build: ({ business, content, registry }) => {
    const products = business.products ?? []
    if (products.length === 0) return null
    const cat = content.productCatalogPage
    return {
      title: cat?.title ?? 'Catalogo',
      subtitle: cat?.subtitle,
      products,
      categories: cat?.categories,
      showPrices: showPricesFrom(registry),
      whatsappPhone: business.whatsapp,
      orderButtonText: cat?.orderButtonText ?? 'Consultar por WhatsApp',
      orderMessageTemplate:
        cat?.orderMessageTemplate ??
        'Hola! Me interesa: {{productName}} (${{productPrice}}). Quisiera mas informacion.',
      emailAddress: business.email,
    }
  },
})

const faq = def({
  type: 'faq',
  component: FAQSection,
  build: ({ content }) => {
    if (!content.faq || content.faq.length === 0) return null
    return { title: 'Preguntas Frecuentes', items: content.faq }
  },
})

const ctaBanner = def({
  type: 'ctaBanner',
  component: CTABannerSection,
  build: ({ content, templateData }) => {
    if (!content.ctaBanner) return null
    return {
      title: fillTemplate(content.ctaBanner.title, templateData),
      buttonText: content.ctaBanner.buttonText,
      buttonHref: '#contacto',
    }
  },
})

const footer = def({
  type: 'footer',
  component: FooterSection,
  build: ({ business, navItems }) => ({
    businessName: business.name,
    phone: business.phone,
    email: business.email,
    address: business.address,
    city: business.city,
    instagram: business.instagram,
    facebook: business.facebook,
    whatsapp: business.whatsapp,
    navLinks: navItems,
  }),
})

const whatsappFloat = def({
  type: 'whatsappFloat',
  component: WhatsAppFloat,
  // Added explicitly by the composer — not a body section.
  build: () => null,
})

export const SECTION_DEFINITIONS: Record<SectionType, SectionDefinition<unknown>> = {
  header: header as SectionDefinition<unknown>,
  hero: hero as SectionDefinition<unknown>,
  services: services as SectionDefinition<unknown>,
  productCatalog: productCatalog as SectionDefinition<unknown>,
  gallery: gallery as SectionDefinition<unknown>,
  team: team as SectionDefinition<unknown>,
  testimonials: testimonials as SectionDefinition<unknown>,
  contact: contact as SectionDefinition<unknown>,
  faq: faq as SectionDefinition<unknown>,
  ctaBanner: ctaBanner as SectionDefinition<unknown>,
  footer: footer as SectionDefinition<unknown>,
  whatsappFloat: whatsappFloat as SectionDefinition<unknown>,
}

// Aliases in registry JSON → canonical SectionType.
export const SECTION_KEY_ALIASES: Record<string, SectionType> = {
  header: 'header',
  hero: 'hero',
  servicesPreview: 'services',
  serviceMenu: 'services',
  services: 'services',
  galleryPreview: 'gallery',
  portfolioGallery: 'gallery',
  gallery: 'gallery',
  team: 'team',
  teamProfiles: 'team',
  testimonial: 'testimonials',
  testimonials: 'testimonials',
  productCatalog: 'productCatalog',
  locationBlock: 'contact',
  contactSplit: 'contact',
  contact: 'contact',
  faq: 'faq',
  ctaBanner: 'ctaBanner',
  footer: 'footer',
  whatsappFloat: 'whatsappFloat',
}

export function resolveSectionKey(key: string): SectionType | null {
  return SECTION_KEY_ALIASES[key] ?? null
}
