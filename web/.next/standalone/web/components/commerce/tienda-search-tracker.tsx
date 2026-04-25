'use client'

import { useEffect, useRef } from 'react'
import { trackSearch } from '@/lib/analytics/commerce-events'

/**
 * Fires the GA4 `search` event once per unique query the shopper lands on.
 * Mounts in /tienda, reads the prop set by the server component.
 */
export function TiendaSearchTracker({ query }: { query: string }) {
  const lastFired = useRef<string | null>(null)
  useEffect(() => {
    if (!query) return
    if (lastFired.current === query) return
    lastFired.current = query
    trackSearch(query)
  }, [query])
  return null
}
