'use client'

import { useEffect, useRef } from 'react'
import type { Order } from '@/lib/schemas/commerce/order'
import { trackPurchase } from '@/lib/analytics/commerce-events'

/**
 * Fires GA4 `purchase` once when an order's status indicates successful
 * completion. Separate from OrderConfirmation so the big stateful
 * component doesn't need to carry analytics concerns + so this can be
 * dropped onto any order-detail page consistently.
 */
export function PurchaseTracker({ order }: { order: Order }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    if (!['paid', 'fulfilled', 'shipped', 'delivered'].includes(order.status)) return
    fired.current = true
    trackPurchase({
      transactionId: order.orderNumber,
      currency: order.currency,
      valueCents: order.totalCents,
      taxCents: order.taxCents,
      shippingCents: order.shippingCents,
      items: (order.items ?? []).map((it) => ({
        itemId: it.productId,
        itemName: it.productSnapshot.name,
        price: it.unitPriceCents,
        currency: order.currency,
        quantity: it.quantity,
      })),
    })
  }, [order.status, order.orderNumber, order.currency, order.totalCents, order.taxCents, order.shippingCents, order.items])
  return null
}
