import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrder, CheckoutError } from '@/lib/commerce/orders'
import { formatCents } from '@/lib/commerce/compute-totals'
import { OrderActions } from '@/components/admin/commerce/order-actions'
import { OrderRefundButton } from '@/components/admin/commerce/order-refund-button'
import { ComprobanteViewer } from '@/components/admin/commerce/comprobante-viewer'
import { OrderNoteForm } from '@/components/admin/commerce/order-note-form'
import { InvoiceIssueForm } from '@/components/admin/commerce/invoice-issue-form'
import { CustomerHistoryPanel } from '@/components/admin/commerce/customer-history-panel'
import { getCustomerHistory } from '@/lib/commerce/customer-history'
import { OrderTimeline } from '@/components/admin/commerce/order-timeline'
import { listOrderEvents } from '@/lib/commerce/order-events'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AdminOrderDetail({ params }: { params: Promise<{ businessId: string; id: string }> }) {
  const { businessId, id } = await params
  let order
  let events: Awaited<ReturnType<typeof listOrderEvents>> = []
  let history: Awaited<ReturnType<typeof getCustomerHistory>> | null = null
  try {
    order = await getOrder(businessId, id)
    events = await listOrderEvents(businessId, id)
    history = await getCustomerHistory(businessId, order.customerEmail, order.id)
  } catch (err) {
    if (err instanceof CheckoutError && err.code === 'order_not_found') notFound()
    throw err
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/admin/commerce/${businessId}/orders`} className="mb-4 inline-block text-sm text-[color:var(--primary,#111)] underline">
        ← Volver
      </Link>

      <div className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orden {order.orderNumber}</h1>
            <p className="text-sm text-[color:var(--text-muted,#6b7280)]">
              Creada: {new Date(order.createdAt).toLocaleString('es-PY')}
            </p>
          </div>
          <span className="rounded bg-primary/10 px-3 py-1 text-sm font-medium">{order.status}</span>
        </header>

        {order.comprobanteSentAt && order.status === 'awaiting_payment' ? (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
            <p className="font-semibold">✓ Cliente avisó que envió el comprobante</p>
            <p className="mt-0.5 text-xs">
              {new Date(order.comprobanteSentAt).toLocaleString('es-PY')} · Verificá la transferencia y
              marcá el pago como recibido abajo.
            </p>
            {order.comprobanteNote ? (
              <p className="mt-2 whitespace-pre-line rounded bg-white/60 p-2 text-xs">
                Nota del cliente: {order.comprobanteNote}
              </p>
            ) : null}
            {order.comprobanteImageUrl && order.comprobanteUploadedAt ? (
              <ComprobanteViewer businessId={businessId} orderId={order.id} uploadedAt={order.comprobanteUploadedAt} />
            ) : null}
          </div>
        ) : null}

        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Cliente</h2>
          <p>{order.customerName}</p>
          <p className="text-sm text-[color:var(--text-muted,#6b7280)]">{order.customerEmail}</p>
          {order.customerPhone ? <p className="text-sm text-[color:var(--text-muted,#6b7280)]">{order.customerPhone}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {order.customerPhone ? (
              <a
                href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.customerName}, sobre tu pedido ${order.orderNumber}:`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                <span aria-hidden="true">💬</span> WhatsApp
              </a>
            ) : null}
            {order.customerEmail ? (
              <a
                href={`mailto:${order.customerEmail}?subject=${encodeURIComponent(`Tu pedido ${order.orderNumber}`)}&body=${encodeURIComponent(`Hola ${order.customerName},\n\nSobre tu pedido ${order.orderNumber}:\n\n`)}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-xs font-medium hover:bg-surface-light"
              >
                <span aria-hidden="true">✉</span> Email
              </a>
            ) : null}
            {order.customerPhone ? (
              <a
                href={`tel:${order.customerPhone}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-1.5 text-xs font-medium hover:bg-surface-light"
              >
                <span aria-hidden="true">📞</span> Llamar
              </a>
            ) : null}
          </div>
        </section>

        {history ? <CustomerHistoryPanel businessId={businessId} history={history} /> : null}

        {order.shippingAddress ? (
          <section className="mb-6">
            <h2 className="mb-2 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Envío</h2>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}
            <p>
              {order.shippingAddress.city}
              {order.shippingAddress.department ? `, ${order.shippingAddress.department}` : ''}
            </p>
            {order.trackingCarrier || order.trackingNumber ? (
              <div className="mt-3 rounded bg-[color:var(--surface-muted,#f9fafb)] p-3 text-sm">
                <p className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Seguimiento</p>
                {order.trackingCarrier ? <p>{order.trackingCarrier}</p> : null}
                {order.trackingNumber ? <p className="font-mono">{order.trackingNumber}</p> : null}
                {order.trackingUrl ? (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[color:var(--primary,#111)] underline">
                    Abrir en transportista →
                  </a>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Items</h2>
          <div className="divide-y divide-[color:var(--border,#e5e7eb)]">
            {(order.items ?? []).map((it) => (
              <div key={it.id} className="flex justify-between py-3">
                <div>
                  <p className="font-medium">{it.productSnapshot.name}</p>
                  <p className="text-sm text-[color:var(--text-muted,#6b7280)]">Cantidad: {it.quantity}</p>
                </div>
                <p className="font-semibold">{formatCents(it.lineTotalCents, order.currency)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-[color:var(--border,#e5e7eb)] pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>{formatCents(order.totalCents, order.currency)}</span>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Historial</h2>
          <OrderTimeline events={events} />
          <OrderNoteForm businessId={businessId} orderId={order.id} />
        </section>
        <OrderActions businessId={businessId} orderId={order.id} currentStatus={order.status} />
        <OrderRefundButton businessId={businessId} orderId={order.id} currentStatus={order.status} />
        <InvoiceIssueForm businessId={businessId} orderId={order.id} alreadyIssued={Boolean(order.invoiceNumber)} invoiceNumber={order.invoiceNumber} customerName={order.customerName} />
      </div>
    </div>
  )
}
