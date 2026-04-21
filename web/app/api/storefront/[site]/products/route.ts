import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { listActiveProducts } from '@/lib/commerce/products'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ site: string }>(async (request, { log }, { site }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const url = new URL(request.url)
  const category = url.searchParams.get('category') ?? undefined
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10) || 50, 100)
  const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0', 10) || 0, 0)

  const products = await listActiveProducts(business.id, { category, limit, offset })
  log.info('storefront.products.listed', { siteSlug: site, count: products.length })

  return NextResponse.json({ products })
})
