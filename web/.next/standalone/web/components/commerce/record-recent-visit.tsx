'use client'

import { useEffect } from 'react'
import { recordRecentlyViewed } from '@/lib/stores/recently-viewed'

interface Props {
  siteSlug: string
  productId: string
  productSlug: string
  productName: string
  priceCents: number
  currency: string
  imageUrl?: string | null
}

/**
 * Side-effect-only client component. Renders nothing; on mount adds the
 * current product to the shopper's localStorage recently-viewed list.
 * Lives separately from PriceDisplay/etc. so a single PDP visit doesn't
 * re-record on every render.
 */
export function RecordRecentVisit({ siteSlug, productId, productSlug, productName, priceCents, currency, imageUrl }: Props) {
  useEffect(() => {
    recordRecentlyViewed(siteSlug, {
      id: productId,
      slug: productSlug,
      name: productName,
      priceCents,
      currency,
      imageUrl: imageUrl ?? null,
    })
  }, [siteSlug, productId, productSlug, productName, priceCents, currency, imageUrl])
  return null
}
