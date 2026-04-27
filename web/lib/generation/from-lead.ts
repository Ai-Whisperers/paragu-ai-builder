/**
 * Stub for the lead → preview-site config mapper. The real implementation
 * was supposed to land alongside `app/api/leads/[id]/generate-preview`
 * (commit 34a5313, PR #150) but the module file was never committed,
 * leaving Main with a broken typecheck.
 *
 * This stub exposes the types the route needs and a throwing implementation
 * so the codebase compiles. The route itself is admin-only, so until a real
 * mapper lands the only effect is a 500 to an admin who tries to trigger it
 * — preferable to keeping Main red for everyone else.
 */

export interface BusinessSchema {
  businessName: string
  contact: {
    email?: string
    phone?: string
    whatsapp?: string
  }
  location?: Record<string, unknown>
  hours?: Record<string, unknown>
  seo?: Record<string, unknown>
}

export interface PreviewConfig {
  siteSlug: string
  verticalId: string
  businessType: 'gimnasio' | 'peluqueria' | string
  schema: BusinessSchema
  source: string
}

const TYPE_TO_VERTICAL: Record<string, string> = {
  peluqueria: 'beauty-personal-care',
  salon_belleza: 'beauty-personal-care',
  barberia: 'service-booking',
  gimnasio: 'sports-recreation',
  spa: 'health-wellness',
  depilacion: 'beauty-personal-care',
  maquillaje: 'portfolio-professional',
  estetica: 'beauty-personal-care',
  unas: 'beauty-personal-care',
  tatuajes: 'portfolio-professional',
  peluqueria_canina: 'pets-animals',
  masajes: 'health-wellness',
  yoga: 'sports-recreation',
  pilates: 'sports-recreation',
}

export function mapLeadToPreviewConfig(lead: Record<string, unknown>): PreviewConfig {
  const businessName = (lead.business_name as string) || 'Mi Negocio'
  const businessType = (lead.business_type as string) || 'peluqueria'
  const city = (lead.city as string) || 'Asunción'
  const phone = (lead.phone as string) || ''
  const whatsapp = (lead.whatsapp as string) || phone
  const instagram = (lead.instagram as string) || ''
  const address = (lead.address as string) || ''
  const coordinates = lead.coordinates as Record<string, number> | null
  const hours = lead.hours as Record<string, string> | null
  const yearsInOp = lead.years_in_operation as number | null
  const rating = lead.rating as number | null
  const reviewCount = lead.review_count as number | null

  const slug = `preview-${lead.id as string}`
  const verticalId = TYPE_TO_VERTICAL[businessType] || 'beauty-personal-care'

  const schema: BusinessSchema = {
    businessName,
    contact: {
      email: (lead.email as string) || '',
      phone,
      whatsapp,
    },
    location: {
      city,
      address,
      coordinates,
    },
    hours: hours || {},
    seo: {
      titleTemplate: `${businessName} — ${businessType.replace(/_/g, ' ')} en ${city}`,
      descriptionTemplate: `${businessName} en ${city}. ${businessType.replace(/_/g, ' ')} profesional con atención personalizada.`,
    },
  }

  const extended = schema as unknown as Record<string, unknown>
  if (instagram) {
    extended.instagram = instagram
  }
  if (yearsInOp) {
    extended.yearsInOperation = yearsInOp
  }
  if (rating) {
    extended.rating = rating
  }
  if (reviewCount) {
    extended.reviewCount = reviewCount
  }

  return {
    siteSlug: slug,
    verticalId,
    businessType,
    schema,
    source: 'lead_generation',
  }
}
