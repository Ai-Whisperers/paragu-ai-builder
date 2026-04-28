export interface BusinessSchema {
  businessName: string
  contact: { email?: string; phone?: string; whatsapp?: string }
  location?: Record<string, unknown>
  hours?: Record<string, unknown>
  seo?: Record<string, unknown>
  services?: Array<{ name: string; price?: string; duration?: number; description?: string }>
  team?: Array<{ name: string; role?: string; bio?: string }>
  gallery?: string[]
  testimonials?: Array<{ quote: string; author: string; rating?: number }>
}

export interface PreviewConfig {
  siteSlug: string
  verticalId: string
  businessType: string
  schema: BusinessSchema
  source: string
}

const TYPE_TO_VERTICAL: Record<string, string> = {
  peluqueria: 'beauty-personal-care', salon_belleza: 'beauty-personal-care',
  barberia: 'service-booking', gimnasio: 'sports-recreation',
  spa: 'health-wellness', depilacion: 'beauty-personal-care',
  maquillaje: 'portfolio-professional', estetica: 'beauty-personal-care',
  unas: 'beauty-personal-care', tatuajes: 'portfolio-professional',
  peluqueria_canina: 'pets-animals', masajes: 'health-wellness',
  yoga: 'sports-recreation', pilates: 'sports-recreation',
  restaurant: 'food-beverage', cafeteria: 'food-beverage',
  panaderia: 'food-beverage', parrilla: 'food-beverage',
  pizzeria: 'food-beverage', taller_mecanico: 'automotive',
  gomeria: 'automotive', lavadero_autos: 'automotive',
  ferreteria: 'retail-local', farmacia: 'health-wellness',
  carniceria: 'retail-local', bodega_corner_store: 'retail-local',
  inmobiliaria: 'real-estate-relocation', contador: 'b2b-professional',
  electricista: 'trades-home-services', plomero: 'trades-home-services',
  cerrajero: 'trades-home-services', herreria: 'trades-home-services',
  veterinaria: 'pets-animals', clinica_integral: 'health-wellness',
  consultorio_odontologico: 'health-wellness', psicologia: 'health-wellness',
  educacion: 'education-training', consultoria: 'b2b-professional',
  diseno_grafico: 'portfolio-professional',
}

export function mapLeadToPreviewConfig(lead: Record<string, unknown>): PreviewConfig {
  const businessName = (lead.business_name as string) || 'Mi Negocio'
  const businessType = (lead.business_type as string) || 'peluqueria'
  const city = (lead.city as string) || 'Asunción'
  const phone = (lead.phone as string) || ''
  const whatsapp = (lead.whatsapp as string) || phone
  const instagram = (lead.instagram as string) || ''
  const address = (lead.address as string) || ''
  const hours = lead.hours as Record<string, string> | null

  const slug = `demo-${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40)}`
  const verticalId = TYPE_TO_VERTICAL[businessType] || 'beauty-personal-care'

  const services = (lead.services as Array<Record<string, unknown>>) || []
  const mappedServices = services.map((s) => ({
    name: (s.name as string) || '',
    price: s.price as string,
    duration: s.duration as number,
    description: s.description as string,
  }))

  const schema: BusinessSchema = {
    businessName,
    contact: { email: (lead.email as string) || '', phone, whatsapp },
    location: { city, address },
    hours: hours || {},
    seo: {
      titleTemplate: `${businessName} — ${businessType.replace(/_/g, ' ')} en ${city}`,
      descriptionTemplate: `${businessName} en ${city}. Profesional con atención personalizada.`,
    },
  }

  if (mappedServices.length > 0) schema.services = mappedServices
  if (instagram) (schema as unknown as Record<string, unknown>).instagram = instagram

  return { siteSlug: slug, verticalId, businessType, schema, source: 'lead_generation' }
}
