'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  siteSlug: string
  locale: string
}

/**
 * Header search input. Submits to /s/{locale}/{site}/tienda?q=… so the
 * existing tienda query pipeline does the work. The whole page already
 * handles q + filter params, so this just needs to push to it.
 *
 * Visible from sm+ (hidden on mobile — the header is tight; search is
 * on the tienda page itself). If a tenant wants it on mobile later,
 * drop the `hidden sm:flex` and add a slide-down drawer.
 */
export function HeaderSearch({ siteSlug, locale }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const q = query.trim()
    const href = q
      ? `/s/${locale}/${siteSlug}/tienda?q=${encodeURIComponent(q)}`
      : `/s/${locale}/${siteSlug}/tienda`
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="hidden items-center gap-1 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] px-2 py-1 sm:flex"
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4 text-[color:var(--text-muted,#6b7280)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        />
      </svg>
      <label className="sr-only" htmlFor={`header-search-${siteSlug}`}>
        Buscar productos
      </label>
      <input
        id={`header-search-${siteSlug}`}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar…"
        className="w-32 bg-transparent text-xs outline-none placeholder:text-[color:var(--text-muted,#9ca3af)] md:w-48"
        disabled={pending}
      />
    </form>
  )
}
