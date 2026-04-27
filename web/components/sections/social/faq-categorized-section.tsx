'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { useMemo, useState } from 'react'

export interface FaqCategorizedProps {
  title?: string
  subtitle?: string
  categories: Array<{ id: string; label: string; items: Array<{ q: string; a: string }> }>
  searchPlaceholder?: string
}

export function FaqCategorizedSection({
  title = 'Preguntas Frecuentes',
  subtitle,
  categories,
  searchPlaceholder = 'Buscar en preguntas...',
}: FaqCategorizedProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(categories[0]?.id ?? '')

  const filtered = useMemo(() => {
    if (!query) return categories.find((c) => c.id === active)?.items ?? []
    const q = query.toLowerCase()
    return categories.flatMap((c) =>
      c.items.filter((it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)),
    )
  }, [categories, active, query])

  return (
    <section className="py-16 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-8">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-[var(--text-muted)] mt-2">{subtitle}</p>}
        </div>

        <div className="max-w-3xl mx-auto">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full mb-4 px-3 py-2 border border-[var(--surface-light)] rounded bg-[var(--surface)] text-[var(--text)]"
          />

          {!query && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    active === c.id
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--surface-light)] text-[var(--text)]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {filtered.map((item, i) => (
              <details
                key={i}
                className="rounded-lg bg-[var(--surface)] border border-[var(--surface-light)] p-3"
              >
                <summary className="cursor-pointer font-medium text-[var(--text)]">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{item.a}</p>
              </details>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-[var(--text-muted)] py-6">Sin resultados.</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
