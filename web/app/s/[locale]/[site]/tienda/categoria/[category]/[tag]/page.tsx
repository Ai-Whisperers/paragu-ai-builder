import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import {
  countActiveProducts,
  listActiveProducts,
  listDistinctCategories,
  listTagsForCategory,
  type ProductSort,
} from '@/lib/commerce/products'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { CommerceChrome } from '@/components/commerce/commerce-chrome'
import { Breadcrumbs } from '@/components/commerce/breadcrumbs'
import { env } from '@/lib/env'
import type { Locale } from '@/lib/i18n/config'
import { ProductCard } from '@/components/commerce/product-card'
import { getSessionToken } from '@/lib/commerce/session'
import { getCartBySessionToken } from '@/lib/commerce/cart'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { TiendaPagination } from '@/components/commerce/tienda-pagination'
import { loadPygRates } from '@/lib/commerce/currency-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

function parsePositiveInt(raw: string | undefined): number {
  if (!raw) return 0
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : 0
}

function pretty(s: string): string {
  const decoded = decodeURIComponent(s).replace(/-/g, ' ')
  return decoded.charAt(0).toUpperCase() + decoded.slice(1)
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ site: string; locale: string; category: string; tag: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { site, locale, category, tag } = await params
  const sp = await searchParams
  const business = await resolveBusinessBySlug(site)
  if (!business) return {}
  const prettyCat = pretty(category)
  const prettyTag = pretty(tag)
  const canonical = `${env.APP_URL}/s/${locale}/${site}/tienda/categoria/${category}/${tag}`
  const decodedCat = decodeURIComponent(category)
  const decodedTag = decodeURIComponent(tag)
  const count = await countActiveProducts(business.id, {
    category: decodedCat,
    tags: [decodedTag],
  }).catch(() => 0)
  // Transactional-intent title: "Comprar [Tag] [Category] en Paraguay | Store".
  // Peer analysis: luden.store uses the same "Comprar X en Y" pattern and
  // ranks consistently on Paraguay-specific long-tail terms.
  const title = `Comprar ${prettyTag} ${prettyCat} en Paraguay | ${business.name}`
  const description = count > 0
    ? `${prettyTag} · ${prettyCat} en ${business.name}: ${count} producto${count === 1 ? '' : 's'} con envío discreto a todo Paraguay. Pagá por transferencia, tarjeta o WhatsApp.`
    : `${prettyTag} · ${prettyCat} en ${business.name}. Envío a domicilio en Asunción y área metropolitana.`
  // noindex if any filter param set — the clean nested URL is the one
  // that should rank, permutations of it are duplicates.
  const hasFilterParam = ['q', 'min', 'max', 'sort', 'page', 'in_stock', 'on_sale']
    .some((k) => {
      const v = sp[k]
      return typeof v === 'string' ? v.length > 0 : Array.isArray(v) ? v.length > 0 : false
    })
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description },
    robots: count > 0 && !hasFilterParam
      ? { index: true, follow: true }
      : { index: false, follow: true },
  }
}

/**
 * Nested category+tag route: `/tienda/categoria/[cat]/[tag]/`.
 *
 * Peer analysis: luden.store surfaces URLs like `/dildos/dildos-realistas/`
 * that rank on specific long-tail search — a pattern we'd missed by
 * only indexing the flat /tienda and single-level /tienda/categoria/<cat>.
 * This route produces one indexable page per (category, tag) pair that
 * has ≥ 2 products in the catalog; the parent category page links in
 * (see ./[category]/page.tsx) so Google can discover them via internal
 * links without a sitemap change.
 *
 * 404 on unknown (category, tag) combo — we don't want to generate
 * thin-content pages for every typo in the URL.
 */
export default async function CategoryTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ site: string; locale: string; category: string; tag: string }>
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
  const { site, locale, category: rawCat, tag: rawTag } = await params
  const sp = await searchParams
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  const categorySlug = decodeURIComponent(rawCat).trim()
  const tagSlug = decodeURIComponent(rawTag).trim()
  if (!categorySlug || !tagSlug) redirect(`/s/${locale}/${site}/tienda`)

  const availableCats = await listDistinctCategories(business.id)
  const matchCat = availableCats.find((c) => c.toLowerCase() === categorySlug.toLowerCase())
  if (!matchCat) {
    redirect(`/s/${locale}/${site}/tienda?category=${encodeURIComponent(categorySlug)}`)
  }

  // Validate the tag belongs to this category with ≥1 product so we
  // don't generate thin-content pages for arbitrary tag typos.
  const tagsInCat = await listTagsForCategory(business.id, matchCat)
  const matchTag = tagsInCat.find((t) => t.tag.toLowerCase() === tagSlug.toLowerCase())
  if (!matchTag) notFound()

  const search = (sp.q ?? '').trim()
  const minPriceCents = parsePositiveInt(sp.min)
  const maxPriceCents = parsePositiveInt(sp.max)
  const inStockOnly = sp.in_stock === '1' || sp.in_stock === 'true'
  const onSaleOnly = sp.on_sale === '1' || sp.on_sale === 'true'
  const sortKey: ProductSort = (sp.sort as ProductSort) || 'newest'
  const page = Math.max(1, parsePositiveInt(sp.page) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const filterOpts = {
    category: matchCat,
    tags: [matchTag.tag],
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
  const initialCart = sessionToken
    ? await getCartBySessionToken(business.id, sessionToken).catch(() => null)
    : null

  const prettyCat = matchCat.charAt(0).toUpperCase() + matchCat.slice(1)
  const prettyTag = matchTag.tag.replace(/-/g, ' ')
  const prettyTagTitle = prettyTag.charAt(0).toUpperCase() + prettyTag.slice(1)

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={initialCart} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} whatsappNumber={business.whatsappNumber} />

      <Breadcrumbs
        absoluteBaseUrl={env.APP_URL}
        items={[
          { label: business.name, href: `/s/${locale}/${site}` },
          { label: 'Tienda', href: `/s/${locale}/${site}/tienda` },
          { label: prettyCat, href: `/s/${locale}/${site}/tienda/categoria/${encodeURIComponent(matchCat)}` },
          { label: prettyTagTitle },
        ]}
      />

      <main className="mx-auto  px-4 py-8">
        <div className="mb-6 rounded-lg bg-primary p-6 text-[color:var(--primary-foreground,#fff)] sm:p-8">
          <h1 className="text-3xl font-bold">
            {prettyTagTitle} · <span className="opacity-80">{prettyCat}</span>
          </h1>
          <p className="mt-1 text-sm opacity-90">
            {totalCount} {totalCount === 1 ? 'producto' : 'productos'} de {prettyTagTitle.toLowerCase()} en {prettyCat.toLowerCase()} con envío discreto a todo Paraguay.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-surface p-12 text-center">
            <p className="text-[color:var(--text-muted,#6b7280)]">
              No hay productos en <strong>{prettyTag}</strong> dentro de {prettyCat}.
            </p>
            <Link
              href={`/s/${locale}/${site}/tienda/categoria/${encodeURIComponent(matchCat)}`}
              className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)]"
            >
              Ver toda la categoría {prettyCat}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
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

        {/* Sibling tag links inside the same category — internal linking
            so Google finds adjacent subcategory pages without a sitemap. */}
        {tagsInCat.length > 1 ? (
          <nav
            aria-label="Otras subcategorías"
            className="mt-10 border-t border-[color:var(--border,#e5e7eb)] pt-6"
          >
            <p className="mb-3 text-sm font-medium text-[color:var(--text,#111)]">
              Otras subcategorías en {prettyCat}
            </p>
            <ul className="flex flex-wrap gap-2 text-xs">
              {tagsInCat
                .filter((t) => t.tag !== matchTag.tag)
                .slice(0, 12)
                .map((t) => (
                  <li key={t.tag}>
                    <Link
                      href={`/s/${locale}/${site}/tienda/categoria/${encodeURIComponent(matchCat)}/${encodeURIComponent(t.tag)}`}
                      className="rounded-full border border-[color:var(--border,#e5e7eb)] bg-surface px-3 py-1 capitalize hover:bg-surface-light"
                    >
                      {t.tag.replace(/-/g, ' ')}{' '}
                      <span className="opacity-60">({t.count})</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        ) : null}
      </main>

      <CommerceChrome siteSlug={site} locale={locale as Locale} />
    </div>
  )
}
