/**
 * Seed list of Paraguayan cities with addressable market data.
 * Numbers are estimates from the leads dataset — refine as we collect more
 * granular data per vertical/city. Used by /c/[ciudad] SEO landings.
 */

export type City = {
  slug: string
  name: string
  /** Brief positioning line for the hero. */
  positioning: string
  /** Total mapped businesses across all verticals in this city. */
  businesses: number
  /** Approx % of those without a web presence. */
  noWebPct: number
  /** Verticals where we have particular density in this city. */
  topVerticals: readonly string[]
}

export const CITIES: readonly City[] = [
  {
    slug: 'asuncion',
    name: 'Asunción',
    positioning: 'Capital y centro económico del país: la mayor concentración de pequeños negocios.',
    businesses: 3200,
    noWebPct: 74,
    topVerticals: ['peluqueria', 'spa', 'gimnasio', 'restaurant', 'salon_belleza'],
  },
  {
    slug: 'ciudad-del-este',
    name: 'Ciudad del Este',
    positioning: 'Triple frontera y comercio internacional: alta rotación, decisiones rápidas.',
    businesses: 1100,
    noWebPct: 78,
    topVerticals: ['barberia', 'salon_belleza', 'gimnasio', 'tatuajes'],
  },
  {
    slug: 'encarnacion',
    name: 'Encarnación',
    positioning: 'Frontera con Argentina, segmento turístico fuerte sobre todo en verano.',
    businesses: 580,
    noWebPct: 76,
    topVerticals: ['spa', 'restaurant', 'peluqueria', 'estetica'],
  },
  {
    slug: 'luque',
    name: 'Luque',
    positioning: 'Crecimiento residencial y comercial sostenido en el área metropolitana.',
    businesses: 720,
    noWebPct: 79,
    topVerticals: ['peluqueria', 'gimnasio', 'unas', 'pestanas'],
  },
  {
    slug: 'san-lorenzo',
    name: 'San Lorenzo',
    positioning: 'Universitaria y comercial: mucho público joven con alto consumo digital.',
    businesses: 950,
    noWebPct: 75,
    topVerticals: ['barberia', 'gimnasio', 'tatuajes', 'estetica'],
  },
] as const

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug)
}
