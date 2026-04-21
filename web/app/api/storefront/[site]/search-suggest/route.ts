import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { listActiveProducts } from '@/lib/commerce/products'
import { recordSearchEvent } from '@/lib/commerce/search-events'

export const runtime = 'nodejs'

/**
 * GET /api/storefront/[site]/search-suggest?q=…
 *
 * Returns up to 6 active products whose name/description/SKU match.
 * Powers the header autocomplete. Payload is intentionally small —
 * just enough to render a suggestion row and link to a PDP.
 */
export const GET = withRequestLog<{ site: string }>(async (req, _ctx, { site }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ suggestions: [] })

  const url = new URL(req.url)
  const q = (url.searchParams.get('q') ?? '').trim()
  if (q.length < 2) return NextResponse.json({ suggestions: [] })

  const products = await listActiveProducts(business.id, { search: q, limit: 6, sort: 'name-asc' })
  const suggestions = products.map((p) => {
    const cover = p.images.find((i) => i.isCover) ?? p.images[0]
    return {
      slug: p.slug,
      name: p.name,
      priceCents: p.priceCents,
      currency: p.currency,
      imageUrl: cover?.url ?? null,
      category: p.category,
    }
  })
  // Fire-and-forget — don't await, never let analytics block the response.
  void recordSearchEvent({
    businessId: business.id,
    query: q,
    resultCount: suggestions.length,
    source: 'suggest',
  })
  return NextResponse.json({ suggestions })
})
