'use client'

import { useEffect } from 'react'
import { trackEvent, EventTypes } from '@/lib/analytics/events'

/**
 * Fires SECTION_VIEW analytics events at scroll depth milestones (25%, 50%,
 * 75%, 100%) — once per session per milestone. Lets us measure how far down
 * the landing page prospects actually read before bouncing.
 *
 * Per BUG_HUNT_500 #339. Cheap: passive scroll listener, sessionStorage-gated
 * so we don't spam the analytics pipeline on jittery scrollers.
 */

const MILESTONES = [25, 50, 75, 100]
const STORAGE_PREFIX = 'pa_scroll_depth_'

export function ScrollDepthTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    function getReached(): Set<number> {
      const reached = new Set<number>()
      try {
        for (const m of MILESTONES) {
          if (sessionStorage.getItem(STORAGE_PREFIX + m) === '1') reached.add(m)
        }
      } catch {
        // ignore
      }
      return reached
    }

    const reached = getReached()
    let ticking = false

    function check() {
      ticking = false
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const depth = Math.min(100, Math.round((window.scrollY / docHeight) * 100))
      for (const m of MILESTONES) {
        if (depth >= m && !reached.has(m)) {
          reached.add(m)
          try {
            sessionStorage.setItem(STORAGE_PREFIX + m, '1')
          } catch {
            // ignore
          }
          void trackEvent(EventTypes.SECTION_VIEW, {
            sectionId: `landing_scroll_${m}`,
            metadata: { depth_pct: m, page: window.location.pathname },
          })
        }
      }
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(check)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    check() // fire once for above-the-fold case
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
