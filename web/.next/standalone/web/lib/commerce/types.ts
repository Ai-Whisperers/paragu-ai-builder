/**
 * Unified commerce types for Paragu-AI Builder.
 *
 * Consolidates product, order, and cart type definitions that were
 * previously scattered across section components and commerce modules.
 * Section components should import from here instead of defining their own.
 */

// ---- Product ----

export interface CommerceProduct {
  id: string
  name: string
  description?: string
  price: number
  priceOriginal?: number
  currency?: 'PYG' | 'USD'
  imageUrl?: string
  category?: string
  available?: boolean
  stockCount?: number
  slug?: string
  /** Optional URL for the product detail page */
  href?: string
}

// ---- Cart ----

export interface CartItem {
  productId: string
  name: string
  unitPriceCents: number
  quantity: number
  imageUrl?: string
  slug?: string
}

export interface CartTotals {
  subtotalCents: number
  itemCount: number
  currency: string
}

// ---- Order ----

export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export interface Order {
  id: string
  businessId: string
  items: CartItem[]
  status: OrderStatus
  subtotalCents: number
  shippingCents: number
  discountCents: number
  totalCents: number
  currency: string
  customerEmail?: string
  customerPhone?: string
  shippingAddress?: string
  createdAt: string
}

// ---- Discount ----

export type DiscountType = 'percent' | 'fixed' | 'free_shipping'

export interface Discount {
  type: DiscountType
  value: number
  code?: string
  minPurchaseCents?: number
}
