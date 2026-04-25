import { notFound } from 'next/navigation'
import Link from 'next/link'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { getOrder, CheckoutError } from '@/lib/commerce/orders'
import { formatCents } from '@/lib/commerce/compute-totals'
import { listCredentialsForBusiness } from '@/lib/commerce/payment-credentials'
import { ReceiptPrintButton } from '@/components/commerce/receipt-print-button'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Printable receipt view for a single order. Shopper-facing — accessible
 * at /s/[locale]/[site]/orden/[id]/recibo. Design priorities:
 *
 *  - Works as "Save as PDF" via browser print dialog on any device. No
 *    server-side PDF library (react-pdf, puppeteer) — avoids Node
 *    runtime binaries + bundle weight for a low-volume feature.
 *  - Print-only layout: no CommerceHeader, no tienda nav, no WhatsApp
 *    float. Just the receipt content.
 *  - Degrades gracefully when invoice fields are null — shows
 *    "documento provisional" copy and the mandatory Ley 6380/19
 *    disclaimer so shoppers aren't misled about the document's legal
 *    status.
 *
 * Batch E of the commerce improvements plan; Batch L will populate the
 * invoice_* fields via the SET / Facture integration.
 */
export default async function OrderReceiptPage({
  params,
}: {
  params: Promise<{ site: string; locale: string; id: string }>
}) {
  const { site, id } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business) notFound()

  let order
  try {
    order = await getOrder(business.id, id)
  } catch (err) {
    if (err instanceof CheckoutError && err.code === 'order_not_found') notFound()
    throw err
  }

  const credentials = await listCredentialsForBusiness(business.id)
  const manualRow = credentials.find((c) => c.provider === 'manual' && c.status === 'active')
  const bank = (manualRow?.publicConfig ?? {}) as {
    bankName?: string
    accountType?: string
    accountNumber?: string
    holderName?: string
    ciOrRuc?: string
  }

  const hasInvoice = Boolean(order.invoiceNumber && order.invoiceIssuedAt)
  const issued = hasInvoice && order.invoiceIssuedAt
    ? new Date(order.invoiceIssuedAt).toLocaleString('es-PY')
    : null

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-gray-900 print:max-w-full print:p-6">
      <div className="mb-6 print:hidden">
        <ReceiptPrintButton />
        <Link
          href={`/s/es/${site}/orden/${order.id}`}
          className="ml-3 text-sm text-gray-600 underline"
        >
          ← Volver al pedido
        </Link>
      </div>

      <header className="mb-6 flex items-start justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-xs text-gray-500">
            {hasInvoice ? 'Factura' : 'Recibo provisional'}
            {' · '}
            {hasInvoice && issued
              ? issued
              : new Date(order.createdAt).toLocaleString('es-PY')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase text-gray-500">
            {hasInvoice ? `Factura ${order.invoiceNumber}` : `Pedido`}
          </p>
          <p className="font-mono text-sm font-bold">{order.orderNumber}</p>
        </div>
      </header>

      <section className="mb-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">Cliente</p>
          <p className="font-medium">{order.invoiceLegalName ?? order.customerName}</p>
          {order.invoiceRuc ? (
            <p className="text-xs text-gray-600">RUC: {order.invoiceRuc}</p>
          ) : null}
          <p className="text-xs text-gray-600">{order.customerEmail}</p>
          {order.customerPhone ? (
            <p className="text-xs text-gray-600">{order.customerPhone}</p>
          ) : null}
        </div>
        {order.shippingAddress ? (
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Entrega</p>
            <p className="text-sm">{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 ? (
              <p className="text-sm">{order.shippingAddress.line2}</p>
            ) : null}
            <p className="text-sm">
              {order.shippingAddress.city}
              {order.shippingAddress.department ? `, ${order.shippingAddress.department}` : ''}
            </p>
          </div>
        ) : null}
      </section>

      <section className="mb-5">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left text-xs uppercase text-gray-500">
              <th className="py-2">Producto</th>
              <th className="py-2 text-right">Cantidad</th>
              <th className="py-2 text-right">Precio</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items ?? []).map((it) => (
              <tr key={it.id} className="border-b border-gray-100">
                <td className="py-2">{it.productSnapshot.name}</td>
                <td className="py-2 text-right">{it.quantity}</td>
                <td className="py-2 text-right">{formatCents(it.unitPriceCents, order.currency)}</td>
                <td className="py-2 text-right font-medium">
                  {formatCents(it.lineTotalCents, order.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6 ml-auto max-w-xs text-sm">
        <div className="flex justify-between py-1">
          <span className="text-gray-600">Subtotal</span>
          <span>{formatCents(order.subtotalCents, order.currency)}</span>
        </div>
        {order.discountCents > 0 ? (
          <div className="flex justify-between py-1 text-green-700">
            <span>Descuento</span>
            <span>−{formatCents(order.discountCents, order.currency)}</span>
          </div>
        ) : null}
        {order.shippingCents > 0 ? (
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Envío</span>
            <span>{formatCents(order.shippingCents, order.currency)}</span>
          </div>
        ) : null}
        {order.taxCents > 0 ? (
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Impuestos</span>
            <span>{formatCents(order.taxCents, order.currency)}</span>
          </div>
        ) : null}
        <div className="mt-1 flex justify-between border-t border-gray-300 pt-2 text-base font-bold">
          <span>Total</span>
          <span>{formatCents(order.totalCents, order.currency)}</span>
        </div>
      </section>

      {order.invoiceConcept ? (
        <section className="mb-4 rounded bg-gray-50 p-3 text-xs text-gray-700">
          <p className="font-semibold">Concepto:</p>
          <p>{order.invoiceConcept}</p>
        </section>
      ) : null}

      {bank.bankName || bank.accountNumber ? (
        <section className="mb-4 rounded bg-gray-50 p-3 text-xs text-gray-700">
          <p className="font-semibold uppercase tracking-wide text-gray-500">Pago</p>
          {bank.bankName ? <p>Banco: {bank.bankName}</p> : null}
          {bank.accountType ? <p>Tipo: {bank.accountType}</p> : null}
          {bank.accountNumber ? <p>Cuenta: {bank.accountNumber}</p> : null}
          {bank.holderName ? <p>Titular: {bank.holderName}</p> : null}
          {bank.ciOrRuc ? <p>CI/RUC: {bank.ciOrRuc}</p> : null}
        </section>
      ) : null}

      <footer className="mt-8 border-t border-gray-200 pt-4 text-xs text-gray-500">
        {hasInvoice ? (
          <p>
            Factura electrónica emitida {issued}. Este documento es válido a efectos fiscales conforme
            Ley 6380/19.
          </p>
        ) : (
          <p>
            Este documento es un <strong>recibo provisional</strong> generado por {business.name} como
            constancia de pedido. No sustituye factura timbrada conforme Ley 6380/19. La factura
            fiscal se emite al confirmar el pago.
          </p>
        )}
        <p className="mt-2">
          Generado por Paragu-AI · Pedido {order.orderNumber} ·{' '}
          {new Date(order.createdAt).toLocaleString('es-PY')}
        </p>
      </footer>
    </div>
  )
}
