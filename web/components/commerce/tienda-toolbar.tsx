'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { ProductSort } from '@/lib/commerce/products'

interface Props {
  initialQuery: string
  initialSort: ProductSort
  resultCount: number
}

const SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre A→Z' },
]

/**
 * URL-driven search + sort. State lives in the query string so back/forward
 * + share-link both work, and the page is a Server Component that re-runs
 * the DB query on every change. No client cache, no out-of-sync risk.
 */
export function TiendaToolbar({ initialQuery, initialSort, resultCount }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [pending, startTransition] = useTransition()

  function pushParams(next: { q?: string; sort?: string }) {
    const params = new URLSearchParams(searchParams.toString())
    if (next.q !== undefined) {
      if (next.q) params.set('q', next.q)
      else params.delete('q')
    }
    if (next.sort !== undefined) {
      if (next.sort && next.sort !== 'newest') params.set('sort', next.sort)
      else params.delete('sort')
    }
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    pushParams({ q: query.trim() })
  }

  function onClear() {
    setQuery('')
    pushParams({ q: '' })
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-3 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={onSubmit} role="search" className="flex flex-1 items-center gap-2">
        <label className="flex flex-1 items-center gap-2 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] px-3 py-2 focus-within:border-[color:var(--primary,#111)]">
          <span className="sr-only">Buscar productos</span>
          <svg aria-hidden="true" className="h-4 w-4 text-[color:var(--text-muted,#6b7280)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--text-muted,#9ca3af)]"
          />
          {query ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Limpiar búsqueda"
              className="text-xs text-[color:var(--text-muted,#6b7280)] hover:underline"
            >
              ×
            </button>
          ) : null}
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[color:var(--primary,#111)] px-3 py-2 text-sm font-medium text-[color:var(--primary-foreground,#fff)] disabled:opacity-50"
        >
          Buscar
        </button>
      </form>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-xs text-[color:var(--text-muted,#6b7280)]" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'producto' : 'productos'}
        </span>
        <label className="flex items-center gap-2">
          <span className="text-xs text-[color:var(--text-muted,#6b7280)]">Ordenar:</span>
          <select
            value={initialSort}
            onChange={(e) => pushParams({ sort: e.target.value })}
            className="rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] px-2 py-1 text-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
