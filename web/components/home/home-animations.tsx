'use client'

import { useEffect } from 'react'

/**
 * Initializes scroll-triggered fade-in animations for homepage sections.
 * Uses IntersectionObserver — no animation library needed.
 */
export function HomeAnimations() {
  useEffect(() => {
    const elements = document.querySelectorAll('.section-fade')
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return null
}
