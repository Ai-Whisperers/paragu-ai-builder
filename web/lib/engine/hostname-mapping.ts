import { listSiteSlugs, loadSite } from './site-loader'

export interface HostnameMap {
  byHost: Record<string, { slug: string; defaultLocale: string }>
}

let cached: HostnameMap | null = null

export function buildHostnameMap(): HostnameMap {
  if (cached) return cached
  const byHost: Record<string, { slug: string; defaultLocale: string }> = {}
  for (const slug of listSiteSlugs()) {
    try {
      const site = loadSite(slug)
      if (site.domain) byHost[site.domain] = { slug, defaultLocale: site.defaultLocale }
      if ((site as { stagingDomain?: string }).stagingDomain) {
        byHost[(site as { stagingDomain?: string }).stagingDomain!] = { slug, defaultLocale: site.defaultLocale }
      }
    } catch {
      // skip malformed sites
    }
  }
  cached = { byHost }
  return cached
}

export function lookupSiteByHostname(hostname: string): { slug: string; defaultLocale: string } | null {
  const map = buildHostnameMap()
  const normalised = hostname.toLowerCase().replace(/^www\./, '')
  return map.byHost[normalised] || null
}
