import { LOCALE_LABELS, type Locale } from '@/lib/i18n/config'
import { buildLocaleUrl } from '@/lib/i18n/routing'

export interface LanguageSwitcherProps {
  currentLocale: Locale
  availableLocales: Locale[]
  siteSlug: string
  currentPath?: string
}

export function LanguageSwitcher({
  currentLocale,
  availableLocales,
  siteSlug,
  currentPath = '',
}: LanguageSwitcherProps) {
  return (
    <nav aria-label="Language" className="flex items-center gap-2 text-sm">
      {availableLocales.map((loc) => {
        const href = buildLocaleUrl(loc, siteSlug, currentPath)
        const active = loc === currentLocale
        return (
          <a
            key={loc}
            href={href}
            hrefLang={loc}
            aria-current={active ? 'true' : undefined}
            className={
              active
                ? 'font-semibold uppercase tracking-wider text-[var(--secondary)]'
                : 'uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text)]'
            }
            title={LOCALE_LABELS[loc]}
          >
            {loc}
          </a>
        )
      })}
    </nav>
  )
}
