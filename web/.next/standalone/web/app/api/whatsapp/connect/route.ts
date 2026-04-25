import { NextRequest, NextResponse } from 'next/server'
import { createInstance } from '@/lib/integrations/whatsapp/evolution'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { businessId, businessName } = await request.json()

    if (!businessId || !businessName) {
      return NextResponse.json({ error: 'businessId and businessName required' }, { status: 400 })
    }

    const instanceName = `wa-${businessId.replace(/-/g, '').slice(0, 20)}`

    // Check if instance already exists
    const supabase = await createAdminClient()
    const { data: existing } = await supabase
      .from('businesses')
      .select('whatsapp_instance')
      .eq('id', businessId)
      .single()

    if (existing?.whatsapp_instance) {
      return NextResponse.json({ instance: existing.whatsapp_instance, message: 'Already connected' })
    }

    // Create instance on Evolution API
    const result = await createInstance(instanceName)

    if (result.error || !result.data) {
      return NextResponse.json({ error: result.error || 'Failed to create instance' }, { status: 500 })
    }

    // Save instance name to business record
    await supabase.from('businesses').update({ whatsapp_instance: instanceName }).eq('id', businessId)

    return NextResponse.json({
      instanceName,
      qrcode: result.data.qrcode,
      message: 'Scan the QR code with WhatsApp to connect',
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
