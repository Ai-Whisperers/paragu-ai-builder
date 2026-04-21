/**
 * Anonymous wishlist store — localStorage only, shopper-private by
 * design. The merchant never sees individual visitors' lists. Same
 * pattern as recently-viewed.
 */

export interface WishlistItem {
  id: string
  slug: string
  name: string
  priceCents: number
  currency: string
  imageUrl?: string | null
  addedAt: number
}

const MAX_ITEMS = 60

function storageKey(siteSlug: string): string {
  return `paragu_wishlist_${siteSlug}`
}

export function readWishlist(siteSlug: string): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey(siteSlug))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((it): it is WishlistItem =>
        typeof it === 'object' && it !== null
        && typeof it.id === 'string'
        && typeof it.slug === 'string'
        && typeof it.name === 'string'
        && typeof it.priceCents === 'number',
      )
      .slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

export function isInWishlist(siteSlug: string, productId: string): boolean {
  return readWishlist(siteSlug).some((it) => it.id === productId)
}

export function addToWishlist(siteSlug: string, item: Omit<WishlistItem, 'addedAt'>): void {
  if (typeof window === 'undefined') return
  try {
    const existing = readWishlist(siteSlug).filter((it) => it.id !== item.id)
    const next: WishlistItem[] = [{ ...item, addedAt: Date.now() }, ...existing].slice(0, MAX_ITEMS)
    window.localStorage.setItem(storageKey(siteSlug), JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('paragu:wishlist-change', { detail: siteSlug }))
  } catch {
    /* quota or private mode */
  }
}

export function removeFromWishlist(siteSlug: string, productId: string): void {
  if (typeof window === 'undefined') return
  try {
    const next = readWishlist(siteSlug).filter((it) => it.id !== productId)
    window.localStorage.setItem(storageKey(siteSlug), JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('paragu:wishlist-change', { detail: siteSlug }))
  } catch {
    /* ignore */
  }
}
