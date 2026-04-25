import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '../dashboard-layout'

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant = await requireTenant()
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', tenant.businessId)
    .order('created_at', { ascending: false })

  return (
    <DashboardLayout slug={slug} tenant={tenant}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Productos</h1>

        {!products || products.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
            No hay productos todavía
          </div>
        ) : (
          <div className="bg-white rounded-xl border divide-y">
            {products.map((product: any) => (
              <div key={product.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {product.image_url && (
                    <img src={product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-400">
                      Gs. {(product.price_cents / 100).toLocaleString()}
                      {product.stock !== null && ` · Stock: ${product.stock}`}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
