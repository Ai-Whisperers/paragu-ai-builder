import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

function pickBestLocale(acceptLanguage: string, enabled: readonly string[]): string | undefined {
  if (!acceptLanguage || enabled.length === 0) return undefined
  const tags = acceptLanguage
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(';')
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='))
      const weight = q ? Number(q.slice(2)) : 1
      return { tag: tag.trim().toLowerCase(), weight: Number.isFinite(weight) ? weight : 1 }
    })
    .filter((t) => t.tag)
    .sort((a, b) => b.weight - a.weight)
  const enabledLower = enabled.map((l) => l.toLowerCase())
  for (const { tag } of tags) {
    const i = enabledLower.indexOf(tag)
    if (i !== -1) return enabled[i]
  }
  for (const { tag } of tags) {
    const primary = tag.split('-')[0]
    const i = enabledLower.indexOf(primary)
    if (i !== -1) return enabled[i]
  }
  return undefined
}

export async function tenantRedirectMiddleware(request: NextRequest, next: () => Promise<NextResponse>) {
  const path = request.nextUrl.pathname

  if (
    path.startsWith('/s/') ||
    path.startsWith('/api/') ||
    path.startsWith('/admin') ||
    path.startsWith('/_next') ||
    path.startsWith('/login') ||
    path === '/'
  ) {
    return next()
  }

  try {
    const { listSiteSlugs, loadSite } = await import('@/lib/engine/site-loader')
    const firstSegment = path.split('/').filter(Boolean)[0] ?? ''
    const siteSlugs = listSiteSlugs()
    if (siteSlugs.includes(firstSegment)) {
      const site = loadSite(firstSegment)
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
      const acceptHeader = request.headers.get('accept-language') || ''
      const enabled = (site.locales || []) as string[]
      const negotiated = (cookieLocale && enabled.includes(cookieLocale)
        ? cookieLocale
        : pickBestLocale(acceptHeader, enabled) || site.defaultLocale || enabled[0]) || 'es'
      const remainder = path.slice(firstSegment.length + 1)
      const url = request.nextUrl.clone()
      url.pathname = `/s/${String(negotiated)}/${firstSegment}${remainder ? remainder : ''}`
      return NextResponse.rewrite(url)
    }
  } catch (error) {
    logger.warn('Flat-slug rewrite skipped', {
      path,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return next()
}
