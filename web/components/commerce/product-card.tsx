'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Product } from '@/lib/schemas/commerce/product'
import { ProductImage } from './product-image'
import { formatCents } from '@/lib/commerce/compute-totals'
import { useCartStore } from '@/lib/stores/cart-store'
import { PriceDisplay } from './price-display'

interface Props {
  siteSlug: string
  product: Product
  priority?: boolean
  rates?: Record<string, number>
  locale?: string
}

export function ProductCard({ siteSlug, product, priority, rates, locale = 'es' }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [adding, setAdding] = useState(false)
  const cover = product.images.find((i) => i.isCover) ?? product.images[0] ?? null
  const lowStock = product.inventoryPolicy === 'deny' && product.inventoryQty > 0 && product.inventoryQty <= (product.lowStockThreshold ?? 3)
  const outOfStock = product.inventoryPolicy === 'deny' && product.inventoryQty === 0
  const discount =
    product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents
      ? Math.round(((product.compareAtPriceCents - product.priceCents) / product.compareAtPriceCents) * 100)
      : null

  const handleAdd = async () => {
    if (outOfStock || adding) return
    setAdding(true)
    try {
      await addItem(siteSlug, product.id, 1)
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="group flex flex-col">
      <Link href={`/s/${locale}/${siteSlug}/producto/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage image={cover} alt={product.name} priority={priority} isSeed={product.isSeed} />
          {discount ? (
            <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white" aria-label={`Descuento del ${discount} por ciento`}>
              −{discount}%
            </span>
          ) : null}
          {lowStock ? (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
              <span aria-hidden="true">⚠</span>
              ¡Últimas {product.inventoryQty}!
            </span>
          ) : null}
          {outOfStock ? (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white">
              <span aria-hidden="true">✕</span>
              Agotado
            </span>
          ) : null}
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-sm font-medium text-[color:var(--text,#111)] line-clamp-2">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          {rates && product.currency === 'PYG' ? (
            <PriceDisplay className="text-base font-semibold text-[color:var(--text,#111)]" pygCents={product.priceCents} rates={rates} />
          ) : (
            <p className="text-base font-semibold text-[color:var(--text,#111)]">{formatCents(product.priceCents, product.currency)}</p>
          )}
          {product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents ? (
            rates && product.currency === 'PYG' ? (
              <PriceDisplay className="text-xs text-[color:var(--text-muted,#9ca3af)] line-through" pygCents={product.compareAtPriceCents} rates={rates} />
            ) : (
              <p className="text-xs text-[color:var(--text-muted,#9ca3af)] line-through">{formatCents(product.compareAtPriceCents, product.currency)}</p>
            )
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock || adding}
          className="mt-3 w-full rounded-md border border-[color:var(--primary,#111)] px-3 py-2 text-sm font-medium text-[color:var(--primary,#111)] hover:bg-[color:var(--primary,#111)] hover:text-[color:var(--primary-foreground,#fff)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {outOfStock ? 'Agotado' : adding ? 'Agregando…' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  )
}
