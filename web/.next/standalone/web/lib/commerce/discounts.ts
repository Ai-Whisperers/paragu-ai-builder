import { createAdminClient } from '@/lib/supabase/admin'

interface DiscountRow {
  id: string
  business_id: string
  code: string
  type: 'percent' | 'fixed_amount' | 'free_shipping'
  value_cents: number | null
  value_percent: number | null
  min_subtotal_cents: number
  currency: string
  starts_at: string | null
  ends_at: string | null
  max_uses: number | null
  max_uses_per_customer: number | null
  uses_count: number
  status: string
}

export interface AppliedDiscount {
  valid: true
  discountId: string
  code: string
  discountCents: number
  freeShipping: boolean
}

export interface RejectedDiscount {
  valid: false
  reason:
    | 'not_found'
    | 'expired'
    | 'not_started'
    | 'min_subtotal'
    | 'usage_exceeded'
    | 'per_customer_exceeded'
    | 'paused'
}

export async function applyDiscount(opts: {
  businessId: string
  code: string
  subtotalCents: number
  customerEmail?: string
}): Promise<AppliedDiscount | RejectedDiscount> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('discounts')
    .select('*')
    .eq('business_id', opts.businessId)
    .eq('code', opts.code.trim().toUpperCase())
    .maybeSingle()

  if (!data) return { valid: false, reason: 'not_found' }
  const d = data as DiscountRow

  if (d.status !== 'active') return { valid: false, reason: 'paused' }

  const now = Date.now()
  if (d.starts_at && new Date(d.starts_at).getTime() > now) return { valid: false, reason: 'not_started' }
  if (d.ends_at && new Date(d.ends_at).getTime() < now) return { valid: false, reason: 'expired' }
  if (d.min_subtotal_cents && opts.subtotalCents < d.min_subtotal_cents) return { valid: false, reason: 'min_subtotal' }
  if (d.max_uses != null && d.uses_count >= d.max_uses) return { valid: false, reason: 'usage_exceeded' }

  if (opts.customerEmail && d.max_uses_per_customer) {
    const { count } = await supabase
      .from('discount_redemptions')
      .select('*', { count: 'exact', head: true })
      .eq('discount_id', d.id)
      .eq('customer_email', opts.customerEmail)
    if ((count ?? 0) >= d.max_uses_per_customer) {
      return { valid: false, reason: 'per_customer_exceeded' }
    }
  }

  let discountCents = 0
  let freeShipping = false
  if (d.type === 'percent' && d.value_percent != null) {
    discountCents = Math.round((opts.subtotalCents * d.value_percent) / 100)
  } else if (d.type === 'fixed_amount' && d.value_cents != null) {
    discountCents = Math.min(d.value_cents, opts.subtotalCents)
  } else if (d.type === 'free_shipping') {
    freeShipping = true
  }

  return { valid: true, discountId: d.id, code: d.code, discountCents, freeShipping }
}
