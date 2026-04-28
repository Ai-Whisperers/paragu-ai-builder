import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_UPDATE_FIELDS = [
  'name', 'tagline', 'phone', 'email', 'whatsapp', 'instagram',
  'facebook', 'address', 'neighborhood', 'city', 'hours',
] as const

export async function GET() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', session.businessId)
      .single()

    if (error || !business) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    return NextResponse.json({ business })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (key in body) {
        updates[key] = body[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'no_valid_fields' }, { status: 400 })
    }

    const { data: business, error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', session.businessId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 })
    }

    return NextResponse.json({ business })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
