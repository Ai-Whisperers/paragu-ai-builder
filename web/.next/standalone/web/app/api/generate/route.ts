import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { composePageForType } from '@/lib/engine/compose'
import { validateBusinessData } from '@/lib/generation/validate'
import { withRequestLog } from '@/lib/api/with-request-log'

export const runtime = 'nodejs'

export const POST = withRequestLog(async (request, { log, perf, requestId }) => {
  const fail = (status: number, body: Record<string, unknown>) =>
    NextResponse.json({ ...body, requestId }, { status })

  const supabase = await createClient()
  perf.checkpoint('supabase-client')

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  perf.checkpoint('auth')
  if (authError || !user) {
    log.warn('Unauthorized /api/generate request', { error: authError?.message })
    return fail(401, { error: 'No autorizado' })
  }

  const body = await request.json()
  const { businessId, pageType = 'homepage' } = body

  if (!businessId) {
    log.warn('Missing businessId on /api/generate', { userId: user.id })
    return fail(400, { error: 'Falta businessId' })
  }

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .eq('user_id', user.id)
    .single()
  perf.checkpoint('business-fetch')

  if (businessError || !business) {
    log.warn('Business not found or not owned by user', {
      businessId,
      userId: user.id,
      error: businessError?.message,
    })
    return fail(404, { error: 'Negocio no encontrado' })
  }

  log.info('Composing page', { businessId, businessType: business.type, pageType })

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

  const validation = validateBusinessData(businessData, {
    businessSlug: business.slug,
    source: 'api/generate',
  })
  if (!validation.success) {
    return fail(422, {
      error: 'Datos del negocio invalidos',
      validationErrors: validation.errors,
    })
  }
  perf.checkpoint('validate')

  const composed = await composePageForType(validation.data!, pageType)
  perf.checkpoint('compose')
  const duration = perf.finish({ businessId, businessType: business.type, pageType })

  return NextResponse.json({
    success: true,
    business: business.slug,
    page: pageType,
    meta: composed.meta,
    sectionsCount: composed.sections.length,
    generatedAt: new Date().toISOString(),
    requestId,
    durationMs: duration,
  })
})
