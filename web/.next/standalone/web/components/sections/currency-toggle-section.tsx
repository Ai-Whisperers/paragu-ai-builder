'use client'

import { useState } from 'react'

/**
 * Currency toggle — small pill component that swaps display currency for any
 * price rendered using `formatPrice` from `@/lib/currency`. Intentionally
 * light: the actual swap logic lives in a React Context in consumer tenants.
 * Drop this in header/footer; consumers subscribe to the dispatched event.
 */

export interface CurrencyToggleProps {
  options: Array<{ code: string; label: string }>
  initial?: string
  /** CustomEvent name dispatched on window when user toggles. */
  eventName?: string
}

export function CurrencyToggleSection({
  options,
  initial,
  eventName = 'currency:change',
}: CurrencyToggleProps) {
  const [active, setActive] = useState(initial || options[0]?.code || '')
  if (!options.length) return null

  function onPick(code: string) {
    setActive(code)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail: { code } }))
    }
  }

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-[var(--surface-light)] rounded-full text-xs">
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => onPick(opt.code)}
          className={`px-3 py-1 rounded-full ${
            active === opt.code ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-[var(--text)]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
