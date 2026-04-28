'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'
import { trackAddToCart } from '@/lib/analytics/commerce-events'
import type { Product } from '@/lib/schemas/commerce'

interface Props {
  product: Product
  siteSlug: string
  outOfStock: boolean
}

export function AddToCartButton({ product, siteSlug, outOfStock }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [adding, setAdding] = useState(false)

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

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={outOfStock || adding}
      className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {outOfStock ? 'Agotado' : adding ? 'Agregando...' : 'Agregar al carrito'}
    </button>
  )
}
