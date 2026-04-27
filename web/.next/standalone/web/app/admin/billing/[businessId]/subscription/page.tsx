import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { BankTransferInstructions } from '@/components/admin/commerce/bank-transfer-instructions'
import { SubscriptionLinkGenerator } from '@/components/admin/commerce/subscription-link-generator'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface BusinessRow {
  id: string
  slug: string
  name: string
  email: string | null
  whatsapp: string | null
  phone: string | null
  owner_name: string | null
}

interface SubscriptionRow {
  id: string
  plan_tier: string
  plan_name: string
  price_monthly: number
  status: string
  current_period_start: string
  current_period_end: string
  payment_payment_id: string | null
}

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  const supabase = await createAdminClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('id, slug, name, email, whatsapp, phone, owner_name')
    .eq('id', businessId)
    .maybeSingle<BusinessRow>()

  if (!business) notFound()

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(10)

  const subs = (Array.isArray(subscriptions) ? subscriptions : []) as SubscriptionRow[]
  const active = subs.find((s) => s.status === 'active' || s.status === 'trialing') ?? null

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/admin/commerce/${businessId}/products`} className="mb-4 inline-block text-sm text-[color:var(--primary,#111)] underline">
        ← Volver al negocio
      </Link>

      <h1 className="mb-1 text-2xl font-bold">Suscripción Paragu-AI</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        <strong>{business.name}</strong> paga su plan por transferencia al alias y manda el comprobante por WhatsApp. Lo activás manualmente una vez que confirmás el comprobante.
      </p>

      {active ? (
        <div className="mb-6 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Plan actual</p>
              <p className="text-lg font-semibold">{active.plan_name}</p>
            </div>
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">{active.status}</span>
          </div>
          <p className="text-sm text-[color:var(--text-muted,#6b7280)]">
            Gs {Number(active.price_monthly).toLocaleString('es-PY')} · período actual {new Date(active.current_period_start).toLocaleDateString('es-PY')} → {new Date(active.current_period_end).toLocaleDateString('es-PY')}
          </p>

          <BankTransferInstructions
            businessName={business.name}
            planLabel={active.plan_name}
            defaultAmountCents={Math.round(Number(active.price_monthly))}
            tenantWhatsapp={business.whatsapp ?? business.phone ?? null}
          />

          <details className="mt-4 rounded border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface-muted,#f9fafb)] p-3 text-sm">
            <summary className="cursor-pointer text-xs font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">
              Avanzado — generar link Pagopar (requiere PARAGU_AI_PAGOPAR_* en env)
            </summary>
            <div className="mt-3 text-xs text-[color:var(--text-muted,#6b7280)]">
              Usá esto si el cliente prefiere pagar con tarjeta o efectivo en Pago Express/Aquí Pago. Si todavía no configuraste la cuenta Pagopar de Paragu-AI, el botón va a fallar con <code>paragu_ai_pagopar_not_configured</code> — está bien, es el default. Priorizá la transferencia de arriba.
            </div>
            <SubscriptionLinkGenerator
              businessId={businessId}
              subscriptionId={active.id}
              planLabel={active.plan_name}
              defaultAmountCents={Math.round(Number(active.price_monthly))}
              defaultEmail={business.email ?? ''}
              defaultName={business.owner_name ?? business.name}
              defaultPhone={business.whatsapp ?? business.phone ?? ''}
            />
          </details>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-6 text-center text-sm text-[color:var(--text-muted,#6b7280)]">
          Este negocio no tiene una suscripción activa. Creá una en Supabase o vía API antes de cobrarle.
        </div>
      )}

      {subs.length > 0 ? (
        <div>
          <h2 className="mb-2 mt-8 text-sm font-semibold uppercase text-[color:var(--text-muted,#6b7280)]">Historial</h2>
          <div className="overflow-x-auto rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)]">
            <table className="w-full text-sm">
              <thead className="bg-[color:var(--surface-muted,#f9fafb)] text-left">
                <tr>
                  <th className="px-4 py-2 font-semibold">Plan</th>
                  <th className="px-4 py-2 font-semibold">Estado</th>
                  <th className="px-4 py-2 font-semibold">Precio</th>
                  <th className="px-4 py-2 font-semibold">Período</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-t border-[color:var(--border,#e5e7eb)]">
                    <td className="px-4 py-2">{s.plan_name}</td>
                    <td className="px-4 py-2">{s.status}</td>
                    <td className="px-4 py-2">Gs {Number(s.price_monthly).toLocaleString('es-PY')}</td>
                    <td className="px-4 py-2 text-[color:var(--text-muted,#6b7280)]">
                      {new Date(s.current_period_start).toLocaleDateString('es-PY')} → {new Date(s.current_period_end).toLocaleDateString('es-PY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}
