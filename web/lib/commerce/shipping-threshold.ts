/**
 * Per-site free-shipping threshold in cents. Returns 0 when no threshold
 * is configured (i.e. the cart drawer hides the progress bar entirely).
 *
 * Lives outside the Supabase/business record on purpose — this is a
 * copy + marketing concern, not a billing rule. The hero and FAQ pages
 * advertise the threshold, and we want the cart UI to match that story
 * without adding a migration + admin UI for one number.
 *
 * Values are in cents of the site's base currency (PYG for PY tenants).
 * Gs. 200.000 = 20_000_000 cents.
 */
const THRESHOLDS: Readonly<Record<string, number>> = {
  fun4me: 20_000_000,
  'viajero-comercio': 30_000_000, // Gs. 300.000
}

export function getFreeShippingThresholdCents(siteSlug: string): number {
  return THRESHOLDS[siteSlug] ?? 0
}
