/**
 * Business Data Validation
 *
 * Validates business input data against Zod schemas derived from
 * the JSON Schema definitions in src/schemas/.
 *
 * TODO: Implement Zod schemas that mirror the JSON Schema definitions
 *
 * Usage:
 * ```typescript
 * const result = validateBusiness(rawData)
 * if (!result.success) {
 *   console.error('Validation errors:', result.errors)
 * }
 * ```
 */

import { z } from 'zod'
import { BUSINESS_TYPES } from '@/lib/types'

export const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  type: z.enum(BUSINESS_TYPES),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }),
  location: z.object({
    address: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    googleMapsUrl: z.string().url().optional(),
  }),
  tagline: z.string().optional(),
  ownerName: z.string().optional(),
  yearsInOperation: z.number().int().positive().optional(),
  services: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string().optional(),
        duration: z.string().optional(),
      })
    )
    .optional(),
  team: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        bio: z.string().optional(),
        imageUrl: z.string().url().optional(),
      })
    )
    .optional(),
})

export type BusinessInput = z.infer<typeof businessSchema>

export function validateBusiness(data: unknown) {
  return businessSchema.safeParse(data)
}
