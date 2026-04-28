'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCents } from '@/lib/commerce/compute-totals'
import {
  clearRecentSearches,
  readRecentSearches,
  recordRecentSearch,
} from '@/lib/stores/recent-searches'

interface Props {
  siteSlug: string
  locale: string
}

interface Suggestion {
  slug: string
  name: string
  priceCents: number
  currency: string
  imageUrl: string | null
  category: string | null
}

const DEBOUNCE_MS = 220

/**
 * Header autocomplete. Two dropdown modes:
 *   - Input empty + focused → recent searches from localStorage.
 *   - Input ≥2 chars → live suggestions via
 *     /api/storefront/[site]/search-suggest.
 *
 * Submit = push to /tienda?q=…, records the term in recents.
 * Click a suggestion = navigate to its PDP.
 * Click a recent term = re-submit.
 *
 * Debounced 220ms so typing "vibrador" isn't 8 round trips.
 */
export function HeaderSearch({ siteSlug, locale }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [recents, setRecents] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Load recents on first focus so SSR/hydration stay clean.
  useEffect(() => {
    if (focused) setRecents(readRecentSearches(siteSlug))
  }, [focused, siteSlug])

  // Debounced suggest fetch.
  useEffect(() => {
    const term = query.trim()
    if (term.length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/storefront/${encodeURIComponent(siteSlug)}/search-suggest?q=${encodeURIComponent(term)}`,
          { cache: 'no-store' },
        )
        if (!res.ok) {
          setSuggestions([])
          return
        }
        const data = (await res.json()) as { suggestions?: Suggestion[] }
        setSuggestions(data.suggestions ?? [])
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query, siteSlug])

  // Close on outside click.
  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!formRef.current) return
      if (event.target instanceof Node && !formRef.current.contains(event.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function submit(term: string) {
    const clean = term.trim()
    if (clean) recordRecentSearch(siteSlug, clean)
    const href = clean
      ? `/s/${locale}/${siteSlug}/tienda?q=${encodeURIComponent(clean)}`
      : `/s/${locale}/${siteSlug}/tienda`
    setFocused(false)
    inputRef.current?.blur()
    startTransition(() => router.push(href))
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submit(query)
  }

  function pickSuggestion(s: Suggestion) {
    if (query.trim()) recordRecentSearch(siteSlug, query.trim())
    setFocused(false)
    inputRef.current?.blur()
    startTransition(() => router.push(`/s/${locale}/${siteSlug}/producto/${s.slug}`))
  }

  function pickRecent(term: string) {
    setQuery(term)
    submit(term)
  }

  const term = query.trim()
  const showDropdown =
    focused &&
    (term.length >= 2 ? suggestions.length > 0 || loading : recents.length > 0)

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      role="search"
      className="relative hidden items-center gap-1 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] px-2 py-1 sm:flex"
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
        ref={inputRef}
        id={`header-search-${siteSlug}`}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder='Buscas carpa, bolsa de dormir, equipo de pesca...'
        autoComplete="off"
        className="w-32 bg-transparent text-xs outline-none placeholder:text-[color:var(--text-muted,#9ca3af)] md:w-48"
        disabled={pending}
      />

      {showDropdown ? (
        <div
          role="listbox"
          className="absolute right-0 top-full z-40 mt-1 w-[min(22rem,90vw)] overflow-hidden rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface shadow-xl"
        >
          {term.length >= 2 ? (
            <>
              {loading && suggestions.length === 0 ? (
                <p className="p-3 text-xs text-[color:var(--text-muted,#6b7280)]">Buscando…</p>
              ) : null}
              {suggestions.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  role="option"
                  onClick={() => pickSuggestion(s)}
                  className="flex w-full items-center gap-2 border-b border-[color:var(--border,#e5e7eb)] p-2 text-left last:border-b-0 hover:bg-surface-light"
                >
                  {s.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.imageUrl}
                      alt=""
                      loading="lazy"
                      className="h-10 w-10 flex-shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 flex-shrink-0 rounded bg-surface-light" />
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
                      {formatCents(s.priceCents, s.currency)}
                      {s.category ? ` · ${s.category}` : ''}
                    </p>
                  </div>
                </button>
              ))}
              {!loading && suggestions.length === 0 ? (
                <p className="p-3 text-xs text-[color:var(--text-muted,#6b7280)]">
                  Sin resultados para <strong>&quot;{term}&quot;</strong>.
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => submit(query)}
                className="block w-full border-t border-[color:var(--border,#e5e7eb)] p-2 text-center text-xs font-medium text-[color:var(--primary,#111)] hover:bg-surface-light"
              >
                Ver todos los resultados →
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between p-2 text-[10px] uppercase tracking-wider text-[color:var(--text-muted,#6b7280)]">
                <span>Búsquedas recientes</span>
                <button
                  type="button"
                  onClick={() => {
                    clearRecentSearches(siteSlug)
                    setRecents([])
                  }}
                  className="hover:underline"
                >
                  limpiar
                </button>
              </div>
              {recents.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => pickRecent(r)}
                  className="flex w-full items-center gap-2 border-b border-[color:var(--border,#e5e7eb)] p-2 text-left last:border-b-0 hover:bg-surface-light"
                >
                  <span aria-hidden="true" className="text-[color:var(--text-muted,#9ca3af)]">↻</span>
                  <span className="text-sm">{r}</span>
                </button>
              ))}
            </>
          )}
          <Link
            href={`/s/${locale}/${siteSlug}/tienda`}
            onClick={() => setFocused(false)}
            className="block border-t border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] p-2 text-center text-xs text-[color:var(--text-muted,#6b7280)] hover:underline"
          >
            Ver toda la tienda
          </Link>
        </div>
      ) : null}
    </form>
  )
}
