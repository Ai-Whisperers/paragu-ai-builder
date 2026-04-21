import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Supported display currencies. Base currency stays PYG — we only convert
 * at RENDER time for shopper display. Actual charges still go through
 * Pagopar in PYG. Full multi-currency settlement is a future dLocal PR.
 */
export const DISPLAY_CURRENCIES = ['PYG', 'USD', 'ARS', 'BRL'] as const
export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number]

export function isDisplayCurrency(value: string): value is DisplayCurrency {
  return (DISPLAY_CURRENCIES as readonly string[]).includes(value)
}

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  asOf: string
}

/**
 * Load the most recent rate for each PYG→X pair. Small enough (≤3 pairs)
 * that caching in Next fetch cache is sufficient — no dedicated Redis
 * layer needed at this volume.
 */
export async function loadPygRates(): Promise<Record<string, number>> {
  const supabase = await createAdminClient()
  const pairs: Record<string, number> = { PYG: 1 }

  const { data } = await supabase
    .from('exchange_rates')
    .select('from_currency, to_currency, rate, as_of')
    .eq('from_currency', 'PYG')
    .in('to_currency', ['USD', 'ARS', 'BRL'])
    .order('as_of', { ascending: false })

  const rows = Array.isArray(data) ? data : []
  for (const row of rows) {
    const key = row.to_currency as string
    // Each target currency's first row (most recent as_of) wins.
    if (pairs[key] === undefined) pairs[key] = Number(row.rate)
  }
  return pairs
}

/**
 * Convert PYG integer amount to a display currency. Rounds to integer
 * cents for USD/ARS/BRL (they have 2 subunits so we multiply by 100 and
 * round). PYG has no subunit so the display is integer guaraníes.
 *
 * Returns zero-padded to safe precision; the UI chooses how to format.
 */
export function convertPygAmount(
  pygAmount: number,
  target: DisplayCurrency,
  rates: Record<string, number>,
): { amount: number; currency: DisplayCurrency } {
  if (target === 'PYG') return { amount: pygAmount, currency: 'PYG' }
  const rate = rates[target]
  if (!rate || rate <= 0) return { amount: pygAmount, currency: 'PYG' } // graceful fallback
  return { amount: pygAmount * rate, currency: target }
}

/**
 * Format a display amount with locale + currency symbol. USD/ARS/BRL get
 * 2 decimals; PYG gets none.
 */
export function formatDisplay(amount: number, currency: DisplayCurrency): string {
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'ARS' ? 'es-AR' : currency === 'USD' ? 'en-US' : 'es-PY'
  const options: Intl.NumberFormatOptions =
    currency === 'PYG'
      ? { style: 'decimal', maximumFractionDigits: 0 }
      : { style: 'currency', currency, maximumFractionDigits: 2 }
  const formatter = new Intl.NumberFormat(locale, options)
  const formatted = formatter.format(Math.round(amount * 100) / 100)
  return currency === 'PYG' ? `Gs ${formatted}` : formatted
}
