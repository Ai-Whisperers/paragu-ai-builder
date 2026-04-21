import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrder, CheckoutError } from '@/lib/commerce/orders'
import { formatCents } from '@/lib/commerce/compute-totals'
import { OrderActions } from '@/components/admin/commerce/order-actions'
import { OrderRefundButton } from '@/components/admin/commerce/order-refund-button'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AdminOrderDetail({ params }: { params: Promise<{ businessId: string; id: string }> }) {
  const { businessId, id } = await params
  let order
  try {
    order = await getOrder(businessId, id)
  } catch (err) {
    if (err instanceof CheckoutError && err.code === 'order_not_found') notFound()
    throw err
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/admin/commerce/${businessId}/orders`} className="mb-4 inline-block text-sm text-[color:var(--primary,#111)] underline">
        ← Volver
      </Link>

      <div className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orden {order.orderNumber}</h1>
            <p className="text-sm text-[color:var(--text-muted,#6b7280)]">
              Creada: {new Date(order.createdAt).toLocaleString('es-PY')}
            </p>
          </div>
          <span className="rounded bg-[color:var(--primary,#111)]/10 px-3 py-1 text-sm font-medium">{order.status}</span>
        </header>

        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Cliente</h2>
          <p>{order.customerName}</p>
          <p className="text-sm text-[color:var(--text-muted,#6b7280)]">{order.customerEmail}</p>
          {order.customerPhone ? <p className="text-sm text-[color:var(--text-muted,#6b7280)]">{order.customerPhone}</p> : null}
        </section>

        {order.shippingAddress ? (
          <section className="mb-6">
            <h2 className="mb-2 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Envío</h2>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}
            <p>
              {order.shippingAddress.city}
              {order.shippingAddress.department ? `, ${order.shippingAddress.department}` : ''}
            </p>
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

        <OrderActions businessId={businessId} orderId={order.id} currentStatus={order.status} />
        <OrderRefundButton businessId={businessId} orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  )
}
