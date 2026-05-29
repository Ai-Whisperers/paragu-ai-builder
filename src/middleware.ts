import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Force correct MIME types for static assets
  if (request.nextUrl.pathname.match(/\.(js|css|woff2?|ttf|eot|otf)$/)) {
    const ext = request.nextUrl.pathname.split('.').pop()

    const contentTypes: Record<string, string> = {
      'js': 'application/javascript; charset=utf-8',
      'css': 'text/css; charset=utf-8',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'ttf': 'font/ttf',
      'eot': 'application/vnd.ms-fontobject',
      'otf': 'font/otf',
    }

    if (ext && contentTypes[ext]) {
      response.headers.set('Content-Type', contentTypes[ext])
      response.headers.set('X-Content-Type-Options', 'nosniff')
    }
  }

  return response
}

// Configure which paths the middleware runs on
export const config = {
  matcher: '/_next/static/:path*',
}