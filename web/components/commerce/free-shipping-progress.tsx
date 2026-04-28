'use client'

import { getFreeShippingThresholdCents } from '@/lib/commerce/tenant-config'
import { formatCents } from '@/lib/commerce/compute-totals'

interface Props {
  siteSlug: string
  subtotalCents: number
  currency: string
  /** Tightens the surrounding spacing for compact surfaces (drawer footer). */
  compact?: boolean
}

/**
 * Progress bar toward the tenant's free-shipping threshold.
 *
 * Renders nothing when the tenant has no threshold or the cart currency
 * doesn't match the tenant's threshold currency (PYG today). Converts the
 * "Gs 200.000" marketing promise into a concrete "te faltan Gs X" nudge
 * the moment a shopper sees their cart.
 */
export function FreeShippingProgress({ siteSlug, subtotalCents, currency, compact = false }: Props) {
  const threshold = getFreeShippingThresholdCents(siteSlug)
  if (threshold <= 0 || currency !== 'PYG') return null

  const pct = Math.min(100, Math.round((subtotalCents / threshold) * 100))
  const reached = subtotalCents >= threshold

  return (
    <div className={compact ? 'mb-3' : 'mb-4'} aria-live="polite">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className={reached ? 'font-medium text-emerald-700' : 'text-[color:var(--text-muted,#6b7280)]'}>
          {reached
            ? '🎉 ¡Ya tenés envío gratis!'
            : `Te faltan ${formatCents(threshold - subtotalCents, 'PYG')} para envío gratis`}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-surface-light"
      >
        <div
          className={`h-full transition-all duration-300 ${reached ? 'bg-emerald-600' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
