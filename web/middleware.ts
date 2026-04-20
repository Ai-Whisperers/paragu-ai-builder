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
        const locale = request.cookies.get('NEXT_LOCALE')?.value
          || site.defaultLocale
          || site.locales?.[0]
          || 'es'
        const remainder = path.slice(firstSegment.length + 1) // drop "/<slug>"
        const url = request.nextUrl.clone()
        url.pathname = `/s/${locale}/${firstSegment}${remainder ? remainder : ''}`
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

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)',
  ],
}
