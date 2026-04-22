/**
 * Per-tenant installment configuration. PY card networks (Bancard,
 * Infonet) routinely offer 3/6/12 cuotas sin interés for select
 * merchants — and "6 cuotas sin interés" is the single highest-AOV
 * lever on a Paraguayan adult-retail shop (peer analysis: luden.store
 * AR shows it on every card, not just at checkout).
 *
 * This module returns a display-only computation. The real tokenization
 * + installment billing happens at the Pagopar/Bancard step during
 * checkout. What we're modeling here is the marketing promise: show the
 * cuota math on the card / PDP so the shopper reads the total price as
 * the monthly payment.
 */

interface Config {
  /** Max installments offered without interest. e.g. 6 → "6 cuotas sin interés". */
  maxCuotas: number
  /** Hide the line below this cart/product amount — cuotas on a Gs 20.000
   *  item is noise. Cents of the base currency. */
  minAmountCents: number
}

const CONFIG: Readonly<Record<string, Config>> = {
  // Fun4Me uses Bancard-backed Pagopar; 6 cuotas sin interés matches the
  // default Bancard merchant plan for mid-ticket retail in PY.
  fun4me: { maxCuotas: 6, minAmountCents: 5_000_000 }, // Gs 50.000 floor
}

export interface InstallmentDisplay {
  count: number
  /** Per-cuota amount in cents, rounded to the nearest thousand Gs so
   *  the displayed figure matches what Bancard actually charges (their
   *  quote also rounds). */
  perCuotaCents: number
  /** "sin interés" vs "con interés" — currently always sin interés for
   *  configured merchants. Kept as a field so tenants on different
   *  plans can later override. */
  freeOfInterest: boolean
}

export function computeInstallmentDisplay(
  siteSlug: string,
  priceCents: number,
  currency: string,
): InstallmentDisplay | null {
  // Display only applies to PYG today — Bancard installments are a PY
  // card-network feature and the math doesn't translate to USD/EUR
  // toggles on the price display.
  if (currency !== 'PYG') return null
  const cfg = CONFIG[siteSlug]
  if (!cfg) return null
  if (priceCents < cfg.minAmountCents) return null
  if (cfg.maxCuotas < 2) return null

  // Round to nearest 1.000 Gs (100_000 cents) so the shown per-cuota
  // figure reads cleanly and matches Bancard's own rounding.
  const raw = priceCents / cfg.maxCuotas
  const perCuotaCents = Math.round(raw / 100_000) * 100_000
  return {
    count: cfg.maxCuotas,
    perCuotaCents,
    freeOfInterest: true,
  }
}
