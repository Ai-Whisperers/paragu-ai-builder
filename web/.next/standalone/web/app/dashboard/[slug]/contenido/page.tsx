import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '../dashboard-layout'
import { ContentEditor } from '@/components/admin/content/content-editor'
import { getBusinessContent } from '@/lib/business-content'

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant = await requireTenant()
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, data_json')
    .eq('id', tenant.businessId)
    .single()

  return (
    <DashboardLayout slug={slug} tenant={tenant}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Editar contenido</h1>
        <p className="text-gray-500 mb-6">Los cambios se guardan y se ven reflejados al instante en tu sitio.</p>
        <ContentEditor
          businessId={tenant.businessId}
          siteSlug={slug}
          initialContent={(getBusinessContent(business || { data_json: null }).content as Record<string, unknown>) || {}}
        />
      </div>
    </DashboardLayout>
  )
}
