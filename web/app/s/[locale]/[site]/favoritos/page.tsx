import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { getSessionToken } from '@/lib/commerce/session'
import { getCartBySessionToken } from '@/lib/commerce/cart'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { WishlistPageClient } from '@/components/commerce/wishlist-page-client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mis favoritos',
  robots: { index: false, follow: false }, // shopper-private utility
}

export default async function WishlistPage({
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
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} whatsappNumber={business.whatsappNumber} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-[color:var(--text,#111)]">Mis favoritos</h1>
        <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
          Los productos que guardás acá quedan en este navegador — nadie más los ve.
        </p>
        <WishlistPageClient siteSlug={site} locale={locale} />
      </main>
    </div>
  )
}
