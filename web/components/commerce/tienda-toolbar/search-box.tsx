'use client'

import { useState } from 'react'

interface Props {
  initialQuery: string
  onSearch: (query: string) => void
  pending: boolean
}

export function SearchBox({ initialQuery, onSearch, pending }: Props) {
  const [query, setQuery] = useState(initialQuery)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex flex-1 items-center gap-2">
      <label className="flex flex-1 items-center gap-2 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] px-3 py-2 focus-within:border-[color:var(--primary,#111)]">
        <span className="sr-only">Buscar productos</span>
        <svg aria-hidden="true" className="h-4 w-4 text-[color:var(--text-muted,#6b7280)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscas carpa, bolsa de dormir, equipo de pesca..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--text-muted,#9ca3af)]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-primary px-3 py-2 text-sm font-medium text-[color:var(--primary-foreground,#fff)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)] disabled:opacity-50"
      >
        Buscar
      </button>
    </form>
  )
}
