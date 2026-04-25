import { z } from 'zod'

export const CartStatusSchema = z.enum([
  'open',
  'checkout',
  'converted',
  'abandoned',
  'expired',
])
export type CartStatus = z.infer<typeof CartStatusSchema>

export const CartItemSchema = z.object({
  id: z.string().uuid(),
  cartId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  createdAt: z.string(),
  /**
   * Product display fields joined in at read time. Optional because older
   * clients / older stored payloads may not include them; callers must
   * fall back to a sensible default when null.
   */
  productName: z.string().nullable().optional(),
  productSlug: z.string().nullable().optional(),
  productImageUrl: z.string().nullable().optional(),
})
export type CartItem = z.infer<typeof CartItemSchema>

export const CartSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  sessionToken: z.string().nullable(),
  status: CartStatusSchema,
  currency: z.string().length(3),
  expiresAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(CartItemSchema),
})
export type Cart = z.infer<typeof CartSchema>

export const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(99),
})
export type AddToCartInput = z.infer<typeof AddToCartSchema>

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().nonnegative().max(99),
})
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>

export const CartTotalsSchema = z.object({
  subtotalCents: z.number().int().nonnegative(),
  itemCount: z.number().int().nonnegative(),
  currency: z.string().length(3),
})
export type CartTotals = z.infer<typeof CartTotalsSchema>
