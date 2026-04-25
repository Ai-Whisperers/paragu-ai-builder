'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { ProductSort } from '@/lib/commerce/products'
import { cn } from '@/lib/utils'

interface Props {
  initialQuery: string
  initialSort: ProductSort
  resultCount: number
  totalCount: number
  /** Active category filter (empty string = all). Deprecated — use initialCategories. */
  initialCategory: string
  /** Active categories (multi-select). Empty array = all. */
  initialCategories: string[]
  /** Distinct categories offered (from DB). */
  availableCategories: string[]
  /** Product counts per category for faceted display. */
  categoryCounts?: Record<string, number>
  /** Active brand filters (multi). */
  initialBrands: string[]
  /** Distinct brands offered by the tenant. */
  availableBrands: string[]
  /** Active tag filters (must all match). */
  initialTags: string[]
  /** Distinct tags across active products. */
  availableTags: string[]
  /** Price bounds in cents, active filter (0 = no bound). */
  initialMinPrice: number
  initialMaxPrice: number
  initialInStockOnly: boolean
  initialOnSaleOnly: boolean
  /** Current page size. Defaults to 12. */
  initialPerPage: number
}

/**
 * Tag buckets for the filter toolbar. Flat wall of 20+ chips (which is
 * what this shop actually ships) is unnavigable; grouping them by
 * intent lets the shopper scan "what kind of filter is this" fast.
 *
 * Curated for the adult-retail niche — feel free to grow or rebalance.
 * Tags not in any bucket fall back to an "Otros" group.
 */
const TAG_GROUPS: Array<{ id: string; label: string; tags: string[] }> = [
  {
    id: 'material',
    label: 'Material',
    tags: [
      'silicona',
      'base-agua',
      'base-silicona',
      'tela',
      'apto-latex',
      'apto-piel',
      'encaje',
    ],
  },
  {
    id: 'caracteristicas',
    label: 'Características',
    tags: [
      'silencioso',
      'recargable',
      'impermeable',
      'larga-duracion',
      'progresivo',
      'sensible',
      'estimulador',
    ],
  },
  {
    id: 'experiencia',
    label: 'Nivel de experiencia',
    tags: ['principiantes', 'clasico', 'sensorial', 'realista'],
  },
  {
    id: 'contexto',
    label: 'Pensado para',
    tags: ['parejas', 'regalo', 'roleplay', 'corporal', 'kit'],
  },
  {
    id: 'estilo',
    label: 'Estilo',
    tags: ['elegante'],
  },
]

const SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: 'newest', label: 'Más nuevos' },
  { value: 'popularity', label: 'Más vendidos' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre A→Z' },
]

type FilterUpdate = {
  q?: string | null
  sort?: string | null
  category?: string | null
  min?: string | null
  max?: string | null
  in_stock?: string | null
  on_sale?: string | null
  page?: string | null
  per_page?: string | null
  brand?: string | null
  tag?: string | null
}

function formatPyg(cents: number): string {
  return `Gs ${new Intl.NumberFormat('es-PY').format(cents)}`
}

/**
 * URL-driven search + filters for /tienda. Every action rewrites query
 * params via router.push; the page is a Server Component so the DB
 * re-queries on every change. No client cache.
 */
export function TiendaToolbar({
  initialQuery,
  initialSort,
  resultCount,
  totalCount,
  initialCategory,
  initialCategories,
  availableCategories,
  categoryCounts,
  initialMinPrice,
  initialMaxPrice,
  initialInStockOnly,
  initialOnSaleOnly,
  initialPerPage: _initialPerPage,
  initialBrands,
  availableBrands,
  initialTags,
  availableTags,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [minPrice, setMinPrice] = useState(initialMinPrice ? String(initialMinPrice) : '')
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ? String(initialMaxPrice) : '')
  const [pending, startTransition] = useTransition()
  const [advancedOpen, setAdvancedOpen] = useState(false)

  function pushParams(next: FilterUpdate) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === '' || value === undefined) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    // Any filter change resets pagination to page 1.
    if (!('page' in next)) params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  function onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    pushParams({ q: query.trim() || null })
  }

  function onPriceSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanMin = minPrice.replace(/\D/g, '')
    const cleanMax = maxPrice.replace(/\D/g, '')
    pushParams({ min: cleanMin || null, max: cleanMax || null })
  }

  function toggleCategory(cat: string) {
    const set = new Set(initialCategories)
    if (set.has(cat)) set.delete(cat)
    else set.add(cat)
    const next = Array.from(set)
    pushParams({ category: next.length === 0 ? null : next.join(',') })
  }

  function toggleBrand(brand: string) {
    const set = new Set(initialBrands)
    if (set.has(brand)) set.delete(brand)
    else set.add(brand)
    const next = Array.from(set)
    pushParams({ brand: next.length === 0 ? null : next.join(',') })
  }

  function toggleTag(tag: string) {
    const set = new Set(initialTags)
    if (set.has(tag)) set.delete(tag)
    else set.add(tag)
    const next = Array.from(set)
    pushParams({ tag: next.length === 0 ? null : next.join(',') })
  }

  function clearAll() {
    setQuery('')
    setMinPrice('')
    setMaxPrice('')
    startTransition(() => {
      router.push(pathname)
    })
  }

  const activeFilters: Array<{ key: string; label: string; clear: () => void }> = []
  if (initialQuery) {
    activeFilters.push({
      key: 'q',
      label: `"${initialQuery}"`,
      clear: () => {
        setQuery('')
        pushParams({ q: null })
      },
    })
  }
  for (const cat of initialCategories) {
    activeFilters.push({
      key: `category:${cat}`,
      label: cat,
      clear: () => {
        const next = initialCategories.filter((c) => c !== cat)
        pushParams({ category: next.length === 0 ? null : next.join(',') })
      },
    })
  }
  for (const brand of initialBrands) {
    activeFilters.push({
      key: `brand:${brand}`,
      label: brand,
      clear: () => {
        const next = initialBrands.filter((b) => b !== brand)
        pushParams({ brand: next.length === 0 ? null : next.join(',') })
      },
    })
  }
  for (const tag of initialTags) {
    activeFilters.push({
      key: `tag:${tag}`,
      label: `#${tag}`,
      clear: () => {
        const next = initialTags.filter((t) => t !== tag)
        pushParams({ tag: next.length === 0 ? null : next.join(',') })
      },
    })
  }
  if (initialMinPrice || initialMaxPrice) {
    const label =
      initialMinPrice && initialMaxPrice
        ? `${formatPyg(initialMinPrice)} – ${formatPyg(initialMaxPrice)}`
        : initialMinPrice
        ? `Desde ${formatPyg(initialMinPrice)}`
        : `Hasta ${formatPyg(initialMaxPrice)}`
    activeFilters.push({
      key: 'price',
      label,
      clear: () => {
        setMinPrice('')
        setMaxPrice('')
        pushParams({ min: null, max: null })
      },
    })
  }
  if (initialInStockOnly) {
    activeFilters.push({ key: 'in_stock', label: 'Solo en stock', clear: () => pushParams({ in_stock: null }) })
  }
  if (initialOnSaleOnly) {
    activeFilters.push({ key: 'on_sale', label: 'En oferta', clear: () => pushParams({ on_sale: null }) })
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-3">
      {/* Search + sort */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onSearchSubmit} role="search" className="flex flex-1 items-center gap-2">
          <label className="flex flex-1 items-center gap-2 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] px-3 py-2 focus-within:border-[color:var(--primary,#111)]">
            <span className="sr-only">Buscar productos</span>
            <svg aria-hidden="true" className="h-4 w-4 text-[color:var(--text-muted,#6b7280)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué buscás? (lubricante, vibrador, lencería…)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--text-muted,#9ca3af)]"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-[color:var(--primary,#111)] px-3 py-2 text-sm font-medium text-[color:var(--primary-foreground,#fff)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] disabled:opacity-50"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-xs text-[color:var(--text-muted,#6b7280)]">Ordenar:</span>
            <select
              value={initialSort}
              onChange={(e) => pushParams({ sort: e.target.value === 'newest' ? null : e.target.value })}
              className="rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
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

      {/* Mobile-only toggle for advanced filters. Hidden md+ where the
          filters always show inline. */}
      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        aria-expanded={advancedOpen}
        className="flex items-center justify-between rounded border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)] md:hidden"
      >
        <span className="flex items-center gap-2">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M6 12h12M10 20h4" />
          </svg>
          Filtros
          {(() => {
            const n =
              initialCategories.length +
              initialBrands.length +
              initialTags.length +
              (initialMinPrice || initialMaxPrice ? 1 : 0) +
              (initialInStockOnly ? 1 : 0) +
              (initialOnSaleOnly ? 1 : 0)
            if (n === 0) return null
            return (
              <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[color:var(--secondary,#b8860b)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {n}
              </span>
            )
          })()}
        </span>
        <span aria-hidden="true">{advancedOpen ? '▲' : '▼'}</span>
      </button>

      {/* Advanced filters: always visible on md+, collapsible on mobile. */}
      <div className={cn('flex flex-col gap-3', advancedOpen ? 'block' : 'hidden', 'md:flex')}>
      {/* Category pills — Capitalize + only show counts ≥ 2 (1-item categories
          look like a stale catalog). "Todo" only visible when at least one
          category is active, so the default view isn't dominated by a loud
          "Todo is selected" chip. */}
      {availableCategories.length > 0 ? (
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Categoría</legend>
          {initialCategories.length > 0 ? (
            <button
              type="button"
              onClick={() => pushParams({ category: null })}
              className="rounded-full border border-[color:var(--border,#e5e7eb)] px-3 py-1 text-xs hover:bg-[color:var(--surface-muted,#f3f4f6)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]"
            >
              ← Todas
            </button>
          ) : null}
          {availableCategories.map((cat) => {
            const count = categoryCounts?.[cat]
            const active = initialCategories.includes(cat)
            // Capitalize first letter; BDSM stays uppercase.
            const label =
              cat.toLowerCase() === 'bdsm'
                ? 'BDSM'
                : cat.charAt(0).toUpperCase() + cat.slice(1)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] ${
                  active
                    ? 'border-[color:var(--primary,#111)] bg-[color:var(--primary,#111)] text-[color:var(--primary-foreground,#fff)]'
                    : 'border-[color:var(--border,#e5e7eb)] hover:bg-[color:var(--surface-muted,#f3f4f6)]'
                }`}
              >
                {label}
                {typeof count === 'number' && count >= 2 ? (
                  <span className="ml-1 opacity-70">({count})</span>
                ) : null}
              </button>
            )
          })}
        </fieldset>
      ) : null}

      {/* Brand filter — only render when there are at least 2 brands.
          With a single brand, the filter is purely decorative and wastes
          vertical space. */}
      {availableBrands.length >= 2 ? (
        <fieldset className="flex flex-wrap items-center gap-2 text-xs">
          <legend className="float-left mr-2 text-[color:var(--text-muted,#6b7280)]">Marca:</legend>
          {availableBrands.map((b) => {
            const active = initialBrands.includes(b)
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggleBrand(b)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] ${
                  active
                    ? 'border-[color:var(--secondary,#b8860b)] bg-[color:var(--secondary,#b8860b)] text-white'
                    : 'border-[color:var(--border,#e5e7eb)] hover:bg-[color:var(--surface-muted,#f3f4f6)]'
                }`}
              >
                {b}
              </button>
            )
          })}
        </fieldset>
      ) : null}

      {/* Tag filter — grouped into themed buckets so 20+ tags don't render
          as a flat "bowl of alphabet soup" wall. Each group is a <details>
          element (native, accessible, keyboard-friendly) collapsed by
          default; opens when it has an active selection. Tags that don't
          fit any bucket fall back to "Otros". */}
      {availableTags.length > 0 ? (
        <div className="flex flex-col gap-2">
          {TAG_GROUPS.map((group) => {
            const tagsInGroup = availableTags.filter((t) => group.tags.includes(t))
            if (tagsInGroup.length === 0) return null
            const activeCount = tagsInGroup.filter((t) => initialTags.includes(t)).length
            return (
              <details
                key={group.id}
                open={activeCount > 0}
                className="group rounded-md border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] px-3 py-2"
              >
                <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-[color:var(--text,#111)] marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2">
                    <span>{group.label}</span>
                    {activeCount > 0 ? (
                      <span className="rounded-full bg-[color:var(--primary,#111)] px-1.5 text-[10px] font-semibold text-[color:var(--primary-foreground,#fff)]">
                        {activeCount}
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[color:var(--text-muted,#9ca3af)] transition-transform group-open:rotate-180"
                  >
                    ▾
                  </span>
                </summary>
                <div className="mt-2 flex flex-wrap gap-1.5 pt-1">
                  {tagsInGroup.map((t) => {
                    const active = initialTags.includes(t)
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        aria-pressed={active}
                        className={`rounded-full border px-2.5 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] ${
                          active
                            ? 'border-[color:var(--primary,#111)] bg-[color:var(--primary,#111)] text-[color:var(--primary-foreground,#fff)]'
                            : 'border-[color:var(--border,#e5e7eb)] hover:bg-[color:var(--surface-muted,#f3f4f6)]'
                        }`}
                      >
                        {t.replace(/-/g, ' ')}
                      </button>
                    )
                  })}
                </div>
              </details>
            )
          })}
          {/* Otros — any tag not matched to a group */}
          {(() => {
            const grouped = new Set(TAG_GROUPS.flatMap((g) => g.tags))
            const others = availableTags.filter((t) => !grouped.has(t))
            if (others.length === 0) return null
            const activeCount = others.filter((t) => initialTags.includes(t)).length
            return (
              <details
                open={activeCount > 0}
                className="group rounded-md border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] px-3 py-2"
              >
                <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-[color:var(--text,#111)] marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2">
                    <span>Otros</span>
                    {activeCount > 0 ? (
                      <span className="rounded-full bg-[color:var(--primary,#111)] px-1.5 text-[10px] font-semibold text-[color:var(--primary-foreground,#fff)]">
                        {activeCount}
                      </span>
                    ) : null}
                  </span>
                  <span aria-hidden="true" className="text-[color:var(--text-muted,#9ca3af)] transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="mt-2 flex flex-wrap gap-1.5 pt-1">
                  {others.map((t) => {
                    const active = initialTags.includes(t)
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        aria-pressed={active}
                        className={`rounded-full border px-2.5 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] ${
                          active
                            ? 'border-[color:var(--primary,#111)] bg-[color:var(--primary,#111)] text-[color:var(--primary-foreground,#fff)]'
                            : 'border-[color:var(--border,#e5e7eb)] hover:bg-[color:var(--surface-muted,#f3f4f6)]'
                        }`}
                      >
                        {t.replace(/-/g, ' ')}
                      </button>
                    )
                  })}
                </div>
              </details>
            )
          })()}
        </div>
      ) : null}

      {/* Price range + toggles */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onPriceSubmit} className="flex flex-wrap items-center gap-2 text-xs">
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="float-left mr-2 text-[color:var(--text-muted,#6b7280)]">Precio (Gs):</legend>
            <input
              type="text"
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Mín"
              className="w-24 rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
              aria-label="Precio mínimo"
            />
            <span aria-hidden="true">–</span>
            <input
              type="text"
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Máx"
              className="w-24 rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)]"
              aria-label="Precio máximo"
            />
          </fieldset>
          <button
            type="submit"
            disabled={pending}
            className="rounded border border-[color:var(--border,#e5e7eb)] px-2 py-1 hover:bg-[color:var(--surface-muted,#f3f4f6)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary,#111)] disabled:opacity-50"
          >
            Aplicar
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="inline-flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={initialInStockOnly}
              onChange={(e) => pushParams({ in_stock: e.target.checked ? '1' : null })}
              className="h-4 w-4"
            />
            <span>Solo en stock</span>
          </label>
          <label className="inline-flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={initialOnSaleOnly}
              onChange={(e) => pushParams({ on_sale: e.target.checked ? '1' : null })}
              className="h-4 w-4"
            />
            <span>En oferta</span>
          </label>
        </div>
      </div>
      </div>

      {/* Active filter chips + result count + clear-all */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[color:var(--border,#e5e7eb)] pt-3 text-xs">
        {activeFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={f.clear}
            className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full bg-[color:var(--surface-muted,#f3f4f6)] py-1 pl-2.5 pr-1.5 transition-colors hover:bg-[color:var(--border,#e5e7eb)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]"
            aria-label={`Quitar filtro: ${f.label}`}
          >
            <span>{f.label}</span>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        ))}
        {activeFilters.length > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-[color:var(--primary,#111)] underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]"
          >
            Limpiar todo
          </button>
        ) : null}
        <span className="ml-auto text-[color:var(--text-muted,#6b7280)]" aria-live="polite">
          {resultCount === totalCount
            ? `${totalCount} ${totalCount === 1 ? 'producto' : 'productos'}`
            : `Mostrando ${resultCount} de ${totalCount}`}
        </span>
      </div>
    </div>
  )
}
