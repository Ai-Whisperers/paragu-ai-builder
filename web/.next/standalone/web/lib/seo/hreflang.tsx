/**
 * Hreflang helper for multi-language SEO.
 * 
 * Usage: Add to the Head of your page:
 * import { generateHreflang } from '@/lib/seo/hreflang'
 * 
 * const hreflangs = generateHreflang('/path', ['es', 'en', 'nl', 'de'], 'https://nexaparaguay.com')
 */

export interface HrefLang {
  hreflang: string
  href: string
}

export type Locale = 'es' | 'en' | 'nl' | 'de'

export const LOCALES: Record<Locale, string> = {
  es: 'es',
  en: 'en',
  nl: 'nl',
  de: 'de',
}

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Spanish',
  en: 'English',
  nl: 'Dutch',
  de: 'German',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  es: '🇵🇾',
  en: '🇬🇧',
  nl: '🇳🇱',
  de: '🇩🇪',
}

/**
 * Generate hreflang tags for a given path.
 * 
 * @param path - The URL path (e.g., '/blog/post-1')
 * @param locales - Array of available locales
 * @param baseUrl - Base URL without trailing slash (e.g., 'https://nexaparaguay.com')
 * @returns Array of { hreflang, href } objects
 */
export function generateHreflang(
  path: string,
  locales: Locale[],
  baseUrl: string,
): HrefLang[] {
  const results: HrefLang[] = []

  for (const locale of locales) {
    results.push({
      hreflang: locale,
      href: `${baseUrl}/${locale}${path === '/' ? '' : path}`,
    })
  }

  // Add x-default (usually the primary locale)
  const defaultLocale = locales[0]
  results.push({
    hreflang: 'x-default',
    href: `${baseUrl}/${defaultLocale}${path === '/' ? '' : path}`,
  })

  return results
}

/**
 * Generate hreflang HTML tags for direct insertion into <head>
 * 
 * @param path - The URL path
 * @param locales - Array of available locales  
 * @param baseUrl - Base URL
 * @returns HTML string with all link rel="alternate" tags
 */
export function generateHreflangHtml(
  path: string,
  locales: Locale[],
  baseUrl: string,
): string {
  const tags = generateHreflang(path, locales, baseUrl)

  return tags
    .map(
      (tag) =>
        `<link rel="alternate" hreflang="${tag.hreflang}" href="${tag.href}" />`,
    )
    .join('\n')
}

/**
 * Get locale from path prefix
 * 
 * @param segments - URL segments
 * @returns Locale or null
 */
export function getLocaleFromPath(segments: string[]): Locale | null {
  const first = segments[0]?.toLowerCase()
  if (first && first in LOCALES) {
    return first as Locale
  }
  return null
}

/**
 * Get path without locale prefix
 * 
 * @param segments - URL segments
 * @returns Path without locale prefix
 */
export function getPathWithoutLocale(segments: string[]): string {
  const first = segments[0]?.toLowerCase()
  if (first && first in LOCALES) {
    return '/' + segments.slice(1).join('/')
  }
  return '/' + segments.join('/')
}

export default {
  generateHreflang,
  generateHreflangHtml,
  getLocaleFromPath,
  getPathWithoutLocale,
  LOCALES,
  LOCALE_NAMES,
  LOCALE_FLAGS,
}