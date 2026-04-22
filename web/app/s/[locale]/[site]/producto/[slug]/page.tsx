import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { getProductBySlug, listRelatedProducts } from '@/lib/commerce/products'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { ProductImage } from '@/components/commerce/product-image'
import { getSessionToken } from '@/lib/commerce/session'
import { getCartBySessionToken } from '@/lib/commerce/cart'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { formatCents } from '@/lib/commerce/compute-totals'
import { ProductDetailActions } from '@/components/commerce/product-detail-actions'
import { ProductCard } from '@/components/commerce/product-card'
import { ProductShare } from '@/components/commerce/product-share'
import { WishlistButton } from '@/components/commerce/wishlist-button'
import { BackInStockSignup } from '@/components/commerce/back-in-stock-signup'
import { RecordRecentVisit } from '@/components/commerce/record-recent-visit'
import { RecentlyViewedRail } from '@/components/commerce/recently-viewed-rail'
import { PriceDisplay } from '@/components/commerce/price-display'
import { ReviewList } from '@/components/commerce/review-list'
import { ReviewForm } from '@/components/commerce/review-form'
import { ReviewStars } from '@/components/commerce/review-stars'
import { PdpStickyMobileCta } from '@/components/commerce/pdp-sticky-mobile-cta'
import { Breadcrumbs } from '@/components/commerce/breadcrumbs'
import { PdpViewTracker } from '@/components/commerce/pdp-view-tracker'
import {
  listApprovedReviews,
  getReviewAggregatesByBusiness,
} from '@/lib/commerce/reviews'
import { loadPygRates } from '@/lib/commerce/currency-server'
import { env } from '@/lib/env'

export const runtime = 'nodejs'
export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string; locale: string; slug: string }>
}): Promise<Metadata> {
  const { site, locale, slug } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business) return {}
  const product = await getProductBySlug(business.id, slug)
  if (!product) return {}
  const cover = product.images.find((i) => i.isCover) ?? product.images[0]

  // Trim description to ~155 chars for Google's meta description limit.
  // Prefer product.description; fall back to a useful category + price line
  // so even minimal-content products have crawlable copy.
  const trim = (s: string, max = 155) => (s.length <= max ? s : s.slice(0, max - 1).trimEnd() + '…')
  const baseDesc = product.description?.trim()
  const fallbackDesc = [
    product.category ? `${product.category.charAt(0).toUpperCase()}${product.category.slice(1)}` : null,
    product.brand,
    `Disponible en ${business.name}. Envío discreto.`,
  ]
    .filter(Boolean)
    .join(' · ')
  const description = trim(baseDesc || fallbackDesc)
  const canonical = `${env.APP_URL}/s/${locale}/${site}/producto/${slug}`

  return {
    title: `${product.name} — ${business.name}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      type: 'website',
      images: cover?.url ? [{ url: cover.url, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: cover?.url ? [cover.url] : [],
    },
    robots: {
      index: product.status === 'active',
      follow: true,
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
  const [rates, related, reviews, aggregates] = await Promise.all([
    loadPygRates(),
    listRelatedProducts(business.id, { excludeId: product.id, category: product.category, limit: 4 }),
    listApprovedReviews(business.id, product.id, { limit: 50 }),
    getReviewAggregatesByBusiness(business.id),
  ])
  const aggregate = aggregates[product.id]

  const productUrl = `${env.APP_URL}/s/${locale}/${site}/producto/${product.slug}`
  // All product images, not just the cover — Google Rich Results card can
  // pull up to 3 and prefers multiple images when present.
  const imageList = product.images
    .map((i) => i.url)
    .filter((u): u is string => typeof u === 'string' && u.length > 0)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: imageList.length > 0 ? imageList : cover?.url,
    sku: product.sku ?? undefined,
    mpn: product.sku ?? undefined,
    url: productUrl,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: product.currency,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.inventoryPolicy === 'deny' && product.inventoryQty === 0
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: business.name },
    },
    aggregateRating: aggregate && aggregate.count > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: aggregate.avg.toFixed(1),
          reviewCount: aggregate.count,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    review: reviews.slice(0, 10).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.authorName },
      datePublished: r.createdAt,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      name: r.title ?? undefined,
      reviewBody: r.content,
    })),
  }

  const sessionToken = await getSessionToken()
  const initialCart = sessionToken && business
    ? await getCartBySessionToken(business.id, sessionToken).catch(() => null)
    : null

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={initialCart} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <PdpViewTracker
        productId={product.id}
        productName={product.name}
        category={product.category}
        brand={product.brand}
        priceCents={product.priceCents}
        currency={product.currency}
      />

      <Breadcrumbs
        absoluteBaseUrl={env.APP_URL}
        items={[
          { label: business.name, href: `/s/${locale}/${site}` },
          { label: 'Tienda', href: `/s/${locale}/${site}/tienda` },
          ...(product.category
            ? [{ label: product.category, href: `/s/${locale}/${site}/tienda/categoria/${encodeURIComponent(product.category)}` }]
            : []),
          { label: product.name },
        ]}
      />

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
          {aggregate ? (
            <div className="mt-1">
              <a href="#reviews-heading" className="inline-flex items-center gap-2 text-sm hover:underline">
                <ReviewStars rating={aggregate.avg} count={aggregate.count} size="md" />
                <span className="text-[color:var(--text-muted,#6b7280)]">Leer reseñas</span>
              </a>
            </div>
          ) : null}
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

          {/* Low-stock urgency cue on the PDP — product-card already
              surfaces the same warning in the grid; mirroring it here
              keeps the message consistent when the shopper clicks through. */}
          {product.inventoryPolicy === 'deny' &&
          product.inventoryQty > 0 &&
          product.inventoryQty <= (product.lowStockThreshold ?? 3) ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
              <span aria-hidden="true">⚠</span>
              {product.inventoryQty === 1
                ? 'Última unidad en stock'
                : `Solo quedan ${product.inventoryQty} en stock`}
            </p>
          ) : null}

          <div id="pdp-main-add-to-cart" className="mt-6">
            <ProductDetailActions siteSlug={site} productId={product.id} inventoryQty={product.inventoryQty} inventoryPolicy={product.inventoryPolicy} />
          </div>

          {product.inventoryPolicy === 'deny' && product.inventoryQty === 0 ? (
            <div className="mt-4">
              <BackInStockSignup siteSlug={site} productId={product.id} locale={locale} />
            </div>
          ) : null}

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

      <div className="mx-auto max-w-5xl px-4 pb-6">
        <ReviewList
          reviews={reviews}
          averageRating={aggregate?.avg}
          totalCount={aggregate?.count}
        />
        <ReviewForm siteSlug={site} productId={product.id} />
      </div>

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

      {/* Mobile-only sticky CTA. Extra bottom padding on the page so content
          isn't hidden behind the bar on mobile. */}
      <div aria-hidden className="h-16 md:hidden" />
      <PdpStickyMobileCta
        siteSlug={site}
        productId={product.id}
        productName={product.name}
        priceCents={product.priceCents}
        currency={product.currency}
        inventoryQty={product.inventoryQty}
        inventoryPolicy={product.inventoryPolicy}
        imageUrl={cover?.url ?? null}
      />
    </div>
  )
}
