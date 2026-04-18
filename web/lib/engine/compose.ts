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
import { readFileSync } from 'fs'
import { resolve } from 'path'

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

function loadJson<T>(relativePath: string): T | null {
  try {
    const fullPath = resolve(process.cwd(), '..', relativePath)
    const content = readFileSync(fullPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`[Compose] Failed to load JSON from ${relativePath}:`, error)
    return null
  }
}

interface RegistryType {
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
const SECTION_MAP: Record<string, SectionType> = {
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
  galleryPreview: 'gallery',
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
  savingsCalculator: 'savingsCalculator',
}

/**
 * Compose a full page for a business from its type registry and data.
 * Supports multiple page types: homepage, services, gallery, team, contact.
 */
export async function composePageForType(
  business: BusinessData,
  pageType: PageType
): Promise<ComposedPage> {
  const registry = loadJson<RegistryType>(`src/registry/${business.type}.type.json`)
  const content = loadJson<ContentTemplate>(`src/content/${business.type}.content.json`)

  if (!registry || !content) {
    throw new Error(
      `[Compose] Failed to load registry or content for business type: ${business.type}. ` +
      `Registry: ${registry ? 'OK' : 'MISSING'}, Content: ${content ? 'OK' : 'MISSING'}`
    )
  }

  const templateData: Record<string, string | number> = {
    businessName: business.name,
    city: business.city,
    neighborhood: business.neighborhood || '',
    year: new Date().getFullYear(),
  }

  const navItems = registry.nav.items.map((label) => ({
    label,
    href: `/${business.slug}/${label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`,
  }))

  const sections: ComposedSection[] = []
  let order = 0

  const pageConfig = registry.pages[pageType]
  if (!pageConfig) {
    console.warn(`[Compose] No config for page type: ${pageType}, falling back to homepage`)
    return composePage(business)
  }

  const registrySections = pageConfig.sections

  for (const sectionKey of registrySections) {
    const type = SECTION_MAP[sectionKey]
    if (!type) continue

    if (sections.some((s) => s.type === type)) continue

    const sectionData = buildSectionData(type, business, content, templateData, navItems, registry, pageType)
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

function buildSectionData(
  type: SectionType,
  business: BusinessData,
  content: ContentTemplate,
  templateData: Record<string, string | number>,
  navItems: Array<{ label: string; href: string }>,
  registry: RegistryType,
  pageType?: string
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
      const heroContent = content as { hero?: { headline: string; subheadline: string; ctaPrimary: string; ctaSecondary?: string } }
      return {
        headline: fillTemplate(heroContent?.hero?.headline || '', templateData),
        subheadline: fillTemplate(heroContent?.hero?.subheadline || '', templateData),
        ctaPrimaryText: heroContent?.hero?.ctaPrimary || 'Reservar',
        ctaPrimaryHref: '#contacto',
        ctaSecondaryText: heroContent?.hero?.ctaSecondary,
        ctaSecondaryHref: '#servicios',
        backgroundImage: business.heroImage,
      }

    case 'services': {
      type ServicesContentType = {
        servicesPage?: {
          title?: string
          categories?: Array<{
            title: string
            defaultServices?: Array<{
              name: string
              description?: string
              price?: string | null
              priceFrom?: string | null
              duration?: number
            }>
          }>
        }
      }
      const servicesContent = (content as ServicesContentType).servicesPage
      let services = business.services || []
      if (services.length === 0 && servicesContent?.categories) {
        services = servicesContent.categories.flatMap(
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
        title: servicesContent?.title || 'Nuestros Servicios',
        services,
        showPrices: registry.features?.pricingDisplay?.enabled ?? true,
        showDuration: true,
      }
    }

    case 'booking': {
      if (!registry.features?.onlineBooking?.enabled) return null
      const services = business.services || []
      if (services.length === 0 && content.servicesPage.categories) {
        services.push(...content.servicesPage.categories.flatMap(
          (cat) =>
            cat.defaultServices?.map((s) => ({
              name: s.name,
              description: s.description,
              price: s.price || undefined,
              priceFrom: s.priceFrom || undefined,
              duration: s.duration,
              category: cat.title,
            })) || []
        ))
      }
      const hours = business.hours
      const weekdayHours = hours?.['Lunes - Viernes'] || '08:00 - 20:00'
      const [start, end] = weekdayHours.split(' - ')
      return {
        title: 'Reserva Tu Cita',
        subtitle: 'Selecciona el servicio, fecha y hora que más te convenga',
        services,
        staff: business.team || [],
        workingHours: { start: start?.trim() || '08:00', end: end?.trim() || '20:00' },
        whatsappPhone: business.whatsapp,
      }
    }

    case 'portfolio': {
      if (!registry.features?.portfolio?.enabled) return null
      const items = (business.gallery || []).map(img => ({
        title: img.alt || 'Proyecto',
        image: img.src,
        category: img.category
      }))
      const portfolioConfig = registry.features?.portfolio as { enabled: boolean; categories?: string[] } | undefined
      const categories = portfolioConfig?.categories
      return {
        title: content.galleryPage?.title || 'Nuestro Portafolio',
        subtitle: content.galleryPage?.subtitle,
        items,
        categories,
        columns: 3,
      }
    }

case 'beforeAfter': {
      if (!registry.features?.beforeAfter?.enabled) return null
      const baConfig = registry.features?.beforeAfter as { enabled: boolean; label?: string } | undefined
      return {
        title: baConfig?.label || 'Antes y Después',
        subtitle: 'Transformaciones reales de nuestros clientes',
        items: [],
      }
    }

    case 'classSchedule': {
      if (!registry.features?.classSchedule?.enabled) return null
      const scheduleContent = content as { classSchedule?: { schedule?: Array<{ day: string; classes: Array<{ time: string; name: string; instructor?: string; duration?: number }> }> } }
      const schedule = business.classSchedule || scheduleContent?.classSchedule?.schedule || []
      return {
        title: 'Horario de Clases',
        subtitle: 'Consulta nuestros horarios y reserva tu clase',
        schedule,
      }
    }

    case 'membershipPlans': {
      if (!registry.features?.packageBuilder?.enabled) return null
      const plansContent = content as { membershipPlans?: { plans?: Array<{ name: string; price: string; period?: string; description?: string; features: string[]; popular?: boolean }> } }
      const plans = business.membershipPlans || plansContent?.membershipPlans?.plans || []
      return {
        title: 'Planes de Membresía',
        subtitle: 'Elige el plan que mejor se adapte a tus necesidades',
        plans,
        whatsappPhone: business.whatsapp,
      }
    }

    case 'roomBooking': {
      return {
        title: 'Reserva de Salas',
        subtitle: 'Espacios equipados para tus reuniones y eventos',
        rooms: [],
        whatsappPhone: business.whatsapp,
      }
    }

    case 'eventVenues': {
      return {
        title: 'Espacios para Eventos',
        subtitle: 'Celebra tus momentos especiales en nuestros espacios',
        venues: [],
        whatsappPhone: business.whatsapp,
      }
    }

    case 'quoteForm': {
      const categories = (registry as { serviceCategories?: string[] }).serviceCategories || []
      return {
        title: 'Solicita un Presupuesto',
        subtitle: 'Te respondemos en menos de 24 horas',
        services: categories,
        whatsappPhone: business.whatsapp,
      }
    }

    case 'emergencyIndicator': {
      if (!business.phone) return null
      return {
        type: 'emergencia',
        phone: business.phone,
        description: 'Servicio de emergencia disponible',
      }
    }

    case 'gallery': {
      const galleryContent = content as { galleryPage?: { title?: string; subtitle?: string } }
      const galleryImages = business.gallery && business.gallery.length > 0
        ? business.gallery
        : generatePlaceholderGallery(business.type, business.name)
      return {
        title: galleryContent?.galleryPage?.title || 'Galeria',
        subtitle: galleryContent?.galleryPage?.subtitle,
        images: galleryImages,
        columns: 3,
      }
    }

    case 'team':
      const teamContent = (content as { teamPage?: { title?: string } }).teamPage
      if (!business.team || business.team.length === 0) return null
      return {
        title: teamContent?.title || 'Nuestro Equipo',
        members: business.team,
      }

    case 'testimonials':
      if (!business.testimonials || business.testimonials.length === 0) return null
      return {
        title: 'Lo Que Dicen Nuestros Clientes',
        testimonials: business.testimonials,
      }

    case 'contact':
      const contactContent = (content as { contactPage?: { title?: string } }).contactPage
      return {
        title: contactContent?.title || 'Contacto',
        address: business.address,
        neighborhood: business.neighborhood,
        city: business.city,
        phone: business.phone,
        email: business.email,
        whatsapp: business.whatsapp,
        googleMapsUrl: business.googleMapsUrl,
        hours: business.hours,
      }

    case 'productCatalog': {
      const products = business.products || []
      if (products.length === 0) return null
      const catalogContent = (content as { productCatalogPage?: { title?: string; subtitle?: string; categories?: string[]; orderButtonText?: string; orderMessageTemplate?: string } }).productCatalogPage
      return {
        title: catalogContent?.title || 'Catalogo',
        subtitle: catalogContent?.subtitle,
        products,
        categories: catalogContent?.categories,
        showPrices: registry.features?.pricingDisplay?.enabled ?? true,
        whatsappPhone: business.whatsapp,
        orderButtonText: catalogContent?.orderButtonText || 'Consultar por WhatsApp',
        orderMessageTemplate: catalogContent?.orderMessageTemplate ||
          'Hola! Me interesa: {{productName}} (${{productPrice}}). Quisiera mas informacion.',
        emailAddress: business.email,
      }
    }

    case 'faq':
      const faqContent = content as { faq?: Array<{ q: string; a: string }> }
      if (!faqContent?.faq || faqContent.faq.length === 0) return null
      return {
        title: 'Preguntas Frecuentes',
        items: faqContent.faq,
      }

    case 'savingsCalculator': {
      if (!registry.features?.savingsCalculator?.enabled) return null
      const calc = content.savingsCalculator
      return {
        title: calc?.title,
        subtitle: calc?.subtitle,
        disclaimer: calc?.disclaimer,
        tierOptions: calc?.tierOptions,
        inputLabels: calc?.inputs,
        outputLabels: calc?.outputs,
        whatsappPhone: business.whatsapp,
      }
    }

    case 'ctaBanner':
      const ctaContent = content as { ctaBanner?: { title: string; buttonText: string } }
      if (!ctaContent?.ctaBanner) return null
      return {
        title: fillTemplate(ctaContent.ctaBanner.title, templateData),
        buttonText: ctaContent.ctaBanner.buttonText,
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
    diseno_grafico: { colors: ['#c4788b', '#d4af37', '#e8b4c8'], categories: ['Portadas', 'Premade', 'Mockups', 'Branding'] },
    meal_prep: { colors: ['#3a6b4a', '#c2663a', '#d4a15a'], categories: ['Cortes de Carne', 'Mise en Place', 'Freezer Meals', 'Mercado'] },
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
