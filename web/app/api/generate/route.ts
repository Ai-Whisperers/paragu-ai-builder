import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { composePageForType } from '@/lib/engine/compose'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { businessId, pageType = 'homepage' } = body

    if (!businessId) {
      return NextResponse.json({ error: 'Falta businessId' }, { status: 400 })
    }

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .eq('user_id', user.id)
      .single()

    if (businessError || !business) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
    }

    const businessData = {
      name: business.name,
      slug: business.slug,
      type: business.type,
      tagline: business.tagline,
      city: business.location?.city || 'Asuncion',
      neighborhood: business.location?.neighborhood,
      address: business.location?.address,
      phone: business.contact?.phone,
      email: business.contact?.email,
      whatsapp: business.contact?.whatsapp,
      instagram: business.contact?.instagram,
      facebook: business.contact?.facebook,
      googleMapsUrl: business.location?.google_maps_url,
      hours: business.hours,
      services: business.services,
      products: business.products,
      team: business.team,
      gallery: business.gallery,
      testimonials: business.testimonials,
      heroImage: business.hero_image,
    }

    const composed = await composePageForType(businessData, pageType)

    return NextResponse.json({
      success: true,
      business: business.slug,
      page: pageType,
      meta: composed.meta,
      sectionsCount: composed.sections.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[API/generate] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}