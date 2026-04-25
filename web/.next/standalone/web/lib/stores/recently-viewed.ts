import { createLocalStorageStore } from './create-local-storage-store'

export interface RecentlyViewedItem {
  id: string
  slug: string
  name: string
  priceCents: number
  currency: string
  imageUrl?: string | null
  visitedAt: number
}

const EVENT = 'paragu:recently-viewed-change'

const store = createLocalStorageStore<RecentlyViewedItem>({
  keyPrefix: 'paragu_recent',
  maxItems: 8,
  changeEvent: EVENT,
  validate: (it): it is RecentlyViewedItem => {
    if (typeof it !== 'object' || it === null) return false
    const o = it as Record<string, unknown>
    return typeof o.id === 'string'
      && typeof o.slug === 'string'
      && typeof o.name === 'string'
      && typeof o.priceCents === 'number'
  },
})

export function getRecentlyViewedSnapshot(siteSlug: string): RecentlyViewedItem[] {
  return store.getSnapshot(siteSlug)
}

export function subscribeRecentlyViewed(siteSlug: string): (cb: () => void) => () => void {
  return store.subscribe(siteSlug)
}

export function readRecentlyViewed(siteSlug: string): RecentlyViewedItem[] {
  return store.read(siteSlug)
}

export function recordRecentlyViewed(siteSlug: string, item: Omit<RecentlyViewedItem, 'visitedAt'>): void {
  const existing = readRecentlyViewed(siteSlug).filter((it) => it.id !== item.id)
  const next: RecentlyViewedItem[] = [{ ...item, visitedAt: Date.now() }, ...existing].slice(0, store.maxItems)
  store.write(siteSlug, next)
}
