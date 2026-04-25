import type { OrderEventRow } from '@/lib/commerce/order-events'

const EVENT_LABELS: Record<string, string> = {
  status_changed: 'Cambio de estado',
  comprobante_received: 'Cliente avisó que envió el comprobante',
  comprobante_uploaded: 'Cliente subió el comprobante',
  invoice_issued: 'Factura emitida',
  refund_issued: 'Reembolso emitido',
  note_added: 'Nota interna',
}

/**
 * Timeline view of an order's history. Renders newest-first on the admin
 * order detail page — pure server component, no client JS.
 */
export function OrderTimeline({ events }: { events: OrderEventRow[] }) {
  if (events.length === 0) {
    return (
      <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
        Todavía no hay eventos registrados en esta orden.
      </p>
    )
  }
  return (
    <ol className="relative space-y-3 border-l-2 border-[color:var(--border,#e5e7eb)] pl-4">
      {events.map((ev) => (
        <li key={ev.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[25px] top-1 block h-3 w-3 rounded-full border-2 border-[color:var(--primary,#111)] bg-white"
          />
          <p className="text-sm font-medium text-[color:var(--text,#111)]">
            {EVENT_LABELS[ev.eventType] ?? ev.eventType}
            {ev.eventType === 'status_changed' && ev.fromStatus && ev.toStatus ? (
              <span className="ml-1 text-xs font-normal text-[color:var(--text-muted,#6b7280)]">
                {ev.fromStatus} → {ev.toStatus}
              </span>
            ) : null}
          </p>
          <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
            {new Date(ev.createdAt).toLocaleString('es-PY')}
            {ev.actorLabel ? ` · ${ev.actorLabel}` : ''}
          </p>
          {ev.note ? (
            <p className="mt-1 whitespace-pre-line rounded bg-[color:var(--surface-muted,#f9fafb)] p-2 text-xs">
              {ev.note}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
