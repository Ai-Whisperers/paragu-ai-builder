import { z } from 'zod'

export const PaymentProviderSchema = z.enum(['pagopar', 'bancard', 'dlocal', 'manual'])
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
  rawPayload: z.record(z.string(), z.unknown()),
  errorCode: z.string().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type StorefrontTransaction = z.infer<typeof StorefrontTransactionSchema>
