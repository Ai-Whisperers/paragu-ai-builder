import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Load the most recent rate for each PYG→X pair. Small enough (≤3 pairs)
 * that caching in Next fetch cache is sufficient — no dedicated Redis
 * layer needed at this volume.
 *
 * Lives in a separate file from `currency.ts` so the pure conversion
 * helpers stay importable from client components without dragging
 * `next/headers` into the browser bundle.
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
    if (pairs[key] === undefined) pairs[key] = Number(row.rate)
  }
  return pairs
}
