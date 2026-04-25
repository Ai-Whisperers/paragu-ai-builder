#!/usr/bin/env node
/**
 * Scaffold 10 new verticals (Phase 1 of the global expansion).
 * Creates vertical.json, schema.json, defaults.tokens.json, copy/es.json,
 * starter-kits/minimal.pages.json for each. Idempotent.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const VERTICALS = path.join(ROOT, 'src/verticals')

interface VerticalSpec {
  id: string
  nameEs: string
  nameEn: string
  description: string
  baseType: string
  features: Record<string, boolean | string>
  allowedSections: string[]
  palette: {
    name: string
    primary: string
    secondary: string
    accent: string
    background?: string
    surface?: string
    text?: string
  }
  typography: {
    heading: string
    body?: string
    headingWeight?: string
  }
  googleFonts: string[]
  locales?: string[]
  heroHeadline: string
  heroSubheadline: string
  primaryCta: string
  secondaryCta: string
  labels: Record<string, string>
  schemaExtraProps?: Record<string, unknown>
}

const VERTICALS_SPEC: VerticalSpec[] = [
  {
    id: 'trades-industrial',
    nameEs: 'Industria y Manufactura',
    nameEn: 'Industrial & Manufacturing',
    description: 'Machining, fabrication, contract manufacturing, printing, packaging, recycling. RFQ-first, spec-sheet heavy, B2B.',
    baseType: 'industrial_base',
    features: { i18n: false, quoteForm: true, caseStudies: true, whatsappFloat: true, certifications: true },
    allowedSections: ['header', 'hero', 'services', 'features', 'process', 'case-studies', 'trust-signals', 'faq', 'quote-form', 'contact', 'footer', 'whatsapp-float'],
    palette: { name: 'Industrial Steel', primary: '#1F2937', secondary: '#F59E0B', accent: '#64748B', background: '#F9FAFB', surface: '#FFFFFF', text: '#111827' },
    typography: { heading: "'Rajdhani', sans-serif", headingWeight: '700' },
    googleFonts: ['Rajdhani:wght@500;600;700', 'Inter:wght@400;500;600'],
    heroHeadline: '{{businessName}} - Fabricacion a medida',
    heroSubheadline: 'Maquinado, fabricacion y soluciones industriales con precision.',
    primaryCta: 'Solicitar Cotizacion',
    secondaryCta: 'Ver Capacidades',
    labels: { services: 'Capacidades', cases: 'Proyectos', certifications: 'Certificaciones' },
    schemaExtraProps: { certifications: { type: 'array', items: { type: 'string' } }, capacityMetrics: { type: 'object' } }
  },
  {
    id: 'agriculture-agribusiness',
    nameEs: 'Agricultura y Agronegocios',
    nameEn: 'Agriculture & Agribusiness',
    description: 'Crop farming, livestock, CSA, viticulture, aquaculture, apiculture, ag services and equipment. Mixed B2B/B2C.',
    baseType: 'agriculture_base',
    features: { i18n: false, quoteForm: true, seasonalHours: true, whatsappFloat: true, productCatalog: true },
    allowedSections: ['header', 'hero', 'about', 'services', 'product-catalog', 'gallery', 'testimonials', 'faq', 'contact', 'google-maps', 'footer', 'whatsapp-float'],
    palette: { name: 'Agri Green', primary: '#166534', secondary: '#CA8A04', accent: '#A7F3D0', background: '#F7FEE7', surface: '#FFFFFF', text: '#14532D' },
    typography: { heading: "'Source Serif Pro', serif", headingWeight: '600' },
    googleFonts: ['Source+Serif+Pro:wght@600;700', 'Inter:wght@400;500;600'],
    heroHeadline: '{{businessName}} - Del campo a tu mesa',
    heroSubheadline: 'Produccion agricola y agronegocios con compromiso ambiental.',
    primaryCta: 'Consultar Productos',
    secondaryCta: 'Conocenos',
    labels: { products: 'Productos', services: 'Servicios', about: 'Nuestra Tierra' }
  },
  {
    id: 'logistics-transport',
    nameEs: 'Logistica y Transporte',
    nameEn: 'Logistics & Transport',
    description: 'Trucking, freight brokerage, warehousing, last-mile, marine/port, air cargo, rail/intermodal. B2B.',
    baseType: 'logistics_base',
    features: { i18n: true, quoteForm: true, trackingIntegration: true, whatsappFloat: true, serviceAreaMap: true },
    allowedSections: ['header', 'hero', 'services', 'features', 'process', 'service-area-map', 'trust-signals', 'faq', 'quote-form', 'contact', 'footer', 'whatsapp-float'],
    palette: { name: 'Logistics Navy', primary: '#1E3A8A', secondary: '#EA580C', accent: '#60A5FA', background: '#F8FAFC', surface: '#FFFFFF', text: '#0F172A' },
    typography: { heading: "'Barlow', sans-serif", headingWeight: '600' },
    googleFonts: ['Barlow:wght@500;600;700', 'Inter:wght@400;500;600'],
    locales: ['es', 'en'],
    heroHeadline: '{{businessName}} - Movemos tu carga, cumplimos tus tiempos',
    heroSubheadline: 'Transporte y logistica con cobertura nacional e internacional.',
    primaryCta: 'Cotizar Envio',
    secondaryCta: 'Nuestros Servicios',
    labels: { services: 'Servicios', coverage: 'Cobertura', track: 'Rastreo' }
  },
  {
    id: 'finance-insurance',
    nameEs: 'Finanzas y Seguros',
    nameEn: 'Finance & Insurance',
    description: 'Financial advisors, insurance brokers, community banks/credit unions, tax prep, debt counseling. HIGHLY REGULATED.',
    baseType: 'finance_insurance_base',
    features: { i18n: true, consultationForm: true, legalDisclosures: true, whatsappFloat: true, credentials: true },
    allowedSections: ['header', 'hero', 'services', 'features', 'process', 'team', 'testimonials', 'faq', 'legal-disclaimer', 'lead-form', 'contact', 'footer', 'whatsapp-float'],
    palette: { name: 'Finance Navy', primary: '#0F172A', secondary: '#047857', accent: '#64748B', background: '#FFFFFF', surface: '#F8FAFC', text: '#0F172A' },
    typography: { heading: "'Lora', serif", headingWeight: '600' },
    googleFonts: ['Lora:wght@600;700', 'Inter:wght@400;500;600'],
    locales: ['es', 'en'],
    heroHeadline: '{{businessName}} - Tu patrimonio, asesorado con rigor',
    heroSubheadline: 'Asesoramiento financiero y seguros para personas y empresas.',
    primaryCta: 'Agendar Consulta',
    secondaryCta: 'Nuestros Servicios',
    labels: { services: 'Servicios', team: 'Profesionales', credentials: 'Registros' }
  },
  {
    id: 'technology-digital',
    nameEs: 'Tecnologia y Digital',
    nameEn: 'Technology & Digital',
    description: 'MSP, web agencies, SaaS, cybersecurity, data, AI/ML, IoT, AV integrators. B2B focus.',
    baseType: 'technology_base',
    features: { i18n: true, caseStudies: true, leadForm: true, whatsappFloat: true, techStack: true },
    allowedSections: ['header', 'hero', 'services', 'features', 'case-studies', 'process', 'team', 'testimonials', 'faq', 'lead-form', 'contact', 'footer', 'whatsapp-float'],
    palette: { name: 'Tech Cobalt', primary: '#4338CA', secondary: '#06B6D4', accent: '#C7D2FE', background: '#FAFAFA', surface: '#FFFFFF', text: '#1E1B4B' },
    typography: { heading: "'Space Grotesk', sans-serif", headingWeight: '600' },
    googleFonts: ['Space+Grotesk:wght@500;600;700', 'Inter:wght@400;500;600'],
    locales: ['es', 'en'],
    heroHeadline: '{{businessName}} - Tecnologia que impulsa',
    heroSubheadline: 'Soluciones digitales para empresas que buscan crecer.',
    primaryCta: 'Solicitar Demo',
    secondaryCta: 'Casos de Exito',
    labels: { services: 'Servicios', stack: 'Stack Tecnologico', cases: 'Casos' }
  },
  {
    id: 'arts-entertainment-venues',
    nameEs: 'Artes y Entretenimiento',
    nameEn: 'Arts & Entertainment Venues',
    description: 'Music venues, theaters, cinemas, galleries, escape rooms, comedy clubs, arcades, nightclubs, festivals. Ticketing-centric.',
    baseType: 'entertainment_base',
    features: { i18n: false, eventsCalendar: true, ticketing: true, gallery: true, whatsappFloat: true },
    allowedSections: ['header', 'hero', 'about', 'events-calendar', 'gallery', 'testimonials', 'faq', 'contact', 'business-hours', 'google-maps', 'footer', 'whatsapp-float'],
    palette: { name: 'Spotlight', primary: '#7C3AED', secondary: '#F59E0B', accent: '#FBCFE8', background: '#0F0518', surface: '#1E0B33', text: '#F5F3FF' },
    typography: { heading: "'Abril Fatface', serif", headingWeight: '400' },
    googleFonts: ['Abril+Fatface', 'Inter:wght@400;500;600'],
    heroHeadline: '{{businessName}} - La experiencia en vivo',
    heroSubheadline: 'Conciertos, teatro, cine y entretenimiento en {{city}}.',
    primaryCta: 'Ver Cartelera',
    secondaryCta: 'Comprar Entradas',
    labels: { events: 'Eventos', tickets: 'Entradas', about: 'El Lugar' }
  },
  {
    id: 'sports-recreation',
    nameEs: 'Deportes y Recreacion',
    nameEn: 'Sports & Recreation',
    description: 'Climbing gyms, racquet sports, golf, water sports, winter sports, motorsports, martial arts, equestrian, esports. Waiver-required.',
    baseType: 'sports_base',
    features: { i18n: false, booking: true, classSchedule: true, membershipPlans: true, whatsappFloat: true, waivers: true },
    allowedSections: ['header', 'hero', 'services', 'class-schedule', 'membership-plans', 'gallery', 'testimonials', 'faq', 'booking', 'contact', 'footer', 'whatsapp-float'],
    palette: { name: 'Athletic Red', primary: '#DC2626', secondary: '#1F2937', accent: '#FBBF24', background: '#FFFFFF', surface: '#F9FAFB', text: '#111827' },
    typography: { heading: "'Oswald', sans-serif", headingWeight: '700' },
    googleFonts: ['Oswald:wght@600;700', 'Inter:wght@400;500;600'],
    heroHeadline: '{{businessName}} - Entrena, juga, vive',
    heroSubheadline: 'Deportes y recreacion con instalaciones de primera.',
    primaryCta: 'Reservar Cancha',
    secondaryCta: 'Ver Horarios',
    labels: { schedule: 'Horarios', membership: 'Membresias', services: 'Actividades' }
  },
  {
    id: 'pets-animals',
    nameEs: 'Mascotas y Animales',
    nameEn: 'Pets & Animals',
    description: 'Pet grooming, boarding, training, retail, sitting/walking, rescue/shelter, breeding. Non-medical (vet stays in health).',
    baseType: 'pets_base',
    features: { i18n: false, booking: true, productCatalog: true, whatsappFloat: true, photoGallery: true },
    allowedSections: ['header', 'hero', 'services', 'product-catalog', 'gallery', 'testimonials', 'faq', 'booking', 'contact', 'business-hours', 'google-maps', 'footer', 'whatsapp-float'],
    palette: { name: 'Pet Friendly', primary: '#EA580C', secondary: '#0EA5E9', accent: '#FED7AA', background: '#FFF7ED', surface: '#FFFFFF', text: '#7C2D12' },
    typography: { heading: "'Nunito', sans-serif", headingWeight: '700' },
    googleFonts: ['Nunito:wght@600;700;800', 'Inter:wght@400;500;600'],
    heroHeadline: '{{businessName}} - Cuidado para tu mejor amigo',
    heroSubheadline: 'Servicios profesionales para mascotas y animales en {{city}}.',
    primaryCta: 'Agendar Turno',
    secondaryCta: 'Ver Servicios',
    labels: { services: 'Servicios', catalog: 'Productos', gallery: 'Galeria' }
  },
  {
    id: 'media-publishing',
    nameEs: 'Medios y Publicacion',
    nameEn: 'Media & Publishing',
    description: 'Local news, niche magazines, podcast studios, indie publishers, ad media, content creators. Mixed B2B/B2C.',
    baseType: 'media_base',
    features: { i18n: false, blog: true, newsletterSignup: true, whatsappFloat: true, adSales: true },
    allowedSections: ['header', 'hero', 'about', 'blog-index', 'services', 'testimonials', 'lead-form', 'contact', 'footer', 'whatsapp-float'],
    palette: { name: 'Editorial', primary: '#111827', secondary: '#DC2626', accent: '#F59E0B', background: '#FFFFFF', surface: '#F9FAFB', text: '#111827' },
    typography: { heading: "'Playfair Display', serif", headingWeight: '700' },
    googleFonts: ['Playfair+Display:wght@600;700;900', 'Inter:wght@400;500;600'],
    heroHeadline: '{{businessName}} - Historias que importan',
    heroSubheadline: 'Periodismo local, contenido de calidad, voces independientes.',
    primaryCta: 'Suscribirse',
    secondaryCta: 'Leer',
    labels: { articles: 'Articulos', subscribe: 'Suscribirse', advertise: 'Anunciar' }
  },
  {
    id: 'membership-community',
    nameEs: 'Membresias y Comunidad',
    nameEn: 'Membership & Community',
    description: 'Nonprofits, religious congregations, trade associations, professional societies, social clubs, coworking, community centers.',
    baseType: 'membership_base',
    features: { i18n: false, events: true, donation: true, membersLogin: true, whatsappFloat: true },
    allowedSections: ['header', 'hero', 'about', 'services', 'team', 'events-calendar', 'testimonials', 'faq', 'lead-form', 'contact', 'footer', 'whatsapp-float'],
    palette: { name: 'Community', primary: '#059669', secondary: '#F59E0B', accent: '#A7F3D0', background: '#FFFFFF', surface: '#F0FDF4', text: '#064E3B' },
    typography: { heading: "'Merriweather', serif", headingWeight: '700' },
    googleFonts: ['Merriweather:wght@700;900', 'Inter:wght@400;500;600'],
    heroHeadline: '{{businessName}} - Juntos somos mas',
    heroSubheadline: 'Una comunidad comprometida con el proposito compartido.',
    primaryCta: 'Unirse',
    secondaryCta: 'Conocenos',
    labels: { members: 'Miembros', events: 'Eventos', give: 'Donar' }
  },
  {
    id: 'death-care',
    nameEs: 'Servicios Funerarios',
    nameEn: 'Death Care',
    description: 'Funeral homes, cemeteries, cremation, pre-planning, monuments. High cultural sensitivity required.',
    baseType: 'death_care_base',
    features: { i18n: false, consultationForm: true, whatsappFloat: true, plannerGuide: true },
    allowedSections: ['header', 'hero', 'about', 'services', 'team', 'testimonials', 'faq', 'contact', 'business-hours', 'google-maps', 'footer', 'whatsapp-float'],
    palette: { name: 'Quiet Dignity', primary: '#334155', secondary: '#94A3B8', accent: '#E2E8F0', background: '#F8FAFC', surface: '#FFFFFF', text: '#1E293B' },
    typography: { heading: "'Cormorant Garamond', serif", headingWeight: '500' },
    googleFonts: ['Cormorant+Garamond:wght@400;500', 'Inter:wght@400;500;600'],
    heroHeadline: '{{businessName}} - Acompañamos con respeto',
    heroSubheadline: 'Servicios funerarios con empatia, discrecion y cuidado.',
    primaryCta: 'Consultar',
    secondaryCta: 'Nuestros Servicios',
    labels: { services: 'Servicios', about: 'Sobre Nosotros', guidance: 'Orientacion' }
  }
]

let created = 0
let skipped = 0

function writeIfMissing(filePath: string, content: string): boolean {
  if (fs.existsSync(filePath)) return false
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
  return true
}

function writeJsonIfMissing(filePath: string, payload: object): boolean {
  return writeIfMissing(filePath, JSON.stringify(payload, null, 2) + '\n')
}

for (const v of VERTICALS_SPEC) {
  const verticalDir = path.join(VERTICALS, v.id)
  const copyDir = path.join(verticalDir, 'copy')
  const kitsDir = path.join(verticalDir, 'starter-kits')

  const verticalJson = {
    id: v.id,
    name: v.nameEn,
    nameEs: v.nameEs,
    description: v.description,
    baseType: v.baseType,
    features: v.features,
    allowedSections: v.allowedSections,
    defaultStarterKit: 'minimal',
    locales: v.locales || ['es']
  }

  const tokensJson = {
    name: v.palette.name,
    theme: 'light',
    palettes: {
      default: {
        name: v.palette.name,
        colors: {
          primary: v.palette.primary,
          secondary: v.palette.secondary,
          accent: v.palette.accent,
          background: v.palette.background || '#FFFFFF',
          surface: v.palette.surface || '#F9FAFB',
          surfaceLight: v.palette.surface || '#F9FAFB',
          text: v.palette.text || '#111827',
          textLight: v.palette.text || '#374151',
          textMuted: '#64748B'
        }
      }
    },
    defaultPalette: 'default',
    typography: {
      heading: v.typography.heading,
      body: v.typography.body || "'Inter', sans-serif",
      headingWeight: v.typography.headingWeight || '600',
      bodyWeight: '400'
    },
    googleFonts: v.googleFonts
  }

  const copyEs = {
    common: {
      cta: { primary: v.primaryCta, secondary: v.secondaryCta, whatsapp: 'WhatsApp' },
      labels: v.labels
    },
    defaults: {
      hero: {
        headline: v.heroHeadline,
        subheadline: v.heroSubheadline,
        ctaPrimaryText: v.primaryCta,
        ctaSecondaryText: v.secondaryCta
      }
    }
  }

  const schemaJson: Record<string, unknown> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `vertical-${v.id}`,
    allOf: [{ $ref: 'base-business' }],
    type: 'object',
    properties: { ...(v.schemaExtraProps || {}) }
  }

  const starterKit = {
    description: `${v.nameEn} minimal starter kit.`,
    pages: {
      home: {
        slug: '',
        sections: [
          { id: 'header', variant: 'standard', content: 'navigation' },
          { id: 'hero', variant: 'image', content: 'home.hero' },
          { id: 'services', variant: 'grid', content: 'home.services' },
          { id: 'contact', variant: 'split', content: 'home.contact' },
          { id: 'footer', variant: 'standard', content: 'footer' },
          { id: 'whatsapp-float', variant: 'standard', content: 'whatsapp' }
        ]
      }
    }
  }

  const files: Array<[string, object]> = [
    [path.join(verticalDir, 'vertical.json'), verticalJson],
    [path.join(verticalDir, 'defaults.tokens.json'), tokensJson],
    [path.join(verticalDir, 'schema.json'), schemaJson],
    [path.join(copyDir, 'es.json'), copyEs],
    [path.join(kitsDir, 'minimal.pages.json'), starterKit]
  ]

  if (v.locales?.includes('en')) {
    const copyEn = {
      common: {
        cta: { primary: v.primaryCta, secondary: v.secondaryCta, whatsapp: 'WhatsApp' },
        labels: v.labels
      },
      defaults: {
        hero: {
          headline: v.heroHeadline,
          subheadline: v.heroSubheadline,
          ctaPrimaryText: v.primaryCta,
          ctaSecondaryText: v.secondaryCta
        }
      }
    }
    files.push([path.join(copyDir, 'en.json'), copyEn])
  }

  let wrote = 0
  for (const [p, payload] of files) {
    if (writeJsonIfMissing(p, payload)) wrote++
  }

  if (wrote) {
    created++
    console.log(`+ ${v.id} (${wrote} files)`)
  } else {
    skipped++
    console.log(`- ${v.id} (already scaffolded)`)
  }
}

console.log(`\nDone. ${created} scaffolded, ${skipped} already existed.`)
