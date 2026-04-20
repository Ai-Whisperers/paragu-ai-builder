import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import { EditProductForm } from '@/components/admin/commerce/edit-product-form'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ProductRow {
  id: string
  slug: string
  name: string
  description: string | null
  category: string | null
  price_cents: number
  inventory_qty: number
  inventory_policy: 'deny' | 'continue'
  status: 'active' | 'draft' | 'archived'
  images: Array<{ url: string; alt?: string; isCover?: boolean }>
  is_seed: boolean
}

export default async function EditProductPage({ params }: { params: Promise<{ businessId: string; id: string }> }) {
  const { businessId, id } = await params
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data } = await scoped.select<ProductRow>('products', '*', {
    filter: (q) => q.eq('id', id).limit(1),
  })
  const product = Array.isArray(data) ? data[0] : data
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href={`/admin/commerce/${businessId}/products`} className="mb-4 inline-block text-sm text-[color:var(--primary,#111)] underline">
        ← Volver
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Editar producto</h1>
      <EditProductForm
        businessId={businessId}
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description ?? '',
          category: product.category ?? '',
          priceCents: product.price_cents,
          inventoryQty: product.inventory_qty,
          status: product.status,
          isSeed: product.is_seed,
        }}
      />
    </div>
  )
}
