import { z } from 'zod'

export const PaymentProviderSchema = z.enum(['mercado_pago', 'bancard', 'manual'])
export type PaymentProvider = z.infer<typeof PaymentProviderSchema>

export const TransactionStatusSchema = z.enum([
  'created',
  'pending',
  'authorized',
  'approved',
  'in_process',
  'rejected',
  'refunded',
  'cancelled',
  'failed',
])
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>

export const StorefrontTransactionSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  orderId: z.string().uuid(),
  provider: PaymentProviderSchema,
  providerPaymentId: z.string().nullable(),
  providerPreferenceId: z.string().nullable(),
  status: TransactionStatusSchema,
  amountCents: z.number().int().nonnegative(),
  currency: z.string().length(3),
  rawPayload: z.record(z.unknown()),
  errorCode: z.string().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type StorefrontTransaction = z.infer<typeof StorefrontTransactionSchema>

// Mercado Pago webhook — only the fields we rely on.
// MP sends two shapes (IPN + Webhook v2); we accept both and normalize.
export const MpWebhookV2Schema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  type: z.string(),
  action: z.string().optional(),
  data: z.object({ id: z.union([z.string(), z.number()]).transform(String) }),
  date_created: z.string().optional(),
  live_mode: z.boolean().optional(),
})
export type MpWebhookV2 = z.infer<typeof MpWebhookV2Schema>

// MP payment resource (fetched by ID after webhook arrives).
export const MpPaymentResourceSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  status: z.string(),
  status_detail: z.string().optional(),
  transaction_amount: z.number(),
  currency_id: z.string(),
  external_reference: z.string().optional(),
  order: z.object({ id: z.union([z.string(), z.number()]).transform(String) }).optional(),
  payment_method_id: z.string().optional(),
  payer: z
    .object({
      email: z.string().email().optional(),
      identification: z.record(z.unknown()).optional(),
    })
    .optional(),
})
export type MpPaymentResource = z.infer<typeof MpPaymentResourceSchema>

// Map MP's status → our TransactionStatus (single source of truth).
export const MP_STATUS_MAP: Record<string, TransactionStatus> = {
  pending: 'pending',
  in_process: 'in_process',
  in_mediation: 'in_process',
  authorized: 'authorized',
  approved: 'approved',
  rejected: 'rejected',
  cancelled: 'cancelled',
  refunded: 'refunded',
  charged_back: 'refunded',
}
