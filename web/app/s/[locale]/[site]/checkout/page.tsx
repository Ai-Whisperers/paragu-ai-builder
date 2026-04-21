import { notFound } from 'next/navigation'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { CheckoutForm } from '@/components/commerce/checkout-form'

export const runtime = 'nodejs'

export default async function CheckoutPage({ params }: { params: Promise<{ site: string; locale: string }> }) {
  const { site, locale } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={null} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Finalizar compra</h1>
        <CheckoutForm siteSlug={site} locale={locale} />
      </main>
    </div>
  )
}
