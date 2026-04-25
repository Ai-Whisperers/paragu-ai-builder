import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params
  const admin = await checkAdmin()
  if (!admin.ok) return NextResponse.json({ error: admin.reason }, { status: admin.status })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lead_audit_log')
    .select('id, actor, field, old_value, new_value, created_at')
    .eq('lead_id', id)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    logger.warn('Audit load failed', { id, error: error.message })
    return NextResponse.json({ error: 'lookup_failed' }, { status: 500 })
  }

  return NextResponse.json({ entries: data ?? [] })
}
