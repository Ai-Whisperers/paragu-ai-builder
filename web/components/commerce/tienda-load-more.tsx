'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface Props {
  currentPage: number
  totalPages: number
  perPage: number
  /** Slug used to construct API URL for soft-loading more products. */
  siteSlug: string
  locale: string
}

export function TiendaLoadMore({ currentPage, totalPages, perPage, siteSlug, locale }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [page, setPage] = useState(currentPage)
  const [products, setProducts] = useState<React.ReactNode[]>([])
  const hasMore = page < totalPages

  async function loadMore() {
    if (pending || !hasMore) return
    const nextPage = page + 1

    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(nextPage))
      params.set('per_page', String(perPage))
      params.set('_data', 'json')
      const res = await fetch(`/api/storefront/${encodeURIComponent(siteSlug)}/products?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        if (data.products?.length > 0) {
          startTransition(() => {
            const urlParams = new URLSearchParams(searchParams.toString())
            urlParams.set('page', String(nextPage))
            urlParams.set('per_page', String(perPage))
            router.push(`${pathname}?${urlParams.toString()}`)
          })
          return
        }
      }
    } catch {
      /* API soft-load failed — fall through to full navigation */
    }

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(nextPage))
      params.set('per_page', String(perPage))
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  if (!hasMore) return null

  const shownCount = Math.min(page * perPage, totalPages * perPage)
  const totalCount = totalPages * perPage

  return (
    <div className="mt-10 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={loadMore}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface px-8 py-3 text-sm font-semibold text-[color:var(--text,#111)] shadow-sm transition-all hover:bg-surface-light hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] disabled:opacity-50"
      >
        {pending ? (
          <>
            <svg aria-hidden="true" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Cargando...
          </>
        ) : (
          <>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
            Cargar mas productos
          </>
        )}
      </button>
      <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
        Mostrando {shownCount} de {totalCount} productos
      </p>
    </div>
  )
}
