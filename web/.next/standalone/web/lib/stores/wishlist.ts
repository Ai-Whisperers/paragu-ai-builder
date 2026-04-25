import { createLocalStorageStore } from './create-local-storage-store'

export interface WishlistItem {
  id: string
  slug: string
  name: string
  priceCents: number
  currency: string
  imageUrl?: string | null
  addedAt: number
}

export const WISHLIST_EVENT = 'paragu:wishlist-change'

const store = createLocalStorageStore<WishlistItem>({
  keyPrefix: 'paragu_wishlist',
  maxItems: 60,
  changeEvent: WISHLIST_EVENT,
  validate: (it): it is WishlistItem => {
    if (typeof it !== 'object' || it === null) return false
    const o = it as Record<string, unknown>
    return typeof o.id === 'string'
      && typeof o.slug === 'string'
      && typeof o.name === 'string'
      && typeof o.priceCents === 'number'
  },
})

export function getWishlistSnapshot(siteSlug: string): WishlistItem[] {
  return store.getSnapshot(siteSlug)
}

export function subscribeWishlist(siteSlug: string): (cb: () => void) => () => void {
  return store.subscribe(siteSlug)
}

export function readWishlist(siteSlug: string): WishlistItem[] {
  return store.read(siteSlug)
}

export function isInWishlist(siteSlug: string, productId: string): boolean {
  return readWishlist(siteSlug).some((it) => it.id === productId)
}

export function addToWishlist(siteSlug: string, item: Omit<WishlistItem, 'addedAt'>): void {
  const existing = readWishlist(siteSlug).filter((it) => it.id !== item.id)
  const next: WishlistItem[] = [{ ...item, addedAt: Date.now() }, ...existing].slice(0, store.maxItems)
  store.write(siteSlug, next)
}

export function removeFromWishlist(siteSlug: string, productId: string): void {
  const next = readWishlist(siteSlug).filter((it) => it.id !== productId)
  store.write(siteSlug, next)
}
