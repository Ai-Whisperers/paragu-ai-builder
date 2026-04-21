import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const PutSchema = z.object({
  commissionPercent: z.number().min(0).max(100),
  commissionFlatCents: z.number().int().nonnegative().max(100_000_000),
  commissionExemptUntil: z
    .union([z.string().datetime(), z.null()])
    .optional(),
})

export const GET = withRequestLog<{ businessId: string }>(async (_req, _ctx, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('businesses')
    .select('id, slug, name, commission_percent, commission_flat_cents, commission_exempt_until')
    .eq('id', businessId)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({
    businessId: data.id,
    slug: data.slug,
    name: data.name,
    commissionPercent: data.commission_percent,
    commissionFlatCents: data.commission_flat_cents,
    commissionExemptUntil: data.commission_exempt_until,
  })
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

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('businesses')
    .update({
      commission_percent: parsed.data.commissionPercent,
      commission_flat_cents: parsed.data.commissionFlatCents,
      commission_exempt_until: parsed.data.commissionExemptUntil ?? null,
    })
    .eq('id', businessId)

  if (error) {
    log.error('admin.commerce.commission.update_failed', new Error(error.message))
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  log.info('admin.commerce.commission.updated', {
    businessId,
    percent: parsed.data.commissionPercent,
    flatCents: parsed.data.commissionFlatCents,
    exemptUntil: parsed.data.commissionExemptUntil,
  })

  return NextResponse.json({ ok: true })
})
