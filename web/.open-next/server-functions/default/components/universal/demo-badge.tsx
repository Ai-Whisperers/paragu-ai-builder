/**
 * Floating "DEMO" ribbon shown on tenant pages where `site.is_demo` is true.
 * Clear visual + text signal so prospects don't mistake demo content for a
 * real client. Click takes them to /demo (the qualifier flow) so the
 * recognition is also a conversion path.
 *
 * Renders nothing when `isDemo` is false — zero JS payload for real tenants.
 *
 * Top-right anchor keeps it clear of the bottom-right floating WhatsApp.
 *
 * Per BUG_HUNT_500 #298: dismissible per-session via sessionStorage so
 * prospects who already saw it can scroll without distraction. The flag
 * resets on next visit so we never permanently hide.
 *
 * Per BUG_HUNT_500 #300: pass `?demo=hide` to suppress for clean
 * screenshots in sales decks.
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type DemoBadgeProps = {
  isDemo?: boolean
  /**
   * Optional rubro slug to pre-fill on the demo qualifier
   * (e.g. "peluqueria" → /demo?v=peluqueria).
   */
  vertical?: string
  /** Active URL locale — picks localized badge label + aria-label. Defaults to 'es'. */
  locale?: string
}

const DISMISS_KEY = 'pa_demo_badge_dismissed'

const DEMO_LABELS: Record<string, { badge: string; aria: string; hide: string; hideTitle: string }> = {
  de: {
    badge: 'Demo · fordern Sie Ihre an',
    aria: 'Dies ist eine Demo-Website. Fordern Sie Ihre eigene in 48 Stunden an.',
    hide: 'Ausblenden',
    hideTitle: 'Diesen Hinweis für diese Sitzung ausblenden',
  },
  en: {
    badge: 'Demo · get yours',
    aria: 'This is a demo site. Get your own in 48 hours.',
    hide: 'Hide',
    hideTitle: 'Hide this notice for this session',
  },
  es: {
    badge: 'Demo · pedí el tuyo',
    aria: 'Este es un sitio de demostración. Pedí el tuyo en 48 horas.',
    hide: 'Ocultar',
    hideTitle: 'Ocultar este aviso por esta sesión',
  },
  nl: {
    badge: 'Demo · vraag de jouwe aan',
    aria: 'Dit is een demosite. Vraag je eigen site aan binnen 48 uur.',
    hide: 'Verbergen',
    hideTitle: 'Deze melding voor deze sessie verbergen',
  },
  pt: {
    badge: 'Demo · peça a sua',
    aria: 'Este é um site de demonstração. Peça o seu em 48 horas.',
    hide: 'Ocultar',
    hideTitle: 'Ocultar este aviso para esta sessão',
  },
}

export function DemoBadge({ isDemo = false, vertical, locale }: DemoBadgeProps) {
  const L = DEMO_LABELS[locale ?? 'es'] ?? DEMO_LABELS.es
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // ?demo=hide → screenshot mode, no badge for the rest of this session.
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo') === 'hide') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true)
      return
    }
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') {
        setHidden(true)
      }
    } catch {
      // ignore — private mode or quota exceeded
    }
  }, [])

  if (!isDemo || hidden) return null

  const href = vertical ? `/demo?v=${encodeURIComponent(vertical)}` : '/demo'

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-1 sm:right-6 sm:top-6">
      <Link
        href={href}
        aria-label={L.aria}
        className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-800 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-amber-100 sm:px-5 sm:py-2.5 sm:text-sm"
      >
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" aria-hidden />
        {L.badge}
      </Link>
      <button
        type="button"
        aria-label={L.hideTitle}
        title={L.hide}
        onClick={() => {
          try {
            sessionStorage.setItem(DISMISS_KEY, '1')
          } catch {
            // ignore
          }
          setHidden(true)
        }}
        className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-300 bg-amber-50/95 text-amber-800 shadow hover:bg-amber-100"
      >
        ✕
      </button>
    </div>
  )
}
