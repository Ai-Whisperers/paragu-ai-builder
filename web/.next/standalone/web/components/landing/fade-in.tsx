'use client'

import { useInView } from '@/lib/hooks'

/**
 * Reveal-on-scroll wrapper used by the marketing homepage. Fades + rises
 * children 30px when they enter the viewport. Supports a stagger delay so a
 * row of cards animates in sequence.
 *
 * Extracted from app/page.tsx — keep it component-level (not a module
 * default) so the landing page can compose it alongside other landing
 * pieces in `components/landing/*`.
 */
export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
