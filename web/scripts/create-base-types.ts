#!/usr/bin/env node
/**
 * Create 11 abstract base types for the new verticals. Idempotent.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')

interface BaseSpec {
  id: string
  nameEs: string
  nameEn: string
  verticalId: string
  schemaType: string
  pagesHomeSections: string[]
  requiredSections: string[]
  features: Record<string, unknown>
  navItems: string[]
  navCtaText: string
  navCtaAction: string
  heroStyle: string
  heroCtaPrimary: { text: string; action: string }
  heroCtaSecondary: { text: string; action: string }
  heroHeadline: string
  heroSubheadline: string
}

const BASES: BaseSpec[] = [
  {
    id: 'industrial_base',
    nameEs: 'Base Industrial',
    nameEn: 'Industrial Base',
    verticalId: 'trades-industrial',
    schemaType: 'ProfessionalService',
    pagesHomeSections: ['header', 'hero', 'services', 'features', 'process', 'caseStudies', 'trustSignals', 'faq', 'quoteForm', 'contact', 'footer'],
    requiredSections: ['header', 'hero', 'services', 'quoteForm', 'contact', 'footer'],
    features: { quoteForm: { enabled: true }, caseStudies: { enabled: true }, certifications: { enabled: true }, whatsappFloat: { enabled: true } },
    navItems: ['Inicio', 'Capacidades', 'Proyectos', 'Contacto'],
    navCtaText: 'Cotizar',
    navCtaAction: 'quoteForm',
    heroStyle: 'image',
    heroCtaPrimary: { text: 'Solicitar Cotizacion', action: 'quoteForm' },
    heroCtaSecondary: { text: 'Ver Capacidades', action: 'scrollTo:services' },
    heroHeadline: '{{businessName}} - Fabricacion con precision',
    heroSubheadline: 'Maquinado y manufactura industrial a medida.'
  },
  {
    id: 'agriculture_base',
    nameEs: 'Base Agricultura',
    nameEn: 'Agriculture Base',
    verticalId: 'agriculture-agribusiness',
    schemaType: 'LocalBusiness',
    pagesHomeSections: ['header', 'hero', 'about', 'services', 'productCatalog', 'gallery', 'testimonials', 'contact', 'googleMaps', 'footer'],
    requiredSections: ['header', 'hero', 'services', 'contact', 'footer'],
    features: { productCatalog: { enabled: true }, whatsappFloat: { enabled: true }, googleMapsEmbed: { enabled: true } },
    navItems: ['Inicio', 'Productos', 'Servicios', 'Contacto'],
    navCtaText: 'Consultar',
    navCtaAction: 'whatsapp',
    heroStyle: 'image',
    heroCtaPrimary: { text: 'Consultar Productos', action: 'whatsapp' },
    heroCtaSecondary: { text: 'Conocenos', action: 'scrollTo:about' },
    heroHeadline: '{{businessName}} - Del campo a tu mesa',
    heroSubheadline: 'Produccion agricola responsable y de calidad.'
  },
  {
    id: 'logistics_base',
    nameEs: 'Base Logistica',
    nameEn: 'Logistics Base',
    verticalId: 'logistics-transport',
    schemaType: 'ProfessionalService',
    pagesHomeSections: ['header', 'hero', 'services', 'features', 'process', 'trustSignals', 'faq', 'quoteForm', 'contact', 'footer'],
    requiredSections: ['header', 'hero', 'services', 'quoteForm', 'contact', 'footer'],
    features: { quoteForm: { enabled: true }, trackingIntegration: { enabled: true }, whatsappFloat: { enabled: true } },
    navItems: ['Inicio', 'Servicios', 'Cobertura', 'Contacto'],
    navCtaText: 'Cotizar Envio',
    navCtaAction: 'quoteForm',
    heroStyle: 'image',
    heroCtaPrimary: { text: 'Cotizar Envio', action: 'quoteForm' },
    heroCtaSecondary: { text: 'Nuestros Servicios', action: 'scrollTo:services' },
    heroHeadline: '{{businessName}} - Tu carga en buenas manos',
    heroSubheadline: 'Logistica y transporte con cobertura nacional e internacional.'
  },
  {
    id: 'finance_insurance_base',
    nameEs: 'Base Finanzas',
    nameEn: 'Finance & Insurance Base',
    verticalId: 'finance-insurance',
    schemaType: 'FinancialService',
    pagesHomeSections: ['header', 'hero', 'services', 'features', 'process', 'team', 'testimonials', 'faq', 'leadForm', 'contact', 'footer'],
    requiredSections: ['header', 'hero', 'services', 'contact', 'footer'],
    features: { leadForm: { enabled: true }, credentials: { enabled: true }, legalDisclosures: { enabled: true }, whatsappFloat: { enabled: true } },
    navItems: ['Inicio', 'Servicios', 'Profesionales', 'Contacto'],
    navCtaText: 'Agendar Consulta',
    navCtaAction: 'leadForm',
    heroStyle: 'minimal',
    heroCtaPrimary: { text: 'Agendar Consulta', action: 'leadForm' },
    heroCtaSecondary: { text: 'Nuestros Servicios', action: 'scrollTo:services' },
    heroHeadline: '{{businessName}} - Asesoramiento con rigor',
    heroSubheadline: 'Finanzas y seguros para proteger lo que te importa.'
  },
  {
    id: 'technology_base',
    nameEs: 'Base Tecnologia',
    nameEn: 'Technology Base',
    verticalId: 'technology-digital',
    schemaType: 'ProfessionalService',
    pagesHomeSections: ['header', 'hero', 'services', 'features', 'caseStudies', 'process', 'team', 'testimonials', 'leadForm', 'contact', 'footer'],
    requiredSections: ['header', 'hero', 'services', 'contact', 'footer'],
    features: { leadForm: { enabled: true }, caseStudies: { enabled: true }, whatsappFloat: { enabled: true } },
    navItems: ['Inicio', 'Servicios', 'Casos', 'Contacto'],
    navCtaText: 'Solicitar Demo',
    navCtaAction: 'leadForm',
    heroStyle: 'minimal',
    heroCtaPrimary: { text: 'Solicitar Demo', action: 'leadForm' },
    heroCtaSecondary: { text: 'Casos de Exito', action: 'scrollTo:caseStudies' },
    heroHeadline: '{{businessName}} - Tecnologia que impulsa',
    heroSubheadline: 'Soluciones digitales para empresas que crecen.'
  },
  {
    id: 'entertainment_base',
    nameEs: 'Base Entretenimiento',
    nameEn: 'Entertainment Base',
    verticalId: 'arts-entertainment-venues',
    schemaType: 'EntertainmentBusiness',
    pagesHomeSections: ['header', 'hero', 'about', 'eventsCalendar', 'gallery', 'testimonials', 'faq', 'contact', 'businessHours', 'googleMaps', 'footer'],
    requiredSections: ['header', 'hero', 'contact', 'footer'],
    features: { eventsCalendar: { enabled: true }, ticketing: { enabled: true }, gallery: { enabled: true }, whatsappFloat: { enabled: true } },
    navItems: ['Inicio', 'Cartelera', 'Entradas', 'Contacto'],
    navCtaText: 'Ver Cartelera',
    navCtaAction: 'scrollTo:eventsCalendar',
    heroStyle: 'image',
    heroCtaPrimary: { text: 'Ver Cartelera', action: 'scrollTo:eventsCalendar' },
    heroCtaSecondary: { text: 'Comprar Entradas', action: 'whatsapp' },
    heroHeadline: '{{businessName}} - La experiencia en vivo',
    heroSubheadline: 'Eventos y entretenimiento inolvidables.'
  },
  {
    id: 'sports_base',
    nameEs: 'Base Deportes',
    nameEn: 'Sports Base',
    verticalId: 'sports-recreation',
    schemaType: 'SportsActivityLocation',
    pagesHomeSections: ['header', 'hero', 'services', 'classSchedule', 'membershipPlans', 'gallery', 'testimonials', 'booking', 'contact', 'footer'],
    requiredSections: ['header', 'hero', 'services', 'contact', 'footer'],
    features: { booking: { enabled: true }, classSchedule: { enabled: true }, membershipPlans: { enabled: true }, whatsappFloat: { enabled: true } },
    navItems: ['Inicio', 'Actividades', 'Horarios', 'Contacto'],
    navCtaText: 'Reservar',
    navCtaAction: 'booking',
    heroStyle: 'image',
    heroCtaPrimary: { text: 'Reservar', action: 'booking' },
    heroCtaSecondary: { text: 'Ver Horarios', action: 'scrollTo:classSchedule' },
    heroHeadline: '{{businessName}} - Muevete, juga, vive',
    heroSubheadline: 'Deportes y recreacion para todos los niveles.'
  },
  {
    id: 'pets_base',
    nameEs: 'Base Mascotas',
    nameEn: 'Pets Base',
    verticalId: 'pets-animals',
    schemaType: 'LocalBusiness',
    pagesHomeSections: ['header', 'hero', 'services', 'productCatalog', 'gallery', 'testimonials', 'booking', 'contact', 'googleMaps', 'footer'],
    requiredSections: ['header', 'hero', 'services', 'contact', 'footer'],
    features: { booking: { enabled: true }, productCatalog: { enabled: true }, whatsappFloat: { enabled: true }, googleMapsEmbed: { enabled: true } },
    navItems: ['Inicio', 'Servicios', 'Productos', 'Contacto'],
    navCtaText: 'Agendar',
    navCtaAction: 'whatsapp',
    heroStyle: 'image',
    heroCtaPrimary: { text: 'Agendar Turno', action: 'whatsapp' },
    heroCtaSecondary: { text: 'Ver Servicios', action: 'scrollTo:services' },
    heroHeadline: '{{businessName}} - Cuidado para tu mejor amigo',
    heroSubheadline: 'Servicios profesionales para mascotas.'
  },
  {
    id: 'media_base',
    nameEs: 'Base Medios',
    nameEn: 'Media Base',
    verticalId: 'media-publishing',
    schemaType: 'Organization',
    pagesHomeSections: ['header', 'hero', 'about', 'blogIndex', 'services', 'testimonials', 'leadForm', 'contact', 'footer'],
    requiredSections: ['header', 'hero', 'contact', 'footer'],
    features: { blog: { enabled: true }, newsletterSignup: { enabled: true }, whatsappFloat: { enabled: true } },
    navItems: ['Inicio', 'Articulos', 'Suscribirse', 'Contacto'],
    navCtaText: 'Suscribirse',
    navCtaAction: 'leadForm',
    heroStyle: 'minimal',
    heroCtaPrimary: { text: 'Suscribirse', action: 'leadForm' },
    heroCtaSecondary: { text: 'Leer', action: 'scrollTo:blogIndex' },
    heroHeadline: '{{businessName}} - Historias que importan',
    heroSubheadline: 'Contenido independiente y de calidad.'
  },
  {
    id: 'membership_base',
    nameEs: 'Base Membresia',
    nameEn: 'Membership Base',
    verticalId: 'membership-community',
    schemaType: 'Organization',
    pagesHomeSections: ['header', 'hero', 'about', 'services', 'team', 'eventsCalendar', 'testimonials', 'faq', 'leadForm', 'contact', 'footer'],
    requiredSections: ['header', 'hero', 'contact', 'footer'],
    features: { events: { enabled: true }, leadForm: { enabled: true }, whatsappFloat: { enabled: true } },
    navItems: ['Inicio', 'Nosotros', 'Eventos', 'Contacto'],
    navCtaText: 'Unirse',
    navCtaAction: 'leadForm',
    heroStyle: 'image',
    heroCtaPrimary: { text: 'Unirse', action: 'leadForm' },
    heroCtaSecondary: { text: 'Conocenos', action: 'scrollTo:about' },
    heroHeadline: '{{businessName}} - Juntos somos mas',
    heroSubheadline: 'Una comunidad con proposito.'
  },
  {
    id: 'death_care_base',
    nameEs: 'Base Servicios Funerarios',
    nameEn: 'Death Care Base',
    verticalId: 'death-care',
    schemaType: 'FuneralHome',
    pagesHomeSections: ['header', 'hero', 'about', 'services', 'team', 'testimonials', 'faq', 'contact', 'businessHours', 'googleMaps', 'footer'],
    requiredSections: ['header', 'hero', 'services', 'contact', 'footer'],
    features: { consultationForm: { enabled: true }, whatsappFloat: { enabled: true }, googleMapsEmbed: { enabled: true } },
    navItems: ['Inicio', 'Servicios', 'Contacto'],
    navCtaText: 'Consultar',
    navCtaAction: 'whatsapp',
    heroStyle: 'minimal',
    heroCtaPrimary: { text: 'Consultar', action: 'whatsapp' },
    heroCtaSecondary: { text: 'Nuestros Servicios', action: 'scrollTo:services' },
    heroHeadline: '{{businessName}} - Acompañamos con respeto',
    heroSubheadline: 'Servicios funerarios con empatia y cuidado.'
  }
]

let created = 0
let skipped = 0

for (const b of BASES) {
  const registryPath = path.join(ROOT, 'src/registry', `${b.id}.type.json`)
  const tokensPath = path.join(ROOT, 'src/tokens', `${b.id}.tokens.json`)

  if (fs.existsSync(registryPath) && fs.existsSync(tokensPath)) {
    skipped++
    continue
  }

  const registry = {
    id: b.id,
    nameEs: b.nameEs,
    nameEn: b.nameEn,
    verticalId: b.verticalId,
    abstract: true,
    tokens: b.id,
    pages: {
      homepage: {
        sections: b.pagesHomeSections,
        requiredSections: b.requiredSections
      }
    },
    features: b.features,
    seo: {
      schemaType: b.schemaType,
      titleTemplate: `{{businessName}} - {{nameEs}} en {{city}}`,
      descriptionTemplate: `${b.nameEs} profesional en {{city}}.`
    },
    nav: { items: b.navItems, cta: { text: b.navCtaText, action: b.navCtaAction } },
    hero: {
      style: b.heroStyle,
      headlineTemplate: b.heroHeadline,
      subheadlineTemplate: b.heroSubheadline,
      ctaPrimary: b.heroCtaPrimary,
      ctaSecondary: b.heroCtaSecondary
    }
  }

  const tokens = {
    $comment: `Inherits ${b.verticalId} vertical defaults`,
    extends: `vertical:${b.verticalId}`
  }

  if (!fs.existsSync(registryPath)) {
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf-8')
  }
  if (!fs.existsSync(tokensPath)) {
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2) + '\n', 'utf-8')
  }

  created++
  console.log(`+ ${b.id} (${b.verticalId})`)
}

console.log(`\nDone. ${created} created, ${skipped} already existed.`)
