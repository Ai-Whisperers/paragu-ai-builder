import { notFound } from 'next/navigation'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { getOrder, CheckoutError } from '@/lib/commerce/orders'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { OrderConfirmation } from '@/components/commerce/order-confirmation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ site: string; id: string }>
  searchParams: Promise<{ status?: string }>
}) {
  const { site, id } = await params
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
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CommerceHeader siteSlug={site} businessName={business.name} />
      <OrderConfirmation siteSlug={site} initialOrder={order} initialStatus={initial} />
    </div>
  )
}
