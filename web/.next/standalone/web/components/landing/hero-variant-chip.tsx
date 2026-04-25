'use client'

import { useEffect, useState } from 'react'
import { useHeroVariant, type HeroVariant } from '@/lib/experiments/hero-variant'

/**
 * Tiny dev/admin chip showing the active hero variant. Visible only when:
 *   - URL has `?debug=1`, or
 *   - localStorage has `pa_debug=1` (set once via `?debug=1`, persists)
 *
 * Helps stakeholders confirm which variant they're seeing without grepping
 * cookies. No analytics emitted from this — purely informational.
 */
export function HeroVariantChip() {
  const variant: HeroVariant | null = useHeroVariant()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    // Hydration-only check: debug flag depends on URL/storage that don't
    // exist on the server. The chip is admin-only — flash on initial render
    // is irrelevant.
    if (params.get('debug') === '1') {
      try {
        localStorage.setItem('pa_debug', '1')
      } catch {
        // ignore quota / private mode
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true)
      return
    }
    try {
      if (localStorage.getItem('pa_debug') === '1') {
        setShow(true)
      }
    } catch {
      // ignore
    }
  }, [])

  if (!show || !variant) return null

  return (
    <div className="fixed left-4 bottom-4 z-50 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-1.5 text-xs font-mono shadow-md backdrop-blur-sm">
      <span className="text-[var(--text-muted)]">hero:</span>
      <span className="font-bold text-[var(--primary)]">{variant}</span>
      <span className="text-[var(--text-muted)]">·</span>
      <a
        href={variant === 'A' ? '?v=B' : '?v=A'}
        className="text-[var(--text-light)] hover:text-[var(--primary)]"
        title="Ver la otra variante"
      >
        toggle
      </a>
    </div>
  )
}
