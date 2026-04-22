import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import {
  countActiveProducts,
  listActiveProducts,
  listDistinctCategories,
  type ProductSort,
} from '@/lib/commerce/products'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { Breadcrumbs } from '@/components/commerce/breadcrumbs'
import { env } from '@/lib/env'
import { ProductCard } from '@/components/commerce/product-card'
import { getSessionToken } from '@/lib/commerce/session'
import { getCartBySessionToken } from '@/lib/commerce/cart'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { TiendaToolbar } from '@/components/commerce/tienda-toolbar'
import { TiendaPagination } from '@/components/commerce/tienda-pagination'
import { loadPygRates } from '@/lib/commerce/currency-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string; locale: string; category: string }>
}): Promise<Metadata> {
  const { site, locale, category } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business) return {}
  const pretty = decodeURIComponent(category)
  const canonical = `${env.APP_URL}/s/${locale}/${site}/tienda/categoria/${category}`
  return {
    title: `${pretty} — ${business.name}`,
    description: `Productos de ${pretty} en ${business.name}. Envío discreto.`,
    alternates: { canonical },
    openGraph: { url: canonical, title: `${pretty} — ${business.name}` },
  }
}

const VALID_SORTS: ProductSort[] = ['newest', 'price-asc', 'price-desc', 'name-asc']
const PAGE_SIZE = 24

function parseSort(raw: string | undefined): ProductSort {
  return raw && (VALID_SORTS as string[]).includes(raw) ? (raw as ProductSort) : 'newest'
}

function parsePositiveInt(raw: string | undefined): number {
  if (!raw) return 0
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : 0
}

/**
 * Dedicated category route. Reuses the same toolbar + grid + pagination
 * as /tienda but pre-filters by the URL category slug.
 *
 * Category slugs come from the DB `products.category` column lowercased
 * + URL-encoded. If the route's slug doesn't match any distinct category,
 * we redirect to /tienda with ?category=<typed slug> so the toolbar can
 * show "no results for this category" consistently.
 */
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ site: string; locale: string; category: string }>
  searchParams: Promise<{
    q?: string
    sort?: string
    min?: string
    max?: string
    in_stock?: string
    on_sale?: string
    page?: string
  }>
}) {
  const { site, locale, category: rawCategory } = await params
  const sp = await searchParams
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  const categorySlug = decodeURIComponent(rawCategory).trim()
  if (!categorySlug) redirect(`/s/${locale}/${site}/tienda`)

  const available = await listDistinctCategories(business.id)
  // Case-insensitive match since slugs in URLs may be lowercased.
  const match = available.find((c) => c.toLowerCase() === categorySlug.toLowerCase())
  if (!match) {
    // Unknown category — bounce to tienda with a notice filter so the
    // shopper lands somewhere useful instead of a hard 404.
    redirect(`/s/${locale}/${site}/tienda?category=${encodeURIComponent(categorySlug)}`)
  }

  const search = (sp.q ?? '').trim()
  const sortKey = parseSort(sp.sort)
  const minPriceCents = parsePositiveInt(sp.min)
  const maxPriceCents = parsePositiveInt(sp.max)
  const inStockOnly = sp.in_stock === '1' || sp.in_stock === 'true'
  const onSaleOnly = sp.on_sale === '1' || sp.on_sale === 'true'
  const page = Math.max(1, parsePositiveInt(sp.page) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const filterOpts = {
    category: match,
    search,
    minPriceCents: minPriceCents || undefined,
    maxPriceCents: maxPriceCents || undefined,
    inStockOnly,
    onSaleOnly,
  }

  const [products, totalCount, rates] = await Promise.all([
    listActiveProducts(business.id, { ...filterOpts, limit: PAGE_SIZE, offset, sort: sortKey }),
    countActiveProducts(business.id, filterOpts),
    loadPygRates(),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const sessionToken = await getSessionToken()
  const initialCart = sessionToken && business
    ? await getCartBySessionToken(business.id, sessionToken).catch(() => null)
    : null

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={initialCart} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />

      <Breadcrumbs
        absoluteBaseUrl={env.APP_URL}
        items={[
          { label: business.name, href: `/s/${locale}/${site}` },
          { label: 'Tienda', href: `/s/${locale}/${site}/tienda` },
          { label: match },
        ]}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">

        <div className="mb-6 rounded-lg bg-[color:var(--primary,#111)] p-6 text-[color:var(--primary-foreground,#fff)] sm:p-8">
          <h1 className="text-3xl font-bold capitalize">{match}</h1>
          <p className="mt-1 text-sm opacity-90">
            {totalCount} {totalCount === 1 ? 'producto disponible' : 'productos disponibles'} en {match}.
          </p>
        </div>

        <TiendaToolbar
          initialQuery={search}
          initialSort={sortKey}
          resultCount={products.length}
          totalCount={totalCount}
          initialCategory={match}
          initialCategories={[match]}
          availableCategories={available}
          initialMinPrice={minPriceCents}
          initialMaxPrice={maxPriceCents}
          initialInStockOnly={inStockOnly}
          initialOnSaleOnly={onSaleOnly}
          initialPerPage={12}
          initialBrands={[]}
          availableBrands={[]}
          initialTags={[]}
          availableTags={[]}
        />

        {products.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-12 text-center">
            <p className="text-[color:var(--text-muted,#6b7280)]">
              No encontramos productos en <strong>{match}</strong> con esos filtros.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {available
                .filter((c) => c !== match)
                .slice(0, 6)
                .map((c) => (
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
