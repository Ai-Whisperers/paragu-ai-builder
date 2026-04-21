/**
 * Pure-client recently-viewed-products store. localStorage only — no SSR,
 * no auth required, no backend trip. Shopper-private by design: the merchant
 * never sees what an individual visitor browsed.
 */

export interface RecentlyViewedItem {
  id: string
  slug: string
  name: string
  priceCents: number
  currency: string
  imageUrl?: string | null
  visitedAt: number
}

const MAX_ITEMS = 8
const EVENT = 'paragu:recently-viewed-change'

function storageKey(siteSlug: string): string {
  return `paragu_recent_${siteSlug}`
}

// Referentially-stable cache per siteSlug. useSyncExternalStore requires
// getSnapshot to return the same reference when underlying data hasn't
// changed — returning a fresh array on every call causes React #185
// ("Maximum update depth exceeded") in production.
const snapshotCache = new Map<string, RecentlyViewedItem[]>()
const EMPTY: RecentlyViewedItem[] = []

function parseFromStorage(siteSlug: string): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(storageKey(siteSlug))
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return EMPTY
    const filtered = parsed
      .filter((it): it is RecentlyViewedItem =>
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

/**
 * Cached, referentially-stable snapshot for useSyncExternalStore. Cache
 * is invalidated by writes + storage events so the next call re-parses.
 */
export function getRecentlyViewedSnapshot(siteSlug: string): RecentlyViewedItem[] {
  const cached = snapshotCache.get(siteSlug)
  if (cached) return cached
  const fresh = parseFromStorage(siteSlug)
  snapshotCache.set(siteSlug, fresh)
  return fresh
}

/**
 * Subscribe factory for useSyncExternalStore. Listens for local writes +
 * cross-tab storage events; invalidates the snapshot cache so React re-reads.
 */
export function subscribeRecentlyViewed(siteSlug: string): (cb: () => void) => () => void {
  return (cb: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const handler = () => {
      invalidate(siteSlug)
      cb()
    }
    window.addEventListener(EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }
}

/** One-shot reader for code outside React. */
export function readRecentlyViewed(siteSlug: string): RecentlyViewedItem[] {
  return parseFromStorage(siteSlug)
}

export function recordRecentlyViewed(siteSlug: string, item: Omit<RecentlyViewedItem, 'visitedAt'>): void {
  if (typeof window === 'undefined') return
  try {
    const existing = readRecentlyViewed(siteSlug).filter((it) => it.id !== item.id)
    const next: RecentlyViewedItem[] = [{ ...item, visitedAt: Date.now() }, ...existing].slice(0, MAX_ITEMS)
    window.localStorage.setItem(storageKey(siteSlug), JSON.stringify(next))
    invalidate(siteSlug)
    window.dispatchEvent(new CustomEvent(EVENT, { detail: siteSlug }))
  } catch {
    // Storage quota / private mode — silently no-op. The rail just won't appear.
  }
}
