import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import { logger } from '@/lib/logger'
import { assertTransition, timestampFieldFor } from './state-machine'
import type { CheckoutInput, Order, OrderItem, OrderStatus } from '@/lib/schemas/commerce/order'

export class CheckoutError extends Error {
  constructor(public code: string, message?: string) {
    super(message ?? code)
    this.name = 'CheckoutError'
  }
}

const PG_ERROR_CODE_MAP: Record<string, string> = {
  cart_not_found_or_closed: 'cart_not_found_or_closed',
  product_missing: 'product_missing',
  product_inactive: 'product_inactive',
  currency_mismatch: 'currency_mismatch',
  out_of_stock: 'out_of_stock',
  out_of_stock_race: 'out_of_stock',
  empty_cart: 'empty_cart',
}

export async function createOrder(
  businessId: string,
  input: CheckoutInput,
  opts: { userId?: string; shippingCents?: number; taxCents?: number; discountCents?: number } = {},
): Promise<string> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.rpc('create_order_txn', {
    p_business_id: businessId,
    p_cart_id: input.cartId,
    p_customer_email: input.customer.email,
    p_customer_name: input.customer.name,
    p_customer_phone: input.customer.phone ?? null,
    p_shipping_address: input.shipping.address,
    p_shipping_cents: opts.shippingCents ?? 0,
    p_tax_cents: opts.taxCents ?? 0,
    p_discount_cents: opts.discountCents ?? 0,
    p_user_id: opts.userId ?? null,
    p_notes: input.notes ?? null,
  })

  if (error) {
    const match = error.message.match(/^([a-z_]+)(?::(.+))?$/i)
    const code = match ? PG_ERROR_CODE_MAP[match[1]] ?? 'order_create_failed' : 'order_create_failed'
    logger.error('[commerce] createOrder failed', { action: 'commerce.order.create', businessId, code, error: error.message })
    throw new CheckoutError(code, error.message)
  }

  return data as string
}

export async function getOrder(businessId: string, orderId: string): Promise<Order> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data, error } = await scoped.select<Record<string, unknown>>('orders', '*', {
    filter: (q) => q.eq('id', orderId).limit(1),
  })
  const row = Array.isArray(data) ? data[0] : data
  if (error || !row) throw new CheckoutError('order_not_found')

  const { data: items } = await scoped.select<Record<string, unknown>>('order_items', '*', {
    filter: (q) => q.eq('order_id', orderId),
  })

  return rowToOrder(row, Array.isArray(items) ? items : [])
}

export async function transitionStatus(
  businessId: string,
  orderId: string,
  next: OrderStatus,
): Promise<void> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)

  const { data, error } = await scoped.select<{ status: string }>('orders', 'status', {
    filter: (q) => q.eq('id', orderId).limit(1),
  })
  const row = Array.isArray(data) ? data[0] : data
  if (error || !row) throw new CheckoutError('order_not_found')

  const current = row.status as OrderStatus
  if (current === next) return // idempotent
  assertTransition(current, next)

  const update: Record<string, unknown> = { status: next }
  const tsField = timestampFieldFor(next)
  if (tsField) update[tsField] = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('orders')
    .update(update)
    .eq('id', orderId)
    .eq('business_id', businessId)

  if (updateError) {
    logger.error('[commerce] transitionStatus failed', {
      action: 'commerce.order.transition',
      businessId,
      orderId,
      from: current,
      to: next,
      error: updateError.message,
    })
    throw new CheckoutError('order_update_failed', updateError.message)
  }

  logger.info('[commerce] order status changed', {
    action: 'commerce.order.state_changed',
    businessId,
    orderId,
    from: current,
    to: next,
  })
}

function rowToOrder(row: Record<string, unknown>, items: Record<string, unknown>[]): Order {
  return {
    id: row.id as string,
    businessId: row.business_id as string,
    orderNumber: row.order_number as string,
    userId: (row.user_id as string | null) ?? null,
    cartId: (row.cart_id as string | null) ?? null,
    status: row.status as OrderStatus,
    subtotalCents: row.subtotal_cents as number,
    shippingCents: row.shipping_cents as number,
    taxCents: row.tax_cents as number,
    discountCents: row.discount_cents as number,
    totalCents: row.total_cents as number,
    currency: row.currency as string,
    customerEmail: row.customer_email as string,
    customerName: row.customer_name as string,
    customerPhone: (row.customer_phone as string | null) ?? null,
    shippingAddress: (row.shipping_address as Order['shippingAddress']) ?? null,
    billingAddress: (row.billing_address as Order['billingAddress']) ?? null,
    notes: (row.notes as string | null) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    placedAt: (row.placed_at as string | null) ?? null,
    paidAt: (row.paid_at as string | null) ?? null,
    shippedAt: (row.shipped_at as string | null) ?? null,
    deliveredAt: (row.delivered_at as string | null) ?? null,
    cancelledAt: (row.cancelled_at as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    items: items.map(
      (it): OrderItem => ({
        id: it.id as string,
        orderId: it.order_id as string,
        productId: it.product_id as string,
        productSnapshot: it.product_snapshot as OrderItem['productSnapshot'],
        quantity: it.quantity as number,
        unitPriceCents: it.unit_price_cents as number,
        lineTotalCents: it.line_total_cents as number,
      }),
    ),
  }
}
