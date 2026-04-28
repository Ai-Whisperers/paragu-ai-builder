'use client'

import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import type { Product } from '@/lib/schemas/commerce'
import { ProductImage } from '@/components/commerce/product-image'
import { formatCents } from '@/lib/commerce/compute-totals'
import { useCartStore } from '@/lib/stores/cart-store'
import { addToWishlist, isInWishlist, removeFromWishlist } from '@/lib/stores/wishlist'
import { ReviewStars } from '@/components/commerce/review-stars'
import { Highlight } from '@/components/commerce/highlight'
import { trackAddToWishlist } from '@/lib/analytics/commerce-events'
import { ProductBadges } from './product-badges'
import { ProductPrice } from './product-price'
import { AddToCartButton } from './product-actions'

const QuickViewModal = dynamic(
  () => import('@/components/commerce/quick-view-modal').then((m) => ({ default: m.QuickViewModal })),
  { ssr: false },
)

interface Props {
  siteSlug: string
  product: Product
  priority?: boolean
  rates?: Record<string, number>
  locale?: string
  reviewAggregate?: { avg: number; count: number }
  highlight?: string
}

const WISHLIST_EVENT = 'paragu:wishlist-change'

function subscribeWishlist(cb: () => void) {
  window.addEventListener(WISHLIST_EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(WISHLIST_EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

function getServerWishlistSnapshot(): boolean {
  return false
}

export function ProductCard({ siteSlug, product, priority, rates, locale = 'es', reviewAggregate, highlight }: Props) {
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const cover = product.images.find((i) => i.isCover) ?? product.images[0] ?? null
  const hoverImage = product.images.length > 1 ? product.images.find((i) => i !== cover) ?? null : null
  const lowStock = product.inventoryPolicy === 'deny' && product.inventoryQty > 0 && product.inventoryQty <= (product.lowStockThreshold ?? 3)
  const outOfStock = product.inventoryPolicy === 'deny' && product.inventoryQty === 0
  const discount = product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents
    ? Math.round(((product.compareAtPriceCents - product.priceCents) / product.compareAtPriceCents) * 100)
    : null
  const isNew = (() => {
    if (product.isSeed) return false
    const explicit = (product as { isNew?: boolean }).isNew
    if (explicit === true) return true
    if (explicit === false) return false
    if (!product.createdAt) return false
    const t = Date.parse(product.createdAt)
    if (!Number.isFinite(t)) return false
    return Date.now() - t < 14 * 24 * 60 * 60 * 1000
  })()

  const saved = useSyncExternalStore(subscribeWishlist, () => isInWishlist(siteSlug, product.id), getServerWishlistSnapshot)

  function toggleWishlist(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (saved) {
      removeFromWishlist(siteSlug, product.id)
    } else {
      addToWishlist(siteSlug, { id: product.id, slug: product.slug, name: product.name, priceCents: product.priceCents, currency: product.currency, imageUrl: cover?.url ?? null })
      trackAddToWishlist({ itemId: product.id, itemName: product.name, itemCategory: product.category ?? undefined, itemBrand: product.brand ?? undefined, price: product.priceCents, currency: product.currency })
    }
  }

  return (
    <article className="group flex flex-col">
      <Link href={`/s/${locale}/${siteSlug}/producto/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage image={cover} alt={product.name} priority={priority} isSeed={product.isSeed} />
          {hoverImage ? (
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ProductImage image={hoverImage} alt={product.name} isSeed={product.isSeed} />
            </div>
          ) : null}

          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewOpen(true) }}
            aria-label={`Vista rapida de ${product.name}`}
            className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-[color:var(--text,#111)] shadow opacity-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)] sm:opacity-0 sm:group-hover:opacity-100"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
            Vista rapida
          </button>

          <button type="button" onClick={toggleWishlist} aria-pressed={saved}
            aria-label={saved ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
            className="absolute right-2 bottom-2 rounded-full bg-white/95 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"
              className={saved ? 'text-[color:var(--primary,#111)]' : 'text-[color:var(--text-muted,#6b7280)]'}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <ProductBadges product={product} discount={discount} isNew={isNew} lowStock={lowStock} outOfStock={outOfStock} />
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        {product.brand ? (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--text-muted,#6b7280)]">{product.brand}</p>
        ) : null}
        <h3 className="text-sm font-medium leading-snug text-[color:var(--text,#111)] line-clamp-2">
          {highlight ? <Highlight text={product.name} term={highlight} /> : product.name}
        </h3>
        {reviewAggregate && reviewAggregate.count > 0 ? (
          <div className="mt-1"><ReviewStars rating={reviewAggregate.avg} count={reviewAggregate.count} size="sm" /></div>
        ) : !product.isSeed ? (
          <p className="mt-1 text-[11px] text-[color:var(--text-muted,#9ca3af)]">Nuevo · Se el primero en opinar</p>
        ) : null}

        <ProductPrice product={product} siteSlug={siteSlug} rates={rates} />
        <AddToCartButton product={product} siteSlug={siteSlug} outOfStock={outOfStock} />
      </div>

      {quickViewOpen ? (
        <QuickViewModal siteSlug={siteSlug} locale={locale} product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
      ) : null}
    </article>
  )
}
