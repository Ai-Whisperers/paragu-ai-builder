/**
 * Lead enrichment — derives additional context from the HTTP request to
 * improve CRM handoff quality.
 *
 * Runs inside /api/leads before the CRM forward. Pure function of the Request
 * headers — no external API calls in this version (geoip lookups can be added
 * later as an adapter).
 *
 * Derived fields:
 *  - ipCountry        — Cloudflare / CDN header if running behind one
 *  - userAgentBrowser — "chrome" / "safari" / "firefox" / "other"
 *  - userAgentDevice  — "mobile" / "desktop" / "tablet"
 *  - acceptLanguage   — first 5 chars of Accept-Language header
 *  - referrerDomain   — canonical domain of `referer` (strips path/query)
 *  - enrichedAt       — timestamp for audit
 */

export interface EnrichedFields {
  ipCountry?: string
  userAgentBrowser?: 'chrome' | 'safari' | 'firefox' | 'edge' | 'other'
  userAgentDevice?: 'mobile' | 'tablet' | 'desktop'
  acceptLanguage?: string
  referrerDomain?: string
  enrichedAt: string
}

function detectBrowser(ua: string): EnrichedFields['userAgentBrowser'] {
  const s = ua.toLowerCase()
  // Order matters — Edge has 'chrome', Chrome has 'safari', etc.
  if (s.includes('edg/') || s.includes('edge/')) return 'edge'
  if (s.includes('firefox/')) return 'firefox'
  if (s.includes('chrome/') && !s.includes('edg')) return 'chrome'
  if (s.includes('safari/') && !s.includes('chrome')) return 'safari'
  return 'other'
}

function detectDevice(ua: string): EnrichedFields['userAgentDevice'] {
  const s = ua.toLowerCase()
  if (/ipad|tablet/i.test(s)) return 'tablet'
  if (/mobile|iphone|android/i.test(s)) return 'mobile'
  return 'desktop'
}

function extractReferrerDomain(referer: string | null): string | undefined {
  if (!referer) return undefined
  try {
    return new URL(referer).hostname
  } catch {
    return undefined
  }
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) : s
}

/**
 * Accepts a web Request (Next.js App Router) and returns derived fields.
 * Safe to call on any request — missing headers just produce `undefined`.
 */
export function enrichLead(req: Request): EnrichedFields {
  const h = req.headers
  const ua = h.get('user-agent') || ''
  const acceptLanguage = truncate(h.get('accept-language') || '', 10) || undefined
  const referer = h.get('referer')
  // Cloudflare sets `cf-ipcountry`; Vercel sets `x-vercel-ip-country`.
  const ipCountry =
    h.get('cf-ipcountry') ||
    h.get('x-vercel-ip-country') ||
    h.get('x-country') ||
    undefined

  return {
    ipCountry: ipCountry ? ipCountry.toUpperCase().slice(0, 2) : undefined,
    userAgentBrowser: ua ? detectBrowser(ua) : undefined,
    userAgentDevice: ua ? detectDevice(ua) : undefined,
    acceptLanguage,
    referrerDomain: extractReferrerDomain(referer),
    enrichedAt: new Date().toISOString(),
  }
}
