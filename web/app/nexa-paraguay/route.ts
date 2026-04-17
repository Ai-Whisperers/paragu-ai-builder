/**
 * Nexa Paraguay - Redirect any route to tenant site
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export function GET(request: NextRequest) {
  const url = new URL(request.url)
  const page = url.pathname.replace(/^\/nexa-paraguay/, '').replace(/^\/$/, '') || ''
  const target = page ? `/s/nl/nexa-paraguay/${page}` : '/s/nl/nexa-paraguay'
  return NextResponse.rewrite(new URL(target, request.url))
}