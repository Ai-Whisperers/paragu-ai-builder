import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import {
  orderConfirmationEmail,
  orderPaidEmail,
  orderShippedEmail,
  adminNewOrderEmail,
} from './email-templates'
import type { Order } from '@/lib/schemas/commerce/order'

type Template =
  | 'order_confirmation'
  | 'order_paid'
  | 'order_shipped'
  | 'order_refunded'
  | 'low_stock_digest'
  | 'admin_new_order'
  | 'admin_daily_digest'

interface EnqueueOpts {
  businessId: string
  businessName: string
  orderId?: string
  template: Template
  order: Order
  storeUrl: string
}

/**
 * Writes an email row to commerce_email_outbox. A separate cron job
 * (see /api/cron/commerce-email-flush) actually sends via Resend.
 * This keeps checkout/admin flows fast and gives us a retry surface.
 */
export async function enqueueOrderEmail(opts: EnqueueOpts): Promise<void> {
  const supabase = await createAdminClient()

  let rendered: { subject: string; html: string }
  switch (opts.template) {
    case 'order_confirmation':
      rendered = orderConfirmationEmail({ order: opts.order, businessName: opts.businessName, storeUrl: opts.storeUrl })
      break
    case 'order_paid':
      rendered = orderPaidEmail({ order: opts.order, businessName: opts.businessName, storeUrl: opts.storeUrl })
      break
    case 'order_shipped':
      rendered = orderShippedEmail({ order: opts.order, businessName: opts.businessName, storeUrl: opts.storeUrl })
      break
    default:
      logger.warn('[commerce] template not implemented for customer email', { template: opts.template })
      return
  }

  const { error } = await supabase.from('commerce_email_outbox').insert({
    business_id: opts.businessId,
    order_id: opts.orderId ?? null,
    template: opts.template,
    recipient_email: opts.order.customerEmail,
    subject: rendered.subject,
    html_body: rendered.html,
  })

  if (error) {
    logger.error('[commerce] outbox insert failed', {
      action: 'commerce.email.enqueue_failed',
      template: opts.template,
      error: error.message,
    })
  }
}

interface AdminEnqueueOpts {
  businessId: string
  businessName: string
  order: Order
  adminEmail: string
  adminDashboardUrl: string
}

/**
 * Enqueue a new-order notification for the merchant. Separate from
 * `enqueueOrderEmail` because the recipient + template are not tied to
 * the customer's email on the order. Silently no-ops when no admin
 * email is configured — we log a warning so the gap is visible in
 * prod logs without breaking the checkout flow.
 */
export async function enqueueAdminNewOrderEmail(opts: AdminEnqueueOpts): Promise<void> {
  if (!opts.adminEmail) {
    logger.warn('[commerce] admin new-order notification skipped: no admin_email configured', {
      action: 'commerce.admin_email.missing',
      businessId: opts.businessId,
      orderId: opts.order.id,
    })
    return
  }

  const rendered = adminNewOrderEmail({
    order: opts.order,
    businessName: opts.businessName,
    adminDashboardUrl: opts.adminDashboardUrl,
  })

  const supabase = await createAdminClient()
  const { error } = await supabase.from('commerce_email_outbox').insert({
    business_id: opts.businessId,
    order_id: opts.order.id,
    template: 'admin_new_order',
    recipient_email: opts.adminEmail,
    subject: rendered.subject,
    html_body: rendered.html,
  })

  if (error) {
    logger.error('[commerce] admin outbox insert failed', {
      action: 'commerce.admin_email.enqueue_failed',
      orderId: opts.order.id,
      error: error.message,
    })
  }
}

/**
 * Resolve the admin email for notifications. Priority:
 *   1. data_json.admin_email (explicit — set via ops)
 *   2. data_json.content.contact.email (tenant support email — in
 *      practice the same inbox for SMB tenants like fun4me)
 *
 * Returns null if neither is set. Callers should log + skip when null
 * rather than fail — missing admin email isn't a customer-visible failure.
 */
export function resolveAdminEmail(dataJson: unknown): string | null {
  if (!dataJson || typeof dataJson !== 'object') return null
  const j = dataJson as Record<string, unknown>
  const explicit = typeof j.admin_email === 'string' ? j.admin_email.trim() : ''
  if (explicit) return explicit
  const content = j.content as { contact?: { email?: string } } | undefined
  const fromContact = content?.contact?.email?.trim() ?? ''
  return fromContact || null
}
