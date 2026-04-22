'use client'

import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import type { Product } from '@/lib/schemas/commerce/product'
import { ProductImage } from './product-image'
import { formatCents } from '@/lib/commerce/compute-totals'
import { useCartStore } from '@/lib/stores/cart-store'
import { PriceDisplay } from './price-display'
import {
  addToWishlist,
  isInWishlist,
  removeFromWishlist,
} from '@/lib/stores/wishlist'
import { QuickViewModal } from './quick-view-modal'
import { ReviewStars } from './review-stars'
import { Highlight } from './highlight'
import { trackAddToCart, trackAddToWishlist } from '@/lib/analytics/commerce-events'

interface Props {
  siteSlug: string
  product: Product
  priority?: boolean
  rates?: Record<string, number>
  locale?: string
  /** Optional review aggregate for rendering stars on the card. */
  reviewAggregate?: { avg: number; count: number }
  /** When set, matched substrings in the product name are <mark>-highlighted. */
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
  const addItem = useCartStore((s) => s.addItem)
  const [adding, setAdding] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const cover = product.images.find((i) => i.isCover) ?? product.images[0] ?? null
  // Secondary image for hover swap — first non-cover image if the product
  // has more than one. Keeps the grid unchanged for single-image products.
  const hoverImage =
    product.images.length > 1 ? product.images.find((i) => i !== cover) ?? null : null
  const lowStock =
    product.inventoryPolicy === 'deny' &&
    product.inventoryQty > 0 &&
    product.inventoryQty <= (product.lowStockThreshold ?? 3)
  const outOfStock = product.inventoryPolicy === 'deny' && product.inventoryQty === 0
  const discount =
    product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents
      ? Math.round(((product.compareAtPriceCents - product.priceCents) / product.compareAtPriceCents) * 100)
      : null
  // "Nuevo" badge requires EITHER an explicit flag from the DB or a fresh
  // createdAt AND `isSeed=false`. Prevents every seed-imported product from
  // advertising itself as new (fun4me shipped with 12/12 products flagged
  // "NUEVO" simply because the seed dump was within 14 days — making the
  // badge pure noise).
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

  const saved = useSyncExternalStore(
    subscribeWishlist,
    () => isInWishlist(siteSlug, product.id),
    getServerWishlistSnapshot,
  )

  const handleAdd = async () => {
    if (outOfStock || adding) return
    setAdding(true)
    try {
      await addItem(siteSlug, product.id, 1)
      trackAddToCart({
        itemId: product.id,
        itemName: product.name,
        itemCategory: product.category ?? undefined,
        itemBrand: product.brand ?? undefined,
        price: product.priceCents,
        currency: product.currency,
        quantity: 1,
      })
    } finally {
      setAdding(false)
    }
  }

  function toggleWishlist(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (saved) {
      removeFromWishlist(siteSlug, product.id)
    } else {
      addToWishlist(siteSlug, {
        id: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        currency: product.currency,
        imageUrl: cover?.url ?? null,
      })
      trackAddToWishlist({
        itemId: product.id,
        itemName: product.name,
        itemCategory: product.category ?? undefined,
        itemBrand: product.brand ?? undefined,
        price: product.priceCents,
        currency: product.currency,
      })
    }
  }

  return (
    <article className="group flex flex-col">
      <Link href={`/s/${locale}/${siteSlug}/producto/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage image={cover} alt={product.name} priority={priority} isSeed={product.isSeed} />
          {/* Hover image: crossfades over the cover when present. Only the
              primary card-level listener fires — no runtime cost on products
              with a single image. */}
          {hoverImage ? (
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ProductImage image={hoverImage} alt={product.name} isSeed={product.isSeed} />
            </div>
          ) : null}

          {/* Quick-view — absolute so clicks bypass the PDP Link. Shown on
              hover (desktop) and always visible on touch devices. */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setQuickViewOpen(true)
            }}
            aria-label={`Vista rápida de ${product.name}`}
            className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-[color:var(--text,#111)] shadow opacity-100 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)] sm:opacity-0 sm:group-hover:opacity-100"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Vista rápida
          </button>

          {/* Wishlist heart — absolute so clicks bypass the PDP Link. */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-pressed={saved}
            aria-label={saved ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
            className="absolute right-2 bottom-2 rounded-full bg-white/95 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={saved ? 'text-[color:var(--primary,#111)]' : 'text-[color:var(--text-muted,#6b7280)]'}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Top-left badge — one at a time. Priority: discount > new. */}
          {discount ? (
            <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white" aria-label={`Descuento del ${discount} por ciento`}>
              −{discount}%
            </span>
          ) : isNew ? (
            <span className="absolute left-2 top-2 rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
              NUEVO
            </span>
          ) : null}

          {/* Top-right badge — one at a time. Priority: out-of-stock > low-stock. */}
          {outOfStock ? (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white">
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M6 18L18 6"/></svg>
              Agotado
            </span>
          ) : lowStock ? (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 20h20L12 2z"/><path d="M12 9v4M12 17h.01"/></svg>
              ¡Últimas {product.inventoryQty}!
            </span>
          ) : null}
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        {/* Title — quiet, single-focus. The buyer reads this once to
            confirm they're looking at the right thing, then eyes drop to
            the decision unit (price + CTA) below. */}
        <h3 className="text-sm font-medium leading-snug text-[color:var(--text,#111)] line-clamp-2">
          {highlight ? <Highlight text={product.name} term={highlight} /> : product.name}
        </h3>
        {reviewAggregate && reviewAggregate.count > 0 ? (
          <div className="mt-1">
            <ReviewStars rating={reviewAggregate.avg} count={reviewAggregate.count} size="sm" />
          </div>
        ) : null}

        {/* Decision unit — price + CTA as one visual block separated from
            title by margin. Price is the heaviest element (text-lg + bold);
            strike-through compareAt sits small and muted next to it so
            the discount reads at a glance. CTA immediately below at full
            card width creates a clear "click here" target. */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            {rates && product.currency === 'PYG' ? (
              <PriceDisplay
                className="text-lg font-bold text-[color:var(--text,#111)]"
                pygCents={product.priceCents}
                rates={rates}
              />
            ) : (
              <p className="text-lg font-bold text-[color:var(--text,#111)]">
                {formatCents(product.priceCents, product.currency)}
              </p>
            )}
            {product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents ? (
              rates && product.currency === 'PYG' ? (
                <PriceDisplay
                  className="text-xs text-[color:var(--text-muted,#9ca3af)] line-through"
                  pygCents={product.compareAtPriceCents}
                  rates={rates}
                />
              ) : (
                <p className="text-xs text-[color:var(--text-muted,#9ca3af)] line-through">
                  {formatCents(product.compareAtPriceCents, product.currency)}
                </p>
              )
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock || adding}
            className="mt-2 w-full rounded-md bg-[color:var(--primary,#111)] px-3 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {outOfStock ? 'Agotado' : adding ? 'Agregando…' : 'Agregar al carrito'}
          </button>
        </div>
      </div>

      <QuickViewModal
        siteSlug={siteSlug}
        locale={locale}
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </article>
  )
}
