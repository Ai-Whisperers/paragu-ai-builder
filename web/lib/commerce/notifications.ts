import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'
import { orderConfirmationEmail, orderPaidEmail, orderShippedEmail } from './email-templates'
import type { Order } from '@/lib/schemas/commerce/order'

type Template = 'order_confirmation' | 'order_paid' | 'order_shipped' | 'order_refunded' | 'low_stock_digest'

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
 * This keeps webhook responses fast and gives us a retry surface.
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
      logger.warn('[commerce] template not implemented', { template: opts.template })
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
