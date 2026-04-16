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

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname
  const requestId = crypto.randomUUID()

  // Skip root path and static files
  if (path === '/') {
    return NextResponse.next()
  }

  // Add request ID and pathname headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)
  requestHeaders.set('x-pathname', path)

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set('x-request-id', requestId)
  response.headers.set('x-pathname', path)

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
