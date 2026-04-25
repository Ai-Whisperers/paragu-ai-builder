/**
 * Shared marketing data for the landing page and all SEO sub-pages.
 * Keeping this as plain typed data (no React imports) so it can be imported
 * from both Server Components and Client Components.
 */

export type Template = {
  id: string
  name: string
  /** Lucide icon name — resolved in the client component. */
  icon: string
  leads: number
  pct: number
  color: string
  demoSlug: string | null
  /** Optional pre-built /p/[rubro] slug. Defaults to id with dashes. */
  seoSlug?: string
  /** Headline override for the vertical SEO landing. */
  seoHeadline?: string
  /** Paragraph override for the vertical SEO landing. */
  seoLead?: string
}

export const TEMPLATES: readonly Template[] = [
  { id: 'peluqueria', name: 'Peluquería', icon: 'Scissors', leads: 2393, pct: 81, color: '#b76e79', demoSlug: 'salon-maria', seoHeadline: 'Sitio web para peluquerías en Paraguay, listo en 48 horas', seoLead: 'Agenda online, galería de trabajos, precios por servicio y botón de WhatsApp. Todo lo que una peluquería necesita, sin que toques código.' },
  { id: 'salon_belleza', name: 'Salón de Belleza', icon: 'Sparkles', leads: 1210, pct: 75, color: '#d4a574', demoSlug: 'studio-belleza', seoHeadline: 'Sitio web para salones de belleza — reservas y galería sin complicaciones', seoLead: 'Mostrá tus servicios, el equipo y la galería de trabajos. Tus clientas reservan por WhatsApp con un clic.' },
  { id: 'gimnasio', name: 'Gimnasio / Fitness', icon: 'Dumbbell', leads: 1087, pct: 72, color: '#2d6a4f', demoSlug: 'gymfit-py', seoHeadline: 'Sitio web para gimnasios y centros fitness — planes, horarios y leads', seoLead: 'Membresías, horarios de clases, staff de entrenadores y formulario de prueba gratis. Captura miembros sin depender solo de Instagram.' },
  { id: 'spa', name: 'Spa & Wellness', icon: 'Flower2', leads: 927, pct: 76, color: '#7c9885', demoSlug: 'spa-serenidad', seoHeadline: 'Sitio web para spas — paquetes, reservas y experiencia de marca', seoLead: 'Diseño premium que transmite tranquilidad, con paquetes de tratamientos, equipo y reservas por WhatsApp.' },
  { id: 'barberia', name: 'Barbería', icon: 'User', leads: 778, pct: 77, color: '#8b6914', demoSlug: 'barberia-clasica', seoHeadline: 'Sitio web para barberías — precios, horarios y turnos online', seoLead: 'Estética clásica o moderna, galería de cortes, lista de precios clara y botón de turnos por WhatsApp.' },
  { id: 'unas', name: 'Uñas', icon: 'Hand', leads: 488, pct: 75, color: '#c77dba', demoSlug: 'unas-y-mas', seoHeadline: 'Sitio web para salones de uñas — galería, servicios y reservas', seoLead: 'Vitrina de diseños, lista de servicios por tipo y duración, y reservas directas por WhatsApp.' },
  { id: 'tatuajes', name: 'Tatuajes & Piercing', icon: 'PenTool', leads: 272, pct: 70, color: '#1a1a2e', demoSlug: 'tinta-viva', seoHeadline: 'Sitio web para estudios de tatuajes — portfolio, artistas y citas', seoLead: 'Portfolio de cada artista, estilos, precios de referencia y agendamiento de consulta por WhatsApp.' },
  { id: 'estetica', name: 'Estética / Facial', icon: 'Sparkles', leads: 137, pct: 77, color: '#9b7cb8', demoSlug: 'belleza-integral', seoHeadline: 'Sitio web para centros de estética y tratamientos faciales', seoLead: 'Tratamientos, equipo, antes y después, y reservas por WhatsApp. Todo en un solo sitio profesional.' },
  { id: 'diseno_grafico', name: 'Diseño Gráfico', icon: 'Palette', leads: 100, pct: 80, color: '#c44569', demoSlug: 'dayah-litworks', seoHeadline: 'Sitio web para diseñadores gráficos — portfolio profesional en minutos', seoLead: 'Portfolio en grilla, proceso de trabajo, precios en USD o Gs y contacto directo. Ideal para freelancers.' },
  { id: 'pestanas', name: 'Pestañas y Cejas', icon: 'Eye', leads: 49, pct: 76, color: '#6c5ce7', demoSlug: 'pestanas-flore', seoHeadline: 'Sitio web para pestañas y cejas — catálogo visual y reservas', seoLead: 'Catálogo de estilos, duración del trabajo, precios y turnos por WhatsApp. Optimizado para Instagram.' },
  { id: 'depilacion', name: 'Depilación', icon: 'Zap', leads: 20, pct: 78, color: '#e17055', demoSlug: 'depilacion-perfecta', seoHeadline: 'Sitio web para centros de depilación — zonas, precios y turnos', seoLead: 'Zonas por sesión, paquetes, preguntas frecuentes y reservas por WhatsApp en una sola página.' },
  { id: 'relocation', name: 'Reubicación', icon: 'Globe', leads: 0, pct: 0, color: '#1e3a5f', demoSlug: 'nexa-paraguay', seoHeadline: 'Sitio web para servicios de reubicación — multi-idioma y profesional', seoLead: 'Sitio serio para clientes internacionales, multi-idioma, con proceso de trabajo, casos de éxito y contacto directo.' },
  { id: 'meal_prep', name: 'Meal Prep & Compras', icon: 'ShoppingCart', leads: 0, pct: 0, color: '#3a6b4a', demoSlug: 'de-abasto-a-casa', seoHeadline: 'Sitio web para meal prep y entregas — menú semanal y pedidos por WhatsApp', seoLead: 'Menú semanal con precios en Gs, selección de platos y checkout directo por WhatsApp. Listo para escalar.' },
  { id: 'restaurant', name: 'Restaurante', icon: 'UtensilsCrossed', leads: 0, pct: 0, color: '#8B4513', demoSlug: 'la-trattoria', seoHeadline: 'Sitio web para restaurantes — menú, reservas y pedidos', seoLead: 'Menú digital, galería del local, reservas online o por WhatsApp. Optimizado para mobile.' },
  { id: 'sushi_bar', name: 'Sushi Bar', icon: 'Fish', leads: 0, pct: 0, color: '#1A1A1A', demoSlug: 'sakura-sushi', seoHeadline: 'Sitio web para sushi bar — menú premium y delivery', seoLead: 'Diseño minimal japonés, menú con fotos, delivery por WhatsApp y galería del local.' },
  { id: 'kaiten_zushi', name: 'Sushi Cinta', icon: 'CircleDot', leads: 0, pct: 0, color: '#2196F3', demoSlug: 'kaiten-express', seoHeadline: 'Sitio web para sushi cinta — precios por color y ubicaciones', seoLead: 'Sistema de precios por color de plato, ubicaciones, promociones y reservas online.' },
  { id: 'maquillaje', name: 'Maquillaje', icon: 'Palette', leads: 130, pct: 72, color: '#e84393', demoSlug: null },
  { id: 'inmobiliaria', name: 'Inmobiliaria', icon: 'MapPin', leads: 0, pct: 0, color: '#2d6a4f', demoSlug: null },
  { id: 'legal', name: 'Servicios Legales', icon: 'Layers', leads: 0, pct: 0, color: '#1a1a1a', demoSlug: null },
  { id: 'consultoria', name: 'Consultoría', icon: 'BarChart3', leads: 0, pct: 0, color: '#4a90a4', demoSlug: null },
  { id: 'educacion', name: 'Educación', icon: 'Users', leads: 0, pct: 0, color: '#7c3aed', demoSlug: null },
  { id: 'salud', name: 'Salud', icon: 'TrendingUp', leads: 0, pct: 0, color: '#059669', demoSlug: null },
  { id: 'inversiones', name: 'Inversiones', icon: 'TrendingUp', leads: 0, pct: 0, color: '#d97706', demoSlug: null },
] as const

/** Templates that have a live demo and an SEO landing. */
export const LIVE_TEMPLATES: readonly Template[] = TEMPLATES.filter((t) => t.demoSlug !== null)

export type RealClient = {
  slug: string
  name: string
  tagline: string
  vertical: string
  href: string
  color: string
  /** Long-form summary for /casos page card. */
  summary: string
}

export const REAL_CLIENTS: readonly RealClient[] = [
  {
    slug: 'nexa-paraguay',
    name: 'Nexa Paraguay',
    tagline: 'Reubicación Europa → Paraguay',
    vertical: 'Relocation · 4 idiomas',
    href: '/s/es/nexa-paraguay',
    color: '#1e3a5f',
    summary: 'Sitio multi-idioma (ES/EN/DE/NL) para clientes europeos que evalúan mudarse a Paraguay. Lanzamos en 2 semanas.',
  },
  {
    slug: 'nexa-propiedades',
    name: 'Nexa Propiedades',
    tagline: 'Inmobiliaria residencial PY',
    vertical: 'Real estate · 3 idiomas',
    href: '/s/es/nexa-propiedades',
    color: '#2d6a4f',
    summary: 'Listado de propiedades, buscador por zona y contacto por WhatsApp. Reusa la infraestructura de Nexa.',
  },
  {
    slug: 'dayah-litworks',
    name: 'Dayah Litworks',
    tagline: 'Diseño de tapas de libros',
    vertical: 'Portfolio · pago en USD',
    href: '/dayah-litworks',
    color: '#c44569',
    summary: 'Portfolio de diseñadora gráfica con pricing en USD y proceso de encargo claro. 3 comisiones cerradas en el primer mes.',
  },
  {
    slug: 'de-abasto-a-casa',
    name: 'De Abasto a Casa',
    tagline: 'Meal prep semanal en Asunción',
    vertical: 'Food · pedidos por WhatsApp',
    href: '/de-abasto-a-casa',
    color: '#3a6b4a',
    summary: 'Menú semanal con precios en Gs y botón de pedido por WhatsApp. Clientes reservan solos, sin perder pedidos en grupos.',
  },
] as const

export type Testimonial = {
  name: string
  business: string
  location: string
  quote: string
  rating: number
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: 'Equipo Nexa Paraguay',
    business: 'Nexa Paraguay · Reubicación Europa → PY',
    location: 'Asunción',
    quote:
      'Necesitábamos un sitio serio en 4 idiomas (ES/EN/DE/NL) para clientes europeos que evalúan mudarse. ParaguAI lo entregó sin que toquemos código y lo replicó para Uruguay en días.',
    rating: 5,
  },
  {
    name: 'Dayah',
    business: 'Dayah Litworks · Diseño de tapas de libros',
    location: 'Remoto',
    quote:
      'Mi portafolio antes estaba en Instagram. Ahora los autores que me contratan me ven con un sitio profesional en USD, con proceso de encargo claro. Cerré 3 comisiones en el primer mes.',
    rating: 5,
  },
  {
    name: 'Iván',
    business: 'De Abasto a Casa · Meal prep semanal',
    location: 'Asunción',
    quote:
      'Mandé los datos por WhatsApp un jueves y el lunes el sitio estaba online con menú semanal, precios en Gs y botón de pedido. Los clientes reservan solos, dejé de perder pedidos en los grupos.',
    rating: 5,
  },
] as const

export type PlanFeature = { text: string; included: boolean }

export type Plan = {
  id: 'prueba' | 'presencia' | 'crecimiento' | 'profesional'
  name: string
  setup: string
  monthly: string
  period: string
  description: string
  features: readonly PlanFeature[]
  cta: string
  waMessage: string
  popular: boolean
  /**
   * Months the customer enjoys full Profesional-tier features regardless of
   * which plan they actually paid for. Honor-system enforced today; once the
   * `graceEndsAt` field is wired into the tenants table we'll downgrade
   * features automatically. See docs/PRICING_ITERATION_V2.md.
   */
  premiumGraceMonths: number
  /** Highlight badge shown on the plan card. Replaces the `popular` flag in v2. */
  badge?: string
}

export const PLANS: readonly Plan[] = [
  {
    id: 'prueba',
    name: 'Prueba',
    setup: 'Gratis',
    monthly: '3 meses',
    period: 'full Profesional, sin costo',
    description: 'Probá todo lo que ofrecemos antes de pagar nada',
    features: [
      { text: '3 meses con la experiencia Profesional completa', included: true },
      { text: 'Subdominio negocio.paragu-ai.com', included: true },
      { text: 'WhatsApp Business + Google Maps + SSL', included: true },
      { text: 'Soporte por WhatsApp durante la prueba', included: true },
      { text: 'Después de los 3 meses: el sitio sigue online con marca ParaguAI', included: true },
      { text: 'Dominio propio incluido', included: false },
      { text: 'Sin marca ParaguAI', included: false },
    ],
    cta: 'Pedir demo gratis',
    waMessage: 'Hola, quiero probar ParaguAI gratis (3 meses Profesional) para mi negocio.',
    popular: false,
    premiumGraceMonths: 3,
  },
  {
    id: 'presencia',
    name: 'Presencia',
    setup: 'Gs 650.000',
    monthly: 'Gs 100.000',
    period: 'por mes (después de 7 meses Profesional gratis)',
    description: 'Tu primer sitio profesional · 7 meses con todo desbloqueado',
    features: [
      { text: '7 meses con la experiencia Profesional completa', included: true },
      { text: 'Hasta 5 páginas en tu plan base', included: true },
      { text: 'Dominio propio (.com.py) incluido 1 año', included: true },
      { text: 'Hasta 15 fotos optimizadas', included: true },
      { text: 'Formulario + WhatsApp Business', included: true },
      { text: 'SEO básico + Google Maps', included: true },
      { text: '2 cambios de contenido al mes', included: true },
      { text: 'WhatsApp dedicado + check-in mensual', included: true },
    ],
    cta: 'Comenzar Presencia',
    waMessage: 'Hola, me interesa el plan Presencia (Gs 650.000 + 100.000/mes, con 7 meses Profesional incluidos).',
    popular: false,
    premiumGraceMonths: 7,
  },
  {
    id: 'crecimiento',
    name: 'Crecimiento',
    setup: 'Gs 1.200.000',
    monthly: 'Gs 150.000',
    period: 'por mes (después de 8 meses Profesional gratis)',
    description: 'Reservas, blog y e-commerce · 8 meses con todo desbloqueado',
    features: [
      { text: '8 meses con la experiencia Profesional completa', included: true },
      { text: 'Todo lo de Presencia en tu plan base', included: true },
      { text: 'Páginas ilimitadas', included: true },
      { text: 'Sistema de reservas online', included: true },
      { text: 'Catálogo con hasta 20 productos', included: true },
      { text: 'Blog y analytics', included: true },
      { text: 'SEO avanzado + Schema.org', included: true },
      { text: '5 cambios al mes + soporte prioritario', included: true },
    ],
    cta: 'Comenzar Crecimiento',
    waMessage: 'Hola, me interesa el plan Crecimiento (Gs 1.200.000 + 150.000/mes, con 8 meses Profesional incluidos).',
    popular: true,
    badge: 'Más recomendado',
    premiumGraceMonths: 8,
  },
  {
    id: 'profesional',
    name: 'Profesional',
    setup: 'Gs 2.200.000',
    monthly: 'Gs 300.000',
    period: 'por mes · siempre full Profesional',
    description: 'Cadenas, franquicias, multi-sucursal — sin downgrades, nunca',
    features: [
      { text: 'Experiencia Profesional completa, siempre', included: true },
      { text: 'Todo lo de Crecimiento sin límite de tiempo', included: true },
      { text: 'Hasta 5 sucursales / locales', included: true },
      { text: 'Sitio multi-idioma (es/en/pt)', included: true },
      { text: 'Integraciones personalizadas', included: true },
      { text: 'Account manager dedicado', included: true },
      { text: 'SLA 99.9% uptime', included: true },
      { text: '10 horas de desarrollo al mes', included: true },
    ],
    cta: 'Hablar con ventas',
    waMessage: 'Hola, me interesa el plan Profesional (Gs 2.200.000 + 300.000/mes).',
    popular: false,
    premiumGraceMonths: 0,
  },
] as const

export const GUARANTEES = [
  { icon: 'PlayCircle', title: 'Demo antes de pagar', desc: 'Ves tu sitio primero, pagás después.' },
  { icon: 'RotateCcw', title: '30 días de garantía', desc: 'Si no te convence, te devolvemos el setup.' },
  { icon: 'Activity', title: 'Uptime 99.9%', desc: 'Infraestructura Cloudflare + Supabase.' },
  { icon: 'Unlock', title: 'Sin permanencia', desc: 'Cancelás cuando quieras, te llevás tu dominio.' },
] as const

export const FEATURES = [
  { icon: 'Check', title: 'Todo incluido', desc: 'Diseño, textos, fotos, dominio, hosting, SEO y soporte. Vos no tocás nada, nosotros publicamos.' },
  { icon: 'MessageCircle', title: 'WhatsApp directo', desc: 'Botón flotante que lleva a tu WhatsApp Business. Tus clientes te escriben con un clic.' },
  { icon: 'Globe', title: 'Dominio propio', desc: 'Tu URL profesional .com.py con SSL y emails incluidos el primer año.' },
  { icon: 'Search', title: 'SEO integrado', desc: 'Meta tags, Schema.org y contenido optimizado para aparecer en Google desde el día uno.' },
  { icon: 'Smartphone', title: '100% responsive', desc: 'Se ve perfecto en móvil, tablet y desktop. Optimizado para la forma en que miran tus clientes.' },
  { icon: 'Layers', title: 'Plantillas por rubro', desc: 'Diseños especializados pensados para tu tipo de negocio. Cada cliente arranca con la base correcta y ajustamos a tu marca.' },
] as const

export const STEPS = [
  { num: '01', title: 'Contanos por WhatsApp', desc: 'Nos mandás el nombre del negocio, tus servicios, precios y fotos. Sin formularios complicados.' },
  { num: '02', title: 'Armamos tu demo', desc: 'En 24 horas te mandamos un link con tu sitio listo. Lo revisás, pedís ajustes, y recién después pagás.' },
  { num: '03', title: 'Lanzamos y mantenemos', desc: 'Publicamos en tu dominio .com.py con SSL, SEO y analytics. Cambios mensuales incluidos por WhatsApp.' },
] as const

export const SITE_CONFIG = {
  whatsapp: '595981324569',
  domain: 'paragu-ai.com',
  companyName: 'ParaguAI Builder',
  marketSize: 7463,
  noWebPct: 75,
  cities: 209,
} as const

/** Build a wa.me URL with an encoded prefilled message. */
export function waLink(message: string, phone: string = SITE_CONFIG.whatsapp): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
