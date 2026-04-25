'use client'

import { useEffect } from 'react'
import { trackPdpView } from '@/lib/analytics/tenant-events'

/**
 * Fires `pdp_view` exactly once on mount for static-JSON PDPs. The
 * commerce route has its own `pdp-view-tracker.tsx` that emits the full
 * `view_item` e-commerce shape; this is the lightweight pre-commerce
 * equivalent that just logs the slug + name for funnel analysis.
 */
export function PdpViewReporter({
  productSlug,
  productName,
  siteSlug,
}: {
  productSlug: string
  productName?: string
  siteSlug?: string
}) {
  useEffect(() => {
    trackPdpView({ productSlug, productName, siteSlug })
  }, [productSlug, productName, siteSlug])
  return null
}
