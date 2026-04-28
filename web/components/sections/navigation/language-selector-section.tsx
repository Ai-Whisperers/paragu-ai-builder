'use client'

/**
 * Language selector — dropdown that redirects to /s/<locale>/<tenant>/<path>.
 * Content is passed in (no assumption about routing structure).
 */

export interface LanguageSelectorProps {
  locales: Array<{ code: string; label: string; flag?: string }>
  currentLocale: string
  /** URL pattern with {{locale}} placeholder. Defaults to swapping 1st path segment. */
  urlPattern?: string
  currentPath?: string
}

export function LanguageSelectorSection({
  locales,
  currentLocale,
  urlPattern,
  currentPath,
}: LanguageSelectorProps) {
  if (!locales?.length) return null

  function hrefFor(code: string): string {
    if (urlPattern) return urlPattern.replace('{{locale}}', code)
    if (typeof window === 'undefined' || !currentPath) return '#'
    // Swap the 1st non-empty path segment.
    const parts = currentPath.split('/').filter(Boolean)
    if (parts.length > 0) parts[0] = code
    return '/' + parts.join('/')
  }

  return (
    <div className="relative inline-block">
      <select
        value={currentLocale}
        onChange={(e) => {
          const href = hrefFor(e.target.value)
          if (typeof window !== 'undefined') window.location.href = href
        }}
        className="text-sm bg-surface border border-[var(--surface-light)] rounded px-2 py-1 text-foreground"
        aria-label="Seleccionar idioma"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.flag ? `${l.flag} ` : ''}
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
