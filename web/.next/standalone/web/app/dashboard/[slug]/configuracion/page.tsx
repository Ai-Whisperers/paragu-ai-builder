import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '../dashboard-layout'
import { SettingsForm } from './settings-form'

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant = await requireTenant()
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', tenant.businessId)
    .single()

  return (
    <DashboardLayout slug={slug} tenant={tenant}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Configuración</h1>
        <p className="text-gray-500 mb-6">Actualizá la información de tu negocio</p>
        <SettingsForm business={business} businessId={tenant.businessId} />
      </div>
    </DashboardLayout>
  )
}
