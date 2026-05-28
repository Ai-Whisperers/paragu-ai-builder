import { Scissors, Dumbbell, Flower2, Hand, PenTool, User, Sparkles, Palette, Zap, Eye, Globe, Smartphone, Search, MessageCircle } from 'lucide-react'

export type Template = {
  id: string
  name: string
  icon: string
  leads: number
  pct: number
  demoSlug: string | null
  seoSlug: string
  seoHeadline: string
  seoLead: string
}

export const TEMPLATES: readonly Template[] = [
  { id: 'restaurant', name: 'Restaurante', icon: 'UtensilsCrossed', leads: 1834, pct: 91, demoSlug: 'demo-restaurant', seoSlug: 'restaurante', seoHeadline: 'Sitio web para restaurantes — menú digital, reservas y pedidos', seoLead: 'Tu menú actualizado, fotos de platos y botón de reservas. Los clientes sehen tu oferta sin esperar al mesero.' },
  { id: 'gimnasio', name: 'Gimnasio', icon: 'Dumbbell', leads: 2201, pct: 87, demoSlug: 'demo-gym', seoSlug: 'gimnasio', seoHeadline: 'Sitio web para gimnasios — horarios, planes y contacto por WhatsApp', seoLead: 'Mostrá tus planes, horarios y testimonios. Tus leads te escriben directo por WhatsApp.' },
  { id: 'ecommerce', name: 'Tienda online', icon: 'ShoppingCart', leads: 3104, pct: 94, demoSlug: 'demo-commerce', seoSlug: 'tienda-online', seoHeadline: 'Tienda online para Paraguay — inventario, pagos y envíos', seoLead: 'Tu catálogo 24/7, MercadoPago integrado y seguimiento de envíos. Vendés cuando dormís.' },
  { id: 'portfolio', name: 'Portfolio / Freelance', icon: 'User', leads: 1403, pct: 79, demoSlug: 'demo-portfolio', seoSlug: 'portfolio-freelance', seoHeadline: 'Sitio portfolio para creativos — muestrá tu trabajo, cobrál en USD', seoLead: 'Tu trabajo habla por vos. Portfolio profesional con formulario de contacto y pricing en dólares.' },
  { id: 'salon_belleza', name: 'Salón de Belleza', icon: 'Sparkles', leads: 1210, pct: 75, demoSlug: 'studio-belleza', seoSlug: 'salon-belleza', seoHeadline: 'Sitio web para salones de belleza — reservas y galería sin complicaciones', seoLead: 'Mostrá tus servicios, el equipo y la galería de trabajos. Tus clientas reservan por WhatsApp con un clic.' },
  { id: 'relocation', name: 'Reubicación', icon: 'Globe', leads: 0, pct: 0, demoSlug: 'nexa-paraguay', seoSlug: 'reubicacion', seoHeadline: 'Sitio web para servicios de reubicación — multi-idioma y profesional', seoLead: 'Sitio serio para clientes internacionales, multi-idioma, con proceso de trabajo, casos de éxito y contacto directo.' },
  { id: 'barberia', name: 'Barbería', icon: 'Scissors', leads: 988, pct: 72, demoSlug: null, seoSlug: 'barberia', seoHeadline: 'Sitio web para barberías — galería, servicios y reservas online', seoLead: 'Tu barbería online: galería de trabajos, servicios con precios y botón de reservas directo.' },
  { id: 'hotel', name: 'Hotel / Hospedaje', icon: 'Building2', leads: 654, pct: 68, demoSlug: null, seoSlug: 'hotel-hospedaje', seoHeadline: 'Sitio web para hoteles — habitaciones, reservas y contacto directo', seoLead: 'Mostrá tus habitaciones, tarifas y ubicación. Los huéspedes reservan directo sin comisiones.' },
  { id: 'ecommerce2', name: 'E-commerce básico', icon: 'ShoppingCart', leads: 2341, pct: 88, demoSlug: null, seoSlug: 'e-commerce-basico', seoHeadline: 'E-commerce básico para Paraguay — catálogo, precios y WhatsApp', seoLead: 'Tu negocio en internet: catálogo, precios en Gs y botón de pedido por WhatsApp. Sin complejidad.' },
  { id: 'servicios', name: 'Servicios profesionales', icon: 'Calculator', leads: 1109, pct: 71, demoSlug: null, seoSlug: 'servicios-profesionales', seoHeadline: 'Sitio para servicios profesionales — proceso, testimonios y contacto', seoLead: 'Tu expertise visible: proceso de trabajo, casos de éxito y formulario de contacto. Leids cualificados.' },
]

export const LIVE_TEMPLATES: readonly Template[] = TEMPLATES.filter((t) => t.demoSlug !== null)

export type RealClient = {
  slug: string
  name: string
  tagline: string
  vertical: string
  href: string
  color: string
  summary: string
}

export const REAL_CLIENTS: readonly RealClient[] = [
  {
    slug: 'nexa-paraguay',
    name: 'Nexa Paraguay',
    tagline: 'Reubicación Europa → Paraguay',
    vertical: 'Relocation · 4 idiomas',
    href: 'https://nexa.paragu-ai.com',
    color: '#1e3a5f',
    summary: 'Sitio multi-idioma (ES/EN/DE/NL) para clientes europeos que evalúan mudarse a Paraguay.',
  },
  {
    slug: 'dayah-litworks',
    name: 'Dayah Litworks',
    tagline: 'Diseño de tapas de libros',
    vertical: 'Portfolio · pago en USD',
    href: 'https://dayah.paragu-ai.com',
    color: '#c44569',
    summary: 'Portfolio de diseñadora gráfica con pricing en USD y proceso de encargo claro.',
  },
  {
    slug: 'magnolia-peluqueria',
    name: 'Magnolia Peluquería',
    tagline: 'Cortes y coloración profesional',
    vertical: 'Peluquería · Asunción',
    href: 'https://magnolia-peluqueria.paragu-ai.com',
    color: '#b76e79',
    summary: 'Sitio para peluquería con galería de trabajos, servicios y botón de reservas por WhatsApp.',
  },
  {
    slug: 'mantra-spa',
    name: 'Mantra Spa',
    tagline: 'Masajes y tratamientos faciales',
    vertical: 'Spa & Wellness · Asunción',
    href: 'https://mantraspa.paragu-ai.com',
    color: '#7c9885',
    summary: 'Sitio para spa con galería de tratamientos, horarios y botón de reservas por WhatsApp.',
  },
  {
    slug: 'bichos-gym',
    name: 'Bichos Gym',
    tagline: 'Entrenamiento funcional',
    vertical: 'Gimnasio · Asunción',
    href: 'https://bichosgym.paragu-ai.com',
    color: '#2d6a4f',
    summary: 'Sitio para gimnasio con planes, horarios y botón de WhatsApp para consultas.',
  },
  {
    slug: 'jota-ink-tattoo',
    name: 'Jota Ink Tattoo',
    tagline: 'Tatuajes personalizados',
    vertical: 'Tatuajes · Asunción',
    href: 'https://jotaink.paragu-ai.com',
    color: '#1a1a2e',
    summary: 'Portfolio de tatuador con galería de trabajos, estilos y botón de contacto directo.',
  },
  {
    slug: 'depi-flash',
    name: 'DepiFlash',
    tagline: 'Depilación láser a domicilio',
    vertical: 'Depilación · Paraguay',
    href: 'https://depiflash.paragu-ai.com',
    color: '#e17055',
    summary: 'Landing para servicio de depilación láser con formulario de contacto y pricing claro.',
  },
  {
    slug: 'trentina',
    name: 'Trentina',
    tagline: 'Cerveza artesanal paraguaya',
    vertical: 'Cervecería · Santa Rita',
    href: 'https://trentina.paragu-ai.com',
    color: '#d97706',
    summary: 'Sitio para cervecería artesanal con catálogo de cervezas y pedidos por WhatsApp.',
  },
  {
    slug: 'superspuma',
    name: 'Superspuma',
    tagline: 'Accesorios de limpieza industriales',
    vertical: 'B2B · Asunción',
    href: 'https://superspuma.com.py',
    color: '#0ea5e9',
    summary: 'Catálogo B2B para empresa de accesorios de limpieza con precios y botón de contacto.',
  },
] as const

export type Testimonial = {
  name: string
  role: string
  quote: string
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: 'Marcelo — Nexa Paraguay',
    role: 'Reubicación',
    quote: 'Necesitábamos un sitio serio en 4 idiomas para clientes europeos. ParaguAI lo entregó sin que toquemos código y lo replicó para Uruguay en días.',
  },
  {
    name: 'Iván — De Abasto a Casa',
    role: 'Food',
    quote: 'Mandé los datos por WhatsApp un jueves y el lunes el sitio estaba online con menú semanal, precios en Gs y botón de pedido. Los clientes reservan solos.',
  },
]

export type PlanFeature = { text: string; included: boolean }

export type Plan = {
  name: string
  setup: string
  monthly: string | null
  period: string
  description: string
  features: PlanFeature[]
  cta: string
  highlight?: boolean
}

export const PLANS: readonly Plan[] = [
  {
    name: 'Diagnóstico',
    setup: 'Gratis',
    monthly: null,
    period: 'sin compromiso',
    description: 'Analizamos tu negocio y te mostramos cómo sería tu sitio con IA',
    features: [
      { text: 'Análisis de tu negocio y competencia local', included: true },
      { text: 'Demo de tu futuro sitio funcionando', included: true },
      { text: 'Recomendación de plan según tus objetivos', included: true },
      { text: 'Sin tarjeta, sin contrato', included: true },
      { text: 'Listo en 48 horas', included: false },
    ],
    cta: 'Pedir diagnóstico gratis',
  },
  {
    name: 'Lanzamiento',
    setup: 'Desde Gs 2.500.000',
    monthly: 'Gs 350.000/mes',
    period: 'primer año',
    description: 'Tu sitio profesional listo para vender, con dominio .com.py incluido',
    features: [
      { text: 'Diseño profesional responsive', included: true },
      { text: 'Dominio .com.py incluido (1 año)', included: true },
      { text: 'SEO básico optimizado para Paraguay', included: true },
      { text: 'Botón de WhatsApp integrado', included: true },
      { text: '5 páginas (inicio, servicios, galería, etc.)', included: true },
      { text: 'Sistema de reservas / pedidos', included: true },
      { text: 'SSL y hosting incluidos', included: true },
      { text: 'Atención en Guaraní o USD', included: true },
    ],
    cta: 'Comenzar con Lanzamiento',
    highlight: true,
  },
  {
    name: 'Crecimiento',
    setup: 'Desde Gs 4.500.000',
    monthly: 'Gs 700.000/mes',
    period: 'primer año',
    description: 'Tu sitio con tienda online, blog y analytics para medir qué funciona',
    features: [
      { text: 'Todo lo de Lanzamiento +', included: true },
      { text: 'Tienda online completa', included: true },
      { text: 'Blog con artículos SEO', included: true },
      { text: 'Google Analytics integrado', included: true },
      { text: 'Integración con MercadoPago / Stripe', included: true },
      { text: 'Reportes mensuales de rendimiento', included: true },
      { text: 'Hasta 20 páginas', included: true },
      { text: 'Chat en vivo opcional', included: true },
    ],
    cta: 'Comenzar con Crecimiento',
  },
]

export const TEMPLATE_FEATURES = [
  { icon: MessageCircle, title: 'WhatsApp directo', desc: 'Botón flotante que lleva a tu WhatsApp Business. Tus clientes te escriben con un clic.' },
  { icon: Smartphone, title: '100% responsive', desc: 'Se ve perfecto en móvil, tablet y desktop. Optimizado para la forma en que miran tus clientes.' },
  { icon: Palette, title: 'Plantillas por rubro', desc: 'Diseños especializados pensados para tu tipo de negocio. Cada cliente arranca con la base correcta y ajustamos a tu marca.' },
  { icon: Zap, title: 'Listo en 48hs', desc: 'Mandás los datos, nosotros armamos el sitio. Sin reuniones, sin paperwork.' },
  { icon: Globe, title: 'Dominio .com.py', desc: 'Tu dirección en internet con extensión paraguaya. Incluye SSL y hosting.' },
  { icon: Eye, title: 'Ves antes de pagar', desc: 'Te mostramos tu sitio funcionando antes de que pagués un peso.' },
]

export function waLink(message: string): string {
  return `https://wa.me/595981324569?text=${encodeURIComponent(message)}`
}
