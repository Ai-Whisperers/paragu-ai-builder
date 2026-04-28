import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await requireTenant()
    const body = await request.json()
    const { referredEmail, referredName } = body

    if (!referredEmail || !referredName) {
      return NextResponse.json({ error: 'email_and_name_required' }, { status: 400 })
    }

    const supabase = await createClient('service_role')

    const { data: existing } = await supabase
      .from('referral_codes')
      .select('id')
      .eq('referrer_business_id', session.businessId)
      .eq('referred_email', referredEmail.toLowerCase().trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'already_referred' }, { status: 409 })
    }

    const uniqueCode = `PA-${session.businessId.slice(0, 6)}-${Date.now().toString(36).toUpperCase()}`

    const { error } = await supabase.from('referral_codes').insert({
      referrer_business_id: session.businessId,
      referred_email: referredEmail.toLowerCase().trim(),
      referred_name: referredName,
      code: uniqueCode,
      status: 'pending',
    })

    if (error) {
      return NextResponse.json({ error: 'insert_failed', detail: error.message }, { status: 500 })
    }

    const shareLink = `https://paragu-ai.com?ref=${uniqueCode}`

    return NextResponse.json({ ok: true, code: uniqueCode, shareLink })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: referrals, error } = await supabase
      .from('referral_codes')
      .select('id, referred_name, referred_email, code, status, created_at, redeemed_at')
      .eq('referrer_business_id', session.businessId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'query_failed' }, { status: 500 })
    }

    return NextResponse.json({ referrals: referrals ?? [] })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
