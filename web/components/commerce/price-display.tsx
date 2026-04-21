'use client'

import { useSyncExternalStore } from 'react'
import { convertPygAmount, formatDisplay, type DisplayCurrency } from '@/lib/commerce/currency'
import { CURRENCY_CHANGE_EVENT, getStoredCurrency } from './currency-toggle'

interface Props {
  pygCents: number
  /** Optional fallback when rates are missing (e.g., zero value). */
  rates: Record<string, number>
  className?: string
}

function subscribe(cb: () => void) {
  window.addEventListener(CURRENCY_CHANGE_EVENT, cb)
  return () => window.removeEventListener(CURRENCY_CHANGE_EVENT, cb)
}

function getServerSnapshot(): DisplayCurrency {
  return 'PYG'
}

/**
 * Renders a PYG amount, re-rendering in the shopper's selected currency.
 * Server renders PYG on first paint (no client JS needed if the shopper
 * never toggles); client side swaps when the event fires.
 */
export function PriceDisplay({ pygCents, rates, className }: Props) {
  const currency = useSyncExternalStore(subscribe, getStoredCurrency, getServerSnapshot)
  const { amount, currency: finalCurrency } = convertPygAmount(pygCents, currency, rates)
  return <span className={className}>{formatDisplay(amount, finalCurrency)}</span>
}
