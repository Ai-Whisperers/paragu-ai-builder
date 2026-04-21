/**
 * Per-section builder registry.
 *
 * Each entry returns the `data` object that flows into the corresponding
 * React component for a section. Returning `null` means "skip this section
 * for this business" (e.g. feature disabled, missing content). Adding a new
 * section is a local change: define one builder below and add it to
 * SECTION_BUILDERS — no need to extend a mega-switch.
 *
 * Contract: builders are pure functions of their context. No I/O, no logging.
 * They must be safe to call during SSG where cookies/requests aren't available.
 */

import { fillTemplate } from '@/lib/utils'
import type {
  BusinessData,
  ContentTemplate,
  RegistryType,
  SectionType,
} from './compose'

export interface SectionBuilderContext {
  business: BusinessData
  content: ContentTemplate
  templateData: Record<string, string | number>
  navItems: Array<{ label: string; href: string }>
  registry: RegistryType
  pageType?: string
}

export type SectionBuilder = (ctx: SectionBuilderContext) => Record<string, unknown> | null

// ---------- builders -------------------------------------------------------

const buildHeader: SectionBuilder = ({ business, navItems, registry }) => ({
  businessName: business.name,
  navItems,
  ctaText: registry.nav.cta?.text,
  ctaHref: '#contacto',
})

const buildHero: SectionBuilder = ({ business, content, templateData }) => {
  const hero = (content as { hero?: { headline: string; subheadline: string; ctaPrimary: string; ctaSecondary?: string } }).hero
  // Admin content editor wins over registry defaults when set.
  const override = business.contentOverrides?.hero
  return {
    headline: override?.headline || fillTemplate(hero?.headline || '', templateData),
    subheadline: override?.subheadline || fillTemplate(hero?.subheadline || '', templateData),
    ctaPrimaryText: override?.ctaPrimaryText || hero?.ctaPrimary || 'Reservar',
    ctaPrimaryHref: override?.ctaPrimaryHref || '#contacto',
    ctaSecondaryText: override?.ctaSecondaryText || hero?.ctaSecondary,
    ctaSecondaryHref: override?.ctaSecondaryHref || '#servicios',
    backgroundImage: override?.backgroundImageUrl || business.heroImage,
  }
}

type ServiceItem = {
  name: string
  description?: string
  price?: string
  priceFrom?: string
  duration?: number
  category?: string
}

type ServicesContent = {
  servicesPage?: {
    title?: string
    // Category-based format (e.g., peluqueria, estetica)
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
    // Direct services format (e.g., nexa-propiedades) - can be array or {title, services: []} object
    services?: ServiceItem[] | { title?: string; services: ServiceItem[] }
  }
}

function resolveServicesFromContent(servicesContent: ServicesContent['servicesPage']): BusinessData['services'] {
  // Handle nested services object format: { title, services: [...] }
  if (servicesContent?.services && !Array.isArray(servicesContent.services)) {
    const nestedServices = servicesContent.services.services
    if (Array.isArray(nestedServices)) {
      return nestedServices.map((s) => ({
        name: s.name,
        description: s.description,
        price: s.price,
        priceFrom: s.priceFrom,
        duration: s.duration,
        category: s.category,
      }))
    }
  }
  
  // Handle direct services array format
  if (servicesContent?.services && Array.isArray(servicesContent.services)) {
    return servicesContent.services.map((s) => ({
      name: s.name,
      description: s.description,
      price: s.price,
      priceFrom: s.priceFrom,
      duration: s.duration,
      category: s.category,
    }))
  }
  
  // Handle category-based format (e.g., peluqueria, estetica)
  return (servicesContent?.categories || []).flatMap(
    (cat) =>
      cat.defaultServices?.map((s) => ({
        name: s.name,
        description: s.description,
        price: s.price || undefined,
        priceFrom: s.priceFrom || undefined,
        duration: s.duration,
        category: cat.title,
      })) || [],
  )
}

const buildServices: SectionBuilder = ({ business, content, registry }) => {
  const servicesContent = (content as ServicesContent).servicesPage
  const services = business.services && business.services.length > 0
    ? business.services
    : resolveServicesFromContent(servicesContent)
  return {
    title: servicesContent?.title || 'Nuestros Servicios',
    services,
    showPrices: registry.features?.pricingDisplay?.enabled ?? true,
    showDuration: true,
  }
}

const buildBooking: SectionBuilder = ({ business, content, registry }) => {
  if (!registry.features?.onlineBooking?.enabled) return null
  const services = business.services && business.services.length > 0
    ? business.services
    : resolveServicesFromContent((content as ServicesContent).servicesPage)
  const weekdayHours = business.hours?.['Lunes - Viernes'] || '08:00 - 20:00'
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

const buildPortfolio: SectionBuilder = ({ business, content, registry }) => {
  if (!registry.features?.portfolio?.enabled) return null
  const items = (business.gallery || []).map((img) => ({
    title: img.alt || 'Proyecto',
    image: img.src,
    category: img.category,
  }))
  const portfolioConfig = registry.features?.portfolio as { enabled: boolean; categories?: string[] } | undefined
  const galleryPage = (content as { galleryPage?: { title?: string; subtitle?: string } }).galleryPage
  return {
    title: galleryPage?.title || 'Nuestro Portafolio',
    subtitle: galleryPage?.subtitle,
    items,
    categories: portfolioConfig?.categories,
    columns: 3,
  }
}

const buildBeforeAfter: SectionBuilder = ({ registry }) => {
  if (!registry.features?.beforeAfter?.enabled) return null
  const baConfig = registry.features?.beforeAfter as { enabled: boolean; label?: string } | undefined
  return {
    title: baConfig?.label || 'Antes y Después',
    subtitle: 'Transformaciones reales de nuestros clientes',
    items: [],
  }
}

const buildClassSchedule: SectionBuilder = ({ business, content, registry }) => {
  if (!registry.features?.classSchedule?.enabled) return null
  const scheduleContent = content as { classSchedule?: { schedule?: Array<{ day: string; classes: Array<{ time: string; name: string; instructor?: string; duration?: number }> }> } }
  const schedule = business.classSchedule || scheduleContent?.classSchedule?.schedule || []
  return {
    title: 'Horario de Clases',
    subtitle: 'Consulta nuestros horarios y reserva tu clase',
    schedule,
  }
}

const buildMembershipPlans: SectionBuilder = ({ business, content, registry }) => {
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

const buildRoomBooking: SectionBuilder = ({ business }) => ({
  title: 'Reserva de Salas',
  subtitle: 'Espacios equipados para tus reuniones y eventos',
  rooms: [],
  whatsappPhone: business.whatsapp,
})

const buildEventVenues: SectionBuilder = ({ business }) => ({
  title: 'Espacios para Eventos',
  subtitle: 'Celebra tus momentos especiales en nuestros espacios',
  venues: [],
  whatsappPhone: business.whatsapp,
})

const buildQuoteForm: SectionBuilder = ({ business, registry }) => {
  const categories = (registry as { serviceCategories?: string[] }).serviceCategories || []
  return {
    title: 'Solicita un Presupuesto',
    subtitle: 'Te respondemos en menos de 24 horas',
    services: categories,
    whatsappPhone: business.whatsapp,
  }
}

const buildEmergencyIndicator: SectionBuilder = ({ business }) => {
  if (!business.phone) return null
  return {
    type: 'emergencia',
    phone: business.phone,
    description: 'Servicio de emergencia disponible',
  }
}

const buildGallery: SectionBuilder = ({ business, content }) => {
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

const buildTeam: SectionBuilder = ({ business, content }) => {
  if (!business.team || business.team.length === 0) return null
  const teamContent = (content as { teamPage?: { title?: string } }).teamPage
  return {
    title: teamContent?.title || 'Nuestro Equipo',
    members: business.team,
  }
}

const buildTestimonials: SectionBuilder = ({ business, content }) => {
  if (!business.testimonials || business.testimonials.length === 0) return null
  
  // Get title from content if available
  const contentTestimonials = (content as { home?: { testimonials?: { title?: string; subtitle?: string } } })?.home?.testimonials
  
  return {
    title: contentTestimonials?.title || 'Lo Que Dicen Nuestros Clientes',
    subtitle: contentTestimonials?.subtitle,
    testimonials: business.testimonials,
  }
}

const buildContact: SectionBuilder = ({ business, content }) => {
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
}

const buildFeaturedProducts: SectionBuilder = ({ business, content }) => {
  // Render-time section: the actual products are fetched from the commerce
  // DB inside the React component, not here. The builder just emits the
  // slug + display copy so the composer has something to pass down.
  const cfg = (content as { featuredProducts?: { title?: string; subtitle?: string; viewAllText?: string; limit?: number } }).featuredProducts
  return {
    siteSlug: business.slug,
    businessName: business.name,
    title: cfg?.title ?? 'Nuestros productos',
    subtitle: cfg?.subtitle,
    viewAllText: cfg?.viewAllText ?? 'Ver toda la tienda',
    limit: typeof cfg?.limit === 'number' ? Math.max(1, Math.min(8, cfg.limit)) : 4,
  }
}

const buildProductCatalog: SectionBuilder = ({ business, content, registry }) => {
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

const buildFaq: SectionBuilder = ({ business, content }) => {
  // Prefer admin-edited FAQ when set; fall back to registry-default content.
  const adminItems = business.contentOverrides?.faq?.items
  if (adminItems && adminItems.length > 0) {
    return {
      title: 'Preguntas Frecuentes',
      items: adminItems.map((i) => ({ q: i.question, a: i.answer })),
    }
  }
  const faqContent = content as { faq?: Array<{ q: string; a: string }> }
  if (!faqContent?.faq || faqContent.faq.length === 0) return null
  return {
    title: 'Preguntas Frecuentes',
    items: faqContent.faq,
  }
}

const buildSavingsCalculator: SectionBuilder = ({ business, content, registry }) => {
  if (!registry.features?.savingsCalculator?.enabled) return null
  const calc = (content as { savingsCalculator?: Record<string, unknown> }).savingsCalculator as
    | { title?: string; subtitle?: string; disclaimer?: string; tierOptions?: unknown; inputs?: unknown; outputs?: unknown }
    | undefined
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

const buildCtaBanner: SectionBuilder = ({ content, templateData }) => {
  const ctaContent = content as { ctaBanner?: { title: string; buttonText: string } }
  if (!ctaContent?.ctaBanner) return null
  return {
    title: fillTemplate(ctaContent.ctaBanner.title, templateData),
    buttonText: ctaContent.ctaBanner.buttonText,
    buttonHref: '#contacto',
  }
}

const buildFooter: SectionBuilder = ({ business, navItems }) => ({
  businessName: business.name,
  phone: business.phone,
  email: business.email,
  address: business.address,
  city: business.city,
  instagram: business.instagram,
  facebook: business.facebook,
  whatsapp: business.whatsapp,
  navLinks: navItems,
})

// Handled separately by compose() — the float is emitted only when WhatsApp
// is configured and the feature flag is on, after all normal sections.
const buildWhatsappFloat: SectionBuilder = () => null

/**
 * Generic features grid — reads `content.features` (either array of
 * {title, description, icon} or {items: [...]}). Used by the `features`
 * section which many B2B / b2b-professional / consultoria types reference.
 */
const buildFeatures: SectionBuilder = ({ content, templateData }) => {
  const c = content as { features?: unknown; featuresPage?: unknown }
  const raw = c.features || c.featuresPage
  if (!raw) return null
  const items = Array.isArray(raw)
    ? raw
    : (raw as { items?: unknown[] }).items || []
  if (!items.length) return null
  const mapped = items.map((it) => {
    const item = it as { title?: string; description?: string; icon?: string }
    return {
      title: fillTemplate(item.title || '', templateData),
      description: fillTemplate(item.description || '', templateData),
      icon: item.icon,
    }
  })
  return { title: (raw as { title?: string }).title || '¿Por que elegirnos?', items: mapped }
}

/**
 * Generic pricing tiers — reads `content.pricing` or `content.packages`.
 * Maps to PricingTableSection / PackagesSection.
 */
const buildPricing: SectionBuilder = ({ content, templateData }) => {
  const c = content as { pricing?: unknown; packages?: unknown }
  const raw = c.pricing || c.packages
  if (!raw) return null
  const tiers = Array.isArray(raw) ? raw : (raw as { tiers?: unknown[]; items?: unknown[] }).tiers || (raw as { items?: unknown[] }).items || []
  if (!tiers.length) return null
  const mapped = tiers.map((t) => {
    const tier = t as { name?: string; price?: string; from?: string; period?: string; description?: string; features?: string[]; popular?: boolean }
    return {
      name: fillTemplate(tier.name || '', templateData),
      price: tier.price || tier.from,
      period: tier.period,
      description: fillTemplate(tier.description || '', templateData),
      features: tier.features || [],
      popular: !!tier.popular,
    }
  })
  return { title: (raw as { title?: string }).title || 'Planes y Paquetes', tiers: mapped }
}

/**
 * Process steps — reads `content.process` ({steps: [...]}) or
 * `content.processSteps` (array of {number, title, description}).
 */
const buildProcess: SectionBuilder = ({ content, templateData }) => {
  const c = content as { process?: unknown; processSteps?: unknown }
  const raw = c.process || c.processSteps
  if (!raw) return null
  const steps = Array.isArray(raw) ? raw : (raw as { steps?: unknown[] }).steps || []
  if (!steps.length) return null
  const mapped = steps.map((s, idx) => {
    const step = s as { number?: number; title?: string; description?: string }
    return {
      number: step.number ?? idx + 1,
      title: fillTemplate(step.title || '', templateData),
      description: fillTemplate(step.description || '', templateData),
    }
  })
  return { title: (raw as { title?: string }).title || 'Como Trabajamos', steps: mapped }
}

const buildOmakase: SectionBuilder = ({ content }) => {
  const omakaseContent = (content as { omakase?: { title?: string; subtitle?: string; description?: string; tiers?: Array<{ name: string; price: string; courses: number; duration: string; features: string[] }>; notes?: string[] } }).omakase
  if (!omakaseContent) return null
  return {
    title: omakaseContent.title || 'Experiencia Omakase',
    subtitle: omakaseContent.subtitle,
    description: omakaseContent.description,
    tiers: omakaseContent.tiers || [],
    notes: omakaseContent.notes,
  }
}

const buildSakeMenu: SectionBuilder = ({ content }) => {
  const sakeContent = (content as { sake?: { title?: string; subtitle?: string; description?: string; types?: Array<{ name: string; description: string }> } }).sake
  if (!sakeContent) return null
  return {
    title: sakeContent.title || 'Sake & Bebidas',
    subtitle: sakeContent.subtitle,
    description: sakeContent.description,
    types: sakeContent.types || [],
  }
}

const buildConveyorBelt: SectionBuilder = ({ content }) => {
  const c = (content as { howItWorks?: { title?: string; subtitle?: string; steps?: Array<{ number: number; title: string; description: string }>; tips?: string[] }; plateColors?: Array<{ color: string; name: string; price: string; description: string }> })
  if (!c.howItWorks) return null
  return {
    title: c.howItWorks.title || 'Cómo Funciona',
    subtitle: c.howItWorks.subtitle,
    steps: c.howItWorks.steps || [],
    plateColors: c.plateColors || [],
    tips: c.howItWorks.tips,
  }
}

// Egg farm section builders
const buildStockIndicator: SectionBuilder = ({ business }) => ({
  products: business.products || [],
})

const buildDeliveryCalculator: SectionBuilder = ({ business }) => ({
  phone: business.whatsapp || business.phone || '',
})

const buildRecipes: SectionBuilder = ({ content }) => {
  const recipes = (content as { recipes?: unknown })?.recipes
  return recipes ? { recipes } : null
}

const buildReviews: SectionBuilder = () => ({
  // Reviews are client-side managed
})

const buildSubscription: SectionBuilder = ({ business }) => ({
  phone: business.whatsapp || business.phone || '',
  products: business.products || [],
})

const buildReferral: SectionBuilder = ({ business }) => ({
  phone: business.whatsapp || business.phone || '',
  businessName: business.name,
})

const buildPriceList: SectionBuilder = ({ business }) => ({
  data: {
    businessName: business.name,
    products: business.products || [],
    phone: business.whatsapp || business.phone || '',
  },
})

const buildPreorder: SectionBuilder = ({ business }) => ({
  phone: business.whatsapp || business.phone || '',
})

// ---------- registry -------------------------------------------------------

export const SECTION_BUILDERS: Record<SectionType, SectionBuilder> = {
  header: buildHeader,
  hero: buildHero,
  services: buildServices,
  booking: buildBooking,
  portfolio: buildPortfolio,
  beforeAfter: buildBeforeAfter,
  classSchedule: buildClassSchedule,
  membershipPlans: buildMembershipPlans,
  roomBooking: buildRoomBooking,
  eventVenues: buildEventVenues,
  quoteForm: buildQuoteForm,
  emergencyIndicator: buildEmergencyIndicator,
  productCatalog: buildProductCatalog,
  featuredProducts: buildFeaturedProducts,
  gallery: buildGallery,
  team: buildTeam,
  testimonials: buildTestimonials,
  contact: buildContact,
  faq: buildFaq,
  ctaBanner: buildCtaBanner,
  footer: buildFooter,
  whatsappFloat: buildWhatsappFloat,
  features: buildFeatures,
  pricing: buildPricing,
  process: buildProcess,
  savingsCalculator: buildSavingsCalculator,
  omakase: buildOmakase,
  sakeMenu: buildSakeMenu,
  conveyorBelt: buildConveyorBelt,
  // Egg farm sections
  stockIndicator: buildStockIndicator,
  deliveryCalculator: buildDeliveryCalculator,
  recipes: buildRecipes,
  reviews: buildReviews,
  subscription: buildSubscription,
  referral: buildReferral,
  priceList: buildPriceList,
  preorder: buildPreorder,
}

// ---------- helpers --------------------------------------------------------

/**
 * Generate placeholder gallery items when a business has no photos.
 * Uses SVG data URIs with gradients themed to the business type.
 */
export function generatePlaceholderGallery(
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
    const angle = 135 + i * 30
    const category = theme.categories[i % theme.categories.length]

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
