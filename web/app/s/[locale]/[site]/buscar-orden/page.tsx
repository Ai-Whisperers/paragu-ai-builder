import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { getSessionToken } from '@/lib/commerce/session'
import { getCartBySessionToken } from '@/lib/commerce/cart'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { OrderLookupForm } from '@/components/commerce/order-lookup-form'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Buscar mi orden',
  robots: { index: false, follow: false }, // shopper-utility, not for SEO
}

export default async function OrderLookupPage({
  params,
}: {
  params: Promise<{ site: string; locale: string }>
}) {
  const { site, locale } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  const sessionToken = await getSessionToken()
  const initialCart = sessionToken && business
    ? await getCartBySessionToken(business.id, sessionToken).catch(() => null)
    : null

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={initialCart} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-[color:var(--text,#111)]">Buscar mi orden</h1>
        <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
          Si perdiste el email de confirmación, ingresá el email que usaste y el número de orden y te llevamos al estado.
        </p>
        <OrderLookupForm siteSlug={site} locale={locale} />
      </main>
    </div>
  )
}
