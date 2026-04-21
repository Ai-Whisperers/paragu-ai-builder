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
  'nexa-uruguay': {
    slug: 'nexa-uruguay',
    vertical: 'relocacion',
    country: 'Uruguay',
    domain: 'nexa-uruguay.com',
    defaultLocale: 'en',
    locales: ['en', 'es'],
    pages: ['home', 'programas', 'por-que-uruguay', 'proceso', 'sobre', 'faq', 'blog', 'contacto', 'privacidad'],
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
  // 'fun4me': {
  //   slug: 'fun4me',
  //   vertical: 'retail-local',
  //   country: 'Paraguay',
  //   domain: '',
  //   defaultLocale: 'es',
  //   locales: ['es'],
  //   pages: ['home', 'store', 'bundles', 'gift-cards', 'subscriptions', 'loyalty', 'size-guide', 'reserva-en-tienda'],
  // },
  'dayah-litworks': {
    slug: 'dayah-litworks',
    vertical: 'portfolio-professional',
    country: 'Paraguay',
    domain: 'dayah-litworks.com',
    defaultLocale: 'es',
    locales: ['es'],
    pages: ['home'],
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
} as const

export type SiteSlug = keyof typeof SITES

export const DEFAULT_SITE = SITES['nexa-paraguay']