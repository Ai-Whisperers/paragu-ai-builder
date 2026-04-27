import { logger } from '@/lib/logger'

/**
 * Unified format utilities for the Paragu-AI Builder.
 *
 * Consolidates 9+ scattered format/currency functions into one module.
 * All other modules should import from here going forward.
 */

// ---- Currency ----

/**
 * Format PYG with dots and "Gs" prefix. 1000000 → "Gs 1.000.000"
 */
export function formatGs(n: number): string {
  if (!Number.isFinite(n)) {
    logger.warn('formatGs received non-finite number', { value: n })
    return 'Gs 0'
  }
  const parts = Math.round(n).toString().split('')
  const withDots: string[] = []
  for (let i = parts.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) withDots.unshift('.')
    withDots.unshift(parts[i])
  }
  return `Gs ${withDots.join('')}`
}

/**
 * Format PYG using Intl.NumberFormat with es-PY locale.
 */
export function formatPyg(value: number): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format cents to display string. Handles PYG and USD.
 */
export function formatCents(cents: number, currency = 'PYG'): string {
  const amount = currency === 'PYG' ? cents : cents / 100
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency,
    ...(currency === 'PYG' ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  }).format(amount)
}

// ---- Date ----

export function formatShortDate(date: Date | string, locale = 'es-PY'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatTime(time: string, locale = 'es-PY'): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Safely strip non-digit characters from a phone number.
 * Returns empty string for non-string input to prevent .replace crashes.
 */
export function cleanPhone(phone: unknown): string {
  if (typeof phone !== 'string' || !phone) return ''
  return phone.replace(/\D/g, '')
}

/**
 * Safely strip @ prefix from an Instagram handle.
 * Returns empty string for non-string input.
 */
export function cleanInstagram(handle: unknown): string {
  if (typeof handle !== 'string' || !handle) return ''
  return handle.replace(/^@/, '')
}

// ---- Numbers ----

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}
