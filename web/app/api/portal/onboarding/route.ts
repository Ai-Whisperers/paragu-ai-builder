import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { sendOnboardingWelcome } from '@/lib/portal/whatsapp-notify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')

    const { data: business } = await supabase
      .from('businesses')
      .select('name, whatsapp, slug, id')
      .eq('id', session.businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    if (business.whatsapp) {
      await sendOnboardingWelcome(business.id, business.whatsapp, session.name)
    }

    await supabase.from('portal_notifications').insert({
      business_id: business.id,
      type: 'system',
      title: '¡Bienvenido a Paragu-AI!',
      body: `Tu sitio ${business.name} está listo. Gestioná tu contenido, reservas y pedidos desde el panel.`,
      action_url: `/dashboard/${business.slug}`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
