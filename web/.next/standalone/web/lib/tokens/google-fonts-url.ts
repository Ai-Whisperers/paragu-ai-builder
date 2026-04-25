/**
 * Build a Google Fonts URL with subsetting so we don't ship 200 KB of
 * CJK glyphs we never use. LATAM tenants need `latin`, EU tenants
 * (Nexa NL/DE/etc.) need `latin-ext`.
 *
 * The existing resolver emits a simple `families=Foo&families=Bar` URL.
 * This helper wraps it with `&display=swap&subset=latin,latin-ext` so the
 * browser fetches only the relevant glyphs.
 */

export type FontSubset = 'latin' | 'latin-ext' | 'cyrillic' | 'greek'

export function buildGoogleFontsUrl(families: string[], locales: string[] = ['es']): string {
  if (!families.length) return ''

  // Default everyone gets `latin`. EU locales add `latin-ext`.
  const subsets = new Set<FontSubset>(['latin'])
  if (locales.some((l) => ['nl', 'de', 'pt', 'fr', 'it', 'sv', 'no', 'da', 'fi', 'pl', 'cs'].includes(l))) {
    subsets.add('latin-ext')
  }

  const parts: string[] = []
  for (const f of families) parts.push(`family=${f.replace(/ /g, '+')}`)
  parts.push('display=swap')
  parts.push(`subset=${[...subsets].join(',')}`)
  return `https://fonts.googleapis.com/css2?${parts.join('&')}`
}
