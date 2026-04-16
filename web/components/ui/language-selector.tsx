'use client'

import { useLocale, type Locale } from '@/lib/i18n/language-context'

const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  nl: 'NL',
  de: 'DE',
}

const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Espanol',
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
}

interface LanguageSelectorProps {
  supportedLocales: Locale[]
}

export function LanguageSelector({ supportedLocales }: LanguageSelectorProps) {
  const { locale, setLocale } = useLocale()

  if (supportedLocales.length <= 1) return null

  return (
    <div className="relative flex items-center gap-1">
      {supportedLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          title={LOCALE_NAMES[loc]}
          aria-label={`Switch to ${LOCALE_NAMES[loc]}`}
          aria-pressed={locale === loc}
          className="rounded px-2 py-1 text-xs font-semibold transition-colors"
          style={{
            backgroundColor: locale === loc ? 'var(--secondary)' : 'transparent',
            color: locale === loc ? 'var(--primary)' : 'var(--text-muted)',
            border: locale === loc ? 'none' : '1px solid var(--border)',
          }}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  )
}
