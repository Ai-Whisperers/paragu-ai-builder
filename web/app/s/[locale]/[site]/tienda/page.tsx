import { notFound } from 'next/navigation'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { listActiveProducts } from '@/lib/commerce/products'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { ProductCard } from '@/components/commerce/product-card'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'

export const runtime = 'nodejs'
export const revalidate = 300

export default async function StorePage({ params }: { params: Promise<{ site: string; locale: string }> }) {
  const { site } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  const products = await listActiveProducts(business.id, { limit: 48 })

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={null} />
      <CommerceHeader siteSlug={site} businessName={business.name} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-[color:var(--text,#111)]">Nuestra tienda</h1>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-12 text-center">
            <p className="text-[color:var(--text-muted,#6b7280)]">Estamos cargando nuestro catálogo. Volvé pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} siteSlug={site} product={product} priority={idx < 4} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
