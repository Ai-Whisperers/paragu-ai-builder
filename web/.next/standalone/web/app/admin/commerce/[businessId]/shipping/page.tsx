import Link from 'next/link'
import { listShippingZones } from '@/lib/commerce/shipping-zones'
import { ShippingZonesManager } from '@/components/admin/commerce/shipping-zones-manager'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function ShippingZonesPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  const zones = await listShippingZones(businessId)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/admin" className="mb-4 inline-block text-sm text-[color:var(--primary,#111)] underline">
        ← Volver al panel
      </Link>
      <h1 className="mb-1 text-2xl font-bold">Zonas de envío</h1>
      <p className="mb-6 text-sm text-[color:var(--text-muted,#6b7280)]">
        Definí cuánto cobrás por envío según el país y la región del cliente. Cuando un shopper ingresa su dirección, el sistema elige la primera zona que coincida.
      </p>
      <ShippingZonesManager businessId={businessId} initialZones={zones} />
    </div>
  )
}
