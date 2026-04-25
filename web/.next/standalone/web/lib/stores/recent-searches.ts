/**
 * localStorage-backed recent search terms, per site. Shown in the
 * header autocomplete when the input is empty/focused.
 */

const MAX = 6

function storageKey(siteSlug: string): string {
  return `paragu_recent_searches_${siteSlug}`
}

export function readRecentSearches(siteSlug: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(storageKey(siteSlug))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((s): s is string => typeof s === 'string').slice(0, MAX)
  } catch {
    return []
  }
}

export function recordRecentSearch(siteSlug: string, term: string): void {
  if (typeof window === 'undefined') return
  const clean = term.trim()
  if (!clean) return
  try {
    const existing = readRecentSearches(siteSlug).filter(
      (s) => s.toLowerCase() !== clean.toLowerCase(),
    )
    const next = [clean, ...existing].slice(0, MAX)
    window.localStorage.setItem(storageKey(siteSlug), JSON.stringify(next))
  } catch {
    /* quota / private mode — silent */
  }
}

export function clearRecentSearches(siteSlug: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(storageKey(siteSlug))
  } catch {
    /* ignore */
  }
}
