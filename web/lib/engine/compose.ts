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
import { fillTemplate } from '@/lib/utils'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Section types matching our component library
export type SectionType =
  | 'header'
  | 'hero'
  | 'services'
  | 'gallery'
  | 'team'
  | 'testimonials'
  | 'contact'
  | 'faq'
  | 'ctaBanner'
  | 'footer'
  | 'whatsappFloat'

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
  }>
  heroImage?: string
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

function loadJson<T>(relativePath: string): T {
  const fullPath = resolve(process.cwd(), '..', relativePath)
  const content = readFileSync(fullPath, 'utf-8')
  return JSON.parse(content)
}

interface RegistryType {
  id: string
  pages: {
    homepage: {
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

interface ContentTemplate {
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
  ctaBanner?: { title: string; buttonText: string }
  footer: {
    quickLinks: string[]
    copyright: string
  }
  whatsapp?: { defaultMessage: string }
}

// Map registry section names to our component types
const SECTION_MAP: Record<string, SectionType> = {
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
  locationBlock: 'contact',
  contactSplit: 'contact',
  contact: 'contact',
  faq: 'faq',
  ctaBanner: 'ctaBanner',
  footer: 'footer',
  whatsappFloat: 'whatsappFloat',
}

/**
 * Compose a full page for a business from its type registry and data.
 */
export async function composePage(business: BusinessData): Promise<ComposedPage> {
  const registry = loadJson<RegistryType>(`src/registry/${business.type}.type.json`)
  const content = loadJson<ContentTemplate>(`src/content/${business.type}.content.json`)

  const templateData: Record<string, string | number> = {
    businessName: business.name,
    city: business.city,
    neighborhood: business.neighborhood || '',
    year: new Date().getFullYear(),
  }

  // Build nav items
  const navItems = registry.nav.items.map((label) => ({
    label,
    href: `#${label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`,
  }))

  // Determine homepage sections from registry
  const registrySections = registry.pages.homepage.sections
  const sections: ComposedSection[] = []
  let order = 0

  for (const sectionKey of registrySections) {
    const type = SECTION_MAP[sectionKey]
    if (!type) continue

    // Skip duplicates
    if (sections.some((s) => s.type === type)) continue

    const sectionData = buildSectionData(type, business, content, templateData, navItems, registry)
    if (sectionData) {
      sections.push({ type, order: order++, data: sectionData })
    }
  }

  // Always add whatsappFloat if enabled and business has whatsapp
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

  // SEO metadata
  const title = fillTemplate(registry.seo.titleTemplate, templateData)
  const description = fillTemplate(registry.seo.descriptionTemplate, templateData)

  // Resolve tokens (dynamic import to avoid circular dependency)
  const { resolveTokens } = await import('@/lib/tokens/resolver')
  const tokens = resolveTokens(business.type)

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

function buildSectionData(
  type: SectionType,
  business: BusinessData,
  content: ContentTemplate,
  templateData: Record<string, string | number>,
  navItems: Array<{ label: string; href: string }>,
  registry: RegistryType
): Record<string, unknown> | null {
  switch (type) {
    case 'header':
      return {
        businessName: business.name,
        navItems,
        ctaText: registry.nav.cta?.text,
        ctaHref: '#contacto',
      }

    case 'hero':
      return {
        headline: fillTemplate(content.hero.headline, templateData),
        subheadline: fillTemplate(content.hero.subheadline, templateData),
        ctaPrimaryText: content.hero.ctaPrimary,
        ctaPrimaryHref: '#contacto',
        ctaSecondaryText: content.hero.ctaSecondary,
        ctaSecondaryHref: '#servicios',
        backgroundImage: business.heroImage,
      }

    case 'services': {
      // Use business-provided services, or fall back to content template defaults
      let services = business.services || []
      if (services.length === 0 && content.servicesPage.categories) {
        services = content.servicesPage.categories.flatMap(
          (cat) =>
            cat.defaultServices?.map((s) => ({
              name: s.name,
              description: s.description,
              price: s.price || undefined,
              priceFrom: s.priceFrom || undefined,
              duration: s.duration,
              category: cat.title,
            })) || []
        )
      }
      return {
        title: content.servicesPage.title,
        services,
        showPrices: registry.features?.pricingDisplay?.enabled ?? true,
        showDuration: true,
      }
    }

    case 'gallery': {
      const galleryImages = business.gallery && business.gallery.length > 0
        ? business.gallery
        : generatePlaceholderGallery(business.type, business.name)
      return {
        title: content.galleryPage?.title || 'Galeria',
        subtitle: content.galleryPage?.subtitle,
        images: galleryImages,
        columns: 3,
      }
    }

    case 'team':
      if (!business.team || business.team.length === 0) return null
      return {
        title: content.teamPage?.title || 'Nuestro Equipo',
        members: business.team,
      }

    case 'testimonials':
      if (!business.testimonials || business.testimonials.length === 0) return null
      return {
        title: 'Lo Que Dicen Nuestros Clientes',
        testimonials: business.testimonials,
      }

    case 'contact':
      return {
        title: content.contactPage?.title || 'Contacto',
        address: business.address,
        neighborhood: business.neighborhood,
        city: business.city,
        phone: business.phone,
        email: business.email,
        whatsapp: business.whatsapp,
        googleMapsUrl: business.googleMapsUrl,
        hours: business.hours,
      }

    case 'faq':
      if (!content.faq || content.faq.length === 0) return null
      return {
        title: 'Preguntas Frecuentes',
        items: content.faq,
      }

    case 'ctaBanner':
      if (!content.ctaBanner) return null
      return {
        title: fillTemplate(content.ctaBanner.title, templateData),
        buttonText: content.ctaBanner.buttonText,
        buttonHref: '#contacto',
      }

    case 'footer':
      return {
        businessName: business.name,
        phone: business.phone,
        email: business.email,
        address: business.address,
        city: business.city,
        instagram: business.instagram,
        facebook: business.facebook,
        whatsapp: business.whatsapp,
        navLinks: navItems,
      }

    case 'whatsappFloat':
      return null // Handled separately

    default:
      return null
  }
}

/**
 * Generate placeholder gallery items when a business has no photos.
 * Uses SVG data URIs with gradients themed to the business type.
 */
function generatePlaceholderGallery(
  businessType: string,
  businessName: string,
): Array<{ src: string; alt: string; category?: string }> {
  const PLACEHOLDER_THEMES: Record<string, { colors: string[]; categories: string[] }> = {
    peluqueria: { colors: ['#b76e79', '#d4a574', '#8b6f5e'], categories: ['Cortes', 'Color', 'Peinados', 'Tratamientos'] },
    salon_belleza: { colors: ['#a67c52', '#d4b88c', '#8b6f5e'], categories: ['Cabello', 'Unas', 'Maquillaje', 'Tratamientos'] },
    gimnasio: { colors: ['#e74c3c', '#f39c12', '#2ecc71'], categories: ['Sala', 'Clases', 'Equipos', 'Resultados'] },
    spa: { colors: ['#5b8a72', '#8fbc8f', '#d4a574'], categories: ['Ambiente', 'Tratamientos', 'Relajacion'] },
    unas: { colors: ['#e91e63', '#ff6090', '#c9a96e'], categories: ['Gel', 'Acrilicas', 'Nail Art', 'Pedicura'] },
    tatuajes: { colors: ['#1a1a1a', '#c0392b', '#7f8c8d'], categories: ['Tradicional', 'Realismo', 'Geometrico'] },
    barberia: { colors: ['#2c3e50', '#c0392b', '#d4a574'], categories: ['Cortes', 'Barba', 'Estilo'] },
    estetica: { colors: ['#9b59b6', '#e8d5f5', '#3498db'], categories: ['Facial', 'Corporal', 'Resultados'] },
    maquillaje: { colors: ['#e91e63', '#9b59b6', '#f39c12'], categories: ['Social', 'Novias', 'Artistico'] },
    depilacion: { colors: ['#3498db', '#1abc9c', '#e8d5f5'], categories: ['Laser', 'Cera', 'Resultados'] },
    pestanas: { colors: ['#c4788b', '#d4a574', '#1a1a1a'], categories: ['Clasicas', 'Volumen', 'Cejas'] },
  }

  const theme = PLACEHOLDER_THEMES[businessType] || PLACEHOLDER_THEMES.peluqueria
  const items: Array<{ src: string; alt: string; category?: string }> = []

  for (let i = 0; i < 6; i++) {
    const color1 = theme.colors[i % theme.colors.length]
    const color2 = theme.colors[(i + 1) % theme.colors.length]
    const angle = 135 + (i * 30)
    const category = theme.categories[i % theme.categories.length]

    // SVG placeholder with gradient + business initial
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs><linearGradient id="g${i}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient></defs>
      <rect width="600" height="600" fill="url(#g${i})"/>
      <text x="300" y="320" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-size="200" font-family="serif">${businessName.charAt(0)}</text>
    </svg>`

    const encoded = Buffer.from(svg).toString('base64')
    items.push({
      src: `data:image/svg+xml;base64,${encoded}`,
      alt: `${category} - ${businessName}`,
      category,
    })
  }

  return items
}
