import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '../dashboard-layout'

export default async function DiscountsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant = await requireTenant()
  const supabase = await createClient()

  const { data: discounts } = await supabase
    .from('discounts')
    .select('*')
    .eq('business_id', tenant.businessId)
    .order('created_at', { ascending: false })

  return (
    <DashboardLayout slug={slug} tenant={tenant}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Descuentos</h1>

        {!discounts || discounts.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
            No hay descuentos todavía
          </div>
        ) : (
          <div className="bg-white rounded-xl border divide-y">
            {discounts.map((discount: any) => (
              <div key={discount.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{discount.code || discount.name}</div>
                  <div className="text-xs text-gray-400">
                    {discount.percent_off ? `${discount.percent_off}% OFF` : `Gs. ${((discount.amount_off || 0) / 100).toLocaleString()}`}
                    {discount.min_subtotal_cents && ` · Mín. Gs. ${(discount.min_subtotal_cents / 100).toLocaleString()}`}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  discount.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {discount.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
