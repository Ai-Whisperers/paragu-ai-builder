import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mapLeadToPreviewConfig } from '@/lib/generation/from-lead'
import { composePageForType } from '@/lib/engine/compose'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient('service_role')

    const { data: lead, error: leadErr } = await supabase.from('leads').select('*').eq('id', id).single()
    if (leadErr || !lead) {
      return NextResponse.json({ error: 'lead_not_found' }, { status: 404 })
    }

    const config = mapLeadToPreviewConfig(lead as unknown as Record<string, unknown>)

    const { error: bizErr } = await supabase.from('businesses').upsert({
      slug: config.siteSlug,
      lead_id: id,
      name: config.schema.businessName,
      type: config.businessType,
      phone: config.schema.contact.phone || null,
      email: config.schema.contact.email || null,
      whatsapp: config.schema.contact.whatsapp || null,
      city: (config.schema.location as Record<string, string> | undefined)?.city || 'Asunción',
      address: (config.schema.location as Record<string, string> | undefined)?.address || null,
      status: 'active',
      data_json: {
        tagline: `${config.schema.businessName} — Profesional`,
        services: config.schema.services || [],
        hours: config.schema.hours || {},
      },
    }).select().single()

    if (bizErr) {
      logger.error('[generate-preview] business upsert failed', { leadId: id, error: bizErr.message })
      return NextResponse.json({ error: 'business_creation_failed' }, { status: 500 })
    }

    await supabase.from('leads').update({ status: 'demo_ready' }).eq('id', id)

    const previewUrl = `/s/es/${config.siteSlug}`

    logger.info('[generate-preview] site created from lead', { leadId: id, slug: config.siteSlug, previewUrl })

    return NextResponse.json({
      ok: true,
      slug: config.siteSlug,
      previewUrl,
      verticalId: config.verticalId,
    })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
