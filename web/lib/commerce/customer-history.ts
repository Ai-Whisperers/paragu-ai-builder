import { createAdminClient } from '@/lib/supabase/admin'

export interface CustomerHistoryEntry {
  id: string
  orderNumber: string
  status: string
  totalCents: number
  currency: string
  createdAt: string
}

export interface CustomerHistorySummary {
  totalOrders: number
  totalSpentCents: number
  currency: string
  firstOrderAt: string | null
  lastOrderAt: string | null
  orders: CustomerHistoryEntry[]
}

/**
 * Lookup the customer's past orders for this tenant. Matched on
 * case-insensitive email. Returns up to 20 most recent orders, plus
 * aggregate stats. Used by the admin order-detail panel to signal
 * "this is a returning customer" to the operator.
 *
 * Excludes the currently-viewed order (excludeId) so the panel's
 * "3 pedidos previos" count matches what the merchant expects.
 */
export async function getCustomerHistory(
  businessId: string,
  email: string,
  excludeId?: string,
): Promise<CustomerHistorySummary> {
  const empty: CustomerHistorySummary = {
    totalOrders: 0,
    totalSpentCents: 0,
    currency: 'PYG',
    firstOrderAt: null,
    lastOrderAt: null,
    orders: [],
  }
  if (!email?.trim()) return empty

  const supabase = await createAdminClient()
  let query = supabase
    .from('orders')
    .select('id, order_number, status, total_cents, currency, created_at')
    .eq('business_id', businessId)
    .ilike('customer_email', email.trim())
    .order('created_at', { ascending: false })
    .limit(20)
  if (excludeId) query = query.neq('id', excludeId)

  const { data } = await query
  const rows = (Array.isArray(data) ? data : []) as Array<{
    id: string
    order_number: string
    status: string
    total_cents: number
    currency: string
    created_at: string
  }>

  // Total count + aggregate spend — a separate cheap query that ignores
  // cancelled/refunded rows so "lifetime value" is meaningful.
  const { count: totalAll } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', businessId)
    .ilike('customer_email', email.trim())
    .neq('id', excludeId ?? '')
  const { data: spendRows } = await supabase
    .from('orders')
    .select('total_cents, currency, created_at')
    .eq('business_id', businessId)
    .ilike('customer_email', email.trim())
    .in('status', ['paid', 'fulfilled', 'shipped', 'delivered'])
    .neq('id', excludeId ?? '')
  const spend = (Array.isArray(spendRows) ? spendRows : []) as Array<{
    total_cents: number
    currency: string
    created_at: string
  }>
  const totalSpentCents = spend.reduce((s, r) => s + r.total_cents, 0)
  const sorted = [...spend].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  return {
    totalOrders: totalAll ?? 0,
    totalSpentCents,
    currency: rows[0]?.currency ?? spend[0]?.currency ?? 'PYG',
    firstOrderAt: sorted[0]?.created_at ?? null,
    lastOrderAt: sorted[sorted.length - 1]?.created_at ?? null,
    orders: rows.map((r) => ({
      id: r.id,
      orderNumber: r.order_number,
      status: r.status,
      totalCents: r.total_cents,
      currency: r.currency,
      createdAt: r.created_at,
    })),
  }
}
