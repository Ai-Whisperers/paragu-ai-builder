/**
 * Business Data Validation
 *
 * Validates business input data against Zod schemas that mirror the
 * BusinessData shape consumed by the composition engine.
 *
 * Failures are surfaced with field paths and values so log output is
 * immediately actionable (no "invalid input" black boxes).
 */

import { z, ZodError } from 'zod'
import { BUSINESS_TYPES } from '@/lib/types'
import { logger } from '@/lib/logger'

// Flat schema service (matches BusinessData['services']) — numeric duration only.
const serviceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string().optional(),
  priceFrom: z.string().optional(),
  duration: z.number().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
})

// Input schema service (admin API payloads) — accepts numeric minutes or
// human strings like "60 min" so legacy submissions don't hard-fail.
const serviceInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string().optional(),
  priceFrom: z.string().optional(),
  duration: z.union([z.string(), z.number()]).optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
})

const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  available: z.boolean().optional(),
})

const teamMemberSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  instagram: z.string().optional(),
})

const gallerySchema = z.object({
  src: z.string(),
  alt: z.string(),
  category: z.string().optional(),
})

const testimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
})

const classScheduleSchema = z.object({
  day: z.string(),
  classes: z.array(
    z.object({
      time: z.string(),
      name: z.string(),
      instructor: z.string().optional(),
      duration: z.number().optional(),
      spots: z.number().optional(),
    }),
  ),
})

const membershipPlanSchema = z.object({
  name: z.string(),
  price: z.string(),
  period: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()),
  popular: z.boolean().optional(),
  cta: z.string().optional(),
})

const featureSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
})

const processStepSchema = z.object({
  number: z.number(),
  title: z.string(),
  description: z.string(),
})

/**
 * Flat schema matching the BusinessData interface that the composition
 * engine consumes. Inputs from the admin API (with nested contact/location)
 * should use `inputBusinessSchema` below and be transformed before compose.
 */
export const businessDataSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  slug: z.string().min(1, 'Slug is required'),
  type: z.enum(BUSINESS_TYPES),
  tagline: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  hours: z.record(z.string(), z.string()).optional(),
  services: z.array(serviceSchema).optional(),
  products: z.array(productSchema).optional(),
  team: z.array(teamMemberSchema).optional(),
  gallery: z.array(gallerySchema).optional(),
  testimonials: z.array(testimonialSchema).optional(),
  heroImage: z.string().optional(),
  classSchedule: z.array(classScheduleSchema).optional(),
  membershipPlans: z.array(membershipPlanSchema).optional(),
  features: z.array(featureSchema).optional(),
  processSteps: z.array(processStepSchema).optional(),
})

export type ValidatedBusinessData = z.infer<typeof businessDataSchema>

/**
 * Input shape (nested contact/location) used by the admin API before
 * being flattened into BusinessData.
 */
export const inputBusinessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  slug: z.string().min(1, 'Slug is required').optional(),
  type: z.enum(BUSINESS_TYPES),
  tagline: z.string().optional(),
  ownerName: z.string().optional(),
  yearsInOperation: z.number().int().positive().optional(),
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      whatsapp: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
    })
    .optional(),
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
    googleMapsUrl: z.string().optional(),
  }),
  services: z.array(serviceInputSchema).optional(),
  products: z.array(productSchema).optional(),
  team: z.array(teamMemberSchema).optional(),
  gallery: z.array(gallerySchema).optional(),
  testimonials: z.array(testimonialSchema).optional(),
  heroImage: z.string().optional(),
  classSchedule: z.array(classScheduleSchema).optional(),
  membershipPlans: z.array(membershipPlanSchema).optional(),
  features: z.array(featureSchema).optional(),
  processSteps: z.array(processStepSchema).optional(),
})

export type BusinessInput = z.infer<typeof inputBusinessSchema>

// Kept for backwards compatibility with existing tests.
export const businessSchema = inputBusinessSchema

export interface ValidationIssue {
  path: string
  message: string
  code: string
  received?: unknown
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationIssue[]
}

function formatIssues(err: ZodError): ValidationIssue[] {
  return err.issues.map((i) => ({
    path: i.path.length === 0 ? '<root>' : i.path.join('.'),
    message: i.message,
    code: i.code,
    received: 'received' in i ? (i as { received: unknown }).received : undefined,
  }))
}

/**
 * Validate flat BusinessData (the shape compose() consumes).
 * Returns a structured result so callers can decide how to respond.
 */
export function validateBusinessData(
  data: unknown,
  context?: { businessSlug?: string; source?: string },
): ValidationResult<ValidatedBusinessData> {
  const parsed = businessDataSchema.safeParse(data)
  if (parsed.success) return { success: true, data: parsed.data }

  const errors = formatIssues(parsed.error)
  logger.warn('BusinessData validation failed', {
    action: 'validateBusinessData',
    businessSlug: context?.businessSlug,
    source: context?.source,
    issueCount: errors.length,
    issues: errors,
  })
  return { success: false, errors }
}

/**
 * Strict variant — throws a descriptive error if validation fails.
 * Use at pipeline boundaries where partial data is unacceptable.
 */
export function assertBusinessData(
  data: unknown,
  context?: { businessSlug?: string; source?: string },
): ValidatedBusinessData {
  const result = validateBusinessData(data, context)
  if (!result.success || !result.data) {
    const summary = (result.errors || [])
      .slice(0, 5)
      .map((e) => `${e.path}: ${e.message}`)
      .join('; ')
    throw new Error(`BusinessData validation failed: ${summary}`)
  }
  return result.data
}

/**
 * Legacy API — validates the nested input shape (contact/location objects).
 * Prefer validateBusinessData for new code.
 */
export function validateBusiness(data: unknown) {
  return inputBusinessSchema.safeParse(data)
}
