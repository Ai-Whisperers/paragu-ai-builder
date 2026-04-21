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

function storageKey(siteSlug: string): string {
  return `paragu_recent_${siteSlug}`
}

export function readRecentlyViewed(siteSlug: string): RecentlyViewedItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey(siteSlug))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Defensive: only keep entries with the required fields. Older payloads
    // from a prior schema get dropped silently rather than blowing up the rail.
    return parsed
      .filter((it): it is RecentlyViewedItem =>
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

export function recordRecentlyViewed(siteSlug: string, item: Omit<RecentlyViewedItem, 'visitedAt'>): void {
  if (typeof window === 'undefined') return
  try {
    const existing = readRecentlyViewed(siteSlug).filter((it) => it.id !== item.id)
    const next: RecentlyViewedItem[] = [{ ...item, visitedAt: Date.now() }, ...existing].slice(0, MAX_ITEMS)
    window.localStorage.setItem(storageKey(siteSlug), JSON.stringify(next))
  } catch {
    // Storage quota / private mode — silently no-op. The rail just won't appear.
  }
}
