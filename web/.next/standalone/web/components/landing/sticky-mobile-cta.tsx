'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { SITE_CONFIG, waLink } from '@/lib/landing/marketing-data'

/**
 * Sticky bottom-bar CTA shown only on mobile after scrolling past the hero.
 * Hidden on desktop because we already have nav + hero CTAs there. Hidden in
 * the first screen so it doesn't fight with the hero CTA buttons.
 */
export function StickyMobileCTA({
  message = 'Hola, quiero una demo gratis de ParaguAI para mi negocio.',
  showAfter = 600,
}: {
  message?: string
  showAfter?: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showAfter])

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Demo gratis"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--background)]/95 px-4 py-3 backdrop-blur-md md:hidden"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--text)]">Demo gratis · 48h</p>
          <p className="truncate text-xs text-[var(--text-muted)]">
            Pagás solo si te gusta · Gs {SITE_CONFIG.marketSize.toLocaleString('es-PY')} negocios PY
          </p>
        </div>
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-[var(--primary-foreground)] shadow-lg"
        >
          <MessageCircle size={16} />
          Pedir demo
        </a>
      </div>
    </div>
  )
}
