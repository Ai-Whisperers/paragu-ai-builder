'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface FAQItem {
  q: string
  a: string
}

export interface FAQSectionProps {
  title: string
  items?: FAQItem[]
  questions?: FAQItem[]
  searchEnabled?: boolean
  __locale?: string
}

type Labels = { searchPlaceholder: string; noMatches: string }

const LABELS: Record<string, Labels> = {
  de: { searchPlaceholder: 'Fragen durchsuchen…', noMatches: 'Keine passenden Fragen gefunden.' },
  en: { searchPlaceholder: 'Search questions…', noMatches: 'No matching questions.' },
  es: { searchPlaceholder: 'Buscar preguntas…', noMatches: 'No se encontraron preguntas coincidentes.' },
  nl: { searchPlaceholder: 'Zoek vragen…', noMatches: 'Geen overeenkomende vragen.' },
  pt: { searchPlaceholder: 'Pesquisar perguntas…', noMatches: 'Nenhuma pergunta correspondente.' },
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = `faq-panel-${index}`
  const triggerId = `faq-trigger-${index}`
  return (
    <AnimateOnScroll stagger={index}>
      <div className="border-b border-[var(--surface-light)]">
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-[var(--secondary)]"
        >
          <span className="pr-4 font-medium text-[var(--text)]">{item.q}</span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="flex-shrink-0 text-[var(--text-muted)] transition-transform duration-normal"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          hidden={!isOpen}
          className="overflow-hidden transition-all duration-normal"
          style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
        >
          <p className="pb-5 leading-relaxed text-[var(--text-muted)]">{item.a}</p>
        </div>
      </div>
    </AnimateOnScroll>
  )
}

export function FAQSection({ title, items, questions, searchEnabled, __locale }: FAQSectionProps) {
  const resolved = items || questions || []
  const locale = __locale && __locale in LABELS ? __locale : 'es'
  const L = LABELS[locale]
  const showSearch = searchEnabled ?? resolved.length >= 6
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return resolved
    const q = norm(query.trim())
    return resolved.filter((it) => norm(it.q).includes(q) || norm(it.a).includes(q))
  }, [resolved, query])

  if (resolved.length === 0) return null
  return (
    <section className="bg-[var(--surface)] py-16 sm:py-20">
      <Container size="md">
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
        </AnimatedSectionHeader>
        <div className="mx-auto max-w-3xl">
          {showSearch && (
            <div className="relative mb-6">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={L.searchPlaceholder}
                aria-label={L.searchPlaceholder}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-base text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
              />
            </div>
          )}
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-muted)]">{L.noMatches}</p>
          ) : (
            filtered.map((item, index) => (
              <FAQAccordion key={`${item.q}-${index}`} item={item} index={index} />
            ))
          )}
        </div>
      </Container>
    </section>
  )
}
