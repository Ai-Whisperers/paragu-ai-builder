export interface LocalStorageStoreConfig<T> {
  keyPrefix: string
  maxItems: number
  changeEvent: string
  validate: (it: unknown) => it is T
}

export function createLocalStorageStore<T>(config: LocalStorageStoreConfig<T>) {
  const { keyPrefix, maxItems, changeEvent, validate } = config

  function storageKey(siteSlug: string): string {
    return `${keyPrefix}_${siteSlug}`
  }

  const snapshotCache = new Map<string, T[]>()
  const EMPTY: T[] = []

  function parseFromStorage(siteSlug: string): T[] {
    if (typeof window === 'undefined') return EMPTY
    try {
      const raw = window.localStorage.getItem(storageKey(siteSlug))
      if (!raw) return EMPTY
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return EMPTY
      const filtered = parsed
        .filter((it): it is T => validate(it))
        .slice(0, maxItems)
      return filtered.length === 0 ? EMPTY : filtered
    } catch {
      return EMPTY
    }
  }

  function invalidate(siteSlug: string): void {
    snapshotCache.delete(siteSlug)
  }

  function getSnapshot(siteSlug: string): T[] {
    const cached = snapshotCache.get(siteSlug)
    if (cached) return cached
    const fresh = parseFromStorage(siteSlug)
    snapshotCache.set(siteSlug, fresh)
    return fresh
  }

  function subscribe(siteSlug: string): (cb: () => void) => () => void {
    return (cb: () => void) => {
      if (typeof window === 'undefined') return () => {}
      const handler = () => {
        invalidate(siteSlug)
        cb()
      }
      window.addEventListener(changeEvent, handler)
      window.addEventListener('storage', handler)
      return () => {
        window.removeEventListener(changeEvent, handler)
        window.removeEventListener('storage', handler)
      }
    }
  }

  function read(siteSlug: string): T[] {
    return parseFromStorage(siteSlug)
  }

  function write(siteSlug: string, items: T[]): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(storageKey(siteSlug), JSON.stringify(items))
      invalidate(siteSlug)
      window.dispatchEvent(new CustomEvent(changeEvent, { detail: siteSlug }))
    } catch {}
  }

  function clear(siteSlug: string): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(storageKey(siteSlug))
      invalidate(siteSlug)
      window.dispatchEvent(new CustomEvent(changeEvent, { detail: siteSlug }))
    } catch {}
  }

  return { getSnapshot, subscribe, read, write, clear, storageKey, maxItems }
}
