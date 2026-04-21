/**
 * GA4 Enhanced Ecommerce event helpers.
 *
 * All functions are no-ops when window.gtag isn't available, so they're
 * safe to call unconditionally from client components. GA4 itself is
 * loaded only after analytics consent (see components/analytics/ga4-loader).
 *
 * Events follow the GA4 Enhanced Ecommerce schema:
 *   https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface EcomItem {
  itemId: string
  itemName: string
  itemCategory?: string
  itemBrand?: string
  price: number
  currency: string
  quantity?: number
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || !window.gtag) return
  try {
    window.gtag(...args)
  } catch {
    // GA4 failures should never break the shopper flow.
  }
}

function toGa4Item(item: EcomItem): Record<string, unknown> {
  return {
    item_id: item.itemId,
    item_name: item.itemName,
    item_category: item.itemCategory,
    item_brand: item.itemBrand,
    price: Number((item.price / 100).toFixed(2)),
    currency: item.currency,
    quantity: item.quantity ?? 1,
  }
}

/** PDP load — shopper looked at the product page. */
export function trackViewItem(item: EcomItem) {
  gtag('event', 'view_item', {
    currency: item.currency,
    value: Number((item.price / 100).toFixed(2)),
    items: [toGa4Item(item)],
  })
}

/** Tienda search — shopper submitted a query. */
export function trackSearch(searchTerm: string) {
  if (!searchTerm) return
  gtag('event', 'search', { search_term: searchTerm })
}

/** Shopper added a product to cart. */
export function trackAddToCart(item: EcomItem) {
  gtag('event', 'add_to_cart', {
    currency: item.currency,
    value: Number(((item.price * (item.quantity ?? 1)) / 100).toFixed(2)),
    items: [toGa4Item(item)],
  })
}

/** Shopper removed a product from cart. */
export function trackRemoveFromCart(item: EcomItem) {
  gtag('event', 'remove_from_cart', {
    currency: item.currency,
    value: Number(((item.price * (item.quantity ?? 1)) / 100).toFixed(2)),
    items: [toGa4Item(item)],
  })
}

/** Shopper opened the cart page / drawer with items in it. */
export function trackViewCart(items: EcomItem[], currency: string, valueCents: number) {
  if (items.length === 0) return
  gtag('event', 'view_cart', {
    currency,
    value: Number((valueCents / 100).toFixed(2)),
    items: items.map(toGa4Item),
  })
}

/** Shopper clicked "Ir a pagar" / entered the checkout flow. */
export function trackBeginCheckout(items: EcomItem[], currency: string, valueCents: number) {
  gtag('event', 'begin_checkout', {
    currency,
    value: Number((valueCents / 100).toFixed(2)),
    items: items.map(toGa4Item),
  })
}

/** Order confirmation — fires once on successful completion. */
export function trackPurchase(opts: {
  transactionId: string
  currency: string
  valueCents: number
  taxCents?: number
  shippingCents?: number
  items: EcomItem[]
}) {
  gtag('event', 'purchase', {
    transaction_id: opts.transactionId,
    currency: opts.currency,
    value: Number((opts.valueCents / 100).toFixed(2)),
    tax: opts.taxCents ? Number((opts.taxCents / 100).toFixed(2)) : undefined,
    shipping: opts.shippingCents ? Number((opts.shippingCents / 100).toFixed(2)) : undefined,
    items: opts.items.map(toGa4Item),
  })
}

/** Shopper added to wishlist. Not part of default GA4 spec but still trackable. */
export function trackAddToWishlist(item: EcomItem) {
  gtag('event', 'add_to_wishlist', {
    currency: item.currency,
    value: Number((item.price / 100).toFixed(2)),
    items: [toGa4Item(item)],
  })
}
