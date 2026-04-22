import { notFound } from 'next/navigation'
import Link from 'next/link'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { CommerceChrome } from '@/components/commerce/commerce-chrome'
import type { Locale } from '@/lib/i18n/config'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { CheckoutProgressIndicator } from '@/components/commerce/checkout-progress-indicator'
import { CartPageClient } from '@/components/commerce/cart-page-client'
import { getSessionToken } from '@/lib/commerce/session'
import { getCartBySessionToken } from '@/lib/commerce/cart'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // depends on the session cookie

export default async function CartPage({ params }: { params: Promise<{ site: string; locale: string }> }) {
  const { site, locale } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  // Server-load the current shopper's cart so SSR renders the items
  // directly. The relaxed hydrator (see PR #256 cart-store.ts change)
  // also protects against the null-wipe case, but loading here means
  // no flash of empty, and no dependence on client-side persist.
  const sessionToken = await getSessionToken()
  const initialCart = sessionToken
    ? await getCartBySessionToken(business.id, sessionToken).catch(() => null)
    : null

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={initialCart} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} whatsappNumber={business.whatsappNumber} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <CheckoutProgressIndicator current="cart" />
        <h1 className="mb-6 text-2xl font-bold">Tu carrito</h1>
        <CartPageClient
          siteSlug={site}
          locale={locale}
          whatsappNumber={business.whatsappNumber}
          businessName={business.name}
        />
        <div className="mt-6">
          <Link href={`/s/${locale}/${site}/tienda`} className="text-sm text-[color:var(--primary,#111)] underline">
            ← Seguir comprando
          </Link>
        </div>
      </main>
      <CommerceChrome siteSlug={site} locale={locale as Locale} />
    </div>
  )
}
