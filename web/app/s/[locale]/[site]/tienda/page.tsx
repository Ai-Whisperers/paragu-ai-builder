import { notFound } from 'next/navigation'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { listActiveProducts, type ProductSort } from '@/lib/commerce/products'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { ProductCard } from '@/components/commerce/product-card'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { TiendaToolbar } from '@/components/commerce/tienda-toolbar'
import { loadPygRates } from '@/lib/commerce/currency-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // search/sort params kill static caching

const VALID_SORTS: ProductSort[] = ['newest', 'price-asc', 'price-desc', 'name-asc']

function parseSort(raw: string | undefined): ProductSort {
  return raw && (VALID_SORTS as string[]).includes(raw) ? (raw as ProductSort) : 'newest'
}

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ site: string; locale: string }>
  searchParams: Promise<{ q?: string; sort?: string }>
}) {
  const { site, locale } = await params
  const { q, sort } = await searchParams
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  const search = (q ?? '').trim()
  const sortKey = parseSort(sort)
  const [products, rates] = await Promise.all([
    listActiveProducts(business.id, { limit: 48, search, sort: sortKey }),
    loadPygRates(),
  ])

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={null} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-[color:var(--text,#111)]">Nuestra tienda</h1>

        <TiendaToolbar initialQuery={search} initialSort={sortKey} resultCount={products.length} />

        {products.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-12 text-center">
            <p className="text-[color:var(--text-muted,#6b7280)]">
              {search ? `No encontramos productos para "${search}".` : 'Estamos cargando nuestro catálogo. Volvé pronto.'}
            </p>
            {!search && business.whatsappNumber ? (
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
          <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} siteSlug={site} product={product} priority={idx < 4} rates={rates} locale={locale} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
