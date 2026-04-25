import { createAdminClient } from '@/lib/supabase/admin'
import type { CommissionConfig } from '@/lib/payments/pagopar/commission'

/**
 * Loads the commission config for a business. Defaults to 5% / 0 flat / no
 * exemption if the business row lacks the columns (pre-migration rows) or
 * the lookup fails — fail-safe to "commission applies."
 */
export async function loadCommissionConfig(businessId: string): Promise<CommissionConfig> {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('businesses')
    .select('commission_percent, commission_flat_cents, commission_exempt_until')
    .eq('id', businessId)
    .maybeSingle()

  return {
    percent: typeof data?.commission_percent === 'number' ? data.commission_percent : 5,
    flatCents: typeof data?.commission_flat_cents === 'number' ? data.commission_flat_cents : 0,
    exemptUntil: data?.commission_exempt_until ? new Date(data.commission_exempt_until) : null,
  }
}
