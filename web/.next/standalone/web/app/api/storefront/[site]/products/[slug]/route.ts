import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { getProductBySlug } from '@/lib/commerce/products'

export const runtime = 'nodejs'

export const GET = withRequestLog<{ site: string; slug: string }>(async (_req, _ctx, { site, slug }) => {
  const business = await resolveBusinessBySlug(site)
  if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const product = await getProductBySlug(business.id, slug)
  if (!product || product.status !== 'active') return NextResponse.json({ error: 'not_found' }, { status: 404 })

  return NextResponse.json({ product })
})
