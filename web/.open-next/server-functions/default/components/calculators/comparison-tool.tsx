'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

interface ComparisonToolProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  __locale?: string
}

interface Destination {
  id: string
  name: Record<string, string>
  taxPersonal: number
  taxCorporate: number
  daysRequired: number
  minInvestment: number
  workPermit: string
  citizenship: string
  colIndex: number
  safetyIndex: number
}

const DESTINATIONS: Destination[] = [
  { id: 'paraguay', name: { es: 'Paraguay', en: 'Paraguay', nl: 'Paraguay', de: 'Paraguay' }, taxPersonal: 10, taxCorporate: 10, daysRequired: 0, minInvestment: 0, workPermit: 'Automatic', citizenship: '3 years', colIndex: 45, safetyIndex: 8 },
  { id: 'portugal', name: { es: 'Portugal', en: 'Portugal', nl: 'Portugal', de: 'Portugal' }, taxPersonal: 48, taxCorporate: 21, daysRequired: 183, minInvestment: 500000, workPermit: 'Golden visa (s)', citizenship: '5 years', colIndex: 75, safetyIndex: 8 },
  { id: 'dubai', name: { es: 'EAU / Dubái', en: 'UAE / Dubai', nl: 'UAE / Dubai', de: 'VAE / Dubai' }, taxPersonal: 0, taxCorporate: 9, daysRequired: 90, minInvestment: 200000, workPermit: 'Freelance visa', citizenship: '10 years', colIndex: 80, safetyIndex: 9 },
  { id: 'georgia', name: { es: 'Georgia', en: 'Georgia', nl: 'Georgia', de: 'Georgien' }, taxPersonal: 1, taxCorporate: 1, daysRequired: 180, minInvestment: 100000, workPermit: 'Self-emp register', citizenship: '10 years', colIndex: 40, safetyIndex: 8 },
  { id: 'panama', name: { es: 'Panamá', en: 'Panama', nl: 'Panama', de: 'Panama' }, taxPersonal: 0, taxCorporate: 25, daysRequired: 0, minInvestment: 300000, workPermit: 'Friendly Nations', citizenship: '5 years', colIndex: 60, safetyIndex: 7 },
]

const LABELS: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
  en: { eyebrow: 'Comparison', title: 'Paraguay vs Alternatives', subtitle: 'Compare relocation destinations across key metrics.' },
  es: { eyebrow: 'Comparación', title: 'PY vs Alternativas', subtitle: 'Compara destinos de reubicación.' },
  nl: { eyebrow: 'Vergelijking', title: 'PY vs Alternatieven', subtitle: 'Vergelijk bestemmingen.' },
  de: { eyebrow: 'Vergleich', title: 'PY vs Alternativen', subtitle: 'Vergleichen Sie Zielorte.' },
}

function formatCurrency(n: number): string {
  return n === 0 ? '-' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function formatPct(n: number): string {
  return n === 0 ? '0%' : `${n}%`
}

function formatNum(n: number): string {
  return n === 0 ? '-' : `${n}`
}

export function ComparisonTool({ eyebrow, title, subtitle, __locale = 'en' }: ComparisonToolProps) {
  const L = LABELS[__locale] || LABELS.en
  const [sortKey, setSortKey] = useState('taxPersonal')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = [...DESTINATIONS].sort((a, b) => {
    const aVal = (a as unknown as Record<string, unknown>)[sortKey] as number
    const bVal = (b as unknown as Record<string, unknown>)[sortKey] as number
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const columns = [
    { key: 'taxPersonal', label: 'Personal tax', format: 'pct' as const },
    { key: 'taxCorporate', label: 'Corporate tax', format: 'pct' as const },
    { key: 'daysRequired', label: 'Days/yr', format: 'num' as const },
    { key: 'minInvestment', label: 'Min investment', format: 'currency' as const },
    { key: 'workPermit', label: 'Work permit', format: 'text' as const },
    { key: 'citizenship', label: 'Citizenship', format: 'text' as const },
    { key: 'colIndex', label: 'Cost of living', format: 'index' as const },
    { key: 'safetyIndex', label: 'Safety', format: 'index' as const },
  ]

  const formatCell = (value: unknown, format: string) => {
    switch (format) {
      case 'pct': return formatPct(value as number)
      case 'currency': return formatCurrency(value as number)
      case 'num': return formatNum(value as number)
      case 'index': return `${value}/10`
      default: return value == null ? '' : String(value)
    }
  }

  return (
    <section className="bg-[var(--surface)] py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow || L.eyebrow}</p>
          <Heading level={2}>{title || L.title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle || L.subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-card">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text)]">Destination</th>
                {columns.map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)} className="cursor-pointer px-4 py-3 text-right text-sm font-medium text-[var(--text)] hover:text-[var(--secondary)]">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((dest) => (
                <tr key={dest.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 text-left text-sm font-medium text-[var(--text)]">{dest.name[__locale] || dest.name.en}</td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-right text-sm text-[var(--text-light)]">
                      {formatCell((dest as unknown as Record<string, unknown>)[col.key], col.format)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  )
}