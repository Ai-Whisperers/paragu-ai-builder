/**
 * POST /api/storefront/[site]/reviews — submit a new product review.
 *
 * Always inserts with is_approved=false. An admin must approve before the
 * review becomes visible. Rate limit: 5 reviews / IP / hour (in-memory —
 * swap for Redis when horizontal). No auth: reviews are public-contributed
 * content behind moderation.
 */

import { NextResponse } from 'next/server'
import { ReviewCreateSchema } from '@/lib/schemas/commerce/review'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { createReview } from '@/lib/commerce/reviews'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const attempts = new Map<string, number[]>()

function allowedByRateLimit(ip: string): boolean {
  const now = Date.now()
  const arr = (attempts.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (arr.length >= RATE_LIMIT_MAX) return false
  arr.push(now)
  attempts.set(ip, arr)
  return true
}

export const POST = withRequestLog<{ site: string }>(async (request, _ctx, { site }) => {
  if (!site) {
    return NextResponse.json({ error: 'site_required' }, { status: 400 })
  }
  const business = await resolveBusinessBySlug(site)
  if (!business) {
    return NextResponse.json({ error: 'site_not_found' }, { status: 404 })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!allowedByRateLimit(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = ReviewCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed', issues: parsed.error.flatten() }, { status: 400 })
  }

  const review = await createReview(business.id, parsed.data)
  if (!review) {
    return NextResponse.json({ error: 'create_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, pending: true }, { status: 201 })
})
