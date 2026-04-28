import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await requireTenant()
    if (session.role !== 'owner') {
      return NextResponse.json({ error: 'forbidden_only_owner_can_invite' }, { status: 403 })
    }
    const body = await request.json()
    const { email, name, role } = body
    if (!email || !name) {
      return NextResponse.json({ error: 'email_and_name_required' }, { status: 400 })
    }
    const validRole = role === 'manager' ? 'manager' : 'manager'
    const supabase = await createClient('service_role')
    const { data: existing } = await supabase
      .from('tenant_users')
      .select('id')
      .eq('business_id', session.businessId)
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ error: 'user_already_invited' }, { status: 409 })
    }
    const { error: insertErr } = await supabase.from('tenant_users').insert({
      business_id: session.businessId,
      email: email.toLowerCase().trim(),
      name,
      role: validRole,
    })
    if (insertErr) {
      return NextResponse.json({ error: 'invite_failed', detail: insertErr.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')
    const { data: users, error } = await supabase
      .from('tenant_users')
      .select('id, email, name, role, last_login_at, invited_at')
      .eq('business_id', session.businessId)
      .order('created_at', { ascending: true })
    if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })
    return NextResponse.json({ users: users ?? [] })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
