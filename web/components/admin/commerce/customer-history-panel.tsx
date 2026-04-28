import Link from 'next/link'
import { formatCents } from '@/lib/commerce/compute-totals'
import type { CustomerHistorySummary } from '@/lib/commerce/customer-history'

interface Props {
  businessId: string
  history: CustomerHistorySummary
}

/**
 * Returning-customer panel on admin order detail. Shows count + lifetime
 * spend + first/last-order + up to 20 recent orders. Server component;
 * all data comes from getCustomerHistory on the page.
 */
export function CustomerHistoryPanel({ businessId, history }: Props) {
  if (history.totalOrders === 0) {
    return (
      <section className="mt-6 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4">
        <h2 className="mb-1 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">
          Historial del cliente
        </h2>
        <p className="text-sm text-[color:var(--text-muted,#6b7280)]">
          Primer pedido — no hay historial previo con este email.
        </p>
      </section>
    )
  }

  return (
    <section className="mt-6 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">
        Cliente recurrente · {history.totalOrders}{' '}
        {history.totalOrders === 1 ? 'pedido previo' : 'pedidos previos'}
      </h2>
      <div className="mb-4 grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-[color:var(--text-muted,#6b7280)]">Gasto total</p>
          <p className="text-base font-semibold">
            {formatCents(history.totalSpentCents, history.currency)}
          </p>
        </div>
        <div>
          <p className="text-[color:var(--text-muted,#6b7280)]">Primer pedido</p>
          <p className="text-sm">
            {history.firstOrderAt
              ? new Date(history.firstOrderAt).toLocaleDateString('es-PY')
              : '—'}
          </p>
        </div>
        <div>
          <p className="text-[color:var(--text-muted,#6b7280)]">Último pedido</p>
          <p className="text-sm">
            {history.lastOrderAt
              ? new Date(history.lastOrderAt).toLocaleDateString('es-PY')
              : '—'}
          </p>
        </div>
      </div>
      {history.orders.length > 0 ? (
        <ul className="space-y-1 text-xs">
          {history.orders.slice(0, 8).map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-2">
              <Link
                href={`/admin/commerce/${businessId}/orders/${o.id}`}
                className="font-mono text-[color:var(--primary,#111)] underline"
              >
                {o.orderNumber}
              </Link>
              <span className="text-[color:var(--text-muted,#6b7280)]">
                {o.status} · {new Date(o.createdAt).toLocaleDateString('es-PY')}
              </span>
              <span className="font-medium">{formatCents(o.totalCents, o.currency)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
