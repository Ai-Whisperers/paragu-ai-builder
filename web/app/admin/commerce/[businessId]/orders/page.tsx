import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import { formatCents } from '@/lib/commerce/compute-totals'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface OrderRow {
  id: string
  order_number: string
  status: string
  total_cents: number
  currency: string
  customer_name: string
  customer_email: string
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  awaiting_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  fulfilled: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-700',
  refunded: 'bg-orange-100 text-orange-800',
  pending: 'bg-gray-100 text-gray-700',
}

export default async function AdminOrdersPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data } = await scoped.select<OrderRow>('orders', '*', {
    filter: (q) => q.order('created_at', { ascending: false }).limit(100),
  })
  const orders = Array.isArray(data) ? data : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Órdenes</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-12 text-center">
          <p className="text-[color:var(--text-muted,#6b7280)]">Todavía no hay órdenes.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)]">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--surface-muted,#f9fafb)] text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Orden</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-[color:var(--border,#e5e7eb)]">
                  <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-xs text-[color:var(--text-muted,#6b7280)]">{o.customer_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLES[o.status] ?? 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatCents(o.total_cents, o.currency)}</td>
                  <td className="px-4 py-3 text-[color:var(--text-muted,#6b7280)]">
                    {new Date(o.created_at).toLocaleString('es-PY')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/commerce/${businessId}/orders/${o.id}`} className="text-sm text-[color:var(--primary,#111)] underline">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
