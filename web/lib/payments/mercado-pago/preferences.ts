import { mpFetch } from './client'
import type { Order } from '@/lib/schemas/commerce/order'

export interface MpPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

export async function createPreference(
  order: Order,
  opts: { returnBaseUrl: string; webhookUrl: string; idempotencyKey?: string },
): Promise<MpPreference> {
  if (!order.items || order.items.length === 0) {
    throw new Error('order_has_no_items')
  }

  // MP expects currency_id + unit_price as a decimal. PYG has no subunit,
  // so for Guaraní we send price_cents as-is (integer).
  const currency_id = order.currency.toUpperCase()
  const toUnit = (cents: number): number => (currency_id === 'PYG' ? cents : cents / 100)

  const payload = {
    items: order.items.map((it) => ({
      id: it.productId,
      title: it.productSnapshot.name,
      quantity: it.quantity,
      currency_id,
      unit_price: toUnit(it.unitPriceCents),
    })),
    payer: {
      email: order.customerEmail,
      name: order.customerName,
    },
    back_urls: {
      success: `${opts.returnBaseUrl}?status=success`,
      pending: `${opts.returnBaseUrl}?status=pending`,
      failure: `${opts.returnBaseUrl}?status=failure`,
    },
    auto_return: 'approved',
    external_reference: order.id,
    notification_url: opts.webhookUrl,
    statement_descriptor: 'PARAGU-AI',
    metadata: {
      order_id: order.id,
      order_number: order.orderNumber,
      business_id: order.businessId,
    },
  }

  return mpFetch<MpPreference>('/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify(payload),
    idempotencyKey: opts.idempotencyKey,
  })
}
