import { notFound } from 'next/navigation'
import Link from 'next/link'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import {
  listActiveProducts,
  countActiveProducts,
  listDistinctCategories,
  type ProductSort,
} from '@/lib/commerce/products'
import { recordSearchEvent } from '@/lib/commerce/search-events'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { ProductCard } from '@/components/commerce/product-card'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { TiendaToolbar } from '@/components/commerce/tienda-toolbar'
import { TiendaQuickFilters } from '@/components/commerce/tienda-quick-filters'
import { TiendaPagination } from '@/components/commerce/tienda-pagination'
import { loadPygRates } from '@/lib/commerce/currency-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // search/sort/filter params kill static caching

const VALID_SORTS: ProductSort[] = ['newest', 'price-asc', 'price-desc', 'name-asc']
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
  }>
}) {
  const { site, locale } = await params
  const sp = await searchParams
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  const search = (sp.q ?? '').trim()
  const sortKey = parseSort(sp.sort)
  const category = (sp.category ?? '').trim()
  const minPriceCents = parsePositiveInt(sp.min)
  const maxPriceCents = parsePositiveInt(sp.max)
  const inStockOnly = sp.in_stock === '1' || sp.in_stock === 'true'
  const onSaleOnly = sp.on_sale === '1' || sp.on_sale === 'true'
  const perPage = parsePerPage(sp.per_page)
  const page = Math.max(1, parsePositiveInt(sp.page) || 1)
  const offset = (page - 1) * perPage

  const filterOpts = {
    search,
    category: category || undefined,
    minPriceCents: minPriceCents || undefined,
    maxPriceCents: maxPriceCents || undefined,
    inStockOnly,
    onSaleOnly,
  }

  const [products, totalCount, rates, availableCategories] = await Promise.all([
    listActiveProducts(business.id, { ...filterOpts, limit: perPage, offset, sort: sortKey }),
    countActiveProducts(business.id, filterOpts),
    loadPygRates(),
    listDistinctCategories(business.id),
  ])

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
    search || category || minPriceCents || maxPriceCents || inStockOnly || onSaleOnly,
  )

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={null} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-[color:var(--text,#111)]">Nuestra tienda</h1>

        <TiendaQuickFilters />
        <TiendaToolbar
          initialQuery={search}
          initialSort={sortKey}
          resultCount={products.length}
          totalCount={totalCount}
          initialCategory={category}
          availableCategories={availableCategories}
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
      </main>
    </div>
  )
}
