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
}

const DISMISS_KEY = 'pa_demo_badge_dismissed'

export function DemoBadge({ isDemo = false, vertical }: DemoBadgeProps) {
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        aria-label="Este es un sitio de demostración. Pedí el tuyo en 48 horas."
        className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-800 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-amber-100 sm:px-5 sm:py-2.5 sm:text-sm"
      >
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" aria-hidden />
        Demo · pedí el tuyo
      </Link>
      <button
        type="button"
        aria-label="Ocultar este aviso por esta sesión"
        title="Ocultar"
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
