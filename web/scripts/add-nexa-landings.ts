#!/usr/bin/env node
/**
 * One-shot script: add the 4 ad-landing content blocks (inversor / trust /
 * lifestyle / empresa) to each Nexa Paraguay locale content file.
 *
 * Idempotent: skips a locale when the keys already exist.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CONTENT_DIR = path.resolve(__dirname, '../../sites/nexa-paraguay/content')

type Locale = 'nl' | 'en' | 'de' | 'es'

interface LandingCopy {
  seo: { title: string; description: string }
  hero: {
    eyebrow?: string
    headline: string
    subheadline: string
    ctaPrimaryText: string
    ctaPrimaryHref: string
    ctaSecondaryText?: string
    ctaSecondaryHref?: string
    backgroundImage?: string
  }
  // Either `trust.*` OR `whyCountry.*` depending on landing angle.
  trust?: {
    eyebrow: string
    title: string
    items: Array<{ icon: string; title: string; description: string; image?: string }>
  }
  whyCountry?: {
    eyebrow: string
    title: string
    pillars: Array<{ icon: string; title: string; description: string; imageUrl?: string }>
  }
  process: {
    eyebrow: string
    title: string
    totalDuration: string
    ctaLabel: string
    ctaHref: string
    steps: Array<{ number: number; title: string; description: string; icon: string; image?: { $img: string } }>
  }
  programs: {
    eyebrow: string
    title: string
    subtitle: string
    tiers: Array<{
      id: string
      name: string
      description: string
      price: string
      priceNote: string
      badge?: string
      highlighted?: boolean
      included: string[]
      ctaLabel: string
      ctaHref: string
      image?: { $img: string }
    }>
  }
  cta: {
    title: string
    subtitle: string
    buttonText: string
    buttonHref: string
  }
}

const CALENDLY = 'https://calendly.com/nexaparaguay/consulta'

function utm(locale: Locale, campaign: string, content: string): string {
  const base = CALENDLY
  const params = new URLSearchParams({
    utm_source: 'linkedin',
    utm_medium: 'paid',
    utm_campaign: campaign,
    utm_content: `${content}-${locale}`,
  })
  return `${base}?${params.toString()}`
}

function tier(
  id: 'base' | 'business' | 'investor',
  locale: Locale,
  campaign: string,
  copy: { name: string; description: string; priceNote: string; included: string[]; ctaLabel: string },
): LandingCopy['programs']['tiers'][number] {
  const prices: Record<typeof id, string> = {
    base: 'USD 2,900',
    business: 'USD 4,400+',
    investor: 'USD 6,900+',
  } as never
  const images: Record<typeof id, string> = {
    base: 'programs.tierBase',
    business: 'programs.tierBusiness',
    investor: 'programs.tierInvestor',
  } as never
  return {
    id,
    name: copy.name,
    description: copy.description,
    price: prices[id],
    priceNote: copy.priceNote,
    highlighted: true,
    included: copy.included,
    ctaLabel: copy.ctaLabel,
    ctaHref: utm(locale, campaign, `cta-${id}`),
    image: { $img: images[id] },
  }
}

function copy(locale: Locale): {
  landingInversor: LandingCopy
  landingTrust: LandingCopy
  landingLifestyle: LandingCopy
  landingEmpresa: LandingCopy
} {
  // One translation table per locale. Kept tight — landings are short.
  const T: Record<Locale, {
    inversor: LandingCopy
    trust: LandingCopy
    lifestyle: LandingCopy
    empresa: LandingCopy
  }> = {
    en: {
      inversor: buildLanding(locale, 'investor', {
        title: 'Paraguay for investors — a structured path',
        description: 'Residency, company, bank account and land purchase — one integrated investor program. No surprises.',
        eyebrow: 'Investor program',
        headline: 'Paraguay, structured for investors.',
        subheadline: 'Residency, company, bank account, 12-month accounting — integrated, transparent, executed by a local professional team.',
        ctaPrimary: 'Book a free 30-min consultation',
        ctaSecondary: 'See the investor program',
        trustEyebrow: 'What you get',
        trustTitle: 'What sets the investor program apart',
        trustItems: [
          { icon: 'TrendingUp', title: 'Structured growth', desc: 'Tax advisory built in for 12 months — you run the business, we handle compliance.' },
          { icon: 'Shield', title: 'Institutional trust', desc: 'Lawyers, accountants and notaries in a single coordinated team.' },
          { icon: 'Users', title: 'Direct access', desc: 'Direct line to the technical team across residency, banking and operations.' },
          { icon: 'LineChart', title: 'Transparent pricing', desc: 'All-inclusive. No hidden fees, no back-end invoicing.' },
        ],
        procEyebrow: 'How it works',
        procTitle: '4 steps, roughly 8–12 weeks',
        procDuration: 'Typical total: 8–12 weeks.',
        procCta: 'Start my process',
        procSteps: [
          { t: 'Consultation', d: 'We review your goals and select the right tier.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Pre-validation', d: 'Documents checked before you travel.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operational day', d: 'Residency, company and bank in a single coordinated day.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Delivery', d: 'You receive final documents; we continue accounting.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Recommended',
        progTitle: 'The Investor program',
        progSubtitle: 'Everything you need to operate in Paraguay — plus 12 months of accompaniment.',
        tierId: 'investor',
        tierName: 'Paraguay Investor',
        tierDesc: 'Residency + company + bank + 12 months support.',
        tierNote: 'Starting price. Final quote depends on case requirements.',
        tierIncluded: [
          'Residency and identity card',
          'Company incorporation + RUC',
          'Corporate bank account',
          'Accounting (12 months)',
          'Legal and tax advisory (12 months)',
          'Direct access to technical team',
        ],
        tierCta: 'Request consultation',
        ctaTitle: 'Ready to structure your move?',
        ctaSub: 'Book a free 30-minute consultation — Spanish, English, Dutch or German.',
        ctaBtn: 'Book consultation',
      }),
      trust: buildLanding(locale, 'trust', {
        title: 'Institutional trust, built by local professionals',
        description: 'An integrated system, not a paperwork agency. Lawyers, accountants, notaries and financial advisors.',
        eyebrow: 'Institutional trust',
        headline: 'Serious people. Serious structure.',
        subheadline: 'We are not an administrative agency. We are a multidisciplinary technical team with relational capital across banks, notaries and authorities.',
        ctaPrimary: 'Book a free 30-min consultation',
        ctaSecondary: 'See our process',
        trustEyebrow: 'Why Nexa',
        trustTitle: 'An integrated system',
        trustItems: [
          { icon: 'Package', title: 'One program', desc: 'Residency, company and bank integrated.' },
          { icon: 'Plane', title: 'One trip', desc: 'In-person processing in a single coordinated day.' },
          { icon: 'Users', title: 'One team', desc: 'Lawyers, accountants, notaries, financial advisors.' },
          { icon: 'Shield', title: 'Transparent pricing', desc: 'All-inclusive. No hidden fees.' },
        ],
        procEyebrow: 'How it works',
        procTitle: 'A clear process, no improvisation',
        procDuration: 'Typical total: 8–12 weeks.',
        procCta: 'Start my process',
        procSteps: [
          { t: 'Consultation', d: 'We review your case before anything else.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Pre-validation', d: 'Everything verified before your trip.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operational day', d: 'All in-person steps in a single day.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Delivery', d: 'Final documents handed over personally.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Recommended',
        progTitle: 'Paraguay Business',
        progSubtitle: 'The core program clients pick when they want one trip, one team, one integrated result.',
        tierId: 'business',
        tierName: 'Paraguay Business',
        tierDesc: 'Residency + company + bank account.',
        tierNote: 'Starting price. Final quote depends on case requirements.',
        tierIncluded: [
          'Paraguayan residency + ID card',
          'Company incorporation + RUC',
          'Corporate bank account',
          'Strategic real-estate tour',
          'Fees, VAT and official taxes included',
        ],
        tierCta: 'Request consultation',
        ctaTitle: 'Do it once, do it properly',
        ctaSub: 'Book a free 30-minute consultation with our team.',
        ctaBtn: 'Book consultation',
      }),
      lifestyle: buildLanding(locale, 'lifestyle', {
        title: 'A calmer base in Paraguay — warmth, nature, stability',
        description: 'Good weather, low cost of living, growing international community, territorial tax system.',
        eyebrow: 'Quality of life',
        headline: 'A calmer base in Paraguay.',
        subheadline: 'Warm climate, growing international community, favourable living costs and a territorial tax system that only taxes local income.',
        ctaPrimary: 'Book a free 30-min consultation',
        ctaSecondary: 'Why Paraguay',
        whyEyebrow: 'What you get',
        whyTitle: 'Three real reasons to move',
        whyPillars: [
          { icon: 'Heart', title: 'Quality of life', desc: 'Warm climate, accessible costs, significant purchasing power.', img: 'whyParaguay.lifestyle' },
          { icon: 'Users', title: 'International community', desc: 'Growing community of expats and investors sharing know-how.', img: 'whyParaguay.community' },
          { icon: 'Landmark', title: 'Tax stability', desc: 'Territorial system — foreign income is not taxed in Paraguay.', img: 'whyParaguay.tax' },
        ],
        procEyebrow: 'How it works',
        procTitle: '4 steps, one trip',
        procDuration: 'Typical total: 8–12 weeks.',
        procCta: 'Start my process',
        procSteps: [
          { t: 'Consultation', d: 'We review your goals and the right program.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Pre-validation', d: 'Documents checked before you travel.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operational day', d: 'All in-person steps executed in one day.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Delivery', d: 'You receive documents and we close the program.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Recommended',
        progTitle: 'Paraguay Base',
        progSubtitle: 'The simplest starting point: residency + ID card. You can always upgrade later.',
        tierId: 'base',
        tierName: 'Paraguay Base',
        tierDesc: 'Paraguayan residency + ID card.',
        tierNote: 'Complete package includes all fees and taxes.',
        tierIncluded: [
          'Paraguayan residency',
          'Identity card',
          'Document pre-validation',
          'On-site operational day',
          'Logistics support',
        ],
        tierCta: 'Request consultation',
        ctaTitle: 'Your new start in Paraguay',
        ctaSub: 'Book a free 30-minute consultation to see if it fits.',
        ctaBtn: 'Book consultation',
      }),
      empresa: buildLanding(locale, 'company', {
        title: 'A Paraguayan company, opened properly',
        description: 'Residency + company + RUC + bank account. Integrated in one program with Nexa Paraguay.',
        eyebrow: 'Company setup',
        headline: 'A Paraguayan company, opened properly.',
        subheadline: 'Residency, company, RUC and a corporate bank account — integrated in one trip, executed by a local professional team.',
        ctaPrimary: 'Book a free 30-min consultation',
        ctaSecondary: 'See the programs',
        trustEyebrow: 'What you get',
        trustTitle: 'What Paraguay Business covers',
        trustItems: [
          { icon: 'Package', title: 'Company + residency', desc: 'Both processes integrated — not sold separately.' },
          { icon: 'Landmark', title: 'Bank account', desc: 'Corporate account coordinated with our banking partners.' },
          { icon: 'Users', title: 'Technical team', desc: 'Lawyers, accountants and notaries working together.' },
          { icon: 'Shield', title: 'Transparent pricing', desc: 'Fees, VAT and official taxes included.' },
        ],
        procEyebrow: 'How it works',
        procTitle: 'Opening a company in 4 steps',
        procDuration: 'Typical total: 8–12 weeks.',
        procCta: 'Start my process',
        procSteps: [
          { t: 'Consultation', d: 'We map the right legal structure (typically EAS or SA).', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Pre-validation', d: 'Everything checked before you travel.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operational day', d: 'Incorporation, RUC, notarisation — single day.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Bank + delivery', d: 'Bank account opened and final documents delivered.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Recommended',
        progTitle: 'Paraguay Business',
        progSubtitle: 'Residency + company + bank account, integrated in a single program.',
        tierId: 'business',
        tierName: 'Paraguay Business',
        tierDesc: 'Residency + company + bank account.',
        tierNote: 'Starting price. Final quote depends on case requirements.',
        tierIncluded: [
          'Paraguayan residency + ID card',
          'Company incorporation + RUC',
          'Corporate bank account',
          'Strategic real-estate tour',
          'Fees, VAT and official taxes included',
        ],
        tierCta: 'Request consultation',
        ctaTitle: 'Open your Paraguayan company properly',
        ctaSub: 'Book a free 30-minute consultation with our team.',
        ctaBtn: 'Book consultation',
      }),
    },
    es: {
      inversor: buildLanding(locale, 'investor', {
        title: 'Paraguay para inversionistas — un camino estructurado',
        description: 'Residencia, empresa, cuenta bancaria y compra de tierras — un programa inversor integrado. Sin sorpresas.',
        eyebrow: 'Programa inversionista',
        headline: 'Paraguay, estructurado para inversionistas.',
        subheadline: 'Residencia, empresa, cuenta bancaria y acompañamiento contable por 12 meses — integrado, transparente, ejecutado por un equipo profesional local.',
        ctaPrimary: 'Agendá una consulta gratuita de 30 min',
        ctaSecondary: 'Ver el programa inversor',
        trustEyebrow: 'Lo que recibís',
        trustTitle: 'Qué distingue al programa inversor',
        trustItems: [
          { icon: 'TrendingUp', title: 'Crecimiento estructurado', desc: 'Asesoría fiscal incluida por 12 meses — vos operás, nosotros cumplimos.' },
          { icon: 'Shield', title: 'Confianza institucional', desc: 'Abogados, contadores y escribanos en un equipo coordinado.' },
          { icon: 'Users', title: 'Acceso directo', desc: 'Línea directa con el equipo técnico en todas las etapas.' },
          { icon: 'LineChart', title: 'Precio transparente', desc: 'Todo incluido. Sin costos ocultos.' },
        ],
        procEyebrow: 'Cómo funciona',
        procTitle: '4 pasos, 8–12 semanas',
        procDuration: 'Total típico: 8–12 semanas.',
        procCta: 'Iniciar mi proceso',
        procSteps: [
          { t: 'Consulta', d: 'Revisamos tu situación y definimos el programa.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Prevalidación', d: 'Documentos revisados antes de viajar.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Día operativo', d: 'Residencia, empresa y banco en un solo día coordinado.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Entrega', d: 'Documentos finales y continuidad contable.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Recomendado',
        progTitle: 'Programa Inversor',
        progSubtitle: 'Todo lo necesario para operar en Paraguay — más 12 meses de acompañamiento.',
        tierId: 'investor',
        tierName: 'Paraguay Inversor',
        tierDesc: 'Residencia + empresa + banco + 12 meses de apoyo.',
        tierNote: 'Precio inicial. Cotización final según requerimientos.',
        tierIncluded: [
          'Residencia paraguaya y cédula',
          'Constitución de empresa + RUC',
          'Cuenta bancaria corporativa',
          'Contabilidad (12 meses)',
          'Asesoría legal y fiscal (12 meses)',
          'Acceso directo al equipo técnico',
        ],
        tierCta: 'Solicitar consulta',
        ctaTitle: '¿Listo para estructurar tu proyecto?',
        ctaSub: 'Agendá una consulta gratuita de 30 minutos — español, inglés, holandés o alemán.',
        ctaBtn: 'Agendar consulta',
      }),
      trust: buildLanding(locale, 'trust', {
        title: 'Confianza institucional, construida por profesionales locales',
        description: 'Un sistema integrado, no una gestoría. Abogados, contadores, escribanos y asesores financieros.',
        eyebrow: 'Confianza institucional',
        headline: 'Gente seria. Estructura seria.',
        subheadline: 'No somos una gestoría. Somos un equipo técnico multidisciplinario con capital relacional en bancos, escribanías y autoridades.',
        ctaPrimary: 'Agendá una consulta gratuita',
        ctaSecondary: 'Ver el proceso',
        trustEyebrow: 'Por qué Nexa',
        trustTitle: 'Un sistema integrado',
        trustItems: [
          { icon: 'Package', title: 'Un programa', desc: 'Residencia, empresa y banco integrados.' },
          { icon: 'Plane', title: 'Un viaje', desc: 'Todo lo presencial en un solo día coordinado.' },
          { icon: 'Users', title: 'Un equipo', desc: 'Abogados, contadores, escribanos y asesores financieros.' },
          { icon: 'Shield', title: 'Precio transparente', desc: 'Todo incluido. Sin costos ocultos.' },
        ],
        procEyebrow: 'Cómo funciona',
        procTitle: 'Un proceso claro, sin improvisación',
        procDuration: 'Total típico: 8–12 semanas.',
        procCta: 'Iniciar mi proceso',
        procSteps: [
          { t: 'Consulta', d: 'Revisamos tu caso antes de todo.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Prevalidación', d: 'Todo verificado antes del viaje.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Día operativo', d: 'Todos los pasos presenciales en un día.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Entrega', d: 'Documentos finales entregados personalmente.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Recomendado',
        progTitle: 'Paraguay Business',
        progSubtitle: 'El programa central — un viaje, un equipo, un resultado integrado.',
        tierId: 'business',
        tierName: 'Paraguay Business',
        tierDesc: 'Residencia + empresa + cuenta bancaria.',
        tierNote: 'Precio inicial. Cotización final según requerimientos.',
        tierIncluded: [
          'Residencia + cédula',
          'Constitución de empresa + RUC',
          'Cuenta bancaria corporativa',
          'Tour inmobiliario estratégico',
          'Honorarios, IVA e impuestos incluidos',
        ],
        tierCta: 'Solicitar consulta',
        ctaTitle: 'Hacelo bien una sola vez',
        ctaSub: 'Agendá una consulta gratuita de 30 minutos con nuestro equipo.',
        ctaBtn: 'Agendar consulta',
      }),
      lifestyle: buildLanding(locale, 'lifestyle', {
        title: 'Una base más tranquila en Paraguay',
        description: 'Buen clima, bajo costo de vida, comunidad internacional en crecimiento, sistema fiscal territorial.',
        eyebrow: 'Calidad de vida',
        headline: 'Una base más tranquila en Paraguay.',
        subheadline: 'Clima cálido, comunidad internacional en crecimiento, costo de vida favorable y un sistema tributario territorial que solo grava ingresos locales.',
        ctaPrimary: 'Agendá una consulta gratuita',
        ctaSecondary: 'Por qué Paraguay',
        whyEyebrow: 'Lo que recibís',
        whyTitle: 'Tres razones reales para mudarte',
        whyPillars: [
          { icon: 'Heart', title: 'Calidad de vida', desc: 'Clima cálido, costos accesibles, poder adquisitivo significativo.', img: 'whyParaguay.lifestyle' },
          { icon: 'Users', title: 'Comunidad internacional', desc: 'Comunidad creciente de expats e inversionistas.', img: 'whyParaguay.community' },
          { icon: 'Landmark', title: 'Estabilidad fiscal', desc: 'Sistema territorial — ingresos externos no tributan en Paraguay.', img: 'whyParaguay.tax' },
        ],
        procEyebrow: 'Cómo funciona',
        procTitle: '4 pasos, un viaje',
        procDuration: 'Total típico: 8–12 semanas.',
        procCta: 'Iniciar mi proceso',
        procSteps: [
          { t: 'Consulta', d: 'Definimos el programa adecuado.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Prevalidación', d: 'Documentos revisados antes del viaje.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Día operativo', d: 'Todo lo presencial en un día.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Entrega', d: 'Recibís documentos y cerramos el programa.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Recomendado',
        progTitle: 'Paraguay Base',
        progSubtitle: 'El punto de partida más simple: residencia + cédula. Podés ampliar después.',
        tierId: 'base',
        tierName: 'Paraguay Base',
        tierDesc: 'Residencia paraguaya + cédula.',
        tierNote: 'Paquete completo con honorarios e impuestos.',
        tierIncluded: [
          'Residencia paraguaya',
          'Cédula de identidad',
          'Prevalidación de documentos',
          'Día operativo presencial',
          'Soporte logístico',
        ],
        tierCta: 'Solicitar consulta',
        ctaTitle: 'Tu nuevo comienzo en Paraguay',
        ctaSub: 'Agendá una consulta gratuita de 30 minutos.',
        ctaBtn: 'Agendar consulta',
      }),
      empresa: buildLanding(locale, 'company', {
        title: 'Una empresa paraguaya, abierta correctamente',
        description: 'Residencia + empresa + RUC + cuenta bancaria. Integrado en un programa con Nexa Paraguay.',
        eyebrow: 'Apertura de empresa',
        headline: 'Una empresa paraguaya, abierta correctamente.',
        subheadline: 'Residencia, empresa, RUC y cuenta bancaria corporativa — integrado en un solo viaje, ejecutado por un equipo profesional local.',
        ctaPrimary: 'Agendá una consulta gratuita',
        ctaSecondary: 'Ver los programas',
        trustEyebrow: 'Lo que recibís',
        trustTitle: 'Qué cubre Paraguay Business',
        trustItems: [
          { icon: 'Package', title: 'Empresa + residencia', desc: 'Ambos procesos integrados — no se venden por separado.' },
          { icon: 'Landmark', title: 'Cuenta bancaria', desc: 'Cuenta corporativa coordinada con nuestros bancos socios.' },
          { icon: 'Users', title: 'Equipo técnico', desc: 'Abogados, contadores y escribanos trabajando juntos.' },
          { icon: 'Shield', title: 'Precio transparente', desc: 'Honorarios, IVA e impuestos incluidos.' },
        ],
        procEyebrow: 'Cómo funciona',
        procTitle: 'Abrir una empresa en 4 pasos',
        procDuration: 'Total típico: 8–12 semanas.',
        procCta: 'Iniciar mi proceso',
        procSteps: [
          { t: 'Consulta', d: 'Mapeamos la estructura legal (típicamente EAS o SA).', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Prevalidación', d: 'Todo revisado antes del viaje.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Día operativo', d: 'Constitución, RUC, escrituración — un solo día.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Banco + entrega', d: 'Cuenta abierta y documentos finales entregados.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Recomendado',
        progTitle: 'Paraguay Business',
        progSubtitle: 'Residencia + empresa + cuenta bancaria, integrado en un solo programa.',
        tierId: 'business',
        tierName: 'Paraguay Business',
        tierDesc: 'Residencia + empresa + cuenta bancaria.',
        tierNote: 'Precio inicial. Cotización final según requerimientos.',
        tierIncluded: [
          'Residencia + cédula',
          'Constitución de empresa + RUC',
          'Cuenta bancaria corporativa',
          'Tour inmobiliario estratégico',
          'Honorarios, IVA e impuestos incluidos',
        ],
        tierCta: 'Solicitar consulta',
        ctaTitle: 'Abrí tu empresa paraguaya correctamente',
        ctaSub: 'Agendá una consulta gratuita de 30 minutos con nuestro equipo.',
        ctaBtn: 'Agendar consulta',
      }),
    },
    nl: {
      inversor: buildLanding(locale, 'investor', {
        title: 'Paraguay voor investeerders — een gestructureerd pad',
        description: 'Residentie, bedrijf, bankrekening en grondaankoop — één geïntegreerd programma voor investeerders. Geen verrassingen.',
        eyebrow: 'Investeerdersprogramma',
        headline: 'Paraguay, gestructureerd voor investeerders.',
        subheadline: 'Residentie, bedrijf, bankrekening en 12 maanden boekhouding — geïntegreerd, transparant, uitgevoerd door een lokaal professioneel team.',
        ctaPrimary: 'Boek een gratis consult van 30 min',
        ctaSecondary: 'Bekijk het investeerdersprogramma',
        trustEyebrow: 'Wat u krijgt',
        trustTitle: 'Wat het investeerdersprogramma onderscheidt',
        trustItems: [
          { icon: 'TrendingUp', title: 'Gestructureerde groei', desc: 'Fiscaal advies inclusief 12 maanden — u runt, wij zorgen voor compliance.' },
          { icon: 'Shield', title: 'Institutioneel vertrouwen', desc: 'Advocaten, accountants en notarissen in één gecoördineerd team.' },
          { icon: 'Users', title: 'Directe toegang', desc: 'Directe lijn met het technisch team voor residentie, banken en operaties.' },
          { icon: 'LineChart', title: 'Transparante prijs', desc: 'Alles-inclusief. Geen verborgen kosten.' },
        ],
        procEyebrow: 'Hoe het werkt',
        procTitle: '4 stappen, ongeveer 8–12 weken',
        procDuration: 'Typisch totaal: 8–12 weken.',
        procCta: 'Start mijn proces',
        procSteps: [
          { t: 'Consult', d: 'We bekijken uw doelen en kiezen het juiste niveau.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Prevalidatie', d: 'Documenten gecontroleerd vóór u reist.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operationele dag', d: 'Residentie, bedrijf en bank in één gecoördineerde dag.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Oplevering', d: 'Definitieve documenten; boekhouding loopt door.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Aanbevolen',
        progTitle: 'Het Investeerdersprogramma',
        progSubtitle: 'Alles wat u nodig hebt om te opereren in Paraguay — plus 12 maanden begeleiding.',
        tierId: 'investor',
        tierName: 'Paraguay Investor',
        tierDesc: 'Residentie + bedrijf + bank + 12 maanden support.',
        tierNote: 'Vanafprijs. Definitieve offerte afhankelijk van dossier.',
        tierIncluded: [
          'Paraguayaanse residentie en ID',
          'Oprichting bedrijf + RUC',
          'Zakelijke bankrekening',
          'Boekhouding (12 maanden)',
          'Juridisch en fiscaal advies (12 maanden)',
          'Directe toegang tot technisch team',
        ],
        tierCta: 'Consult aanvragen',
        ctaTitle: 'Klaar om uw project te structureren?',
        ctaSub: 'Boek een gratis consult van 30 minuten — Nederlands, Engels, Spaans of Duits.',
        ctaBtn: 'Consult boeken',
      }),
      trust: buildLanding(locale, 'trust', {
        title: 'Institutioneel vertrouwen, opgebouwd door lokale professionals',
        description: 'Een geïntegreerd systeem, geen papierkantoor. Advocaten, accountants, notarissen en financieel adviseurs.',
        eyebrow: 'Institutioneel vertrouwen',
        headline: 'Serieuze mensen. Serieuze structuur.',
        subheadline: 'Wij zijn geen administratief bureau. Wij zijn een multidisciplinair technisch team met relationeel kapitaal bij banken, notarissen en autoriteiten.',
        ctaPrimary: 'Boek een gratis consult',
        ctaSecondary: 'Bekijk het proces',
        trustEyebrow: 'Waarom Nexa',
        trustTitle: 'Een geïntegreerd systeem',
        trustItems: [
          { icon: 'Package', title: 'Eén programma', desc: 'Residentie, bedrijf en bank geïntegreerd.' },
          { icon: 'Plane', title: 'Eén reis', desc: 'Alle fysieke stappen in één gecoördineerde dag.' },
          { icon: 'Users', title: 'Eén team', desc: 'Advocaten, accountants, notarissen, financieel adviseurs.' },
          { icon: 'Shield', title: 'Transparante prijs', desc: 'Alles-inclusief. Geen verborgen kosten.' },
        ],
        procEyebrow: 'Hoe het werkt',
        procTitle: 'Een helder proces, geen improvisatie',
        procDuration: 'Typisch totaal: 8–12 weken.',
        procCta: 'Start mijn proces',
        procSteps: [
          { t: 'Consult', d: 'We bekijken uw casus eerst.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Prevalidatie', d: 'Alles geverifieerd vóór uw reis.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operationele dag', d: 'Alle fysieke stappen in één dag.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Oplevering', d: 'Definitieve documenten persoonlijk overhandigd.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Aanbevolen',
        progTitle: 'Paraguay Business',
        progSubtitle: 'Het kernprogramma — één reis, één team, één geïntegreerd resultaat.',
        tierId: 'business',
        tierName: 'Paraguay Business',
        tierDesc: 'Residentie + bedrijf + bankrekening.',
        tierNote: 'Vanafprijs. Definitieve offerte afhankelijk van dossier.',
        tierIncluded: [
          'Paraguayaanse residentie + ID',
          'Oprichting bedrijf + RUC',
          'Zakelijke bankrekening',
          'Strategische vastgoedtour',
          'Honoraria, BTW en belastingen inbegrepen',
        ],
        tierCta: 'Consult aanvragen',
        ctaTitle: 'Doe het één keer, doe het goed',
        ctaSub: 'Boek een gratis consult van 30 minuten met ons team.',
        ctaBtn: 'Consult boeken',
      }),
      lifestyle: buildLanding(locale, 'lifestyle', {
        title: 'Een rustigere basis in Paraguay',
        description: 'Goed klimaat, lage kosten van levensonderhoud, groeiende internationale gemeenschap, territoriaal belastingsysteem.',
        eyebrow: 'Levenskwaliteit',
        headline: 'Een rustigere basis in Paraguay.',
        subheadline: 'Warm klimaat, groeiende internationale gemeenschap, gunstige leefkosten en een territoriaal belastingsysteem dat alleen lokaal inkomen belast.',
        ctaPrimary: 'Boek een gratis consult',
        ctaSecondary: 'Waarom Paraguay',
        whyEyebrow: 'Wat u krijgt',
        whyTitle: 'Drie echte redenen om te verhuizen',
        whyPillars: [
          { icon: 'Heart', title: 'Levenskwaliteit', desc: 'Warm klimaat, toegankelijke kosten, aanzienlijke koopkracht.', img: 'whyParaguay.lifestyle' },
          { icon: 'Users', title: 'Internationale gemeenschap', desc: 'Groeiende gemeenschap van expats en investeerders.', img: 'whyParaguay.community' },
          { icon: 'Landmark', title: 'Fiscale stabiliteit', desc: 'Territoriaal systeem — buitenlands inkomen wordt niet belast.', img: 'whyParaguay.tax' },
        ],
        procEyebrow: 'Hoe het werkt',
        procTitle: '4 stappen, één reis',
        procDuration: 'Typisch totaal: 8–12 weken.',
        procCta: 'Start mijn proces',
        procSteps: [
          { t: 'Consult', d: 'We bepalen het juiste programma.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Prevalidatie', d: 'Documenten gecontroleerd vóór u reist.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operationele dag', d: 'Alle fysieke stappen in één dag.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Oplevering', d: 'Definitieve documenten; programma gesloten.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Aanbevolen',
        progTitle: 'Paraguay Base',
        progSubtitle: 'Het eenvoudigste startpunt: residentie + ID. U kunt later uitbreiden.',
        tierId: 'base',
        tierName: 'Paraguay Base',
        tierDesc: 'Paraguayaanse residentie + ID.',
        tierNote: 'Compleet pakket met honoraria en belastingen.',
        tierIncluded: [
          'Paraguayaanse residentie',
          'Identiteitskaart',
          'Prevalidatie van documenten',
          'Operationele dag ter plaatse',
          'Logistieke ondersteuning',
        ],
        tierCta: 'Consult aanvragen',
        ctaTitle: 'Uw nieuwe start in Paraguay',
        ctaSub: 'Boek een gratis consult van 30 minuten.',
        ctaBtn: 'Consult boeken',
      }),
      empresa: buildLanding(locale, 'company', {
        title: 'Een Paraguayaans bedrijf, goed opgericht',
        description: 'Residentie + bedrijf + RUC + bankrekening. Geïntegreerd in één programma met Nexa Paraguay.',
        eyebrow: 'Bedrijfsoprichting',
        headline: 'Een Paraguayaans bedrijf, goed opgericht.',
        subheadline: 'Residentie, bedrijf, RUC en een zakelijke bankrekening — geïntegreerd in één reis, uitgevoerd door een lokaal professioneel team.',
        ctaPrimary: 'Boek een gratis consult',
        ctaSecondary: 'Bekijk de programmas',
        trustEyebrow: 'Wat u krijgt',
        trustTitle: 'Wat Paraguay Business dekt',
        trustItems: [
          { icon: 'Package', title: 'Bedrijf + residentie', desc: 'Beide processen geïntegreerd — niet apart verkocht.' },
          { icon: 'Landmark', title: 'Bankrekening', desc: 'Zakelijke rekening gecoördineerd met onze bankpartners.' },
          { icon: 'Users', title: 'Technisch team', desc: 'Advocaten, accountants en notarissen die samenwerken.' },
          { icon: 'Shield', title: 'Transparante prijs', desc: 'Honoraria, BTW en belastingen inbegrepen.' },
        ],
        procEyebrow: 'Hoe het werkt',
        procTitle: 'Een bedrijf oprichten in 4 stappen',
        procDuration: 'Typisch totaal: 8–12 weken.',
        procCta: 'Start mijn proces',
        procSteps: [
          { t: 'Consult', d: 'We kiezen de juiste juridische structuur (doorgaans EAS of SA).', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Prevalidatie', d: 'Alles gecontroleerd vóór u reist.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operationele dag', d: 'Oprichting, RUC, notariële akte — één dag.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Bank + oplevering', d: 'Rekening geopend en documenten geleverd.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Aanbevolen',
        progTitle: 'Paraguay Business',
        progSubtitle: 'Residentie + bedrijf + bankrekening, geïntegreerd in één programma.',
        tierId: 'business',
        tierName: 'Paraguay Business',
        tierDesc: 'Residentie + bedrijf + bankrekening.',
        tierNote: 'Vanafprijs. Definitieve offerte afhankelijk van dossier.',
        tierIncluded: [
          'Paraguayaanse residentie + ID',
          'Oprichting bedrijf + RUC',
          'Zakelijke bankrekening',
          'Strategische vastgoedtour',
          'Honoraria, BTW en belastingen inbegrepen',
        ],
        tierCta: 'Consult aanvragen',
        ctaTitle: 'Richt uw Paraguayaans bedrijf goed op',
        ctaSub: 'Boek een gratis consult van 30 minuten.',
        ctaBtn: 'Consult boeken',
      }),
    },
    de: {
      inversor: buildLanding(locale, 'investor', {
        title: 'Paraguay für Investoren — ein strukturierter Weg',
        description: 'Aufenthalt, Unternehmen, Bankkonto und Grunderwerb — ein integriertes Investorenprogramm. Keine Überraschungen.',
        eyebrow: 'Investorenprogramm',
        headline: 'Paraguay, strukturiert für Investoren.',
        subheadline: 'Aufenthalt, Unternehmen, Bankkonto und 12-monatige Buchhaltung — integriert, transparent, von einem lokalen Fachteam ausgeführt.',
        ctaPrimary: 'Kostenloses 30-Min-Gespräch buchen',
        ctaSecondary: 'Investorenprogramm ansehen',
        trustEyebrow: 'Was Sie erhalten',
        trustTitle: 'Was das Investorenprogramm auszeichnet',
        trustItems: [
          { icon: 'TrendingUp', title: 'Strukturiertes Wachstum', desc: 'Steuerberatung 12 Monate inklusive — Sie führen, wir sorgen für Compliance.' },
          { icon: 'Shield', title: 'Institutionelles Vertrauen', desc: 'Juristen, Steuerberater und Notare in einem koordinierten Team.' },
          { icon: 'Users', title: 'Direkter Zugang', desc: 'Direkte Linie zum technischen Team über alle Phasen.' },
          { icon: 'LineChart', title: 'Transparente Preise', desc: 'Alles inklusive. Keine versteckten Kosten.' },
        ],
        procEyebrow: 'So funktioniert es',
        procTitle: '4 Schritte, ca. 8–12 Wochen',
        procDuration: 'Typische Gesamtdauer: 8–12 Wochen.',
        procCta: 'Prozess starten',
        procSteps: [
          { t: 'Beratung', d: 'Wir prüfen Ihre Ziele und wählen das richtige Niveau.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Vorvalidierung', d: 'Dokumente geprüft, bevor Sie reisen.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operativer Tag', d: 'Aufenthalt, Unternehmen und Bank an einem Tag.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Abschluss', d: 'Finale Dokumente; Buchhaltung läuft weiter.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Empfohlen',
        progTitle: 'Das Investorenprogramm',
        progSubtitle: 'Alles zum Operieren in Paraguay — plus 12 Monate Begleitung.',
        tierId: 'investor',
        tierName: 'Paraguay Investor',
        tierDesc: 'Aufenthalt + Unternehmen + Bank + 12 Monate Support.',
        tierNote: 'Einstiegspreis. Endpreis abhängig vom Fall.',
        tierIncluded: [
          'Paraguayischer Aufenthalt und ID',
          'Unternehmensgründung + RUC',
          'Geschäftsbankkonto',
          'Buchhaltung (12 Monate)',
          'Rechts- und Steuerberatung (12 Monate)',
          'Direkter Zugang zum technischen Team',
        ],
        tierCta: 'Beratung anfragen',
        ctaTitle: 'Bereit, Ihr Projekt zu strukturieren?',
        ctaSub: 'Buchen Sie ein kostenloses 30-Minuten-Gespräch — Deutsch, Englisch, Niederländisch oder Spanisch.',
        ctaBtn: 'Beratung buchen',
      }),
      trust: buildLanding(locale, 'trust', {
        title: 'Institutionelles Vertrauen, aufgebaut von lokalen Fachleuten',
        description: 'Ein integriertes System, keine Behördenagentur. Juristen, Steuerberater, Notare und Finanzberater.',
        eyebrow: 'Institutionelles Vertrauen',
        headline: 'Ernsthafte Menschen. Ernsthafte Struktur.',
        subheadline: 'Wir sind keine Verwaltungsagentur. Wir sind ein multidisziplinäres Fachteam mit relationalem Kapital bei Banken, Notaren und Behörden.',
        ctaPrimary: 'Kostenloses Gespräch buchen',
        ctaSecondary: 'Unseren Prozess ansehen',
        trustEyebrow: 'Warum Nexa',
        trustTitle: 'Ein integriertes System',
        trustItems: [
          { icon: 'Package', title: 'Ein Programm', desc: 'Aufenthalt, Unternehmen und Bank integriert.' },
          { icon: 'Plane', title: 'Eine Reise', desc: 'Alle Vor-Ort-Schritte an einem koordinierten Tag.' },
          { icon: 'Users', title: 'Ein Team', desc: 'Juristen, Steuerberater, Notare, Finanzberater.' },
          { icon: 'Shield', title: 'Transparente Preise', desc: 'Alles inklusive. Keine versteckten Kosten.' },
        ],
        procEyebrow: 'So funktioniert es',
        procTitle: 'Ein klarer Prozess, keine Improvisation',
        procDuration: 'Typische Gesamtdauer: 8–12 Wochen.',
        procCta: 'Prozess starten',
        procSteps: [
          { t: 'Beratung', d: 'Wir prüfen Ihren Fall zuerst.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Vorvalidierung', d: 'Alles vor Ihrer Reise verifiziert.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operativer Tag', d: 'Alle Vor-Ort-Schritte an einem Tag.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Abschluss', d: 'Finale Dokumente persönlich übergeben.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Empfohlen',
        progTitle: 'Paraguay Business',
        progSubtitle: 'Das Kernprogramm — eine Reise, ein Team, ein integriertes Ergebnis.',
        tierId: 'business',
        tierName: 'Paraguay Business',
        tierDesc: 'Aufenthalt + Unternehmen + Bankkonto.',
        tierNote: 'Einstiegspreis. Endpreis abhängig vom Fall.',
        tierIncluded: [
          'Aufenthalt + ID',
          'Unternehmensgründung + RUC',
          'Geschäftsbankkonto',
          'Strategische Immobilientour',
          'Honorare, MwSt. und Steuern inklusive',
        ],
        tierCta: 'Beratung anfragen',
        ctaTitle: 'Einmal machen, richtig machen',
        ctaSub: 'Buchen Sie ein kostenloses 30-Minuten-Gespräch.',
        ctaBtn: 'Beratung buchen',
      }),
      lifestyle: buildLanding(locale, 'lifestyle', {
        title: 'Eine ruhigere Basis in Paraguay',
        description: 'Gutes Klima, niedrige Lebenshaltungskosten, wachsende internationale Gemeinschaft, territoriales Steuersystem.',
        eyebrow: 'Lebensqualität',
        headline: 'Eine ruhigere Basis in Paraguay.',
        subheadline: 'Warmes Klima, wachsende internationale Gemeinschaft, günstige Lebenshaltungskosten und ein territoriales Steuersystem, das nur lokales Einkommen besteuert.',
        ctaPrimary: 'Kostenloses Gespräch buchen',
        ctaSecondary: 'Warum Paraguay',
        whyEyebrow: 'Was Sie erhalten',
        whyTitle: 'Drei echte Gründe umzuziehen',
        whyPillars: [
          { icon: 'Heart', title: 'Lebensqualität', desc: 'Warmes Klima, zugängliche Kosten, hohe Kaufkraft.', img: 'whyParaguay.lifestyle' },
          { icon: 'Users', title: 'Internationale Gemeinschaft', desc: 'Wachsende Gemeinschaft von Expats und Investoren.', img: 'whyParaguay.community' },
          { icon: 'Landmark', title: 'Steuerstabilität', desc: 'Territoriales System — ausländisches Einkommen wird nicht besteuert.', img: 'whyParaguay.tax' },
        ],
        procEyebrow: 'So funktioniert es',
        procTitle: '4 Schritte, eine Reise',
        procDuration: 'Typische Gesamtdauer: 8–12 Wochen.',
        procCta: 'Prozess starten',
        procSteps: [
          { t: 'Beratung', d: 'Wir bestimmen das richtige Programm.', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Vorvalidierung', d: 'Dokumente vor der Reise geprüft.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operativer Tag', d: 'Alle Vor-Ort-Schritte an einem Tag.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Abschluss', d: 'Finale Dokumente; Programm geschlossen.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Empfohlen',
        progTitle: 'Paraguay Base',
        progSubtitle: 'Der einfachste Einstieg: Aufenthalt + ID. Später erweiterbar.',
        tierId: 'base',
        tierName: 'Paraguay Base',
        tierDesc: 'Paraguayischer Aufenthalt + ID.',
        tierNote: 'Komplettpaket mit Honoraren und Steuern.',
        tierIncluded: [
          'Paraguayischer Aufenthalt',
          'Personalausweis',
          'Vorvalidierung der Dokumente',
          'Vor-Ort-Operationstag',
          'Logistische Unterstützung',
        ],
        tierCta: 'Beratung anfragen',
        ctaTitle: 'Ihr neuer Start in Paraguay',
        ctaSub: 'Buchen Sie ein kostenloses 30-Minuten-Gespräch.',
        ctaBtn: 'Beratung buchen',
      }),
      empresa: buildLanding(locale, 'company', {
        title: 'Ein paraguayisches Unternehmen, richtig gegründet',
        description: 'Aufenthalt + Unternehmen + RUC + Bankkonto. Integriert in einem Programm mit Nexa Paraguay.',
        eyebrow: 'Unternehmensgründung',
        headline: 'Ein paraguayisches Unternehmen, richtig gegründet.',
        subheadline: 'Aufenthalt, Unternehmen, RUC und ein Geschäftsbankkonto — integriert in einer Reise, ausgeführt von einem lokalen Fachteam.',
        ctaPrimary: 'Kostenloses Gespräch buchen',
        ctaSecondary: 'Programme ansehen',
        trustEyebrow: 'Was Sie erhalten',
        trustTitle: 'Was Paraguay Business abdeckt',
        trustItems: [
          { icon: 'Package', title: 'Unternehmen + Aufenthalt', desc: 'Beide Prozesse integriert — nicht separat verkauft.' },
          { icon: 'Landmark', title: 'Bankkonto', desc: 'Geschäftskonto koordiniert mit unseren Bankpartnern.' },
          { icon: 'Users', title: 'Fachteam', desc: 'Juristen, Steuerberater und Notare arbeiten zusammen.' },
          { icon: 'Shield', title: 'Transparente Preise', desc: 'Honorare, MwSt. und Steuern inklusive.' },
        ],
        procEyebrow: 'So funktioniert es',
        procTitle: 'Unternehmensgründung in 4 Schritten',
        procDuration: 'Typische Gesamtdauer: 8–12 Wochen.',
        procCta: 'Prozess starten',
        procSteps: [
          { t: 'Beratung', d: 'Wir wählen die Rechtsform (meist EAS oder SA).', i: 'MessageCircle', img: 'process.consultation' },
          { t: 'Vorvalidierung', d: 'Alles vor der Reise geprüft.', i: 'FileCheck', img: 'process.documents' },
          { t: 'Operativer Tag', d: 'Gründung, RUC, Notar — ein Tag.', i: 'MapPin', img: 'process.arrival' },
          { t: 'Bank + Abschluss', d: 'Konto eröffnet, Dokumente geliefert.', i: 'CheckCircle', img: 'process.completion' },
        ],
        progEyebrow: 'Empfohlen',
        progTitle: 'Paraguay Business',
        progSubtitle: 'Aufenthalt + Unternehmen + Bankkonto, integriert in einem Programm.',
        tierId: 'business',
        tierName: 'Paraguay Business',
        tierDesc: 'Aufenthalt + Unternehmen + Bankkonto.',
        tierNote: 'Einstiegspreis. Endpreis abhängig vom Fall.',
        tierIncluded: [
          'Aufenthalt + ID',
          'Unternehmensgründung + RUC',
          'Geschäftsbankkonto',
          'Strategische Immobilientour',
          'Honorare, MwSt. und Steuern inklusive',
        ],
        tierCta: 'Beratung anfragen',
        ctaTitle: 'Gründen Sie Ihr paraguayisches Unternehmen richtig',
        ctaSub: 'Buchen Sie ein kostenloses 30-Minuten-Gespräch.',
        ctaBtn: 'Beratung buchen',
      }),
    },
  }

  return {
    landingInversor: T[locale].inversor,
    landingTrust: T[locale].trust,
    landingLifestyle: T[locale].lifestyle,
    landingEmpresa: T[locale].empresa,
  }
}

// Helper to assemble a LandingCopy given compact per-locale inputs.
interface LandingInputs {
  title: string
  description: string
  eyebrow: string
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary?: string
  trustEyebrow?: string
  trustTitle?: string
  trustItems?: Array<{ icon: string; title: string; desc: string }>
  whyEyebrow?: string
  whyTitle?: string
  whyPillars?: Array<{ icon: string; title: string; desc: string; img?: string }>
  procEyebrow: string
  procTitle: string
  procDuration: string
  procCta: string
  procSteps: Array<{ t: string; d: string; i: string; img: string }>
  progEyebrow: string
  progTitle: string
  progSubtitle: string
  tierId: 'base' | 'business' | 'investor'
  tierName: string
  tierDesc: string
  tierNote: string
  tierIncluded: string[]
  tierCta: string
  ctaTitle: string
  ctaSub: string
  ctaBtn: string
}

function buildLanding(
  locale: Locale,
  campaign: string,
  i: LandingInputs,
): LandingCopy {
  const heroImageByCampaign: Record<string, string> = {
    investor: '@img:whyParaguay.growth',
    trust: '@img:trust.migraciones',
    lifestyle: '@img:whyParaguay.lifestyle',
    company: '@img:programs.tierBusiness',
  }
  const out: LandingCopy = {
    seo: { title: i.title, description: i.description },
    hero: {
      eyebrow: i.eyebrow,
      headline: i.headline,
      subheadline: i.subheadline,
      ctaPrimaryText: i.ctaPrimary,
      ctaPrimaryHref: utm(locale, campaign, 'cta-hero-primary'),
      ctaSecondaryText: i.ctaSecondary,
      ctaSecondaryHref: `/s/${locale}/nexa-paraguay/programas`,
      backgroundImage: heroImageByCampaign[campaign] ?? '@img:hero.home',
    },
    process: {
      eyebrow: i.procEyebrow,
      title: i.procTitle,
      totalDuration: i.procDuration,
      ctaLabel: i.procCta,
      ctaHref: utm(locale, campaign, 'cta-process'),
      steps: i.procSteps.map((s, idx) => ({
        number: idx + 1,
        title: s.t,
        description: s.d,
        icon: s.i,
        image: { $img: s.img },
      })),
    },
    programs: {
      eyebrow: i.progEyebrow,
      title: i.progTitle,
      subtitle: i.progSubtitle,
      tiers: [
        tier(i.tierId, locale, campaign, {
          name: i.tierName,
          description: i.tierDesc,
          priceNote: i.tierNote,
          included: i.tierIncluded,
          ctaLabel: i.tierCta,
        }),
      ],
    },
    cta: {
      title: i.ctaTitle,
      subtitle: i.ctaSub,
      buttonText: i.ctaBtn,
      buttonHref: utm(locale, campaign, 'cta-final'),
    },
  }
  if (i.trustItems && i.trustEyebrow && i.trustTitle) {
    out.trust = {
      eyebrow: i.trustEyebrow,
      title: i.trustTitle,
      items: i.trustItems.map((x) => ({
        icon: x.icon,
        title: x.title,
        description: x.desc,
      })),
    }
  }
  if (i.whyPillars && i.whyEyebrow && i.whyTitle) {
    out.whyCountry = {
      eyebrow: i.whyEyebrow,
      title: i.whyTitle,
      pillars: i.whyPillars.map((p) => ({
        icon: p.icon,
        title: p.title,
        description: p.desc,
        imageUrl: p.img ? `@src:${p.img}` : undefined,
      })),
    }
  }
  return out
}

function processLocale(locale: Locale): void {
  const file = path.join(CONTENT_DIR, `${locale}.json`)
  const raw = fs.readFileSync(file, 'utf-8')
  const json = JSON.parse(raw) as Record<string, unknown>

  const existingKey = Object.keys(json).find((k) => k.startsWith('landing'))
  if (existingKey) {
    console.log(`[${locale}] already has landing content (${existingKey}) — skipping`)
    return
  }

  const landings = copy(locale)
  const merged: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(json)) {
    if (k === 'whatsapp') {
      // Insert landings before whatsapp so file stays readable.
      for (const [lk, lv] of Object.entries(landings)) merged[lk] = lv
    }
    merged[k] = v
  }

  fs.writeFileSync(file, JSON.stringify(merged, null, 2) + '\n')
  console.log(`[${locale}] added 4 landing sections`)
}

for (const locale of ['en', 'es', 'nl', 'de'] as Locale[]) {
  processLocale(locale)
}
