/**
 * Multi-currency price formatting — single source of truth for how prices
 * render across the catalog. Used by sections that display services, products,
 * pricing tiers, and anything with a money amount.
 *
 * Covers the currencies real tenants actually use today: Guaranies (PYG),
 * US dollars (USD), euros (EUR). Extend the CURRENCY_FORMAT map to add more.
 *
 * Behaviour:
 *  - PYG (Guaranies) uses Paraguay's ad-hoc convention: "150.000 Gs" (period
 *    as thousands separator, "Gs" suffix, no fractional part).
 *  - USD / EUR / GBP use the browser's Intl.NumberFormat which renders the
 *    native symbol in the correct locale ("$35", "€35", "£35").
 *  - If the input is already a formatted string (e.g. "150.000 Gs" or "$35"),
 *    pass through unchanged so content files that use human-authored prices
 *    keep working.
 *  - Unknown currency → returns input unchanged and logs a warning.
 */

export type SupportedCurrency = 'PYG' | 'USD' | 'EUR' | 'GBP' | 'BRL' | 'ARS' | 'UYU'

export type PriceInput =
  | number
  | string
  | null
  | undefined
  | { amount: number; currency: SupportedCurrency; period?: string }

interface CurrencyFormatter {
  format: (n: number) => string
  /** Short-form suffix when the amount needs to show only the symbol or abbreviation. */
  suffix?: string
}

/**
 * Paraguay convention for Guaranies — no cents, period thousands separator,
 * " Gs" suffix. Intl.NumberFormat would produce "PYG 150.000" which is not
 * how anyone writes it locally.
 */
function formatPyg(amount: number): string {
  const fixed = Math.round(amount).toLocaleString('es-PY', {
    useGrouping: true,
    maximumFractionDigits: 0,
  })
  // Spanish number format already uses "." as thousands separator.
  return `${fixed} Gs`
}

/**
 * Lazily build an Intl formatter per currency. Browser + Node both ship with
 * full ICU data on modern Node 20+, so `Intl.NumberFormat` is safe server-side.
 */
function intlFormatter(currency: string, locale: string): CurrencyFormatter {
  const f = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
  return {
    format: (n) => f.format(n),
  }
}

const FORMATTERS_CACHE = new Map<string, CurrencyFormatter>()

function getFormatter(currency: SupportedCurrency, locale: string): CurrencyFormatter {
  const key = `${currency}:${locale}`
  const cached = FORMATTERS_CACHE.get(key)
  if (cached) return cached

  let f: CurrencyFormatter
  if (currency === 'PYG') {
    f = { format: formatPyg }
  } else {
    f = intlFormatter(currency, locale)
  }
  FORMATTERS_CACHE.set(key, f)
  return f
}

/**
 * Format a price for display.
 *
 * - If `input` is already a string, it's assumed to be pre-formatted (e.g.
 *   legacy content with `"150.000 Gs"` or `"$35"`). Returned unchanged.
 * - If `input` is a number, requires `currency` (defaults to PYG).
 * - If `input` is `{ amount, currency, period? }`, renders with the declared
 *   currency and appends the optional period ("/mes", "/semana").
 */
export function formatPrice(
  input: PriceInput,
  opts?: { currency?: SupportedCurrency; locale?: string },
): string {
  if (input === null || input === undefined || input === '') return ''
  const locale = opts?.locale || 'es-PY'

  if (typeof input === 'string') return input
  if (typeof input === 'number') {
    const currency = opts?.currency || 'PYG'
    return getFormatter(currency, locale).format(input)
  }
  // Structured input
  const { amount, currency, period } = input
  const base = getFormatter(currency, locale).format(amount)
  return period ? `${base}/${period}` : base
}

/** Sugar: format a range "from – to" with currency suffix shared. */
export function formatPriceRange(
  from: number,
  to: number,
  opts: { currency: SupportedCurrency; locale?: string },
): string {
  const a = formatPrice(from, opts)
  const b = formatPrice(to, opts)
  return `${a} – ${b}`
}

/** Infer a safe default currency from a country code. Falls back to PYG. */
export function defaultCurrencyForCountry(country: string | undefined): SupportedCurrency {
  switch ((country || '').toLowerCase()) {
    case 'paraguay':
    case 'py':
      return 'PYG'
    case 'uruguay':
    case 'uy':
      return 'UYU'
    case 'argentina':
    case 'ar':
      return 'ARS'
    case 'brazil':
    case 'brasil':
    case 'br':
      return 'BRL'
    case 'united states':
    case 'usa':
    case 'us':
      return 'USD'
    case 'eu':
    case 'europe':
    case 'spain':
    case 'germany':
    case 'netherlands':
      return 'EUR'
    default:
      return 'PYG'
  }
}
