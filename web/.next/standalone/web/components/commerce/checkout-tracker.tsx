'use client'

import { useEffect, useRef } from 'react'
import { useCartStore, cartSubtotalCents } from '@/lib/stores/cart-store'
import { trackBeginCheckout } from '@/lib/analytics/commerce-events'

/**
 * Fires GA4 `begin_checkout` once per checkout-page mount with at least
 * one cart item. Mounted in /checkout via the server page so the big
 * CheckoutForm component doesn't need analytics concerns embedded.
 */
export function CheckoutTracker() {
  const cart = useCartStore((s) => s.cart)
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    const items = cart?.items ?? []
    if (items.length === 0) return
    fired.current = true
    const currency = cart?.currency ?? 'PYG'
    trackBeginCheckout(
      items.map((it) => ({
        itemId: it.productId,
        itemName: it.productName ?? 'Producto',
        price: it.unitPriceCents,
        currency,
        quantity: it.quantity,
      })),
      currency,
      cartSubtotalCents(cart),
    )
  }, [cart])
  return null
}
