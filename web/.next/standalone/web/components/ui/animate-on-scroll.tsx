'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  /** Stagger index for grid items (adds transition-delay) */
  stagger?: number
  /** Root margin for IntersectionObserver */
  threshold?: number
}

/**
 * Wrapper that animates children into view when they enter the viewport.
 * Uses IntersectionObserver for performance — no animation libraries needed.
 *
 * Usage:
 *   <AnimateOnScroll>
 *     <Card>...</Card>
 *   </AnimateOnScroll>
 *
 *   // With stagger for grid items:
 *   {items.map((item, i) => (
 *     <AnimateOnScroll key={i} stagger={i}>
 *       <Card>{item}</Card>
 *     </AnimateOnScroll>
 *   ))}
 */
export function AnimateOnScroll({
  children,
  className,
  stagger,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const staggerClass = stagger !== undefined && stagger < 10 ? `stagger-${stagger + 1}` : ''

  return (
    <div
      ref={ref}
      className={cn('animate-on-scroll', staggerClass, className)}
    >
      {children}
    </div>
  )
}

/**
 * Animate a section heading block (title + optional subtitle).
 */
export function AnimatedSectionHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <AnimateOnScroll className={cn('mb-12 text-center', className)}>
      {children}
    </AnimateOnScroll>
  )
}
