import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

export type InventoryReason = 'order' | 'refund' | 'manual_adjust' | 'return' | 'damage' | 'initial'

/**
 * Writes an inventory_logs row AND adjusts products.inventory_qty in a single
 * DB round-trip. The adjust_inventory PL/pgSQL function enforces the 'deny'
 * policy atomically (FOR UPDATE lock), so oversell races are impossible.
 *
 * Throws 'out_of_stock' if a deny-policy product would go negative.
 * Throws 'product_not_found' if the product is missing or wrong business.
 */
export async function applyInventoryDelta(opts: {
  businessId: string
  productId: string
  delta: number
  reason: InventoryReason
  referenceType?: string
  referenceId?: string
  note?: string
}): Promise<number> {
  const supabase = await createAdminClient()

  const { data: newQty, error: adjustError } = await supabase.rpc('adjust_inventory', {
    p_business_id: opts.businessId,
    p_product_id: opts.productId,
    p_delta: opts.delta,
  })

  if (adjustError) {
    const msg = adjustError.message
    if (msg.includes('out_of_stock')) throw new Error('out_of_stock')
    if (msg.includes('product_not_found')) throw new Error('product_not_found')
    logger.error('[commerce] inventory adjust failed', {
      action: 'commerce.inventory.adjust_failed',
      productId: opts.productId,
      error: msg,
    })
    throw new Error('inventory_adjust_failed')
  }

  // Audit log — best-effort, doesn't gate the stock change (already committed).
  const { error: logError } = await supabase.from('inventory_logs').insert({
    business_id: opts.businessId,
    product_id: opts.productId,
    delta: opts.delta,
    reason: opts.reason,
    reference_type: opts.referenceType ?? null,
    reference_id: opts.referenceId ?? null,
    note: opts.note ?? null,
  })
  if (logError) {
    logger.warn('[commerce] inventory log insert failed (stock change already committed)', {
      action: 'commerce.inventory.log_write_failed',
      productId: opts.productId,
      error: logError.message,
    })
  }

  return newQty as number
}
