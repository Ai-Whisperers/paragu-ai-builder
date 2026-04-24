/**
 * Supported locales across the platform.
 * Sites opt into a subset via `site.json.locales`.
 *
 * Kept in sync with the locales actually shipped by real tenants:
 *   - nexa-paraguay → nl, en, de, es
 *   - nexa-propiedades → es, en, pt
 *   - everyone else → es or en
 *
 * Before this was extended beyond en/es, the language switcher rendered
 * `aria-label="undefined"` for any tenant shipping nl/de/pt because the
 * lookup in LOCALE_LABELS fell off the end.
 */
export const ALL_LOCALES = ['en', 'es', 'nl', 'de', 'pt'] as const
export type Locale = (typeof ALL_LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  nl: 'Nederlands',
  de: 'Deutsch',
  pt: 'Português',
}

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: 'en-US',
  es: 'es',
  nl: 'nl-NL',
  de: 'de-DE',
  pt: 'pt-BR',
}

export function isLocale(value: string): value is Locale {
  return (ALL_LOCALES as readonly string[]).includes(value)
}

export const DEFAULT_LOCALE: Locale = 'es'
