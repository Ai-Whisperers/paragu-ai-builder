import { ALL_LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from './config'

export interface LocaleRoute {
  locale: Locale
  site: string
  pathSegments: string[]
}

export function parseLocaleRoute(pathname: string): LocaleRoute | null {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] !== 's' || !parts[1] || !parts[2]) return null
  const [, locale, site, ...rest] = parts
  if (!isLocale(locale)) return null
  return { locale, site, pathSegments: rest }
}

export function buildLocaleUrl(locale: Locale, site: string, path = ''): string {
  const trimmed = path.replace(/^\//, '').replace(/\/$/, '')
  return trimmed ? `/s/${locale}/${site}/${trimmed}` : `/s/${locale}/${site}`
}

export function alternatesFor(site: string, locales: Locale[], path: string) {
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = buildLocaleUrl(loc, site, path)
  }
  languages['x-default'] = buildLocaleUrl(
    locales.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : locales[0],
    site,
    path,
  )
  return languages
}

export { ALL_LOCALES, DEFAULT_LOCALE, isLocale }
export type { Locale }
