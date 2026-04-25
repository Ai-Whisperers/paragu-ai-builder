import { NextResponse } from 'next/server'
import { withRequestLog } from '@/lib/api/with-request-log'
import { requireAdminUser } from '@/lib/commerce/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { parseProductCsv } from '@/lib/commerce/csv-import'

export const runtime = 'nodejs'

/**
 * POST multipart/form-data { file, mode } — bulk product import.
 *   mode = "preview" → parse + validate only, return per-row results
 *   mode = "commit"  → parse + validate + batch-insert valid rows
 * Conflict handling: (business_id, slug) is unique, so duplicate rows
 * return a per-row error in the preview and are skipped on commit.
 */
export const POST = withRequestLog<{ businessId: string }>(async (req, { log }, { businessId }) => {
  const admin = await requireAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'invalid_multipart' }, { status: 400 })
  }
  const file = form.get('file')
  const mode = String(form.get('mode') ?? 'preview')
  if (!(file instanceof File)) return NextResponse.json({ error: 'missing_file' }, { status: 400 })
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: 'file_too_large' }, { status: 413 })

  const text = new TextDecoder('utf-8').decode(new Uint8Array(await file.arrayBuffer()))
  const { rows, headerWarnings } = parseProductCsv(text)

  const valid = rows.filter((r) => r.ok)
  const invalid = rows.filter((r) => !r.ok)

  const summary = {
    total: rows.length,
    valid: valid.length,
    invalid: invalid.length,
    headerWarnings,
  }

  if (mode === 'preview') {
    return NextResponse.json({ mode, summary, rows })
  }

  // Commit — batch insert via upsert on (business_id, slug) so re-runs
  // update instead of failing. ON CONFLICT uses the existing UNIQUE index.
  if (valid.length === 0) {
    return NextResponse.json({ mode: 'commit', summary, rows })
  }

  const supabase = await createAdminClient()
  const records = valid.map((r) => ({
    business_id: businessId,
    slug: r.data!.slug,
    name: r.data!.name,
    description: r.data!.description,
    category: r.data!.category,
    price_cents: r.data!.priceCents,
    compare_at_price_cents: r.data!.compareAtPriceCents,
    currency: 'PYG',
    sku: r.data!.sku,
    inventory_qty: r.data!.inventoryQty,
    inventory_policy: 'deny',
    images: r.data!.imageUrl
      ? [{ url: r.data!.imageUrl, alt: r.data!.name, isCover: true }]
      : [],
    status: r.data!.status,
    is_seed: false,
    metadata: {},
  }))

  const { data, error } = await supabase
    .from('products')
    .upsert(records, { onConflict: 'business_id,slug' })
    .select('id, slug')

  if (error) {
    log.error('admin.commerce.csv.upsert_failed', new Error(error.message))
    return NextResponse.json(
      { error: 'upsert_failed', message: error.message, summary },
      { status: 500 },
    )
  }

  log.info('admin.commerce.csv.imported', { businessId, count: data?.length ?? 0 })
  return NextResponse.json({
    mode: 'commit',
    summary: { ...summary, inserted: data?.length ?? 0 },
    rows,
  })
})
