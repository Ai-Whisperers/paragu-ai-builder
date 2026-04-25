import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface BookingRow {
  id: string
  customer_name: string
  customer_email: string | null
  customer_phone: string
  booking_date: string
  booking_time: string
  duration_minutes: number
  status: string
  source: string
  customer_notes: string | null
  internal_notes: string | null
  created_at: string
  service: { name: string } | null
  staff: { name: string } | null
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-700',
  no_show: 'bg-red-100 text-red-800',
}

const STATUS_LABELS: Record<string, string> = {
  '': 'Todos los estados',
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
}

const PAGE_SIZE = 50

export default async function AdminBookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>
  searchParams: Promise<{ dateFrom?: string; dateTo?: string; status?: string; page?: string }>
}) {
  const { businessId } = await params
  const sp = await searchParams
  const dateFrom = (sp.dateFrom ?? '').trim()
  const dateTo = (sp.dateTo ?? '').trim()
  const statusFilter = (sp.status ?? '').trim()
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)

  const rowsPromise = scoped.select<BookingRow>('bookings', '*, service:service_id(name), staff:staff_member_id(name)', {
    filter: (q) => {
      let q2 = q.order('booking_date', { ascending: false }).range(offset, offset + PAGE_SIZE - 1)
      if (statusFilter) q2 = q2.eq('status', statusFilter)
      if (dateFrom) q2 = q2.gte('booking_date', dateFrom)
      if (dateTo) q2 = q2.lte('booking_date', dateTo)
      return q2
    },
  })

  let countQuery = supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', businessId)
  if (statusFilter) countQuery = countQuery.eq('status', statusFilter)
  if (dateFrom) countQuery = countQuery.gte('booking_date', dateFrom)
  if (dateTo) countQuery = countQuery.lte('booking_date', dateTo)
  const { count } = await countQuery

  const { data } = await rowsPromise
  const bookings = Array.isArray(data) ? data : []
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1

  function pageHref(next: { dateFrom?: string; dateTo?: string; status?: string; page?: number }): string {
    const params = new URLSearchParams()
    const dF = next.dateFrom ?? dateFrom
    const dT = next.dateTo ?? dateTo
    const s = next.status ?? statusFilter
    const p = next.page ?? page
    if (dF) params.set('dateFrom', dF)
    if (dT) params.set('dateTo', dT)
    if (s) params.set('status', s)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/admin/bookings/${businessId}${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reservas</h1>
      </div>

      <form className="mb-4 flex flex-wrap gap-2">
        <input
          type="date"
          name="dateFrom"
          defaultValue={dateFrom}
          className="rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
        />
        <input
          type="date"
          name="dateTo"
          defaultValue={dateTo}
          className="rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
        />
        <select
          name="status"
          defaultValue={statusFilter}
          className="rounded-md border border-[color:var(--border,#e5e7eb)] bg-white px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
        >
          {Object.entries(STATUS_LABELS).map(([v, label]) => (
            <option key={v || 'all'} value={v}>{label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90"
        >
          Buscar
        </button>
        {(dateFrom || dateTo || statusFilter) ? (
          <Link
            href={`/admin/bookings/${businessId}`}
            className="self-center text-sm text-[color:var(--text-muted,#6b7280)] underline"
          >
            Limpiar
          </Link>
        ) : null}
      </form>

      {count !== undefined && count !== null ? (
        <p className="mb-3 text-xs text-[color:var(--text-muted,#6b7280)]">
          {count} {count === 1 ? 'reserva' : 'reservas'} {(dateFrom || dateTo || statusFilter) ? 'coinciden' : 'en total'}
        </p>
      ) : null}

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-12 text-center">
          <p className="text-[color:var(--text-muted,#6b7280)]">
            {dateFrom || dateTo || statusFilter
              ? 'No encontramos reservas con esos filtros.'
              : 'Todavía no hay reservas.'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)]">
            <table className="w-full text-sm">
              <thead className="bg-[color:var(--surface-muted,#f9fafb)] text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Contacto</th>
                  <th className="px-4 py-3 font-semibold">Servicio</th>
                  <th className="px-4 py-3 font-semibold">Profesional</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Hora</th>
                  <th className="px-4 py-3 font-semibold">Duración</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Origen</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-[color:var(--border,#e5e7eb)]">
                    <td className="px-4 py-3 font-medium">{b.customer_name}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs">{b.customer_phone}</p>
                      {b.customer_email && (
                        <p className="text-xs text-[color:var(--text-muted,#6b7280)]">{b.customer_email}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">{b.service?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-[color:var(--text-muted,#6b7280)]">{b.staff?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      {new Date(b.booking_date + 'T12:00:00').toLocaleDateString('es-PY')}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{b.booking_time.slice(0, 5)}</td>
                    <td className="px-4 py-3 text-[color:var(--text-muted,#6b7280)]">{b.duration_minutes} min</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          STATUS_STYLES[b.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[color:var(--text-muted,#6b7280)]">
                      {b.source === 'website' ? 'Web' : b.source === 'whatsapp' ? 'WhatsApp' : b.source === 'admin' ? 'Admin' : b.source}
                    </td>
                    <td className="px-4 py-3">
                      <StatusActions bookingId={b.id} currentStatus={b.status} businessId={businessId} />
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

function StatusActions({ bookingId, currentStatus, businessId }: { bookingId: string; currentStatus: string; businessId: string }) {
  const actions: { status: string; label: string; style: string }[] = []

  if (currentStatus === 'pending') {
    actions.push({ status: 'confirmed', label: 'Confirmar', style: 'text-green-600 hover:text-green-800' })
    actions.push({ status: 'cancelled', label: 'Cancelar', style: 'text-red-600 hover:text-red-800' })
  } else if (currentStatus === 'confirmed') {
    actions.push({ status: 'completed', label: 'Completar', style: 'text-blue-600 hover:text-blue-800' })
    actions.push({ status: 'no_show', label: 'No asistió', style: 'text-red-600 hover:text-red-800' })
  } else if (currentStatus === 'no_show') {
    actions.push({ status: 'cancelled', label: 'Cancelar', style: 'text-red-600 hover:text-red-800' })
  }

  if (actions.length === 0) return <span className="text-xs text-[color:var(--text-muted,#6b7280)]">—</span>

  return (
    <div className="flex gap-2 text-xs">
      {actions.map((a) => (
        <form key={a.status} method="POST" action={`/api/admin/bookings/${bookingId}/status`}>
          <input type="hidden" name="status" value={a.status} />
          <button type="submit" className={`underline ${a.style}`}>
            {a.label}
          </button>
        </form>
      ))}
    </div>
  )
}
