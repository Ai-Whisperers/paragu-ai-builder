import { listCredentialsForBusiness } from '@/lib/commerce/payment-credentials'
import { PaymentCredentialsManager } from '@/components/admin/commerce/payment-credentials-manager'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function AdminPaymentsPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  const credentials = await listCredentialsForBusiness(businessId)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Métodos de pago</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Conectá tus credenciales de Pagopar (y opcionalmente Bancard o dLocal) para que tu tienda pueda cobrar. Las claves se guardan cifradas; nunca las mostramos completas después de guardarlas.
      </p>
      <PaymentCredentialsManager businessId={businessId} initialCredentials={credentials} />
    </div>
  )
}
