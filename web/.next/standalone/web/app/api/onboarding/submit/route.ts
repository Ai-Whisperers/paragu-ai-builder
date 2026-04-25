import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, businessName, phone, whatsapp, email, address, city, instagram, services, hours } = body

    if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

    const supabase = await createAdminClient()

    // Find the lead by onboarding token
    const { data: ot } = await supabase.from('onboarding_tokens').select('lead_id').eq('token', token).single()

    if (ot) {
      // Update lead with collected data
      await supabase.from('leads').update({
        collected_data: { businessName, phone, whatsapp, email, address, city, instagram, services, hours },
        status: 'onboarding',
      }).eq('id', ot.lead_id)

      // Mark token as used
      await supabase.from('onboarding_tokens').update({ used: true, used_at: new Date().toISOString() }).eq('token', token)
    } else {
      // No token found - store anyway as a new lead
      await supabase.from('leads').insert({
        business_name: businessName,
        phone, email, city,
        status: 'onboarding',
        source: 'onboarding_form',
      })
    }

    logger.info('Onboarding submitted', { businessName, city })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Onboarding submission error', { error: String(error) })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
