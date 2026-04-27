import { formatCents } from '@/lib/commerce/compute-totals'
import { computeInstallmentDisplay } from '@/lib/commerce/installments'

interface Props {
  siteSlug: string
  priceCents: number
  currency: string
  /** "card" renders tight (one line, small).
   *  "pdp" renders slightly larger with the explicit "sin interés" wording.
   */
  variant?: 'card' | 'pdp'
  className?: string
}

/**
 * Renders "6 cuotas de Gs 40.000 sin interés" under a price when the
 * tenant has an installment config (see lib/commerce/installments.ts).
 * Returns null when the tenant has no config, the currency isn't PYG,
 * or the price is below the display floor.
 *
 * Design goal: make the total price read as a monthly payment the
 * moment the shopper sees the card. This is the single highest AOV
 * lever on a Paraguayan shop — card-surfaced, not just at checkout.
 */
export function InstallmentLine({ siteSlug, priceCents, currency, variant = 'card', className }: Props) {
  const display = computeInstallmentDisplay(siteSlug, priceCents, currency)
  if (!display) return null
  if (variant === 'pdp') {
    return (
      <p className={`text-sm text-[color:var(--text-muted,#4b5563)] ${className ?? ''}`}>
        o <strong className="text-[color:var(--text,#111)]">{display.count} cuotas</strong> de{' '}
        <strong className="text-[color:var(--text,#111)]">{formatCents(display.perCuotaCents, 'PYG')}</strong>{' '}
        {display.freeOfInterest ? 'sin interés' : 'con interés'}
      </p>
    )
  }
  return (
    <p className={`text-xs text-[color:var(--text-muted,#6b7280)] ${className ?? ''}`}>
      o {display.count} cuotas de {formatCents(display.perCuotaCents, 'PYG')} sin interés
    </p>
  )
}
