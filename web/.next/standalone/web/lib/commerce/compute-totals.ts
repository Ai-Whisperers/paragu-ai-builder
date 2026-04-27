import type { CartItem, CartTotals } from '@/lib/schemas/commerce/cart'

export function computeCartTotals(items: CartItem[], currency: string): CartTotals {
  let subtotalCents = 0
  let itemCount = 0
  for (const item of items) {
    subtotalCents += item.unitPriceCents * item.quantity
    itemCount += item.quantity
  }
  return { subtotalCents, itemCount, currency }
}

export function computeOrderTotal(parts: {
  subtotalCents: number
  shippingCents: number
  taxCents: number
  discountCents: number
}): number {
  const total = parts.subtotalCents + parts.shippingCents + parts.taxCents - parts.discountCents
  return total < 0 ? 0 : total
}

export { formatCents } from '@/lib/format'
