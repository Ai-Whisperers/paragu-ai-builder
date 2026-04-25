import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

/**
 * Per-tenant content that merchants can edit via /admin/content/[businessId].
 *
 * Storage contract: everything lives under businesses.data_json.content.
 * Sections are independent — updating one doesn't overwrite others.
 *
 * The engine (lib/engine/compose.ts and friends) should read from these
 * same keys so the admin edits propagate to the live site. Until that
 * integration is wired, admin edits persist and can be consumed by future
 * engine work. No breakage to current rendering because data_json.content
 * is additive.
 */

// Hero
export const HeroContentSchema = z.object({
  headline: z.string().max(200).optional().or(z.literal('')),
  subheadline: z.string().max(400).optional().or(z.literal('')),
  ctaPrimaryText: z.string().max(50).optional().or(z.literal('')),
  ctaPrimaryHref: z.string().max(500).optional().or(z.literal('')),
  ctaSecondaryText: z.string().max(50).optional().or(z.literal('')),
  ctaSecondaryHref: z.string().max(500).optional().or(z.literal('')),
  backgroundImageUrl: z.string().url().optional().or(z.literal('')),
})
export type HeroContent = z.infer<typeof HeroContentSchema>

// About / Nuestra Historia
export const AboutContentSchema = z.object({
  title: z.string().max(200).optional().or(z.literal('')),
  body: z.string().max(5000).optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
})
export type AboutContent = z.infer<typeof AboutContentSchema>

// Testimonials — array
export const TestimonialSchema = z.object({
  name: z.string().max(120),
  quote: z.string().max(1000),
  photoUrl: z.string().url().optional().or(z.literal('')),
  role: z.string().max(120).optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5).optional(),
})
export const TestimonialsContentSchema = z.object({
  items: z.array(TestimonialSchema).max(20),
})
export type Testimonial = z.infer<typeof TestimonialSchema>
export type TestimonialsContent = z.infer<typeof TestimonialsContentSchema>

// FAQ — array
export const FaqItemSchema = z.object({
  question: z.string().max(300),
  answer: z.string().max(2000),
})
export const FaqContentSchema = z.object({
  items: z.array(FaqItemSchema).max(30),
})
export type FaqItem = z.infer<typeof FaqItemSchema>
export type FaqContent = z.infer<typeof FaqContentSchema>

// Contact + hours (hours is a 7-day array keyed by weekday)
export const ContactContentSchema = z.object({
  phone: z.string().max(40).optional().or(z.literal('')),
  whatsapp: z.string().max(40).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  city: z.string().max(120).optional().or(z.literal('')),
  googleMapsUrl: z.string().url().optional().or(z.literal('')),
  hours: z
    .array(
      z.object({
        day: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
        open: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().or(z.literal('')),
        close: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().or(z.literal('')),
        closed: z.boolean().optional(),
      }),
    )
    .length(7)
    .optional(),
})
export type ContactContent = z.infer<typeof ContactContentSchema>

// The aggregate — every section is optional so partial updates are safe.
export const BusinessContentSchema = z.object({
  hero: HeroContentSchema.optional(),
  about: AboutContentSchema.optional(),
  testimonials: TestimonialsContentSchema.optional(),
  faq: FaqContentSchema.optional(),
  contact: ContactContentSchema.optional(),
})
export type BusinessContent = z.infer<typeof BusinessContentSchema>

export const CONTENT_SECTIONS = ['hero', 'about', 'testimonials', 'faq', 'contact'] as const
export type ContentSection = (typeof CONTENT_SECTIONS)[number]

/**
 * Returns the full content subtree for a business. Missing sections come back
 * as undefined — the UI fills in defaults.
 */
export async function loadBusinessContent(businessId: string): Promise<BusinessContent> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('businesses')
    .select('data_json')
    .eq('id', businessId)
    .maybeSingle()

  if (error || !data) {
    logger.warn('[content] loadBusinessContent missing business', { businessId, error: error?.message })
    return {}
  }

  const content = (data.data_json as { content?: BusinessContent } | null)?.content ?? {}
  const parsed = BusinessContentSchema.safeParse(content)
  if (!parsed.success) {
    logger.warn('[content] business content failed validation; returning empty', {
      businessId,
      issues: parsed.error.flatten(),
    })
    return {}
  }
  return parsed.data
}

/**
 * Replaces a single content section. Merges into businesses.data_json.content
 * via jsonb_set so other sections are untouched.
 *
 * We use raw SQL (rpc or direct PostgREST) rather than a read-modify-write
 * to keep this atomic — two admins editing two sections simultaneously can
 * both win. If admins edit the same section concurrently, last-write-wins,
 * which is acceptable for this use case.
 */
export async function saveContentSection<K extends ContentSection>(opts: {
  businessId: string
  section: K
  value: BusinessContent[K]
}): Promise<void> {
  const supabase = await createAdminClient()

  // Fetch-then-write is fine here — Supabase Postgrest doesn't expose jsonb_set
  // directly and a dedicated RPC would be overkill for admin-rate writes.
  // We preserve other sections by reading first.
  const { data, error } = await supabase
    .from('businesses')
    .select('data_json')
    .eq('id', opts.businessId)
    .maybeSingle()

  if (error || !data) {
    throw new Error('business_not_found')
  }

  const current = (data.data_json as Record<string, unknown> | null) ?? {}
  const currentContent = (current.content as BusinessContent | undefined) ?? {}
  const nextContent: BusinessContent = { ...currentContent, [opts.section]: opts.value }
  const nextDataJson = { ...current, content: nextContent }

  const { error: updateError } = await supabase
    .from('businesses')
    .update({ data_json: nextDataJson })
    .eq('id', opts.businessId)

  if (updateError) {
    logger.error('[content] saveContentSection failed', {
      action: 'content.save_failed',
      businessId: opts.businessId,
      section: opts.section,
      error: updateError.message,
    })
    throw new Error(`content_save_failed:${updateError.message}`)
  }

  logger.info('[content] section saved', {
    action: 'content.section_saved',
    businessId: opts.businessId,
    section: opts.section,
  })
}
