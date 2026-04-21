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

export function formatCents(cents: number, currency = 'PYG'): string {
  if (currency === 'PYG') {
    return `Gs ${Math.round(cents).toLocaleString('es-PY')}`
  }
  const formatter = new Intl.NumberFormat('es-PY', { style: 'currency', currency })
  return formatter.format(cents / 100)
}
