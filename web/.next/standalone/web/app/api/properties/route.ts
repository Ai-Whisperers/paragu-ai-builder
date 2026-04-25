/**
 * GET /api/properties — paginated property listings from Supabase.
 *
 * Consumers: the `property-listings` section in its `listings-from-api`
 * variant. Tenants filter via query params:
 *   ?siteSlug=nexa-propiedades&transactionType=venta&priceMax=300000
 *
 * Degrades gracefully: if the `properties` table doesn't exist yet (the
 * migration hasn't been applied), returns an empty list with a `note`
 * instead of 500. That way sites rendering the section don't hard-fail
 * during gradual rollout.
 */

import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export interface PropertyFilter {
  transactionType?: 'venta' | 'alquiler' | 'temporal'
  propertyType?: string
  neighborhood?: string
  priceMin?: number
  priceMax?: number
  bedrooms?: number
  siteSlug?: string
  page?: number
  pageSize?: number
}

const MAX_PAGE_SIZE = 50

export const GET = withRequestLog(async (req, { log }) => {
  const url = new URL(req.url)
  const filter: PropertyFilter = {
    transactionType: (url.searchParams.get('transactionType') as PropertyFilter['transactionType']) || undefined,
    propertyType: url.searchParams.get('propertyType') || undefined,
    neighborhood: url.searchParams.get('neighborhood') || undefined,
    siteSlug: url.searchParams.get('siteSlug') || undefined,
    priceMin: url.searchParams.get('priceMin') ? Number(url.searchParams.get('priceMin')) : undefined,
    priceMax: url.searchParams.get('priceMax') ? Number(url.searchParams.get('priceMax')) : undefined,
    bedrooms: url.searchParams.get('bedrooms') ? Number(url.searchParams.get('bedrooms')) : undefined,
    page: Math.max(1, Number(url.searchParams.get('page') || '1')),
    pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, Number(url.searchParams.get('pageSize') || '20'))),
  }

  log.debug('properties list requested', { filter })

  const supabase = await createClient('anon')
  let q = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'active')
    .order('published_at', { ascending: false, nullsFirst: false })

  if (filter.siteSlug) q = q.eq('site_slug', filter.siteSlug)
  if (filter.transactionType) q = q.eq('transaction', filter.transactionType)
  if (filter.propertyType) q = q.eq('property_type', filter.propertyType)
  if (filter.neighborhood) q = q.eq('neighborhood', filter.neighborhood)
  if (filter.bedrooms !== undefined) q = q.gte('bedrooms', filter.bedrooms)
  if (filter.priceMin !== undefined) q = q.gte('price', filter.priceMin)
  if (filter.priceMax !== undefined) q = q.lte('price', filter.priceMax)

  const from = (filter.page! - 1) * filter.pageSize!
  const to = from + filter.pageSize! - 1
  q = q.range(from, to)

  const { data, error, count } = await q
  if (error) {
    log.warn('properties query failed', { error: error.message })
    if (/does not exist|relation .* does not exist/.test(error.message)) {
      return NextResponse.json({
        data: [],
        pagination: { total: 0, page: filter.page, pageSize: filter.pageSize },
        note: 'properties table not yet provisioned',
      })
    }
    return NextResponse.json({ error: 'query_failed', detail: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data: data || [],
    pagination: {
      total: count ?? data?.length ?? 0,
      page: filter.page,
      pageSize: filter.pageSize,
    },
  })
})
