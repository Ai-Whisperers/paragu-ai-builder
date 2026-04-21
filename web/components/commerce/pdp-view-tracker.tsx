'use client'

import { useEffect, useRef } from 'react'
import { trackViewItem } from '@/lib/analytics/commerce-events'

interface Props {
  productId: string
  productName: string
  category: string | null
  brand: string | null
  priceCents: number
  currency: string
}

/**
 * Client-only side effect: fires GA4 view_item once on mount. Kept in its
 * own component so the PDP server page stays server-rendered.
 */
export function PdpViewTracker({
  productId,
  productName,
  category,
  brand,
  priceCents,
  currency,
}: Props) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackViewItem({
      itemId: productId,
      itemName: productName,
      itemCategory: category ?? undefined,
      itemBrand: brand ?? undefined,
      price: priceCents,
      currency,
    })
  }, [productId, productName, category, brand, priceCents, currency])
  return null
}
