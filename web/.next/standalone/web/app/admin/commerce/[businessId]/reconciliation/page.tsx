import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import { formatCents } from '@/lib/commerce/compute-totals'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface DailyAggregate {
  day: string
  orders: number
  paidCount: number
  paidGmvCents: number
  failedCount: number
  refundedCount: number
}

interface TxAggregate {
  day: string
  approved: number
  rejected: number
  pending: number
  refunded: number
  approvedCents: number
}

/**
 * Naive daily reconciliation: aggregate orders by day + status and
 * storefront_transactions by day + status, put them side-by-side. The
 * diff in the rightmost column is the quick eyeball check: if your
 * orders say paid-N but Pagopar-tx says approved-M and N != M, that's
 * a reconciliation gap to dig into.
 *
 * For v1 we slice by day/14d in the app rather than via the
 * commerce_daily_metrics materialized view — less DB surface to
 * maintain and the data volume is tiny right now.
 */
async function loadAggregates(businessId: string) {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const sinceIso = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

  type OrderRow = { created_at: string; status: string; total_cents: number; currency: string }
  type TxRow = { created_at: string; status: string; amount_cents: number }

  const { data: orderRowsRaw } = await scoped.select<OrderRow>('orders', 'created_at, status, total_cents, currency', {
    filter: (q) => q.gt('created_at', sinceIso),
  })
  const { data: txRowsRaw } = await scoped.select<TxRow>('storefront_transactions', 'created_at, status, amount_cents', {
    filter: (q) => q.gt('created_at', sinceIso),
  })

  const orderRows = Array.isArray(orderRowsRaw) ? orderRowsRaw : []
  const txRows = Array.isArray(txRowsRaw) ? txRowsRaw : []

  const byDay: Record<string, DailyAggregate> = {}
  for (const o of orderRows) {
    const day = o.created_at.slice(0, 10)
    const cur = byDay[day] ?? {
      day,
      orders: 0,
      paidCount: 0,
      paidGmvCents: 0,
      failedCount: 0,
      refundedCount: 0,
    }
    cur.orders++
    if (['paid', 'fulfilled', 'shipped', 'delivered'].includes(o.status)) {
      cur.paidCount++
      cur.paidGmvCents += o.total_cents
    }
    if (o.status === 'failed') cur.failedCount++
    if (o.status === 'refunded') cur.refundedCount++
    byDay[day] = cur
  }

  const txByDay: Record<string, TxAggregate> = {}
  for (const t of txRows) {
    const day = t.created_at.slice(0, 10)
    const cur = txByDay[day] ?? { day, approved: 0, rejected: 0, pending: 0, refunded: 0, approvedCents: 0 }
    if (t.status === 'approved') {
      cur.approved++
      cur.approvedCents += t.amount_cents
    } else if (t.status === 'rejected' || t.status === 'failed') cur.rejected++
    else if (t.status === 'refunded') cur.refunded++
    else cur.pending++
    txByDay[day] = cur
  }

  const days = new Set([...Object.keys(byDay), ...Object.keys(txByDay)])
  return [...days].sort().reverse().map((day) => ({
    day,
    orders: byDay[day] ?? { day, orders: 0, paidCount: 0, paidGmvCents: 0, failedCount: 0, refundedCount: 0 },
    tx: txByDay[day] ?? { day, approved: 0, rejected: 0, pending: 0, refunded: 0, approvedCents: 0 },
  }))
}

export default async function ReconciliationPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  const rows = await loadAggregates(businessId)

  const totals = rows.reduce(
    (acc, r) => {
      acc.orders += r.orders.orders
      acc.paidOrders += r.orders.paidCount
      acc.paidGmvCents += r.orders.paidGmvCents
      acc.pagoparApproved += r.tx.approved
      acc.pagoparApprovedCents += r.tx.approvedCents
      return acc
    },
    { orders: 0, paidOrders: 0, paidGmvCents: 0, pagoparApproved: 0, pagoparApprovedCents: 0 },
  )

  const gmvDiff = totals.paidGmvCents - totals.pagoparApprovedCents
  const countDiff = totals.paidOrders - totals.pagoparApproved

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href={`/admin/commerce/${businessId}/orders`} className="mb-4 inline-block text-sm text-[color:var(--primary,#111)] underline">
        ← Volver a órdenes
      </Link>
      <h1 className="mb-1 text-2xl font-bold">Conciliación — últimos 14 días</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Compara tus órdenes (fuente: nuestra DB) con las transacciones de Pagopar del mismo día.
        Si los totales no cuadran, es momento de revisar manualmente.
      </p>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Órdenes pagadas (14 d)"
          value={String(totals.paidOrders)}
          sub={formatCents(totals.paidGmvCents)}
        />
        <SummaryCard
          label="Pagopar aprobadas"
          value={String(totals.pagoparApproved)}
          sub={formatCents(totals.pagoparApprovedCents)}
        />
        <SummaryCard
          label="Diferencia"
          value={countDiff === 0 ? '✓ OK' : `${countDiff > 0 ? '+' : ''}${countDiff}`}
          sub={gmvDiff === 0 ? 'totales coinciden' : formatCents(gmvDiff)}
          tone={countDiff === 0 && gmvDiff === 0 ? 'good' : 'warn'}
        />
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-8 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
          Sin datos en los últimos 14 días.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)]">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--surface-muted,#f9fafb)] text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Día</th>
                <th className="px-3 py-2 text-right font-semibold">Órdenes</th>
                <th className="px-3 py-2 text-right font-semibold">Pagadas</th>
                <th className="px-3 py-2 text-right font-semibold">GMV</th>
                <th className="px-3 py-2 text-right font-semibold">Pagopar aprob.</th>
                <th className="px-3 py-2 text-right font-semibold">Pagopar $</th>
                <th className="px-3 py-2 text-right font-semibold">Δ $</th>
                <th className="px-3 py-2 text-right font-semibold">Rechazadas</th>
                <th className="px-3 py-2 text-right font-semibold">Reembolsadas</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const diff = r.orders.paidGmvCents - r.tx.approvedCents
                return (
                  <tr key={r.day} className="border-t border-[color:var(--border,#e5e7eb)]">
                    <td className="px-3 py-2 font-mono text-xs">{r.day}</td>
                    <td className="px-3 py-2 text-right">{r.orders.orders}</td>
                    <td className="px-3 py-2 text-right">{r.orders.paidCount}</td>
                    <td className="px-3 py-2 text-right">{formatCents(r.orders.paidGmvCents)}</td>
                    <td className="px-3 py-2 text-right">{r.tx.approved}</td>
                    <td className="px-3 py-2 text-right">{formatCents(r.tx.approvedCents)}</td>
                    <td className={`px-3 py-2 text-right ${diff === 0 ? '' : 'bg-yellow-50 text-yellow-900'}`}>
                      {diff === 0 ? '—' : formatCents(diff)}
                    </td>
                    <td className="px-3 py-2 text-right text-[color:var(--text-muted,#6b7280)]">
                      {r.orders.failedCount + r.tx.rejected}
                    </td>
                    <td className="px-3 py-2 text-right text-[color:var(--text-muted,#6b7280)]">
                      {r.orders.refundedCount}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  sub,
  tone = 'default',
}: {
  label: string
  value: string
  sub: string
  tone?: 'default' | 'good' | 'warn'
}) {
  const toneClass =
    tone === 'good'
      ? 'bg-green-50 text-green-800'
      : tone === 'warn'
      ? 'bg-yellow-50 text-yellow-800'
      : 'bg-[color:var(--surface,#fff)]'
  return (
    <div className={`rounded-lg border border-[color:var(--border,#e5e7eb)] p-4 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-70">{sub}</p>
    </div>
  )
}
