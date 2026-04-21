import { notFound } from 'next/navigation'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { getOrder, CheckoutError } from '@/lib/commerce/orders'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { OrderConfirmation } from '@/components/commerce/order-confirmation'
import { PurchaseTracker } from '@/components/commerce/purchase-tracker'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ site: string; locale: string; id: string }>
  searchParams: Promise<{ status?: string }>
}) {
  const { site, locale, id } = await params
  const { status } = await searchParams
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  let order
  try {
    order = await getOrder(business.id, id)
  } catch (err) {
    if (err instanceof CheckoutError && err.code === 'order_not_found') notFound()
    throw err
  }

  const initial = status === 'success' || status === 'pending' || status === 'failure' ? status : null

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)] print:bg-white">
      <div className="print:hidden">
        <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />
      </div>
      <OrderConfirmation siteSlug={site} locale={locale} businessName={business.name} initialOrder={order} initialStatus={initial} />
      <PurchaseTracker order={order} />
    </div>
  )
}
