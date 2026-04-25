import { notFound } from 'next/navigation'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { CommerceChrome } from '@/components/commerce/commerce-chrome'
import type { Locale } from '@/lib/i18n/config'
import { CartStoreHydrator } from '@/components/commerce/cart-store-hydrator'
import { CheckoutForm } from '@/components/commerce/checkout-form'
import { CheckoutProgressIndicator } from '@/components/commerce/checkout-progress-indicator'
import { CheckoutTrustStrip } from '@/components/commerce/checkout-trust-strip'
import { CheckoutTracker } from '@/components/commerce/checkout-tracker'
import { getSessionToken } from '@/lib/commerce/session'
import { getCartBySessionToken } from '@/lib/commerce/cart'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // depends on the session cookie

export default async function CheckoutPage({ params }: { params: Promise<{ site: string; locale: string }> }) {
  const { site, locale } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  // Server-load the shopper's cart so the rendered form + hydrator agree
  // with the drawer. Passing `initialCart={null}` wipes the persisted
  // zustand cart on mount — which is how the "cart has items but
  // checkout says empty" regression happened. getSessionToken does not
  // create a new cookie; if there is no session yet, the cart is null
  // (which is correct — there's nothing to check out).
  const sessionToken = await getSessionToken()
  const initialCart = sessionToken
    ? await getCartBySessionToken(business.id, sessionToken).catch(() => null)
    : null

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CartStoreHydrator siteSlug={site} initialCart={initialCart} />
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} whatsappNumber={business.whatsappNumber} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <CheckoutProgressIndicator current="checkout" />
        <h1 className="mb-6 text-2xl font-bold">Finalizar compra</h1>
        <CheckoutTrustStrip />
        <CheckoutForm siteSlug={site} locale={locale} />
        <CheckoutTracker />
      </main>
      <CommerceChrome siteSlug={site} locale={locale as Locale} />
    </div>
  )
}
