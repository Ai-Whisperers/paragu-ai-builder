import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import {
  listActiveProducts,
  countActiveProducts,
  listDistinctCategories,
  listCategoryCounts,
  listDistinctBrands,
  listDistinctTags,
  getPopularityByBusiness,
  type ProductSort,
} from '@/lib/commerce/products'
import { recordSearchEvent, listTopSearches } from '@/lib/commerce/search-events'
import { getReviewAggregatesByBusiness } from '@/lib/commerce/reviews'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { ProductCard } from '@/components/commerce/product-card'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { TiendaToolbar } from '@/components/commerce/tienda-toolbar'
import { TiendaQuickFilters } from '@/components/commerce/tienda-quick-filters'
import { TiendaPagination } from '@/components/commerce/tienda-pagination'
import { RecentlyViewedRail } from '@/components/commerce/recently-viewed-rail'
import { Breadcrumbs } from '@/components/commerce/breadcrumbs'
import { env } from '@/lib/env'
import { loadPygRates } from '@/lib/commerce/currency-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // search/sort/filter params kill static caching

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string; locale: string }>
}): Promise<Metadata> {
  const { site, locale } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business) return {}
  const canonical = `${env.APP_URL}/s/${locale}/${site}/tienda`
  return {
    title: `Tienda — ${business.name}`,
    description: `Catálogo completo de ${business.name}. Envío a todo Paraguay.`,
    alternates: { canonical },
    openGraph: { url: canonical, title: `Tienda — ${business.name}` },
  }
}

const VALID_SORTS: ProductSort[] = ['newest', 'price-asc', 'price-desc', 'name-asc', 'popularity', 'rating']
const DEFAULT_PER_PAGE = 12
const PER_PAGE_OPTIONS = [12, 24, 48, 96]
const MAX_PER_PAGE = 96

function parseSort(raw: string | undefined): ProductSort {
  return raw && (VALID_SORTS as string[]).includes(raw) ? (raw as ProductSort) : 'newest'
}

function parsePositiveInt(raw: string | undefined): number {
  if (!raw) return 0
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function parsePerPage(raw: string | undefined): number {
  const n = parsePositiveInt(raw)
  if (!n) return DEFAULT_PER_PAGE
  return PER_PAGE_OPTIONS.includes(n) ? n : Math.min(n, MAX_PER_PAGE)
}

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ site: string; locale: string }>
  searchParams: Promise<{
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
  }>
}) {
  const { site, locale } = await params
  const sp = await searchParams
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  const search = (sp.q ?? '').trim()
  const sortKey = parseSort(sp.sort)
  // Supports "a,b,c" comma-delimited multi-select; single "a" stays as a
  // one-element array. Empty/undefined → empty array.
  const categories = (sp.category ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const category = categories[0] ?? ''
  const brands = (sp.brand ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const tags = (sp.tag ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const minPriceCents = parsePositiveInt(sp.min)
  const maxPriceCents = parsePositiveInt(sp.max)
  const inStockOnly = sp.in_stock === '1' || sp.in_stock === 'true'
  const onSaleOnly = sp.on_sale === '1' || sp.on_sale === 'true'
  const perPage = parsePerPage(sp.per_page)
  const page = Math.max(1, parsePositiveInt(sp.page) || 1)
  const offset = (page - 1) * perPage

  const filterOpts = {
    search,
    categories: categories.length > 0 ? categories : undefined,
    brands: brands.length > 0 ? brands : undefined,
    tags: tags.length > 0 ? tags : undefined,
    minPriceCents: minPriceCents || undefined,
    maxPriceCents: maxPriceCents || undefined,
    inStockOnly,
    onSaleOnly,
  }

  // Popularity + rating sorts require all matching rows up front so we can
  // re-sort by aggregates before paginating. For any other sort the DB
  // paginates natively.
  const needsPostSort = sortKey === 'popularity' || sortKey === 'rating'
  const fetchLimit = needsPostSort ? 500 : perPage
  const fetchOffset = needsPostSort ? 0 : offset

  const [fetchedProducts, totalCount, rates, availableCategories, categoryCounts, topSearches, availableBrands, availableTags, reviewAggregates, popularityMap] =
    await Promise.all([
      listActiveProducts(business.id, { ...filterOpts, limit: fetchLimit, offset: fetchOffset, sort: sortKey }),
      countActiveProducts(business.id, filterOpts),
      loadPygRates(),
      listDistinctCategories(business.id),
      listCategoryCounts(business.id),
      listTopSearches(business.id, { windowDays: 30, limit: 8 }),
      listDistinctBrands(business.id),
      listDistinctTags(business.id),
      getReviewAggregatesByBusiness(business.id),
      sortKey === 'popularity' ? getPopularityByBusiness(business.id) : Promise.resolve(new Map<string, number>()),
    ])

  let products = fetchedProducts
  if (sortKey === 'popularity') {
    products = [...fetchedProducts]
      .sort((a, b) => (popularityMap.get(b.id) ?? 0) - (popularityMap.get(a.id) ?? 0))
      .slice(offset, offset + perPage)
  } else if (sortKey === 'rating') {
    // Rank by avg rating desc, tiebreak by count desc, tiebreak by created_at desc.
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
  // Only surface suggestions with at least 1 result (non-zero-result).
  // Dedup by normalized form, keep pretty sampleQuery.
  const popularQueries = topSearches
    .filter((s) => s.avgResults >= 1)
    .slice(0, 5)
    .map((s) => s.sampleQuery)

  // Record shopper searches only when there's an actual query term — avoids
  // a log entry on every tienda page view. Fire-and-forget, non-blocking.
  if (search) {
    void recordSearchEvent({
      businessId: business.id,
      query: search,
      resultCount: totalCount,
      source: 'tienda',
    })
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const hasActiveFilters = Boolean(
    search ||
      categories.length > 0 ||
      brands.length > 0 ||
      tags.length > 0 ||
      minPriceCents ||
      maxPriceCents ||
      inStockOnly ||
      onSaleOnly,
  )

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={null} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />

      <Breadcrumbs
        absoluteBaseUrl={env.APP_URL}
        items={[
          { label: business.name, href: `/s/${locale}/${site}` },
          { label: 'Tienda' },
        ]}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-[color:var(--text,#111)]">Nuestra tienda</h1>

        <TiendaQuickFilters />
        {!search && popularQueries.length > 0 ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-[color:var(--text-muted,#6b7280)]">Búsquedas populares:</span>
            {popularQueries.map((q) => (
              <Link
                key={q}
                href={`/s/${locale}/${site}/tienda?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] px-3 py-1 hover:bg-[color:var(--surface-muted,#f3f4f6)]"
              >
                {q}
              </Link>
            ))}
          </div>
        ) : null}
        <TiendaToolbar
          initialQuery={search}
          initialSort={sortKey}
          resultCount={products.length}
          totalCount={totalCount}
          initialCategory={category}
          initialCategories={categories}
          availableCategories={availableCategories}
          categoryCounts={categoryCounts}
          initialBrands={brands}
          availableBrands={availableBrands}
          initialTags={tags}
          availableTags={availableTags}
          initialMinPrice={minPriceCents}
          initialMaxPrice={maxPriceCents}
          initialInStockOnly={inStockOnly}
          initialOnSaleOnly={onSaleOnly}
          initialPerPage={perPage}
        />

        {products.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-12 text-center">
            <p className="text-[color:var(--text-muted,#6b7280)]">
              {hasActiveFilters
                ? 'No encontramos productos con esos filtros. Probá quitar alguno o buscar otra palabra.'
                : 'Estamos cargando nuestro catálogo. Volvé pronto.'}
            </p>
            {hasActiveFilters && availableCategories.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-[color:var(--text-muted,#6b7280)]">
                  Probá otra categoría:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {availableCategories.slice(0, 8).map((c) => (
                    <Link
                      key={c}
                      href={`/s/${locale}/${site}/tienda/categoria/${encodeURIComponent(c)}`}
                      className="rounded-full border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs capitalize hover:bg-[color:var(--surface-muted,#f3f4f6)]"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            {!hasActiveFilters && business.whatsappNumber ? (
              <a
                href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa comprar en ${business.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                <span aria-hidden="true">💬</span>
                Consultar por WhatsApp
              </a>
            ) : null}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  siteSlug={site}
                  product={product}
                  priority={idx < 4}
                  rates={rates}
                  locale={locale}
                  reviewAggregate={reviewAggregates[product.id]}
                  highlight={search || undefined}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-10">
                <TiendaPagination currentPage={page} totalPages={totalPages} />
              </div>
            ) : null}
          </>
        )}

        <RecentlyViewedRail siteSlug={site} locale={locale} />
      </main>
    </div>
  )
}
