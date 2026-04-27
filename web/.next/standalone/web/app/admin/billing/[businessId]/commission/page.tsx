import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { CommissionSettingsForm } from '@/components/admin/commerce/commission-settings-form'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface BusinessRow {
  id: string
  slug: string
  name: string
  commission_percent: number
  commission_flat_cents: number
  commission_exempt_until: string | null
}

export default async function CommissionSettingsPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('businesses')
    .select('id, slug, name, commission_percent, commission_flat_cents, commission_exempt_until')
    .eq('id', businessId)
    .maybeSingle<BusinessRow>()

  if (!data) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Comisión</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Configurá cuánto se queda Paragu-AI por cada venta en la tienda de <strong>{data.name}</strong>. La comisión se cobra vía Pagopar split billing — el tenant recibe su parte y Paragu-AI la suya, sin que nosotros manejemos el dinero.
      </p>

      <CommissionSettingsForm
        businessId={businessId}
        initial={{
          commissionPercent: data.commission_percent,
          commissionFlatCents: data.commission_flat_cents,
          commissionExemptUntil: data.commission_exempt_until,
        }}
      />
    </div>
  )
}
