/**
 * Supabase / PostgREST convenience helpers shared across lib/commerce etc.
 */

/**
 * PostgREST embedded selects sometimes return a single joined record as a
 * 1-element array (when the planner thinks the relation is 1-to-many) and
 * sometimes as an object (when it's 1-to-1 with FK). `pickOne` flattens
 * both shapes into `T | null` so callers don't have to branch.
 *
 *   const { data } = await supabase
 *     .from('reviews')
 *     .select('*, products!inner(name, slug)')
 *   // r.products could be { name, slug } OR [{ name, slug }]
 *   const product = pickOne(r.products)
 */
export function pickOne<T>(v: T | T[] | null | undefined): T | null {
  if (v == null) return null
  return Array.isArray(v) ? v[0] ?? null : v
}
