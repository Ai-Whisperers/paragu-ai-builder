'use client'

import { usePathname } from 'next/navigation'

const LABELS: Record<string, string> = {
  en: 'Skip to main content',
  es: 'Saltar al contenido principal',
  de: 'Zum Hauptinhalt springen',
  pt: 'Ir para o conteúdo principal',
  nl: 'Naar hoofdinhoud',
}

function localeFromPath(pathname: string | null): string {
  if (!pathname) return 'es'
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 's' && parts[1] && LABELS[parts[1]]) return parts[1]
  if (parts[0] === 'en' && parts[1] === 'p') return 'en'
  return 'es'
}

export function SkipToContent({ targetId = 'main-content' }: { targetId?: string }) {
  const pathname = usePathname()
  const label = LABELS[localeFromPath(pathname)] ?? LABELS.es
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-[var(--primary-foreground)] focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--accent)]"
    >
      {label}
    </a>
  )
}
