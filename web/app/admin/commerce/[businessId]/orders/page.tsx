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
  customer_phone: string | null
  created_at: string
  comprobante_sent_at: string | null
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

const STATUS_LABELS: Record<string, string> = {
  '': 'Todos los estados',
  awaiting_payment: 'Esperando pago',
  paid: 'Pagadas',
  fulfilled: 'Preparadas',
  shipped: 'Enviadas',
  delivered: 'Entregadas',
  refunded: 'Reembolsadas',
  cancelled: 'Canceladas',
}

const PAGE_SIZE = 50

export default async function AdminOrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { businessId } = await params
  const sp = await searchParams
  const query = (sp.q ?? '').trim()
  const statusFilter = (sp.status ?? '').trim()
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)

  const rowsPromise = scoped.select<OrderRow>('orders', '*', {
    filter: (q) => {
      let q2 = q.order('created_at', { ascending: false }).range(offset, offset + PAGE_SIZE - 1)
      if (statusFilter) q2 = q2.eq('status', statusFilter)
      if (query) {
        const escaped = query.replace(/[\\%_,]/g, (ch) => `\\${ch}`)
        q2 = q2.or(
          `order_number.ilike.*${escaped}*,customer_name.ilike.*${escaped}*,customer_email.ilike.*${escaped}*,customer_phone.ilike.*${escaped}*`,
        )
      }
      return q2
    },
  })

  // Count query — same filters as rows so pagination math is consistent.
  let countQuery = supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', businessId)
  if (statusFilter) countQuery = countQuery.eq('status', statusFilter)
  if (query) {
    const escaped = query.replace(/[\\%_,]/g, (ch) => `\\${ch}`)
    countQuery = countQuery.or(
      `order_number.ilike.*${escaped}*,customer_name.ilike.*${escaped}*,customer_email.ilike.*${escaped}*,customer_phone.ilike.*${escaped}*`,
    )
  }
  const { count } = await countQuery

  const { data } = await rowsPromise
  const orders = Array.isArray(data) ? data : []
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  function pageHref(next: { q?: string; status?: string; page?: number }): string {
    const params = new URLSearchParams()
    const q = next.q ?? query
    const s = next.status ?? statusFilter
    const p = next.page ?? page
    if (q) params.set('q', q)
    if (s) params.set('status', s)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/admin/commerce/${businessId}/orders${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Órdenes</h1>

      <form className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Buscar por número, nombre, email o teléfono…"
          className="flex-1 min-w-[240px] rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
        />
        <select
          name="status"
          defaultValue={statusFilter}
          className="rounded-md border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
        >
          {Object.entries(STATUS_LABELS).map(([v, label]) => (
            <option key={v || 'all'} value={v}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90"
        >
          Buscar
        </button>
        {(query || statusFilter) ? (
          <Link
            href={`/admin/commerce/${businessId}/orders`}
            className="self-center text-sm text-[color:var(--text-muted,#6b7280)] underline"
          >
            Limpiar
          </Link>
        ) : null}
      </form>

      {count !== undefined && count !== null ? (
        <p className="mb-3 text-xs text-[color:var(--text-muted,#6b7280)]">
          {count} {count === 1 ? 'orden' : 'órdenes'} {(query || statusFilter) ? 'coinciden' : 'en total'}
        </p>
      ) : null}

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-12 text-center">
          <p className="text-[color:var(--text-muted,#6b7280)]">
            {query || statusFilter
              ? 'No encontramos órdenes con esos filtros.'
              : 'Todavía no hay órdenes.'}
          </p>
        </div>
      ) : (
        <>
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
                      {o.customer_phone ? (
                        <p className="text-xs text-[color:var(--text-muted,#6b7280)]">{o.customer_phone}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          STATUS_STYLES[o.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                      {o.comprobante_sent_at && o.status === 'awaiting_payment' ? (
                        <span
                          title={`Comprobante enviado ${new Date(o.comprobante_sent_at).toLocaleString('es-PY')}`}
                          className="ml-2 inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-900"
                        >
                          ✓ comprobante
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatCents(o.total_cents, o.currency)}</td>
                    <td className="px-4 py-3 text-[color:var(--text-muted,#6b7280)]">
                      {new Date(o.created_at).toLocaleString('es-PY')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/commerce/${businessId}/orders/${o.id}`}
                        className="text-sm text-[color:var(--primary,#111)] underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Paginación">
              <div className="text-[color:var(--text-muted,#6b7280)]">
                Página {page} de {totalPages}
              </div>
              <div className="flex gap-2">
                {page > 1 ? (
                  <Link
                    href={pageHref({ page: page - 1 })}
                    className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 hover:bg-[color:var(--surface-muted,#f3f4f6)]"
                  >
                    ← Anterior
                  </Link>
                ) : (
                  <span className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 opacity-40">
                    ← Anterior
                  </span>
                )}
                {page < totalPages ? (
                  <Link
                    href={pageHref({ page: page + 1 })}
                    className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 hover:bg-[color:var(--surface-muted,#f3f4f6)]"
                  >
                    Siguiente →
                  </Link>
                ) : (
                  <span className="rounded border border-[color:var(--border,#e5e7eb)] px-3 py-1 opacity-40">
                    Siguiente →
                  </span>
                )}
              </div>
            </nav>
          ) : null}
        </>
      )}
    </div>
  )
}
