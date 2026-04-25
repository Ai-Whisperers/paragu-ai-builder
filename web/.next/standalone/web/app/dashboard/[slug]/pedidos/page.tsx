import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '../dashboard-layout'

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant = await requireTenant()
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('business_id', tenant.businessId)
    .order('created_at', { ascending: false })

  return (
    <DashboardLayout slug={slug} tenant={tenant}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Pedidos</h1>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
            No hay pedidos todavía
          </div>
        ) : (
          <div className="bg-white rounded-xl border divide-y">
            {orders.map((order: any) => (
              <div key={order.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Gs. {(order.total_cents / 100).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('es-PY', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  {order.customer_name && (
                    <div className="text-xs text-gray-500 mt-0.5">{order.customer_name}</div>
                  )}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'preparing' ? 'bg-purple-100 text-purple-700' :
                  order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'completed' ? 'bg-green-100 text-green-700' :
                  order.status === 'canceled' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
