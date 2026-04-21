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
export const WISHLIST_EVENT = 'paragu:wishlist-change'

function storageKey(siteSlug: string): string {
  return `paragu_wishlist_${siteSlug}`
}

// Referentially-stable cache per siteSlug. useSyncExternalStore requires
// getSnapshot to return the same reference when data hasn't changed;
// returning a fresh array every call causes React #185 in production.
const snapshotCache = new Map<string, WishlistItem[]>()
const EMPTY: WishlistItem[] = []

function parseFromStorage(siteSlug: string): WishlistItem[] {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(storageKey(siteSlug))
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return EMPTY
    const filtered = parsed
      .filter((it): it is WishlistItem =>
        typeof it === 'object' && it !== null
        && typeof it.id === 'string'
        && typeof it.slug === 'string'
        && typeof it.name === 'string'
        && typeof it.priceCents === 'number',
      )
      .slice(0, MAX_ITEMS)
    return filtered.length === 0 ? EMPTY : filtered
  } catch {
    return EMPTY
  }
}

function invalidate(siteSlug: string): void {
  snapshotCache.delete(siteSlug)
}

/** Cached, referentially-stable snapshot for useSyncExternalStore. */
export function getWishlistSnapshot(siteSlug: string): WishlistItem[] {
  const cached = snapshotCache.get(siteSlug)
  if (cached) return cached
  const fresh = parseFromStorage(siteSlug)
  snapshotCache.set(siteSlug, fresh)
  return fresh
}

/**
 * Subscribe factory for useSyncExternalStore. Invalidates cache + triggers
 * React re-read on local writes and cross-tab storage events.
 */
export function subscribeWishlist(siteSlug: string): (cb: () => void) => () => void {
  return (cb: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const handler = () => {
      invalidate(siteSlug)
      cb()
    }
    window.addEventListener(WISHLIST_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(WISHLIST_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }
}

export function readWishlist(siteSlug: string): WishlistItem[] {
  return parseFromStorage(siteSlug)
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
    invalidate(siteSlug)
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: siteSlug }))
  } catch {
    /* quota or private mode */
  }
}

export function removeFromWishlist(siteSlug: string, productId: string): void {
  if (typeof window === 'undefined') return
  try {
    const next = readWishlist(siteSlug).filter((it) => it.id !== productId)
    window.localStorage.setItem(storageKey(siteSlug), JSON.stringify(next))
    invalidate(siteSlug)
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: siteSlug }))
  } catch {
    /* ignore */
  }
}
