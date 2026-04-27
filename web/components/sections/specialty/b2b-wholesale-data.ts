/** Business data types and defaults for B2BWholesaleSection */
import { CheckCircle, Shield, Truck, Leaf, Award, Users, Package, Clock, HeartHandshake, Phone, MessageCircle, Building2, ChefHat, Store, Coffee, School, MapPin, Calculator, type LucideIcon } from 'lucide-react'


export interface BusinessData {
  name: string
  whatsapp: string
  phone?: string
  email?: string
  address: string
  city: string
}

export interface Industry {
  icon?: string
  title: string
  description: string
  testimonial: string
  author: string
}

export interface PricingTier {
  name: string
  volume: string
  discount: string
  benefits: string[]
  recommended?: boolean
}

export interface FaqItem {
  question: string
  answer: string
}

export interface WhyItem {
  icon?: string
  title: string
  desc: string
}

export interface ProcessStep {
  step: string
  title: string
  desc: string
}

export interface Guarantee {
  title: string
  desc: string
}

export interface B2BPageProps {
  business: BusinessData
  industries?: Industry[]
  pricingTiers?: PricingTier[]
  faqs?: FaqItem[]
  whyChooseUs?: WhyItem[]
  processSteps?: ProcessStep[]
  guarantees?: Guarantee[]
  heroTitle?: string
  heroTitleAccent?: string
  heroSubtitle?: string
  claimLine?: string
  urgentMessage?: string
}

// Icon registry — maps string names in JSON content to Lucide components.
// Content files can't store component refs; this bridges that gap.

export const ICONS: Record<string, LucideIcon> = {
  ChefHat,
  Store,
  Coffee,
  School,
  Building2,
  Package,
  Users,
  Award,
  Truck,
  Calculator,
  Clock,
  CheckCircle,
  MessageCircle,
}

export const DEFAULT_INDUSTRIES: Industry[] = [
  {
    icon: 'ChefHat',
    title: 'Restaurantes',
    description: 'Huevos perfectos para desayunos y brunch. Consistencia en cada plato y presentación premium con yemas doradas.',
    testimonial: '"La calidad de los huevos se nota en cada plato. Nuestros clientes elogian los desayunos."',
    author: 'Chef Roberto Martínez, Restaurante La Tradición',
  },
  {
    icon: 'Store',
    title: 'Panaderías',
    description: 'Mejor estructura en masas, color dorado natural en bizcochos. Consistencia batch a batch.',
    testimonial: '"Mis facturas y bizcochos quedan más esponjosos. El color dorado de las yemas es incomparable."',
    author: 'Don José Giménez, Panadería San José',
  },
  {
    icon: 'Building2',
    title: 'Hoteles',
    description: 'Servicio de buffet consistente. Opciones de empaque según necesidad y facturación disponible.',
    testimonial: '"Nuestros huéspedes notan la diferencia en el desayuno. Calidad premium a precio justo."',
    author: 'María Elena Fernández, Hotel del Centro',
  },
  {
    icon: 'Package',
    title: 'Supermercados',
    description: 'Producto local con historia. Etiquetado personalizado disponible y suministro constante.',
    testimonial: '"Vendemos producto local y tienen buena reputación entre nuestros clientes."',
    author: 'Carlos Medina, Supermercado El Pueblo',
  },
  {
    icon: 'Coffee',
    title: 'Cafeterías',
    description: 'Ideales para sandwiches y wraps. Entregas de 2-3 veces por semana. Calidad para platos fotografiados.',
    testimonial: '"Nuestros bowls de desayuno se ven hermosos en Instagram gracias a las yemas doradas."',
    author: 'Lucía Benítez, Café Ruta 2',
  },
  {
    icon: 'School',
    title: 'Instituciones',
    description: 'Escuelas, colegios, hospitales y comedores industriales. Precios especiales por volumen.',
    testimonial: '"Llevamos 6 meses comprando para el comedor escolar. Siempre puntuales y buena calidad."',
    author: 'Directora, Colegio San Roque',
  },
]

export const DEFAULT_PRICING_TIERS: PricingTier[] = [
  {
    name: 'Bronce',
    volume: '100-300 huevos/semana',
    discount: '10% OFF',
    benefits: ['Delivery semanal incluido', 'Atención por WhatsApp', 'Sin contratos forzosos', 'Calidad garantizada'],
  },
  {
    name: 'Plata',
    volume: '300-600 huevos/semana',
    discount: '15% OFF',
    benefits: ['Delivery 2x semana', 'Prioridad en pedidos urgentes', 'Facturación mensual', 'Atención personalizada'],
    recommended: true,
  },
  {
    name: 'Oro',
    volume: '600+ huevos/semana',
    discount: '20% OFF',
    benefits: ['Delivery flexible según necesidad', 'Gerente de cuenta dedicado', 'Facturación personalizada', 'Precio bloqueado 3 meses'],
  },
  {
    name: 'Platinum',
    volume: '1000+ huevos/semana',
    discount: 'Personalizado',
    benefits: ['Todas las ventajas Oro', 'Contrato anual con beneficios', 'Visita mensual de seguimiento', 'Soporte prioritario 24/7'],
  },
]

export const DEFAULT_FAQS: FaqItem[] = [
  {
    question: '¿Cuál es el mínimo de compra para obtener precios mayoristas?',
    answer: 'El descuento mayorista aplica desde 100 huevos por semana. Sin embargo, podemos cotizar cualquier volumen. Consultanos sin compromiso.',
  },
  {
    question: '¿Emiten factura para mi negocio?',
    answer: 'Sí, emitimos factura con todos los datos de tu empresa. Podemos hacer facturación mensual consolidada o por cada entrega, según prefieras.',
  },
  {
    question: '¿Puedo establecer entregas regulares sin pedir cada vez?',
    answer: 'Absolutamente. De hecho, lo recomendamos. Establecemos un día y hora fijos de entrega semanal. Podés modificar cantidades con 24-48 horas de anticipación.',
  },
  {
    question: '¿Qué pasa si necesito un pedido urgente fuera de lo programado?',
    answer: 'Entendemos las emergencias. Con gusto coordinamos entregas adicionales cuando sea posible. Los clientes Oro y Platinum tienen prioridad para entregas urgentes.',
  },
  {
    question: '¿Puedo visitar la granja antes de comprometerme?',
    answer: '¡Por supuesto! Te invitamos a conocer nuestras instalaciones. Verás cómo trabajamos y la calidad de nuestras gallinas. Coordinamos visitas de lunes a sábado previa cita.',
  },
]

export const DEFAULT_WHY_CHOOSE_US: WhyItem[] = [
  { icon: 'Package', title: 'Frescura Garantizada', desc: 'Recolección diaria y entrega el mismo día. Máxima frescura para tus clientes.' },
  { icon: 'Award', title: 'Calidad Superior', desc: 'Yemas doradas intensamente coloreadas. Perfectas para presentación.' },
  { icon: 'Truck', title: 'Entrega Confiable', desc: 'Rutas de entrega semanales establecidas. Nunca te quedes sin stock.' },
  { icon: 'Calculator', title: 'Precios Competitivos', desc: 'Descuentos por volumen desde 100 unidades. Más comprás, más ahorrás.' },
  { icon: 'Users', title: 'Atención Personalizada', desc: 'Hablás directamente con el dueño. Entiende tu negocio.' },
  { icon: 'Clock', title: 'Flexibilidad Total', desc: 'Cantidades específicas y entregas urgentes. Nos adaptamos a vos.' },
]

export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  { step: '1', title: 'Consulta', desc: 'Nos escribís por WhatsApp. Nos contás sobre tu negocio: tipo, consumo estimado, zona y horarios.' },
  { step: '2', title: 'Cotización', desc: 'Te enviamos precios especiales según tu volumen. Sin compromiso. Sin contratos forzosos.' },
  { step: '3', title: 'Prueba', desc: 'Hacé tu primer pedido pequeño. Probá la frescura y calidad. Sin riesgo. Sin mínimos forzados.' },
  { step: '4', title: 'Suministro Regular', desc: 'Establecemos día y hora fijos de entrega. Cantidad semanal definida. Contacto directo.' },
]

export const DEFAULT_GUARANTEES: Guarantee[] = [
  { title: 'Garantía de Frescura', desc: 'Si un huevo llega roto o en mal estado, lo reemplazamos sin costo en tu próxima entrega.' },
  { title: 'Garantía de Puntualidad', desc: 'Si llegamos tarde a una entrega programada, 10% de descuento en esa entrega.' },
  { title: 'Garantía de Calidad', desc: 'Si la calidad no cumple tus expectativas, te devolvemos el dinero. Sin preguntas.' },
  { title: 'Garantía de Consistencia', desc: 'Si notás variación en calidad entre entregas, nos ajustamos o cambiamos lo necesario.' },
]
