/**
 * Supported locales across the platform.
 * Sites opt into a subset via `site.json.locales`.
 */
export const ALL_LOCALES = ['en', 'es'] as const
export type Locale = (typeof ALL_LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: 'en-US',
  es: 'es',
}

export function isLocale(value: string): value is Locale {
  return (ALL_LOCALES as readonly string[]).includes(value)
}

export const DEFAULT_LOCALE: Locale = 'es'
