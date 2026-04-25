import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from './dashboard-layout'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant = await requireTenant()
  const supabase = await createClient()

  // Check if this tenant needs onboarding (missing business info)
  const { data: business } = await supabase
    .from('businesses')
    .select('name, data_json')
    .eq('id', tenant.businessId)
    .single()

  const needsOnboarding = !business?.name || !business?.name?.trim()
  if (needsOnboarding) {
    redirect(`/dashboard/${slug}/onboarding`)
  }

  const [ordersRes, productsRes] = await Promise.all([
    supabase.from('orders').select('id, status, total_cents, created_at').eq('business_id', tenant.businessId).order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, name, status').eq('business_id', tenant.businessId).limit(100),
  ])

  const orders = ordersRes.data || []
  const products = productsRes.data || []
  const activeProducts = products.filter(p => p.status === 'active').length
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  return (
    <DashboardLayout slug={slug} tenant={tenant}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Panel de control</h1>
          <p className="text-gray-500 mt-1">Bienvenido, {tenant.name || tenant.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-5">
            <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-sm text-gray-500 mt-1">Pedidos totales</div>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <div className="text-3xl font-bold text-amber-600">{pendingOrders}</div>
            <div className="text-sm text-gray-500 mt-1">Pedidos pendientes</div>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <div className="text-3xl font-bold text-green-600">{activeProducts}</div>
            <div className="text-sm text-gray-500 mt-1">Productos activos</div>
          </div>
        </div>

        {orders.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Últimos pedidos</h2>
            <div className="bg-white rounded-xl border divide-y">
              {orders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Gs. {(order.total_cents / 100).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('es-PY')}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href={`/dashboard/${slug}/contenido`} className="block bg-white rounded-xl border p-5 hover:border-blue-300 transition-colors">
            <h3 className="font-medium text-gray-900">✏️ Editar contenido</h3>
            <p className="text-sm text-gray-500 mt-1">Modificá textos, fotos y secciones de tu sitio</p>
          </a>
          <a href={`/dashboard/${slug}/pedidos`} className="block bg-white rounded-xl border p-5 hover:border-blue-300 transition-colors">
            <h3 className="font-medium text-gray-900">📦 Pedidos</h3>
            <p className="text-sm text-gray-500 mt-1">Gestioná pedidos y actualizá estados</p>
          </a>
          <a href={`/dashboard/${slug}/productos`} className="block bg-white rounded-xl border p-5 hover:border-blue-300 transition-colors">
            <h3 className="font-medium text-gray-900">🏷️ Productos</h3>
            <p className="text-sm text-gray-500 mt-1">Administrá tu catálogo de productos</p>
          </a>
          <a href={`/dashboard/${slug}/descuentos`} className="block bg-white rounded-xl border p-5 hover:border-blue-300 transition-colors">
            <h3 className="font-medium text-gray-900">🔥 Descuentos</h3>
            <p className="text-sm text-gray-500 mt-1">Creá promociones y ofertas especiales</p>
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
