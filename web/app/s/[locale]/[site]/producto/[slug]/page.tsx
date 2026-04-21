import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { getProductBySlug, listRelatedProducts } from '@/lib/commerce/products'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { ProductImage } from '@/components/commerce/product-image'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { formatCents } from '@/lib/commerce/compute-totals'
import { ProductDetailActions } from '@/components/commerce/product-detail-actions'
import { ProductCard } from '@/components/commerce/product-card'
import { ProductShare } from '@/components/commerce/product-share'
import { WishlistButton } from '@/components/commerce/wishlist-button'
import { RecordRecentVisit } from '@/components/commerce/record-recent-visit'
import { RecentlyViewedRail } from '@/components/commerce/recently-viewed-rail'
import { PriceDisplay } from '@/components/commerce/price-display'
import { loadPygRates } from '@/lib/commerce/currency-server'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ site: string; slug: string }> }): Promise<Metadata> {
  const { site, slug } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business) return {}
  const product = await getProductBySlug(business.id, slug)
  if (!product) return {}
  const cover = product.images.find((i) => i.isCover) ?? product.images[0]
  return {
    title: `${product.name} — ${business.name}`,
    description: product.description ?? `${product.name} disponible en ${business.name}.`,
    openGraph: {
      title: product.name,
      description: product.description ?? '',
      images: cover?.url ? [{ url: cover.url }] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ site: string; locale: string; slug: string }> }) {
  const { site, locale, slug } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  const product = await getProductBySlug(business.id, slug)
  if (!product || product.status !== 'active') notFound()

  const cover = product.images.find((i) => i.isCover) ?? product.images[0]
  const [rates, related] = await Promise.all([
    loadPygRates(),
    listRelatedProducts(business.id, { excludeId: product.id, category: product.category, limit: 4 }),
  ])

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: cover?.url,
    sku: product.sku ?? undefined,
    offers: {
      '@type': 'Offer',
      price: product.priceCents,
      priceCurrency: product.currency,
      availability:
        product.inventoryPolicy === 'deny' && product.inventoryQty === 0
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
    },
  }

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={null} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <nav aria-label="Migas de pan" className="mx-auto max-w-5xl px-4 pt-4 text-sm text-[color:var(--text-muted,#6b7280)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href={`/s/${locale}/${site}`} className="hover:underline">{business.name}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/s/${locale}/${site}/tienda`} className="hover:underline">Tienda</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="truncate text-[color:var(--text,#111)]" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:grid-cols-2">
        <div>
          <ProductImage image={cover} alt={product.name} aspectRatio="4:5" priority isSeed={product.isSeed} />
          {product.images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, idx) => (
                <ProductImage key={idx} image={img} alt={`${product.name} ${idx + 1}`} aspectRatio="1:1" />
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[color:var(--text,#111)]">{product.name}</h1>
          {product.currency === 'PYG' ? (
            <PriceDisplay className="mt-2 block text-2xl font-semibold" pygCents={product.priceCents} rates={rates} />
          ) : (
            <p className="mt-2 text-2xl font-semibold">{formatCents(product.priceCents, product.currency)}</p>
          )}
          {product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents ? (
            product.currency === 'PYG' ? (
              <PriceDisplay
                className="mt-1 block text-sm text-[color:var(--text-muted,#9ca3af)] line-through"
                pygCents={product.compareAtPriceCents}
                rates={rates}
              />
            ) : (
              <p className="mt-1 text-sm text-[color:var(--text-muted,#9ca3af)] line-through">
                {formatCents(product.compareAtPriceCents, product.currency)}
              </p>
            )
          ) : null}

          {product.description ? (
            <p className="mt-6 whitespace-pre-line text-[color:var(--text,#111)]">{product.description}</p>
          ) : null}

          <div className="mt-6">
            <ProductDetailActions siteSlug={site} productId={product.id} inventoryQty={product.inventoryQty} inventoryPolicy={product.inventoryPolicy} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <WishlistButton
              siteSlug={site}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                currency: product.currency,
                imageUrl: cover?.url ?? null,
              }}
            />
          </div>

          <ProductShare productName={product.name} productUrl={`${env.APP_URL}/s/${locale}/${site}/producto/${product.slug}`} />

          <div className="mt-8 rounded-lg bg-[color:var(--surface,#fff)] p-4 text-sm text-[color:var(--text-muted,#6b7280)]">
            <p>✓ Pago seguro</p>
            <p>✓ Envío a todo el Paraguay</p>
            <p>✓ Atención por WhatsApp</p>
          </div>
        </div>
      </main>

      <RecordRecentVisit
        siteSlug={site}
        productId={product.id}
        productSlug={product.slug}
        productName={product.name}
        priceCents={product.priceCents}
        currency={product.currency}
        imageUrl={cover?.url ?? null}
      />

      <RecentlyViewedRail siteSlug={site} locale={locale} excludeId={product.id} />

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mx-auto max-w-5xl px-4 pb-12">
          <h2 id="related-heading" className="mb-4 text-xl font-semibold text-[color:var(--text,#111)]">
            {product.category ? `Más en ${product.category}` : 'También te puede gustar'}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} siteSlug={site} product={p} rates={rates} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
