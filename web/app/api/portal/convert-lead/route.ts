import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { handleLeadConversion } from '@/lib/portal/conversion'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await requireTenant()
    if (session.role !== 'owner') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { leadId } = body
    if (!leadId) {
      return NextResponse.json({ error: 'lead_id_required' }, { status: 400 })
    }

    await handleLeadConversion(leadId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
