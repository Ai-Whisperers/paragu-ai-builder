import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function authMiddleware(request: NextRequest, next: () => Promise<NextResponse>) {
  const path = request.nextUrl.pathname
  const isAdminRoute = path === '/admin' || path.startsWith('/admin/')
  const isDashboardRoute = path === '/dashboard' || path.startsWith('/dashboard/')
  const isProtectedRoute = isAdminRoute || isDashboardRoute
  const isPublicRoute = !isProtectedRoute || path === '/login' || path === '/tenant-login'

  if (isPublicRoute) {
    return next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return next()
  }

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || ''

  let response = await next()

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request: { headers: request.headers } })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = isDashboardRoute ? '/tenant-login' : '/login'
    url.searchParams.set('returnTo', path)
    return NextResponse.redirect(url)
  }

  return response
}
