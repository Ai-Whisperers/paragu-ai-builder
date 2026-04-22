/**
 * Next.js Middleware
 *
 * Simplified from Vete (ai-whisperers/vete).
 * - Rate limiting for API endpoints (Upstash Redis, optional)
 * - Session refresh for authenticated routes
 * - Admin route protection
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { logger } from '@/lib/logger'
import { correlationFromRequest, toTraceparent } from '@/lib/obs/request-id'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname

  // Honour upstream correlation: x-request-id, x-correlation-id, or W3C
  // traceparent. Only generate a fresh id if none is supplied. This keeps
  // traces intact across CDN / gateway / partner-integration hops.
  const correlation = correlationFromRequest(request)
  const requestId = correlation.traceId
  const traceparent = toTraceparent(correlation.traceId, correlation.spanId)

  // Flat-slug rewrite: /<tenant-slug>[/...] → /s/<defaultLocale>/<slug>[/...]
  // Lets `paragu-ai.com/nexa-paraguay` resolve to the canonical locale route
  // without duplicating tenant render logic in the flat `[business]` handler.
  // Only matches single-segment paths that correspond to a registered site.
  // Legacy demo tenants (salon-maria, gymfit-py, etc.) are NOT in sites/ so
  // they fall through to the existing [business] handler.
  if (
    !path.startsWith('/s/') &&
    !path.startsWith('/api/') &&
    !path.startsWith('/admin') &&
    !path.startsWith('/_next') &&
    !path.startsWith('/login') &&
    path !== '/'
  ) {
    try {
      const { listSiteSlugs, loadSite } = await import('@/lib/engine/site-loader')
      const firstSegment = path.split('/').filter(Boolean)[0] ?? ''
      const siteSlugs = listSiteSlugs()
      if (siteSlugs.includes(firstSegment)) {
        const site = loadSite(firstSegment)
        // Locale priority:
        //   1. `NEXT_LOCALE` cookie — respects the visitor's previous explicit choice
        //   2. Best match of Accept-Language against the site's enabled locales
        //   3. site.defaultLocale
        //   4. First enabled locale
        //   5. 'es' as universal fallback
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
        const acceptHeader = request.headers.get('accept-language') || ''
        const enabled = site.locales || []
        const negotiated = cookieLocale && enabled.includes(cookieLocale)
          ? cookieLocale
          : pickBestLocale(acceptHeader, enabled) || site.defaultLocale || enabled[0] || 'es'
        const remainder = path.slice(firstSegment.length + 1) // drop "/<slug>"
        const url = request.nextUrl.clone()
        url.pathname = `/s/${negotiated}/${firstSegment}${remainder ? remainder : ''}`
        return NextResponse.rewrite(url)
      }
    } catch (error) {
      logger.warn('Flat-slug rewrite skipped — falling back to original path', {
        requestId,
        path,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  // Skip root path and static files
  if (path === '/') {
    return NextResponse.next()
  }

  // Add request ID and pathname headers. Overwrite upstream correlation
  // headers with the canonical ones we just resolved so every downstream
  // hop sees the same traceId — even when the upstream sent a malformed
  // value that correlationFromRequest rejected.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)
  requestHeaders.set('traceparent', traceparent)
  requestHeaders.set('x-pathname', path)

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set('x-request-id', requestId)
  response.headers.set('traceparent', traceparent)
  response.headers.set('x-pathname', path)

  // Cache-Control for tenant marketing pages.
  //
  // The tenant catch-all route exports `dynamic = 'force-dynamic'` (see
  // web/app/s/[locale]/[site]/[[...page]]/page.tsx) because a small number
  // of sections — commerce-catalog, featured-products — call Supabase
  // admin APIs that trigger DYNAMIC_SERVER_USAGE on pre-rendered routes.
  // That's fine for correctness, but it also sets a no-cache response
  // header that prevents the CDN from caching purely-static marketing
  // pages (hero/features/testimonials/FAQ) which are the 99% case.
  //
  // We override the Cache-Control here for marketing pages. Commerce
  // sub-routes — /tienda, /producto/*, /carrito, /checkout — keep the
  // strict no-cache defaults so fresh inventory and cart state are never
  // served stale.
  const isTenantRoute = path.startsWith('/s/')
  const isTenantCommerce = /^\/s\/[^/]+\/[^/]+\/(tienda|producto|carrito|checkout)(\/|$)/.test(path)
  if (isTenantRoute && !isTenantCommerce) {
    // 60s fresh at the CDN edge, then up to 24h stale-while-revalidate.
    // Keeps latency tiny for repeat visitors; background revalidation
    // picks up content edits within a minute of the next request.
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=86400',
    )
  }

  // NOTE: Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy,
  // Permissions-Policy) are set in next.config.mjs → headers() so they apply
  // to static + dynamic routes uniformly. An earlier version of this
  // middleware also emitted a stricter CSP that blocked Google Fonts for
  // every tenant site — removed 2026-04. If you need route-specific CSP,
  // add a `<meta http-equiv="Content-Security-Policy">` tag in that route's
  // layout rather than overriding here.

  // Public routes: skip auth to reduce latency
  // Admin routes (/admin, /admin/*) are protected; everything else is public.
  const isAdminRoute = path === '/admin' || path.startsWith('/admin/')
  const isPublicRoute = !isAdminRoute || path === '/login'
  if (isPublicRoute) {
    return response
  }

  // Refresh session for protected routes (critical for Supabase SSR).
  // Skip auth check entirely when Supabase isn't configured with real credentials
  // to allow admin access during development.
  // NOTE: Read env var directly — the env.ts getter throws when the var is missing,
  // which would crash the middleware before the falsy check can evaluate.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (
    !supabaseUrl ||
    supabaseUrl.includes('placeholder')
  ) {
    return response
  }

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || ''

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({
          request: { headers: requestHeaders },
        })
        response.headers.set('x-request-id', requestId)
        response.headers.set('traceparent', traceparent)
        response.headers.set('x-pathname', path)
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // IMPORTANT: Use getUser() not getSession() - getUser() actually refreshes tokens
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users to login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('returnTo', path)

    const redirectResponse = NextResponse.redirect(url)
    redirectResponse.headers.set('x-request-id', requestId)
    return redirectResponse
  }

  return response
}

/**
 * Pick the best-matching locale from an Accept-Language header against
 * a set of enabled locales. Returns the first enabled locale that matches
 * any language-tag in the header (in q-weighted order), or undefined if
 * nothing matches.
 *
 * Handles three match levels in priority order:
 *   1. Exact tag match (e.g. 'de-DE' in enabled → 'de-DE')
 *   2. Primary subtag match (e.g. 'de-DE' in header → 'de' in enabled)
 *   3. Case-insensitive
 *
 * Intentionally simple — we're not implementing full BCP-47 negotiation,
 * just picking from a short list (usually 4 locales). No regex for the
 * q-value parser — a simple split is fine for well-formed Accept-Language.
 */
function pickBestLocale(acceptLanguage: string, enabled: readonly string[]): string | undefined {
  if (!acceptLanguage || enabled.length === 0) return undefined

  // Parse "en-US,en;q=0.9,de;q=0.8" into [['en-US',1],['en',0.9],['de',0.8]]
  const tags = acceptLanguage
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(';')
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
      const weight = q ? Number(q.slice(2)) : 1
      return { tag: tag.trim().toLowerCase(), weight: Number.isFinite(weight) ? weight : 1 }
    })
    .filter((t) => t.tag)
    .sort((a, b) => b.weight - a.weight)

  const enabledLower = enabled.map((l) => l.toLowerCase())

  // Pass 1: exact tag match (respecting q-order)
  for (const { tag } of tags) {
    const i = enabledLower.indexOf(tag)
    if (i !== -1) return enabled[i]
  }
  // Pass 2: primary subtag match (de-DE → de)
  for (const { tag } of tags) {
    const primary = tag.split('-')[0]
    const i = enabledLower.indexOf(primary)
    if (i !== -1) return enabled[i]
  }
  return undefined
}

export const config = {
  matcher: [
    // Run middleware for everything EXCEPT API / Next internals / favicons /
    // static assets. We explicitly list static asset extensions (css, js,
    // fonts, images) so that meaningful content paths like /<tenant>/
    // sitemap.xml and /<tenant>/robots.txt still go through the flat-slug
    // rewrite — without this, tenant sitemaps 500 because they fall to
    // the legacy `[business]/[page]` route instead of the canonical
    // `/s/<locale>/<site>/sitemap.xml` handler.
    '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:css|js|mjs|map|woff2?|ttf|eot|otf|svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm)$).*)',
  ],
}
