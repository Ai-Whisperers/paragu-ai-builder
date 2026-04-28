'use client'

import { useState } from 'react'

interface Props {
  initialMinPrice: number
  initialMaxPrice: number
  initialInStockOnly: boolean
  initialOnSaleOnly: boolean
  onApply: (min: string, max: string) => void
  onToggleStock: () => void
  onToggleSale: () => void
  pending: boolean
}

function formatPyg(cents: number): string {
  return `Gs ${new Intl.NumberFormat('es-PY').format(cents)}`
}

export function PriceFilters({ initialMinPrice, initialMaxPrice, initialInStockOnly, initialOnSaleOnly, onApply, onToggleStock, onToggleSale, pending }: Props) {
  const [minPrice, setMinPrice] = useState(initialMinPrice ? String(initialMinPrice) : '')
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ? String(initialMaxPrice) : '')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanMin = minPrice.replace(/\D/g, '')
    const cleanMax = maxPrice.replace(/\D/g, '')
    onApply(cleanMin, cleanMax)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 text-xs">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="float-left mr-2 text-[color:var(--text-muted,#6b7280)]">Precio (Gs):</legend>
          <input
            type="text"
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-24 rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
            aria-label="Precio minimo"
          />
          <span aria-hidden="true">–</span>
          <input
            type="text"
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-24 rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
            aria-label="Precio maximo"
          />
        </fieldset>
        <button
          type="submit"
          disabled={pending}
          className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 hover:bg-surface-light focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)] disabled:opacity-50"
        >
          Aplicar
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={initialInStockOnly}
            onChange={onToggleStock}
            className="h-4 w-4"
          />
          <span>Solo en stock</span>
        </label>
        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={initialOnSaleOnly}
            onChange={onToggleSale}
            className="h-4 w-4"
          />
          <span>En oferta</span>
        </label>
      </div>
    </div>
  )
}

export { formatPyg }
