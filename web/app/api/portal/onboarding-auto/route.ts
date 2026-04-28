import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mapLeadToPreviewConfig } from '@/lib/generation/from-lead'
import { triggerOnboardingSequence } from '@/lib/portal/onboarding-emails'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { businessName, businessType, phone, email, city, services, ownerName } = body

    if (!businessName || !businessType) {
      return NextResponse.json({ error: 'business_name_and_type_required' }, { status: 400 })
    }

    const supabase = await createClient('service_role')
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40)

    const { data: existing } = await supabase.from('businesses').select('id').eq('slug', slug).maybeSingle()
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug

    const { data: business, error: bizErr } = await supabase.from('businesses').insert({
      slug: finalSlug,
      name: businessName,
      type: businessType,
      phone: phone || null,
      email: email || null,
      whatsapp: phone || null,
      city: city || 'Asunción',
      status: 'active',
      data_json: {
        tagline: `${businessName} — Profesional en ${city || 'Asunción'}`,
        services: services || [],
        city: city || 'Asunción',
      },
    }).select().single()

    if (bizErr) {
      logger.error('[onboarding-auto] create failed', { error: bizErr.message })
      return NextResponse.json({ error: 'creation_failed' }, { status: 500 })
    }

    await supabase.from('subscriptions').insert({
      business_id: business.id,
      plan_tier: 'starter',
      plan_name: 'Starter',
      price_monthly: 150000,
      status: 'trialing',
      trial_ends_at: new Date(Date.now() + 90 * 86_400_000).toISOString(),
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    })

    if (email) {
      const name = ownerName || businessName
      await supabase.from('tenant_users').insert({
        business_id: business.id,
        email: email.toLowerCase().trim(),
        name,
        role: 'owner',
      }).catch(() => {})
    }

    await Promise.all([
      triggerOnboardingSequence(business.id).catch(() => {}),
      supabase.from('portal_notifications').insert({
        business_id: business.id,
        type: 'system',
        title: '¡Bienvenido a ParaguAI!',
        body: `Tu sitio ${businessName} está listo. Gestioná todo desde tu panel.`,
        action_url: `/dashboard/${finalSlug}`,
      }),
    ])

    logger.info('[onboarding-auto] client onboarded', { businessId: business.id, slug: finalSlug, type: businessType })

    return NextResponse.json({
      ok: true,
      slug: finalSlug,
      businessId: business.id,
      dashboardUrl: `/dashboard/${finalSlug}`,
      siteUrl: `/s/es/${finalSlug}`,
    })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
