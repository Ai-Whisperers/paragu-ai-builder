'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { cn } from '@/lib/utils'

interface QuickFilter {
  key: string
  label: string
  params: Record<string, string | null>
  /** Which current URL state means this is active. */
  matches: (sp: URLSearchParams) => boolean
}

/**
 * Pre-baked URL-param shortcuts above the full filter toolbar. Each chip
 * sets or clears a handful of params in one click — no separate state.
 * When a chip is already "active", clicking it clears its params.
 */
const FILTERS: QuickFilter[] = [
  {
    key: 'on-sale',
    label: 'En oferta',
    params: { on_sale: '1', min: null, max: null },
    matches: (sp) => sp.get('on_sale') === '1',
  },
  {
    key: 'under-100k',
    label: 'Hasta Gs 100k',
    params: { min: null, max: '10000000', on_sale: null },
    matches: (sp) => !sp.get('min') && sp.get('max') === '10000000',
  },
  {
    key: '100-300k',
    label: 'Gs 100k – 300k',
    params: { min: '10000000', max: '30000000', on_sale: null },
    matches: (sp) => sp.get('min') === '10000000' && sp.get('max') === '30000000',
  },
  {
    key: 'over-300k',
    label: 'Más de Gs 300k',
    params: { min: '30000000', max: null, on_sale: null },
    matches: (sp) => sp.get('min') === '30000000' && !sp.get('max'),
  },
  {
    key: 'in-stock',
    label: 'Solo en stock',
    params: { in_stock: '1' },
    matches: (sp) => sp.get('in_stock') === '1',
  },
]

export function TiendaQuickFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  function toggle(filter: QuickFilter) {
    const params = new URLSearchParams(searchParams.toString())
    const isActive = filter.matches(params)
    if (isActive) {
      for (const key of Object.keys(filter.params)) params.delete(key)
    } else {
      for (const [key, value] of Object.entries(filter.params)) {
        if (value === null) params.delete(key)
        else params.set(key, value)
      }
    }
    params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2" aria-label="Filtros rápidos">
      <span className="text-xs font-medium text-[color:var(--text-muted,#6b7280)]">Rápido:</span>
      {FILTERS.map((f) => {
        const active = f.matches(searchParams)
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => toggle(f)}
            disabled={pending}
            aria-pressed={active}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] disabled:opacity-50',
              active
                ? 'border-[color:var(--secondary,#b8860b)] bg-[color:var(--secondary,#b8860b)] text-white'
                : 'border-[color:var(--border,#e5e7eb)] bg-surface hover:bg-surface-light',
            )}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
