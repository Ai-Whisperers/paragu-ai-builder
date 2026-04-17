import { SITES } from './static-sites'

export interface HostnameMap {
  byHost: Record<string, { slug: string; defaultLocale: string }>
}

let cached: HostnameMap | null = null

export function buildHostnameMap(): HostnameMap {
  if (cached) return cached
  const byHost: Record<string, { slug: string; defaultLocale: string }> = {}
  for (const [slug, site] of Object.entries(SITES)) {
    if (site.domain) byHost[site.domain] = { slug, defaultLocale: site.defaultLocale }
  }
  cached = { byHost }
  return cached
}

export function lookupSiteByHostname(hostname: string): { slug: string; defaultLocale: string } | null {
  const map = buildHostnameMap()
  const normalised = hostname.toLowerCase().replace(/^www\./, '')
  return map.byHost[normalised] || null
}
