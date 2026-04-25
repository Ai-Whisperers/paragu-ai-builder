import { z } from 'zod'

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  productId: z.string().uuid(),
  authorName: z.string().min(1).max(80),
  authorEmail: z.string().email().nullable(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(160).nullable(),
  content: z.string().min(1).max(4000),
  isVerifiedPurchase: z.boolean(),
  isApproved: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Review = z.infer<typeof ReviewSchema>

export const ReviewCreateSchema = z.object({
  productId: z.string().uuid(),
  authorName: z.string().min(1).max(80),
  authorEmail: z.string().email().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(160).optional(),
  content: z.string().min(10).max(4000),
})
export type ReviewCreate = z.infer<typeof ReviewCreateSchema>

export interface ReviewAggregate {
  productId: string
  count: number
  avg: number
}
