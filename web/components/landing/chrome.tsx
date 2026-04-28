'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, ArrowUp } from 'lucide-react'
import { useScrollProgress } from '@/lib/hooks'
import { waLink } from '@/lib/landing/marketing-data'

/**
 * Decorative blurred blob used by the landing page hero + CTA sections.
 * Pure visual — pass `className` for colour/position, `delay` to stagger
 * the pulse animation across multiple blobs on the same screen.
 */
export function FloatingShape({
  className,
  style,
  delay = 0,
}: {
  className?: string
  style?: React.CSSProperties
  delay?: number
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 animate-pulse ${className}`}
      style={{ animationDuration: '4s', animationDelay: `${delay}s`, ...style }}
    />
  )
}

/** Thin progress bar pinned to the top of the viewport as the user scrolls. */
export function ScrollProgress() {
  const progress = useScrollProgress()
  return (
    <div className="fixed left-0 top-0 z-[51] h-0.5 w-full bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/**
 * Persistent WhatsApp CTA in the bottom-right corner. Number sourced from
 * SITE_CONFIG.whatsapp via the waLink helper — tenant sites use the
 * WhatsAppFloat section component (which reads from business data) instead.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={waLink('Hola, me interesa saber más sobre ParaguAI')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl md:bottom-6"
      style={{ animation: 'pulse 2s infinite' }}
    >
      <MessageCircle size={28} fill="currentColor" />
    </a>
  )
}

/**
 * Back-to-top button that appears after scrolling 500px. Scrolls smoothly
 * to the top when clicked.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className="fixed bottom-44 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md transition-all hover:bg-surface-light md:bottom-24"
    >
      <ArrowUp size={20} />
    </button>
  )
}
