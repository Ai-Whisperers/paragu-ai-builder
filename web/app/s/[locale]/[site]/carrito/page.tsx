import { notFound } from 'next/navigation'
import Link from 'next/link'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { CartPageClient } from '@/components/commerce/cart-page-client'

export const runtime = 'nodejs'

export default async function CartPage({ params }: { params: Promise<{ site: string; locale: string }> }) {
  const { site, locale } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={null} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Tu carrito</h1>
        <CartPageClient siteSlug={site} locale={locale} />
        <div className="mt-6">
          <Link href={`/s/${locale}/${site}/tienda`} className="text-sm text-[color:var(--primary,#111)] underline">
            ← Seguir comprando
          </Link>
        </div>
      </main>
    </div>
  )
}
