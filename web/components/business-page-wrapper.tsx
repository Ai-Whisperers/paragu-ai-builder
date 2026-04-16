'use client'

import { LanguageProvider, type Locale } from '@/lib/i18n/language-context'

interface BusinessPageWrapperProps {
  children: React.ReactNode
  supportedLocales: string[]
  defaultLocale: string
}

export function BusinessPageWrapper({
  children,
  supportedLocales,
  defaultLocale,
}: BusinessPageWrapperProps) {
  return (
    <LanguageProvider
      supportedLocales={supportedLocales as Locale[]}
      defaultLocale={defaultLocale as Locale}
    >
      {children}
    </LanguageProvider>
  )
}
