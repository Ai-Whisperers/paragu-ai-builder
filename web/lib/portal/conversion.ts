import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { sendOnboardingWelcome } from './whatsapp-notify'

export async function handleLeadConversion(leadId: string): Promise<void> {
  const supabase = await createClient('service_role')

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (!lead) {
    logger.warn('[conversion] lead not found', { leadId })
    return
  }

  const slug = lead.slug || lead.business_name.toLowerCase().replace(/[^a-z0-9]/g, '-')

  const { data: business, error: bizErr } = await supabase
    .from('businesses')
    .insert({
      lead_id: leadId,
      slug,
      name: lead.business_name,
      type: lead.business_type || 'unknown',
      phone: lead.phone,
      email: lead.email,
      whatsapp: lead.whatsapp || lead.phone,
      city: lead.city || 'Asunción',
      address: lead.address,
      neighborhood: lead.neighborhood,
      status: 'active',
      data_json: {
        tagline: `${lead.business_name} — Profesional en ${lead.city || 'Asunción'}`,
        city: lead.city || 'Asunción',
      },
    })
    .select()
    .single()

  if (bizErr || !business) {
    logger.error('[conversion] business creation failed', { leadId, error: bizErr?.message })
    return
  }

  await supabase.from('subscriptions').insert({
    business_id: business.id,
    lead_id: leadId,
    plan_tier: 'starter',
    plan_name: 'Starter',
    price_monthly: 150000,
    status: 'trialing',
    trial_ends_at: new Date(Date.now() + 90 * 86_400_000).toISOString(),
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 86_400_000).toISOString(),
  })

  const ownerName = lead.business_name.split(' ')[0] || 'Cliente'
  if (lead.whatsapp) {
    try {
      await sendOnboardingWelcome(business.id, lead.whatsapp, ownerName)
    } catch (err) {
      logger.warn('[conversion] welcome message failed', { error: String(err) })
    }
  }

  await supabase.from('portal_notifications').insert({
    business_id: business.id,
    type: 'system',
    title: 'Bienvenido a Paragu-AI',
    body: `Tu sitio ${business.name} está listo. Gestioná tu contenido desde el panel de control.`,
    action_url: `/dashboard/${business.slug}`,
  })

  await supabase.from('outreach_events').insert({
    lead_id: leadId,
    event_type: 'onboarding_completed',
    channel: 'whatsapp',
  })

  await supabase.from('leads').update({ status: 'paying' }).eq('id', leadId)

  logger.info('[conversion] lead converted to business', { leadId, businessId: business.id, slug })
}
