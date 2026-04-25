'use client'

import { useSyncExternalStore } from 'react'
import { DISPLAY_CURRENCIES, isDisplayCurrency, type DisplayCurrency } from '@/lib/commerce/currency'

const STORAGE_KEY = 'paragu_storefront_currency'
export const CURRENCY_CHANGE_EVENT = 'paragu:currency-change'

export function getStoredCurrency(): DisplayCurrency {
  if (typeof window === 'undefined') return 'PYG'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored && isDisplayCurrency(stored) ? stored : 'PYG'
}

function subscribe(cb: () => void) {
  window.addEventListener(CURRENCY_CHANGE_EVENT, cb)
  return () => window.removeEventListener(CURRENCY_CHANGE_EVENT, cb)
}

function getServerSnapshot(): DisplayCurrency {
  return 'PYG'
}

/**
 * Shopper-side currency selector. Persists choice in localStorage + fires
 * a window event so every <PriceDisplay> on the page re-renders without a
 * round trip to the server. Prices never leave PYG on the wire; this is
 * purely a display convenience for cross-border visitors (Argentine
 * expats, Brazilian tourists, etc.).
 */
export function CurrencyToggle({ availableCurrencies }: { availableCurrencies?: DisplayCurrency[] }) {
  const options = availableCurrencies ?? DISPLAY_CURRENCIES
  const currency = useSyncExternalStore(subscribe, getStoredCurrency, getServerSnapshot)

  function change(next: DisplayCurrency) {
    window.localStorage.setItem(STORAGE_KEY, next)
    window.dispatchEvent(new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: next }))
  }

  return (
    <label className="inline-flex items-center gap-1 text-xs text-[color:var(--text-muted,#6b7280)]">
      <span className="sr-only">Moneda</span>
      <select
        value={currency}
        onChange={(e) => change(e.target.value as DisplayCurrency)}
        className="rounded border border-[color:var(--border,#e5e7eb)] bg-white px-2 py-1 text-xs"
        aria-label="Moneda de visualización"
      >
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  )
}
