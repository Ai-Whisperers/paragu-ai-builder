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
    pages: ['index', 'programas', 'por-que-paraguay', 'proceso', 'sobre', 'faq', 'blog', 'contacto'],
  },
  'nexa-uruguay': {
    slug: 'nexa-uruguay',
    vertical: 'relocacion',
    country: 'Uruguay',
    domain: 'nexa-uruguay.com',
    defaultLocale: 'en',
    locales: ['en', 'es'],
    pages: ['index', 'programas', 'por-que-uruguay', 'proceso', 'sobre', 'faq', 'contacto'],
  },
} as const

export type SiteSlug = keyof typeof SITES

export const DEFAULT_SITE = SITES['nexa-paraguay']