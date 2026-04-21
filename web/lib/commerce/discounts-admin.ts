import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'

/**
 * Admin CRUD over the discounts table. The shopper-side applyDiscount lives
 * in /lib/commerce/discounts.ts; this module is the merchant-facing surface.
 */

export const DiscountTypeSchema = z.enum(['percent', 'fixed_amount', 'free_shipping'])
export type DiscountType = z.infer<typeof DiscountTypeSchema>

/**
 * Raw object schema without refinement — exported so callers that need
 * `.partial()` (PATCH routes) can derive a patch schema. Zod v4 rejects
 * `.partial()` on schemas that carry refinements, so we keep the refine
 * on DiscountInputSchema only (used for create/full-body validation).
 */
export const DiscountInputShape = z.object({
  code: z.string().trim().min(1).max(80).transform((s) => s.toUpperCase()),
  type: DiscountTypeSchema,
  valuePercent: z.number().min(0).max(100).nullable().optional(),
  valueCents: z.number().int().min(0).nullable().optional(),
  minSubtotalCents: z.number().int().min(0).default(0),
  currency: z.string().length(3).default('PYG'),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  maxUsesPerCustomer: z.number().int().min(1).default(1),
  status: z.enum(['active', 'paused', 'archived']).default('active'),
})

export const DiscountInputSchema = DiscountInputShape.refine(
  (d) => {
    if (d.type === 'percent') return typeof d.valuePercent === 'number' && d.valuePercent > 0
    if (d.type === 'fixed_amount') return typeof d.valueCents === 'number' && d.valueCents > 0
    return true // free_shipping needs no amount
  },
  { message: 'percent requires valuePercent; fixed_amount requires valueCents' },
)
export type DiscountInput = z.infer<typeof DiscountInputSchema>

export interface DiscountRecord {
  id: string
  businessId: string
  code: string
  type: DiscountType
  valuePercent: number | null
  valueCents: number | null
  minSubtotalCents: number
  currency: string
  startsAt: string | null
  endsAt: string | null
  maxUses: number | null
  maxUsesPerCustomer: number | null
  usesCount: number
  status: 'active' | 'paused' | 'archived'
  createdAt: string
  updatedAt: string
}

function rowToRecord(row: Record<string, unknown>): DiscountRecord {
  return {
    id: row.id as string,
    businessId: row.business_id as string,
    code: row.code as string,
    type: row.type as DiscountType,
    valuePercent: (row.value_percent as number | null) ?? null,
    valueCents: (row.value_cents as number | null) ?? null,
    minSubtotalCents: (row.min_subtotal_cents as number) ?? 0,
    currency: row.currency as string,
    startsAt: (row.starts_at as string | null) ?? null,
    endsAt: (row.ends_at as string | null) ?? null,
    maxUses: (row.max_uses as number | null) ?? null,
    maxUsesPerCustomer: (row.max_uses_per_customer as number | null) ?? null,
    usesCount: (row.uses_count as number) ?? 0,
    status: row.status as DiscountRecord['status'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function listDiscounts(businessId: string): Promise<DiscountRecord[]> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data } = await scoped.select<Record<string, unknown>>('discounts', '*', {
    filter: (q) => q.order('created_at', { ascending: false }),
  })
  return (Array.isArray(data) ? data : []).map(rowToRecord)
}

export async function createDiscount(businessId: string, input: DiscountInput): Promise<DiscountRecord> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data, error } = await scoped.insert<Record<string, unknown>>('discounts', {
    code: input.code,
    type: input.type,
    value_percent: input.valuePercent ?? null,
    value_cents: input.valueCents ?? null,
    min_subtotal_cents: input.minSubtotalCents,
    currency: input.currency,
    starts_at: input.startsAt ?? null,
    ends_at: input.endsAt ?? null,
    max_uses: input.maxUses ?? null,
    max_uses_per_customer: input.maxUsesPerCustomer,
    status: input.status,
  })
  if (error || !data?.[0]) {
    const pgCode = (error as { code?: string } | null)?.code
    if (pgCode === '23505' || (error?.message ?? '').includes('duplicate')) {
      throw new Error('code_already_exists')
    }
    throw new Error(error?.message ?? 'discount_create_failed')
  }
  return rowToRecord(data[0])
}

export async function updateDiscount(
  businessId: string,
  id: string,
  patch: Partial<DiscountInput>,
): Promise<DiscountRecord> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const dbPatch: Record<string, unknown> = {}
  if (patch.code !== undefined) dbPatch.code = patch.code.toUpperCase()
  if (patch.type !== undefined) dbPatch.type = patch.type
  if (patch.valuePercent !== undefined) dbPatch.value_percent = patch.valuePercent
  if (patch.valueCents !== undefined) dbPatch.value_cents = patch.valueCents
  if (patch.minSubtotalCents !== undefined) dbPatch.min_subtotal_cents = patch.minSubtotalCents
  if (patch.currency !== undefined) dbPatch.currency = patch.currency
  if (patch.startsAt !== undefined) dbPatch.starts_at = patch.startsAt
  if (patch.endsAt !== undefined) dbPatch.ends_at = patch.endsAt
  if (patch.maxUses !== undefined) dbPatch.max_uses = patch.maxUses
  if (patch.maxUsesPerCustomer !== undefined) dbPatch.max_uses_per_customer = patch.maxUsesPerCustomer
  if (patch.status !== undefined) dbPatch.status = patch.status

  const { data, error } = await scoped.update<Record<string, unknown>>(
    'discounts',
    dbPatch,
    (q) => q.eq('id', id),
  )
  if (error || !data?.[0]) throw new Error(error?.message ?? 'discount_update_failed')
  return rowToRecord(data[0])
}

export async function deleteDiscount(businessId: string, id: string): Promise<void> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('discounts')
    .delete()
    .eq('id', id)
    .eq('business_id', businessId)
  if (error) throw new Error(error.message)
}
