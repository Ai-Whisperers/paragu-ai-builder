import { notFound } from 'next/navigation'
import Link from 'next/link'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { getOrder, CheckoutError } from '@/lib/commerce/orders'
import { formatCents } from '@/lib/commerce/compute-totals'
import { listCredentialsForBusiness } from '@/lib/commerce/payment-credentials'
import { CheckoutProgressIndicator } from '@/components/commerce/checkout-progress-indicator'
import { ComprobanteSentButton } from '@/components/commerce/comprobante-sent-button'
import { ComprobanteUploadButton } from '@/components/commerce/comprobante-upload-button'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface BankInstructions {
  bankName?: string
  accountType?: string
  accountNumber?: string
  holderName?: string
  ciOrRuc?: string
  whatsappNumber?: string
  instructions?: string
}

function buildWhatsappDeepLink(whatsappNumber: string, orderNumber: string, totalLabel: string): string {
  const digits = whatsappNumber.replace(/\D/g, '')
  const text = `Hola, adjunto el comprobante de transferencia del pedido ${orderNumber} por ${totalLabel}.`
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export default async function TransferInstructionsPage({
  params,
}: {
  params: Promise<{ site: string; locale: string; orderId: string }>
}) {
  const { site, locale, orderId } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business) notFound()

  let order
  try {
    order = await getOrder(business.id, orderId)
  } catch (err) {
    if (err instanceof CheckoutError && err.code === 'order_not_found') notFound()
    throw err
  }

  const credentials = await listCredentialsForBusiness(business.id)
  const manualRow = credentials.find((c) => c.provider === 'manual' && c.status === 'active')
  const bank: BankInstructions = (manualRow?.publicConfig as BankInstructions | undefined) ?? {}

  const totalLabel = formatCents(order.totalCents, order.currency)
  const whatsappUrl = bank.whatsappNumber
    ? buildWhatsappDeepLink(bank.whatsappNumber, order.orderNumber, totalLabel)
    : null

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <main className="mx-auto max-w-2xl px-4 py-10">
        <CheckoutProgressIndicator current="payment" />
        <div className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[color:var(--text,#111)]">
            Pedido {order.orderNumber} — esperando transferencia
          </h1>
          <p className="mt-2 text-sm text-[color:var(--text-muted,#6b7280)]">
            Guardamos tu pedido. Para completarlo, transferí el total a la cuenta de abajo y enviá el
            comprobante por WhatsApp.
          </p>

          <section className="mt-6 rounded-lg bg-[color:var(--surface-muted,#f9fafb)] p-4">
            <p className="text-sm text-[color:var(--text-muted,#6b7280)]">Total a transferir</p>
            <p className="text-3xl font-bold">{totalLabel}</p>
          </section>

          {bank.bankName || bank.accountNumber ? (
            <section className="mt-6 space-y-2 text-sm">
              <h2 className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Datos bancarios</h2>
              {bank.bankName ? <p><strong>Banco:</strong> {bank.bankName}</p> : null}
              {bank.accountType ? <p><strong>Tipo:</strong> {bank.accountType}</p> : null}
              {bank.accountNumber ? <p><strong>Número:</strong> <code className="rounded bg-surface-light px-1.5 py-0.5 font-mono">{bank.accountNumber}</code></p> : null}
              {bank.holderName ? <p><strong>Titular:</strong> {bank.holderName}</p> : null}
              {bank.ciOrRuc ? <p><strong>CI / RUC:</strong> {bank.ciOrRuc}</p> : null}
              {bank.instructions ? (
                <p className="mt-3 whitespace-pre-line rounded bg-amber-50 p-3 text-sm text-amber-900">{bank.instructions}</p>
              ) : null}
            </section>
          ) : (
            <section className="mt-6 rounded bg-amber-50 p-4 text-sm text-amber-900">
              <p>
                <strong>{business.name}</strong> todavía no configuró sus datos bancarios. Te pedimos
                que lo contactes directamente para coordinar el pago.
              </p>
            </section>
          )}

          <section className="mt-6 space-y-3">
            <h2 className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Enviar comprobante</h2>
            {order.comprobanteSentAt ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                <p className="font-semibold">✓ Marcaste el comprobante como enviado</p>
                <p className="mt-1 text-xs">
                  {new Date(order.comprobanteSentAt).toLocaleString('es-PY')} · {business.name} revisa
                  los comprobantes y confirma tu pago por email en las próximas horas.
                </p>
              </div>
            ) : (
              <>
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Enviar comprobante por WhatsApp
                  </a>
                ) : (
                  <p className="text-sm text-[color:var(--text-muted,#6b7280)]">
                    El comercio no configuró WhatsApp. Contactalo por otro canal.
                  </p>
                )}
                <ComprobanteSentButton siteSlug={site} orderId={order.id} />
                <ComprobanteUploadButton siteSlug={site} orderId={order.id} alreadyUploaded={Boolean(order.comprobanteImageUrl)} />
                <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
                  Referenciá el pedido <strong>{order.orderNumber}</strong> al enviarlo. Tu pedido se
                  confirma cuando el comercio valida la transferencia.
                </p>
              </>
            )}
          </section>

          <section className="mt-8 border-t border-[color:var(--border,#e5e7eb)] pt-4 text-sm">
            <Link href={`/s/${locale}/${site}/orden/${order.id}`} className="text-[color:var(--primary,#111)] underline">
              Ver estado del pedido →
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
