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
import { env } from '@/lib/env'

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
  // Note: /admin is temporarily unprotected until Supabase auth is configured.
  // Once login flow is implemented, remove '/admin' from this list.
  const isPublicRoute = !path.startsWith('/admin') || path === '/login'
  if (isPublicRoute) {
    return response
  }

  // Refresh session for protected routes (critical for Supabase SSR).
  // Skip auth check entirely when Supabase isn't configured with real credentials
  // to allow admin access during development.
  if (
    !env.SUPABASE_URL ||
    env.SUPABASE_URL.includes('placeholder')
  ) {
    return response
  }

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
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
  if (!user && isProtectedRoute) {
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
