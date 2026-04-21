/**
 * POST /api/admin/tenants/[slug]/notes — append a tenant_notes row.
 *
 * Auth: presence of an authenticated session (middleware blocks anon).
 * TODO: gate by profiles.role='admin' once that table is introduced.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

const Schema = z.object({
  body: z.string().min(1).max(4000),
  pinned: z.boolean().optional().default(false),
})

export const POST = withRequestLog(async (req, { log }) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const slug = url.pathname.split('/').filter(Boolean).slice(-2, -1)[0]
  if (!slug) {
    return NextResponse.json({ error: 'missing slug' }, { status: 400 })
  }

  const parsed = Schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', detail: parsed.error.flatten() }, { status: 400 })
  }

  const { data: biz, error: lookupErr } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', slug)
    .single()
  if (lookupErr || !biz) {
    return NextResponse.json({ error: 'tenant not found', slug }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('tenant_notes')
    .insert({
      business_id: biz.id,
      body: parsed.data.body,
      pinned: parsed.data.pinned,
    })
    .select('id')
    .single()

  if (error) {
    log.error('admin.tenant_notes.insert_failed', new Error(error.message))
    return NextResponse.json({ error: 'insert_failed', detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data.id })
})
