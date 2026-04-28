'use client'

import type { ProductSort } from '@/lib/schemas/commerce'

interface Props {
  value: ProductSort
  onChange: (sort: ProductSort) => void
}

const SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: 'newest', label: 'Mas nuevos' },
  { value: 'popularity', label: 'Mas vendidos' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre A-Z' },
]

export function SortSelect({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs text-[color:var(--text-muted,#6b7280)]">Ordenar:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSort)}
        className="rounded border border-[color:var(--border,#e5e7eb)] bg-surface px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
