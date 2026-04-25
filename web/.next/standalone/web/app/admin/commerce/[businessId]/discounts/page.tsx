import Link from 'next/link'
import { listDiscounts } from '@/lib/commerce/discounts-admin'
import { DiscountsManager } from '@/components/admin/commerce/discounts-manager'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function DiscountsPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  const discounts = await listDiscounts(businessId)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href={`/admin/commerce/${businessId}/products`} className="mb-4 inline-block text-sm text-[color:var(--primary,#111)] underline">
        ← Volver a productos
      </Link>
      <h1 className="mb-1 text-2xl font-bold">Códigos de descuento</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Creá cupones que el shopper aplica en el checkout. Podés ser porcentuales, monto fijo, o envío gratis.
      </p>
      <DiscountsManager businessId={businessId} initialDiscounts={discounts} />
    </div>
  )
}
