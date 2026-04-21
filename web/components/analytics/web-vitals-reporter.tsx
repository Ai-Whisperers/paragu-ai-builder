'use client'

import { useReportWebVitals } from 'next/web-vitals'

/**
 * Core Web Vitals beacon — posts LCP, CLS, INP, TTFB, FCP to
 * /api/analytics/track so the same pipeline that receives page-view +
 * section-impression events can aggregate real-user metrics.
 *
 * Uses `navigator.sendBeacon` so readings land even when the user
 * navigates away mid-measurement; the beacon survives page-unload.
 */
export function WebVitalsReporter(): null {
  useReportWebVitals((metric) => {
    try {
      const body = JSON.stringify({
        eventType: 'web_vital',
        name: metric.name,
        id: metric.id,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        navigationType: metric.navigationType,
        pageUrl: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }))
      } else {
        fetch('/api/analytics/track', {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }).catch(() => {
          // Fire-and-forget; the logger lives on the server and we don't
          // want to trigger another render on reporting failure.
        })
      }
    } catch {
      // Suppress — RUM must never crash the app.
    }
  })
  return null
}
