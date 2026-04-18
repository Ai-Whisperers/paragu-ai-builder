/**
 * Supported locales across the platform.
 * Sites opt into a subset via `site.json.locales`.
 */
export const ALL_LOCALES = ['nl', 'en', 'de', 'es', 'pt'] as const
export type Locale = (typeof ALL_LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
}

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  nl: 'nl-NL',
  en: 'en-US',
  de: 'de-DE',
  es: 'es',
  pt: 'pt-BR',
}

export function isLocale(value: string): value is Locale {
  return (ALL_LOCALES as readonly string[]).includes(value)
}

export const DEFAULT_LOCALE: Locale = 'en'
