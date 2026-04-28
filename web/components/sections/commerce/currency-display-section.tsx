'use client'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { useState } from 'react'

export interface CurrencyOption {
  code: string
  symbol: string
  label: string
  rate?: number
}

export interface CurrencyDisplaySectionProps {
  currencies?: CurrencyOption[]
  defaultCurrency?: string
  variant?: 'toggle' | 'inline' | 'dropdown'
  __locale?: string
}

const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { code: 'PYG', symbol: 'Gs.', label: 'Guaraníes', rate: 1 },
  { code: 'USD', symbol: '$', label: 'Dólares', rate: 0.00013 },
]

export function CurrencyDisplaySection({
  currencies = DEFAULT_CURRENCIES,
  defaultCurrency = 'PYG',
  variant = 'toggle',
}: CurrencyDisplaySectionProps) {
  const [active, setActive] = useState(defaultCurrency)

  if (!currencies?.length) return null

  if (variant === 'dropdown') {
    return (
      <div className="relative inline-block">
        <select
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="appearance-none rounded-lg border border-border bg-surface px-3 py-1.5 pr-8 text-sm text-foreground focus:border-secondary focus:outline-none"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">▼</span>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        {currencies.map((c, i) => (
          <span key={c.code}>
            {i > 0 && <span className="mx-1">|</span>}
            <button
              onClick={() => setActive(c.code)}
              className={`transition-colors ${active === c.code ? 'font-semibold text-foreground' : 'hover:text-foreground'}`}
            >
              {c.symbol}
            </button>
          </span>
        ))}
      </span>
    )
  }

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-border">
      {currencies.map((c) => (
        <button
          key={c.code}
          onClick={() => setActive(c.code)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            active === c.code
              ? 'bg-primary text-white'
              : 'bg-surface text-muted-foreground hover:bg-surface-light'
          }`}
        >
          {c.code}
        </button>
      ))}
    </div>
  )
}
