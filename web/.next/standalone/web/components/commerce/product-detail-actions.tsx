'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'

interface Props {
  siteSlug: string
  productId: string
  inventoryQty: number
  inventoryPolicy: 'deny' | 'continue'
}

export function ProductDetailActions({ siteSlug, productId, inventoryQty, inventoryPolicy }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const maxQty = inventoryPolicy === 'deny' ? Math.min(inventoryQty, 99) : 99
  const outOfStock = inventoryPolicy === 'deny' && inventoryQty === 0

  const handleAdd = async () => {
    if (outOfStock || adding) return
    setAdding(true)
    setFeedback(null)
    try {
      await addItem(siteSlug, productId, quantity)
      setFeedback('Agregado al carrito')
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Error al agregar')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-[color:var(--text-muted,#6b7280)]">
          Cantidad
          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="ml-2 rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 text-sm"
            disabled={outOfStock}
          >
            {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock || adding}
          className="flex-1 rounded-lg bg-[color:var(--primary,#111)] px-4 py-3 font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {outOfStock ? 'Agotado' : adding ? 'Agregando…' : 'Agregar al carrito'}
        </button>
      </div>
      {feedback ? (
        <p role="status" className="mt-3 text-sm text-[color:var(--text,#111)]">
          {feedback}
        </p>
      ) : null}
    </div>
  )
}
