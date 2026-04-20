import { z } from 'zod'

export const ProductImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  isCover: z.boolean().optional(),
})
export type ProductImage = z.infer<typeof ProductImageSchema>

export const ProductStatusSchema = z.enum(['active', 'draft', 'archived'])
export type ProductStatus = z.infer<typeof ProductStatusSchema>

export const InventoryPolicySchema = z.enum(['deny', 'continue'])
export type InventoryPolicy = z.infer<typeof InventoryPolicySchema>

export const ProductSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  description: z.string().max(5000).nullable(),
  category: z.string().max(80).nullable(),
  priceCents: z.number().int().nonnegative(),
  compareAtPriceCents: z.number().int().nonnegative().nullable(),
  currency: z.string().length(3),
  sku: z.string().max(80).nullable(),
  inventoryQty: z.number().int(),
  inventoryPolicy: InventoryPolicySchema,
  lowStockThreshold: z.number().int().nonnegative().nullable(),
  images: z.array(ProductImageSchema),
  weightGrams: z.number().int().positive().nullable(),
  status: ProductStatusSchema,
  isSeed: z.boolean(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Product = z.infer<typeof ProductSchema>

export const ProductCreateSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, 'slug_invalid'),
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  category: z.string().max(80).optional(),
  priceCents: z.number().int().nonnegative(),
  compareAtPriceCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('PYG'),
  sku: z.string().max(80).optional(),
  inventoryQty: z.number().int().nonnegative().default(0),
  inventoryPolicy: InventoryPolicySchema.default('deny'),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  images: z.array(ProductImageSchema).max(8).default([]),
  weightGrams: z.number().int().positive().optional(),
  status: ProductStatusSchema.default('draft'),
  metadata: z.record(z.string(), z.unknown()).default({}),
})
export type ProductCreate = z.infer<typeof ProductCreateSchema>

export const ProductUpdateSchema = ProductCreateSchema.partial()
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>
