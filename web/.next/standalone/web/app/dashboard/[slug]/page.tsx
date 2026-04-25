import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from './dashboard-layout'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
    .select('name, slug, data_json, whatsapp_instance')
    .eq('id', tenant.businessId)
    .single()

  const needsOnboarding = !business?.name || !business?.name?.trim()
  if (needsOnboarding) {
    redirect(`/dashboard/${slug}/onboarding`)
  }

  const today = new Date().toISOString().split('T')[0]
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

  const [ordersRes, productsRes, bookingsRes, todayBookingsRes] = await Promise.all([
    supabase.from('orders').select('id, status, total_cents, created_at').eq('business_id', tenant.businessId).order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, name, status').eq('business_id', tenant.businessId).limit(100),
    supabase.from('bookings').select('id, customer_name, service_id, booking_date, booking_time, status').eq('business_id', tenant.businessId).gte('booking_date', today).lte('booking_date', nextWeek).order('booking_date', { ascending: true }).limit(10),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('business_id', tenant.businessId).eq('booking_date', today),
  ])

  const orders = ordersRes.data || []
  const products = productsRes.data || []
  const bookings = bookingsRes.data || []
  const todayBookings = todayBookingsRes.count || 0
  const activeProducts = products.filter(p => p.status === 'active').length
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  const businessSlug = business?.slug || slug
  const previewUrl = `https://paragu-ai.com/s/es/${businessSlug}`
  const waConnected = !!business?.whatsapp_instance

  const formatDate = (date: string) => {
    try { return format(new Date(date + 'T12:00:00'), "EEEE d 'de' MMMM", { locale: es }) } catch { return date }
  }

  return (
    <DashboardLayout slug={slug} tenant={tenant}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Panel de control</h1>
            <p className="text-gray-500 mt-1">{business.name || tenant.name || tenant.email}</p>
          </div>
          <div className="flex gap-2">
            <a href={previewUrl} target="_blank" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Ver mi sitio
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Mira mi sitio web! ${previewUrl}`)}`} target="_blank" className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
              Compartir
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border p-4">
            <div className="text-2xl font-bold text-blue-600">{todayBookings}</div>
            <div className="text-xs text-gray-500 mt-0.5">Reservas hoy</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Proximos 7 dias</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            <div className="text-xs text-gray-500 mt-0.5">Productos</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-2xl font-bold text-amber-600">{pendingOrders}</div>
            <div className="text-xs text-gray-500 mt-0.5">Pedidos pendientes</div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        {bookings.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-3">Proximas reservas</h2>
            <div className="bg-white rounded-xl border divide-y">
              {bookings.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{b.customer_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(b.booking_date)} a las {b.booking_time?.slice(0,5)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp connection status */}
        <div className={`p-4 rounded-xl border ${waConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{waConnected ? 'WhatsApp conectado' : 'WhatsApp no conectado'}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {waConnected ? 'Tus clientes reciben notificaciones automaticas' : 'Conecta tu WhatsApp para recibir notificaciones de reservas'}
              </p>
            </div>
            {!waConnected && (
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                Conectar WhatsApp
              </button>
            )}
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
          <a href={`/dashboard/${slug}/reservas`} className="block bg-white rounded-xl border p-5 hover:border-blue-300 transition-colors">
            <h3 className="font-medium text-gray-900">📅 Reservas</h3>
            <p className="text-sm text-gray-500 mt-1">Gestioná turnos, confirmá y cancelá reservas</p>
          </a>
          <a href={`/dashboard/${slug}/contenido`} className="block bg-white rounded-xl border p-5 hover:border-blue-300 transition-colors">
            <h3 className="font-medium text-gray-900">✏️ Editar contenido</h3>
            <p className="text-sm text-gray-500 mt-1">Modificá textos, fotos y secciones de tu sitio</p>
          </a>
          <a href={`/dashboard/${slug}/configuracion`} className="block bg-white rounded-xl border p-5 hover:border-blue-300 transition-colors">
            <h3 className="font-medium text-gray-900">⚙️ Configuración</h3>
            <p className="text-sm text-gray-500 mt-1">Teléfono, dirección, horarios y redes</p>
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
