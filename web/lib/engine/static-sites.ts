/**
 * Static Site Configuration for Cloudflare Pages
 * This file is imported at build time to avoid Edge Runtime issues
 */

export const SITES = {
  'nexa-paraguay': {
    slug: 'nexa-paraguay',
    vertical: 'relocacion',
    country: 'Paraguay',
    domain: 'nexaparaguay.com',
    defaultLocale: 'nl',
    locales: ['nl', 'en', 'de', 'es'],
    pages: ['home', 'programas', 'por-que-paraguay', 'proceso', 'sobre', 'faq', 'blog', 'contacto', 'privacidad'],
  },
  'nexa-propiedades': {
    slug: 'nexa-propiedades',
    vertical: 'inmobiliaria',
    country: 'Paraguay',
    domain: 'nexapropiedades.com',
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    pages: ['home', 'propiedades', 'servicios', 'contacto', 'privacidad'],
  },
  'fun4me': {
    slug: 'fun4me',
    vertical: 'retail-local',
    country: 'Paraguay',
    domain: '',
    defaultLocale: 'es',
    locales: ['es'],
    pages: ['home', 'quienes-somos', 'suscripciones', 'bundles', 'placer-plus', 'gift-cards', 'loyalty', 'blog', 'legal', 'reserva-en-tienda', 'size-guide'],
  },
  'dayah-litworks': {
    slug: 'dayah-litworks',
    vertical: 'portfolio-professional',
    country: 'Paraguay',
    domain: 'dayah-litworks.com',
    defaultLocale: 'es',
    locales: ['es', 'en'],
    pages: ['home', 'servicios', 'catalogo', 'portafolio', 'faq', 'blog', 'contacto', 'sobre', 'terminos'],
  },
  'de-abasto-a-casa': {
    slug: 'de-abasto-a-casa',
    vertical: 'food-beverage',
    country: 'Paraguay',
    domain: 'deabastoacasa.com.py',
    defaultLocale: 'es',
    locales: ['es'],
    pages: ['home'],
  },
  'granja-cabral': {
    slug: 'granja-cabral',
    vertical: 'agriculture-agribusiness',
    country: 'Paraguay',
    domain: 'granjacabral.com.py',
    defaultLocale: 'es',
    locales: ['es'],
    pages: ['home'],
  },
  'stoicfinch': {
    slug: 'stoicfinch',
    vertical: 'technology-digital',
    country: 'Canada',
    domain: 'stoicfinch.com',
    defaultLocale: 'en',
    locales: ['en'],
    pages: ['home'],
  },
  'nudo': {
    slug: 'nudo',
    vertical: 'arts-entertainment-venues',
    country: 'Paraguay',
    domain: '',
    defaultLocale: 'es',
    locales: ['es'],
    pages: ['home', 'musica', 'videos', 'letras', 'shows', 'galeria', 'contacto'],
  },
  'bufete-mendez': {
    slug: 'bufete-mendez',
    vertical: 'b2b-professional',
    country: 'Paraguay',
    domain: '',
    defaultLocale: 'es',
    locales: ['es'],
    pages: ['home', 'servicios', 'equipo', 'casos', 'faq', 'contacto', 'privacidad', 'terminos'],
  },
  'demo-contador': {
    slug: 'demo-contador',
    vertical: 'b2b-professional',
    country: 'Paraguay',
    domain: '',
    defaultLocale: 'es',
    locales: ['es'],
    pages: ['home', 'servicios', 'team', 'contacto'],
  },
  'demo-estudio-contable': {
    slug: 'demo-estudio-contable',
    vertical: 'b2b-professional',
    country: 'Paraguay',
    domain: '',
    defaultLocale: 'es',
    locales: ['es'],
    pages: ['home', 'servicios', 'equipo', 'contacto'],
  },
  'alejandro-villamayor': {
    slug: 'alejandro-villamayor',
    vertical: 'b2b-professional',
    country: 'Paraguay',
    domain: '',
    defaultLocale: 'es',
    locales: ['es', 'en'],
    pages: ['home', 'servicios', 'investor-pass', 'inversionista', 'sobre-mi', 'faq', 'blog', 'contacto'],
  },
} as const

export type SiteSlug = keyof typeof SITES

export const DEFAULT_SITE = SITES['nexa-paraguay']