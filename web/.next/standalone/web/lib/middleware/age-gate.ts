import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function ageGateMiddleware(request: NextRequest, next: () => Promise<NextResponse>) {
  const path = request.nextUrl.pathname
  const siteMatch = /^\/s\/([^/]+)\/([^/]+)(?:\/|$)/.exec(path)

  if (!siteMatch) return next()

  const [, , siteSlug] = siteMatch
  const searchStr = request.nextUrl.search || ''
  const isAgeGatePage = path.endsWith('/age-gate') || searchStr.includes('age_gate=1')

  if (!isAgeGatePage) {
    try {
      const { loadSite } = await import('@/lib/engine/site-loader')
      const site = loadSite(siteSlug) as {
        settings?: { ageGate?: { enabled?: boolean; minAge?: number } }
      }
      const ageGateCfg = site?.settings?.ageGate
      if (ageGateCfg?.enabled) {
        const cookieName = `age_gated_${siteSlug}`
        const gated = request.cookies.get(cookieName)?.value === 'yes'
        if (!gated) {
          const locale = siteMatch[1]
          const returnTo = encodeURIComponent(path + request.nextUrl.search)
          const url = request.nextUrl.clone()
          url.pathname = `/s/${locale}/${siteSlug}`
          url.search = `?age_gate=1&return=${returnTo}`
          return NextResponse.redirect(url, 307)
        }
      }
    } catch {
      // Unknown site slug — fall through
    }
  }

  return next()
}
