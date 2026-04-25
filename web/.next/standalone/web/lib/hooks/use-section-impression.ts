'use client'

import { useEffect, useRef } from 'react'
import { trackSectionView } from '@/lib/analytics/events'

/**
 * Fire a `section_view` analytics event once when a section scrolls into
 * view. Uses IntersectionObserver with a 30% visibility threshold; the
 * observer disconnects after the first report so we don't double-count
 * repeated scroll passes.
 *
 * Usage:
 *   const ref = useSectionImpression('hero', 'hero')
 *   return <section ref={ref}>…</section>
 */
export function useSectionImpression(
  sectionId: string,
  sectionType?: string,
  threshold = 0.3,
): React.RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null)
  const reportedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const node = ref.current
    if (!node || reportedRef.current) return
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !reportedRef.current) {
            reportedRef.current = true
            trackSectionView(sectionId, sectionType).catch(() => {
              // swallow — event loss is acceptable for a scroll beacon
            })
            observer.disconnect()
          }
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [sectionId, sectionType, threshold])

  return ref
}
