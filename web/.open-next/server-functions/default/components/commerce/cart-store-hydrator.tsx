'use client'

import { useEffect } from 'react'
import type { Cart } from '@/lib/schemas/commerce/cart'
import { useCartStore } from '@/lib/stores/cart-store'

export function CartStoreHydrator({ siteSlug, initialCart }: { siteSlug: string; initialCart: Cart | null }) {
  const hydrate = useCartStore((s) => s.hydrate)
  useEffect(() => {
    hydrate(siteSlug, initialCart)
  }, [siteSlug, initialCart, hydrate])
  return null
}
