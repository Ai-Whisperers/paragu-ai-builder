/**
 * Long-form case study content for /casos/[cliente].
 * Slugs match REAL_CLIENTS in marketing-data.ts.
 */

export type CaseStudy = {
  slug: string
  /** Short label shown in the hero kicker. */
  vertical: string
  /** Hero headline — story-shaped, not feature-shaped. */
  headline: string
  /** Hero lead paragraph. */
  lead: string
  /** Year/period the work happened. */
  period: string
  /** What measurable outcome shipped. */
  outcomes: readonly string[]
  /** What was challenging — sets up the solution. */
  challenge: string
  /** How we solved it. */
  approach: string
  /** Live URL (could be local /[business] or absolute). */
  liveUrl: string
}

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: 'nexa-paraguay',
    vertical: 'Reubicación · 4 idiomas',
    headline: 'Nexa Paraguay: un sitio multi-idioma para clientes europeos en 2 semanas',
    lead:
      'Nexa ayuda a familias europeas a mudarse a Paraguay. Necesitaban un sitio profesional en 4 idiomas (ES/EN/DE/NL) que transmitiera seriedad ante clientes que evalúan trasladar su vida.',
    period: '2026 · Q1',
    outcomes: [
      '4 idiomas activos desde el primer día (ES/EN/DE/NL)',
      'Sitio replicado para Nexa Uruguay en cuestión de días',
      'Sin permanencia con un proveedor — la infraestructura es propia',
    ],
    challenge:
      'Las agencias web locales cotizaban entre 3 y 6 meses para un sitio multi-idioma. Para Nexa, eso significaba perder un trimestre completo de leads europeos.',
    approach:
      'Reusamos la arquitectura multi-tenant de ParaguAI para servir cuatro locales desde un solo despliegue. El equipo de Nexa entregó copy en cada idioma; nosotros publicamos en menos de dos semanas, dominio y certificados incluidos.',
    liveUrl: '/s/es/nexa-paraguay',
  },
  {
    slug: 'nexa-propiedades',
    vertical: 'Real estate · 3 idiomas',
    headline: 'Nexa Propiedades: extender la marca Nexa al mercado inmobiliario residencial',
    lead:
      'Cuando Nexa decidió ofrecer propiedades a sus clientes europeos, necesitaban un brazo dedicado a inmobiliaria — sin dejar de aprovechar la marca y la audiencia que ya tenían.',
    period: '2026 · Q1',
    outcomes: [
      'Listado de propiedades actualizable sin tocar código',
      'Misma identidad visual que el resto de marcas Nexa',
      'Contacto directo por WhatsApp en cada propiedad',
    ],
    challenge:
      'El equipo necesitaba autonomía para subir y bajar propiedades sin depender de un desarrollador, manteniendo el estándar visual de la marca.',
    approach:
      'Configuramos un panel donde el equipo de Nexa carga propiedades con fotos, precios y ubicación. Los listings se renderizan con el mismo motor de plantillas que el resto de los sitios Nexa.',
    liveUrl: '/s/es/nexa-paraguay',
  },
  {
    slug: 'dayah-litworks',
    vertical: 'Portfolio · pago en USD',
    headline: 'Dayah Litworks: del Instagram al portfolio profesional en USD',
    lead:
      'Dayah es diseñadora de tapas de libros y su negocio depende de cómo la perciben autores que la contratan. Su portfolio vivía en Instagram — funcional, pero con techo.',
    period: '2026 · Q1',
    outcomes: [
      '3 comisiones cerradas en el primer mes',
      'Pricing en USD listo para clientes internacionales',
      'Proceso de encargo claro, sin DMs de ida y vuelta',
    ],
    challenge:
      'Instagram limita cómo se presenta un proceso de trabajo y un pricing claro. Los autores que evalúan contratarla necesitaban un sitio que transmitiera seriedad y autonomía profesional.',
    approach:
      'Diseñamos un portfolio enfocado en el proceso: del brief al manuscrito final. Pricing en USD, formulario de encargo y proceso paso-a-paso. Mantiene la estética visual personal de Dayah.',
    liveUrl: '/dayah-litworks',
  },
  {
    slug: 'de-abasto-a-casa',
    vertical: 'Food · pedidos por WhatsApp',
    headline: 'De Abasto a Casa: del jueves al lunes con sitio publicado y pedidos entrando',
    lead:
      'Iván maneja un servicio de meal prep semanal en Asunción. Recibía pedidos por grupos de WhatsApp, donde los mensajes se perdían. Necesitaba ordenar el flujo sin perder la cercanía.',
    period: '2026 · Q1',
    outcomes: [
      'De mensaje de WhatsApp a sitio publicado: 4 días',
      'Menú semanal con precios en Gs visible 24/7',
      'Clientes hacen su selección y la mandan por WhatsApp con un clic',
    ],
    challenge:
      'Los pedidos se perdían entre cientos de mensajes en grupos. Iván dedicaba horas a buscar quién había pedido qué, y los clientes no veían un menú claro hasta que él lo enviaba uno-a-uno.',
    approach:
      'Construimos un menú semanal estructurado donde cada cliente arma su pedido y lo envía pre-formateado por WhatsApp. Iván recibe un mensaje con todo lo que pidieron, listo para preparar.',
    liveUrl: '/s/es/de-abasto-a-casa',
  },
] as const
