import { z } from 'zod'

export const OrderStatusSchema = z.enum([
  'pending',
  'awaiting_payment',
  'paid',
  'failed',
  'cancelled',
  'refunded',
  'fulfilled',
  'shipped',
  'delivered',
])
export type OrderStatus = z.infer<typeof OrderStatusSchema>

export const ShippingAddressSchema = z.object({
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  department: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().length(2).default('PY'),
  references: z.string().max(500).optional(),
})
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

export const OrderItemSnapshotSchema = z.object({
  name: z.string(),
  sku: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  category: z.string().nullable().optional(),
})

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  productSnapshot: OrderItemSnapshotSchema,
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  lineTotalCents: z.number().int().nonnegative(),
})
export type OrderItem = z.infer<typeof OrderItemSchema>

export const OrderSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  orderNumber: z.string(),
  userId: z.string().uuid().nullable(),
  cartId: z.string().uuid().nullable(),
  status: OrderStatusSchema,
  subtotalCents: z.number().int().nonnegative(),
  shippingCents: z.number().int().nonnegative(),
  taxCents: z.number().int().nonnegative(),
  discountCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative(),
  currency: z.string().length(3),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  customerPhone: z.string().nullable(),
  shippingAddress: ShippingAddressSchema.nullable(),
  billingAddress: ShippingAddressSchema.nullable(),
  notes: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  placedAt: z.string().nullable(),
  paidAt: z.string().nullable(),
  shippedAt: z.string().nullable(),
  deliveredAt: z.string().nullable(),
  cancelledAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(OrderItemSchema).optional(),
})
export type Order = z.infer<typeof OrderSchema>

// Checkout input — what the customer POSTs to /api/[business]/checkout
export const CheckoutInputSchema = z.object({
  cartId: z.string().uuid(),
  customer: z.object({
    name: z.string().min(1).max(200),
    email: z.string().email(),
    phone: z.string().min(6).max(30).optional(),
  }),
  shipping: z.object({
    address: ShippingAddressSchema,
    methodId: z.string().optional(),
  }),
  notes: z.string().max(1000).optional(),
})
export type CheckoutInput = z.infer<typeof CheckoutInputSchema>
