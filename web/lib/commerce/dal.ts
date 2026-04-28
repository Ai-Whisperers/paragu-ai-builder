/**
 * Data Access Layer for the commerce storefront.
 *
 * Encapsulates ALL data fetching for storefront pages (/tienda, /categoria, /producto).
 * Pages should NOT fetch data directly from Supabase — they use this module.
 *
 * Each loader function:
 * 1. Resolves the business by slug
 * 2. Fetches all required data in PARALLEL via Promise.all
 * 3. Returns a typed object
 */

import { resolveBusinessBySlug } from './resolve-business'
import {
  listActiveProducts,
  countActiveProducts,
  listDistinctCategories,
  listCategoryCounts,
  listDistinctBrands,
  listDistinctTags,
  getPopularityByBusiness,
  getProductBySlug,
  listRelatedProducts,
} from './products'
import { getReviewAggregatesByBusiness } from './reviews'
import { listTopSearches } from './search-events'
import { loadPygRates } from './currency-server'
import type { Product, ProductSort } from '@/lib/schemas/commerce'

// ─── Shared types ──────────────────────────────────────────

export interface FilterOptions {
  search?: string
  categories?: string[]
  brands?: string[]
  tags?: string[]
  minPriceCents?: number
  maxPriceCents?: number
  inStockOnly?: boolean
  onSaleOnly?: boolean
  sort?: ProductSort
  page?: number
  perPage?: number
}

export interface TiendaPageData {
  business: { id: string; name: string; whatsappNumber?: string; type: string }
  products: Product[]
  totalCount: number
  availableCategories: string[]
  categoryCounts: Record<string, number>
  availableBrands: string[]
  availableTags: string[]
  reviewAggregates: Record<string, { avg: number; count: number }>
  rates: Record<string, number>
  topSearches: { sampleQuery: string; avgResults: number }[]
  popularityMap: Map<string, number>
}

export interface ProductPageData {
  product: Product
  related: Product[]
  reviewAggregates: Record<string, { avg: number; count: number }>
  rates: Record<string, number>
}

// ─── Helpers ───────────────────────────────────────────────

function parsePositiveInt(raw: string | undefined): number {
  if (!raw) return 0
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function parsePerPage(raw: string | undefined): number {
  const n = parsePositiveInt(raw)
  if (!n) return 12
  return [12, 24, 48, 96].includes(n) ? n : Math.min(n, 96)
}

export function parseProductFilters(searchParams: {
  q?: string
  sort?: string
  category?: string
  min?: string
  max?: string
  in_stock?: string
  on_sale?: string
  page?: string
  per_page?: string
  brand?: string
  tag?: string
}): FilterOptions & { parsedPage: number; parsedPerPage: number; hasActiveFilters: boolean } {
  const search = (searchParams.q ?? '').trim()
  const categories = (searchParams.category ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const brands = (searchParams.brand ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const tags = (searchParams.tag ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const minPriceCents = parsePositiveInt(searchParams.min)
  const maxPriceCents = parsePositiveInt(searchParams.max)
  const inStockOnly = searchParams.in_stock === '1' || searchParams.in_stock === 'true'
  const onSaleOnly = searchParams.on_sale === '1' || searchParams.on_sale === 'true'
  const parsedPerPage = parsePerPage(searchParams.per_page)
  const parsedPage = Math.max(1, parsePositiveInt(searchParams.page) || 1)

  const VALID_SORTS: ProductSort[] = ['newest', 'price-asc', 'price-desc', 'name-asc', 'popularity', 'rating']
  const sort = searchParams.sort && VALID_SORTS.includes(searchParams.sort as ProductSort)
    ? (searchParams.sort as ProductSort)
    : 'newest' as ProductSort

  const hasActiveFilters = Boolean(
    search || categories.length > 0 || brands.length > 0 || tags.length > 0 ||
    minPriceCents || maxPriceCents || inStockOnly || onSaleOnly,
  )

  return {
    search,
    sort,
    categories,
    brands,
    tags,
    minPriceCents: minPriceCents || undefined,
    maxPriceCents: maxPriceCents || undefined,
    inStockOnly,
    onSaleOnly,
    parsedPage,
    parsedPerPage,
    hasActiveFilters,
  }
}

// ─── Loader functions ──────────────────────────────────────

export async function loadTiendaPageData(
  siteSlug: string,
  filters: FilterOptions & { sort?: ProductSort },
  page: number,
  perPage: number,
): Promise<TiendaPageData> {
  const business = await resolveBusinessBySlug(siteSlug)
  if (!business) throw new Error(`Business not found: ${siteSlug}`)

  const offset = (page - 1) * perPage
  const needsPostSort = filters.sort === 'popularity' || filters.sort === 'rating'
  const fetchLimit = needsPostSort ? 500 : perPage
  const fetchOffset = needsPostSort ? 0 : offset

  const [
    fetchedProducts,
    totalCount,
    rates,
    availableCategories,
    categoryCounts,
    topSearches,
    availableBrands,
    availableTags,
    reviewAggregates,
    popularityMap,
  ] = await Promise.all([
    listActiveProducts(business.id, { ...filters, limit: fetchLimit, offset: fetchOffset, sort: filters.sort }),
    countActiveProducts(business.id, filters),
    loadPygRates(),
    listDistinctCategories(business.id),
    listCategoryCounts(business.id),
    listTopSearches(business.id, { windowDays: 30, limit: 8 }),
    listDistinctBrands(business.id),
    listDistinctTags(business.id),
    getReviewAggregatesByBusiness(business.id),
    filters.sort === 'popularity' ? getPopularityByBusiness(business.id) : Promise.resolve(new Map<string, number>()),
  ])

  let products = fetchedProducts
  if (filters.sort === 'popularity') {
    products = [...fetchedProducts]
      .sort((a, b) => (popularityMap.get(b.id) ?? 0) - (popularityMap.get(a.id) ?? 0))
      .slice(offset, offset + perPage)
  } else if (filters.sort === 'rating') {
    products = [...fetchedProducts]
      .sort((a, b) => {
        const ra = reviewAggregates[a.id]
        const rb = reviewAggregates[b.id]
        const aAvg = ra?.avg ?? 0
        const bAvg = rb?.avg ?? 0
        if (bAvg !== aAvg) return bAvg - aAvg
        const aCount = ra?.count ?? 0
        const bCount = rb?.count ?? 0
        if (bCount !== aCount) return bCount - aCount
        return Date.parse(b.createdAt) - Date.parse(a.createdAt)
      })
      .slice(offset, offset + perPage)
  }

  return {
    business,
    products,
    totalCount,
    availableCategories,
    categoryCounts,
    availableBrands,
    availableTags,
    reviewAggregates,
    rates,
    topSearches,
    popularityMap,
  }
}

export async function loadProductPageData(
  siteSlug: string,
  productSlug: string,
): Promise<ProductPageData | null> {
  const business = await resolveBusinessBySlug(siteSlug)
  if (!business) return null

  const product = await getProductBySlug(business.id, productSlug)
  if (!product) return null

  const [rates, related, reviewAggregates] = await Promise.all([
    loadPygRates(),
    listRelatedProducts(business.id, { excludeId: product.id, category: product.category, limit: 4 }),
    getReviewAggregatesByBusiness(business.id),
  ])

  return { product, related, reviewAggregates, rates }
}
