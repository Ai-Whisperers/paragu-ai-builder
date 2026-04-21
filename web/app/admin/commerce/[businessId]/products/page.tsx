import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import { formatCents } from '@/lib/commerce/compute-totals'
import { SeedCatalogButton } from '@/components/admin/commerce/seed-catalog-button'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ProductRow {
  id: string
  slug: string
  name: string
  status: string
  price_cents: number
  currency: string
  inventory_qty: number
  inventory_policy: string
  is_seed: boolean
  updated_at: string
}

export default async function AdminProductsPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data } = await scoped.select<ProductRow>('products', '*', {
    filter: (q) => q.order('updated_at', { ascending: false }).limit(100),
  })
  const products = Array.isArray(data) ? data : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-muted,#6b7280)]">
        <Link href={`/admin/commerce/${businessId}/products`} className="font-semibold text-[color:var(--text,#111)] underline">
          Productos
        </Link>
        <Link href={`/admin/commerce/${businessId}/products/import`} className="hover:underline">
          Importar CSV
        </Link>
        <Link href={`/admin/commerce/${businessId}/discounts`} className="hover:underline">
          Descuentos
        </Link>
        <Link href={`/admin/commerce/${businessId}/shipping`} className="hover:underline">
          Envíos
        </Link>
        <Link href={`/admin/commerce/${businessId}/orders`} className="hover:underline">
          Pedidos
        </Link>
        <Link href={`/admin/commerce/${businessId}/reconciliation`} className="hover:underline">
          Conciliación
        </Link>
        <Link href={`/admin/commerce/${businessId}/search-analytics`} className="hover:underline">
          Búsquedas
        </Link>
      </nav>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="flex items-center gap-2">
          <SeedCatalogButton businessId={businessId} />
          <Link
            href={`/admin/commerce/${businessId}/products/new`}
            className="rounded-lg bg-[color:var(--primary,#111)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] p-12 text-center">
          <p className="text-[color:var(--text-muted,#6b7280)]">Aún no tenés productos. Creá el primero o cargá el catálogo de ejemplo.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)]">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--surface-muted,#f9fafb)] text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[color:var(--border,#e5e7eb)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.name}</span>
                      {p.is_seed ? <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">Ejemplo</span> : null}
                    </div>
                    <p className="text-xs text-[color:var(--text-muted,#6b7280)]">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">{formatCents(p.price_cents, p.currency)}</td>
                  <td className="px-4 py-3">
                    {p.inventory_policy === 'continue' ? '∞' : p.inventory_qty}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/commerce/${businessId}/products/${p.id}`} className="text-sm text-[color:var(--primary,#111)] underline">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
