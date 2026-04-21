import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { scopedQueries } from '@/lib/supabase/scoped'
import { logger } from '@/lib/logger'

/**
 * Shipping zone model — each zone defines a cost for shoppers whose shipping
 * address falls under its country/region coverage. `rules_json` is a tagged
 * union so the admin UI can support flat / weight / cart-total pricing
 * without separate tables.
 *
 * v1 supports { type: "flat", amountCents } only. weight/total variants are
 * shaped in the schema so adding them later is a 1-day PR, not a migration.
 */

export const FlatRuleSchema = z.object({
  type: z.literal('flat'),
  amountCents: z.number().int().nonnegative(),
})

export const CartTotalTierRuleSchema = z.object({
  type: z.literal('cart_total_tiers'),
  // Shipping cost by cart-total threshold. Lowest minSubtotalCents wins.
  tiers: z
    .array(
      z.object({
        minSubtotalCents: z.number().int().nonnegative(),
        amountCents: z.number().int().nonnegative(),
      }),
    )
    .min(1),
})

export const ShippingRuleSchema = z.discriminatedUnion('type', [
  FlatRuleSchema,
  CartTotalTierRuleSchema,
])
export type ShippingRule = z.infer<typeof ShippingRuleSchema>

export const ShippingZoneSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(1).max(200),
  countries: z.array(z.string().length(2)),
  regions: z.array(z.string()).nullable(),
  rules: ShippingRuleSchema,
  sortOrder: z.number().int(),
  status: z.enum(['active', 'archived']),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type ShippingZone = z.infer<typeof ShippingZoneSchema>

export const ShippingZoneInputSchema = z.object({
  name: z.string().min(1).max(200),
  countries: z.array(z.string().length(2)).min(1).default(['PY']),
  regions: z.array(z.string()).optional().nullable(),
  rules: ShippingRuleSchema,
  sortOrder: z.number().int().optional(),
  status: z.enum(['active', 'archived']).default('active'),
})
export type ShippingZoneInput = z.infer<typeof ShippingZoneInputSchema>

function rowToZone(row: Record<string, unknown>): ShippingZone {
  return {
    id: row.id as string,
    businessId: row.business_id as string,
    name: row.name as string,
    countries: (row.countries as string[]) ?? [],
    regions: (row.regions as string[] | null) ?? null,
    rules: row.rules_json as ShippingRule,
    sortOrder: (row.sort_order as number) ?? 0,
    status: row.status as ShippingZone['status'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function listShippingZones(businessId: string): Promise<ShippingZone[]> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data } = await scoped.select<Record<string, unknown>>('shipping_zones', '*', {
    filter: (q) => q.order('sort_order').order('name'),
  })
  return (Array.isArray(data) ? data : []).map(rowToZone)
}

export async function createShippingZone(
  businessId: string,
  input: ShippingZoneInput,
): Promise<ShippingZone> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const { data, error } = await scoped.insert<Record<string, unknown>>('shipping_zones', {
    name: input.name,
    countries: input.countries,
    regions: input.regions ?? null,
    rules_json: input.rules,
    sort_order: input.sortOrder ?? 0,
    status: input.status,
  })
  if (error || !data?.[0]) throw new Error(error?.message ?? 'zone_create_failed')
  return rowToZone(data[0])
}

export async function updateShippingZone(
  businessId: string,
  zoneId: string,
  patch: Partial<ShippingZoneInput>,
): Promise<ShippingZone> {
  const supabase = await createAdminClient()
  const scoped = scopedQueries(supabase, businessId)
  const dbPatch: Record<string, unknown> = {}
  if (patch.name !== undefined) dbPatch.name = patch.name
  if (patch.countries !== undefined) dbPatch.countries = patch.countries
  if (patch.regions !== undefined) dbPatch.regions = patch.regions
  if (patch.rules !== undefined) dbPatch.rules_json = patch.rules
  if (patch.sortOrder !== undefined) dbPatch.sort_order = patch.sortOrder
  if (patch.status !== undefined) dbPatch.status = patch.status

  const { data, error } = await scoped.update<Record<string, unknown>>(
    'shipping_zones',
    dbPatch,
    (q) => q.eq('id', zoneId),
  )
  if (error || !data?.[0]) throw new Error(error?.message ?? 'zone_update_failed')
  return rowToZone(data[0])
}

export async function deleteShippingZone(businessId: string, zoneId: string): Promise<void> {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('shipping_zones')
    .delete()
    .eq('id', zoneId)
    .eq('business_id', businessId)
  if (error) throw new Error(error.message)
}

/**
 * Pick the zone that matches a shipping address + compute shipping cost for
 * a given subtotal. Returns 0 cost if no zone matches (= free-by-default).
 * Used by checkout to fill order.shipping_cents.
 */
export async function quoteShippingForAddress(opts: {
  businessId: string
  country: string
  region?: string
  subtotalCents: number
}): Promise<{ zoneId: string | null; amountCents: number }> {
  const zones = await listShippingZones(opts.businessId)
  const active = zones.filter((z) => z.status === 'active')
  const matched = active.find((z) => {
    if (!z.countries.includes(opts.country.toUpperCase())) return false
    if (z.regions && z.regions.length > 0 && opts.region) {
      return z.regions.includes(opts.region)
    }
    return true
  })
  if (!matched) {
    logger.debug('[shipping] no zone matched — cost 0', { businessId: opts.businessId, country: opts.country })
    return { zoneId: null, amountCents: 0 }
  }

  const rule = matched.rules
  if (rule.type === 'flat') {
    return { zoneId: matched.id, amountCents: rule.amountCents }
  }
  if (rule.type === 'cart_total_tiers') {
    // Sort tiers ascending, pick the tier whose min is <= subtotal
    const sorted = [...rule.tiers].sort((a, b) => a.minSubtotalCents - b.minSubtotalCents)
    const applicable = sorted.filter((t) => t.minSubtotalCents <= opts.subtotalCents)
    const winner = applicable[applicable.length - 1] ?? sorted[0]
    return { zoneId: matched.id, amountCents: winner.amountCents }
  }
  return { zoneId: matched.id, amountCents: 0 }
}
