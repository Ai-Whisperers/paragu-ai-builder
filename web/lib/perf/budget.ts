/**
 * Per-page performance budgets. Declared in one place so CI can assert them
 * uniformly across tenants. Used by Lighthouse CI (github actions) and by
 * `cli perf-budget <slug>`.
 */

export const PERF_BUDGET = {
  /** Hero image weight (LCP asset). */
  lcpImageKb: 150,
  /** Total JS sent to the browser for the homepage route. */
  homepageJsKb: 220,
  /** First-party CSS (excludes Google Fonts). */
  firstPartyCssKb: 40,
  /** Largest contentful paint in ms (p75 mobile 4G Slow). */
  lcpMs: 2500,
  /** Cumulative Layout Shift target. */
  cls: 0.1,
  /** Total Blocking Time ms. */
  tbtMs: 300,
  /** Bytes of per-tenant content JSON before we warn. */
  tenantContentBytes: 500 * 1024,
}

export function formatBudgetReport(
  actual: Partial<typeof PERF_BUDGET>,
): Array<{ key: keyof typeof PERF_BUDGET; actual?: number; budget: number; ok: boolean }> {
  const rows: Array<{ key: keyof typeof PERF_BUDGET; actual?: number; budget: number; ok: boolean }> = []
  for (const k of Object.keys(PERF_BUDGET) as Array<keyof typeof PERF_BUDGET>) {
    const budget = PERF_BUDGET[k]
    const a = actual[k]
    rows.push({ key: k, actual: a, budget, ok: a === undefined || a <= budget })
  }
  return rows
}
