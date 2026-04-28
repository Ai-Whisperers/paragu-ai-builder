import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await requireTenant()
    const body = await request.json()
    const { score, feedback } = body

    if (score == null || score < 0 || score > 10) {
      return NextResponse.json({ error: 'score_0_to_10_required' }, { status: 400 })
    }

    const supabase = await createClient('service_role')

    await supabase.from('portal_notifications').insert({
      business_id: session.businessId,
      type: 'system',
      title: 'NPS Response',
      body: `Score: ${score}/10. Feedback: ${feedback || '—'}`,
    })

    const { error } = await supabase.from('nps_responses').insert({
      business_id: session.businessId,
      score,
      feedback: feedback || null,
      source: 'portal',
    })

    if (error) return NextResponse.json({ error: 'save_failed', detail: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
