import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import {
  upsertCredentials,
  listCredentialsForBusiness,
  deleteCredentials,
} from '@/lib/commerce/payment-credentials'
import { PaymentProviderSchema } from '@/lib/schemas/commerce/transaction'

export const runtime = 'nodejs'

const PutSchema = z.object({
  provider: PaymentProviderSchema,
  // secrets is a free-form key/value map; provider-specific shape is
  // validated in the UI form. Empty values get filtered out so a partial
  // update doesn't accidentally wipe a token.
  secrets: z.record(z.string(), z.string().min(1)),
  publicConfig: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(['active', 'paused', 'archived']).optional(),
})

const DeleteSchema = z.object({
  provider: PaymentProviderSchema,
})

export const GET = withRequestLog<{ businessId: string }>(async (_req, _ctx, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const credentials = await listCredentialsForBusiness(businessId)
  return NextResponse.json({ credentials })
})

export const PUT = withRequestLog<{ businessId: string }>(async (req, { log }, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = PutSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const record = await upsertCredentials({ businessId, ...parsed.data })
    log.info('admin.commerce.credentials.upserted', { businessId, provider: parsed.data.provider })
    return NextResponse.json({ credential: record })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'upsert_failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
})

export const DELETE = withRequestLog<{ businessId: string }>(async (req, { log }, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = DeleteSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 400 })
  }

  try {
    await deleteCredentials(businessId, parsed.data.provider)
    log.info('admin.commerce.credentials.deleted', { businessId, provider: parsed.data.provider })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'delete_failed' }, { status: 500 })
  }
})
