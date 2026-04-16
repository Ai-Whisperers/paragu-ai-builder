'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type Locale = 'es' | 'en' | 'nl' | 'de'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (es: string, en?: string, nl?: string, de?: string) => string
}

const STORAGE_KEY = 'paragu-locale'
const DEFAULT_LOCALE: Locale = 'es'

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (es) => es,
})

export function LanguageProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
  supportedLocales = ['es'],
}: {
  children: React.ReactNode
  defaultLocale?: Locale
  supportedLocales?: Locale[]
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && supportedLocales.includes(stored)) {
      setLocaleState(stored)
    }
  }, [supportedLocales])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }, [])

  const t = useCallback(
    (es: string, en?: string, nl?: string, de?: string): string => {
      switch (locale) {
        case 'en': return en || es
        case 'nl': return nl || en || es
        case 'de': return de || en || es
        default: return es
      }
    },
    [locale]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLocale() {
  return useContext(LanguageContext)
}
