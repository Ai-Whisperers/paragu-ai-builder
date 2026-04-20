/**
 * Smart WhatsApp Integration for Granja Cabral
 * 
 * Drop-in utilities for context-aware WhatsApp messaging
 */

export interface WhatsAppTemplate {
  id: string
  label: string
  template: string
  context: 'product' | 'wholesale' | 'delivery' | 'chicken' | 'general'
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'product_inquiry',
    label: 'Consulta de producto',
    context: 'product',
    template: 'Hola! Vi el {{productName}} a {{price}} en su web. ¿Está disponible? Quiero {{quantity}}.'
  },
  {
    id: 'wholesale_inquiry',
    label: 'Consulta mayorista',
    context: 'wholesale',
    template: 'Hola! Represento a un negocio y me interesa su lista de precios mayoristas. Consumimos aprox {{weeklyVolume}} huevos/semana. ¿Podemos coordinar?'
  },
  {
    id: 'chicken_preorder',
    label: 'Reservar pollo',
    context: 'chicken',
    template: 'Hola! Quiero reservar {{chickenType}} para el {{pickupDate}}. ¿Lo pueden preparar?'
  },
  {
    id: 'delivery_inquiry',
    label: 'Consultar delivery',
    context: 'delivery',
    template: 'Hola! Necescho delivery a {{address}} en {{zone}}. ¿Cuál es el costo de envío? Quiero {{productList}}.'
  },
  {
    id: 'subscription_inquiry',
    label: 'Pedido recurrente',
    context: 'general',
    template: 'Hola! Me interesa el servicio de entrega semanal. Somos {{familySize}} personas. ¿Tienen planes de suscripción?'
  }
]

export interface WhatsAppMessageParams {
  phone: string
  template: string
  variables: Record<string, string>
}

/**
 * Build WhatsApp URL with pre-filled message
 */
export function buildWhatsAppUrl(params: WhatsAppMessageParams): string {
  const cleanPhone = params.phone.replace(/\D/g, '')
  
  let message = params.template
  Object.entries(params.variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{{${key}}}`, 'g'), value)
  })
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Quick order button handler for products
 */
export function buildProductOrderUrl(
  phone: string,
  productName: string,
  price: string,
  quantity: string = '1'
): string {
  return buildWhatsAppUrl({
    phone,
    template: WHATSAPP_TEMPLATES[0].template,
    variables: {
      productName,
      price,
      quantity
    }
  })
}

/**
 * Wholesale inquiry URL
 */
export function buildWholesaleInquiryUrl(
  phone: string,
  businessName: string = '',
  weeklyVolume: string = '500'
): string {
  return buildWhatsAppUrl({
    phone,
    template: WHATSAPP_TEMPLATES[1].template,
    variables: {
      businessName,
      weeklyVolume
    }
  })
}

/**
 * Pre-order chicken URL
 */
export function buildChickenPreorderUrl(
  phone: string,
  chickenType: 'Pollo Entero' | 'Pollito Tierno',
  pickupDate: string
): string {
  return buildWhatsAppUrl({
    phone,
    template: WHATSAPP_TEMPLATES[2].template,
    variables: {
      chickenType,
      pickupDate
    }
  })
}

/**
 * Stock status display helper
 */
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder'

export interface StockIndicator {
  status: StockStatus
  label: string
  color: string
  icon: string
  actionText: string
}

export const STOCK_INDICATORS: Record<StockStatus, StockIndicator> = {
  in_stock: {
    status: 'in_stock',
    label: 'Disponible',
    color: '#27ae60',
    icon: '✅',
    actionText: 'Pedir ahora'
  },
  low_stock: {
    status: 'low_stock',
    label: 'Quedan pocas unidades',
    color: '#f39c12',
    icon: '⚠️',
    actionText: 'Reservar ahora'
  },
  out_of_stock: {
    status: 'out_of_stock',
    label: 'Agotado temporalmente',
    color: '#e74c3c',
    icon: '❌',
    actionText: 'Avisarme cuando haya'
  },
  preorder: {
    status: 'preorder',
    label: 'Reservar con 24hs anticipación',
    color: '#3498db',
    icon: '📅',
    actionText: 'Reservar'
  }
}

/**
 * Delivery zones configuration
 */
export interface DeliveryZone {
  id: string
  name: string
  fee: number
  minOrder: number
  freeDeliveryOver: number
  estimatedTime: string
  coordinates?: {
    lat: number
    lng: number
    radiusKm: number
  }
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'centro',
    name: 'Coronel Oviedo Centro',
    fee: 5000,
    minOrder: 15000,
    freeDeliveryOver: 50000,
    estimatedTime: '30-45 min'
  },
  {
    id: 'ruta2_cerca',
    name: 'Ruta 2 (Km 120-140)',
    fee: 8000,
    minOrder: 20000,
    freeDeliveryOver: 70000,
    estimatedTime: '45-60 min'
  },
  {
    id: 'ruta2_lejos',
    name: 'Ruta 2 (Km 140-150)',
    fee: 12000,
    minOrder: 30000,
    freeDeliveryOver: 100000,
    estimatedTime: '60-90 min'
  }
]

/**
 * Format price in Guaraníes
 */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('es-PY')} Gs`
}

/**
 * Calculate delivery fee based on zone and order total
 */
export function calculateDelivery(
  zoneId: string,
  orderTotal: number
): { fee: number; freeDelivery: boolean } {
  const zone = DELIVERY_ZONES.find(z => z.id === zoneId)
  if (!zone) return { fee: 0, freeDelivery: false }
  
  const freeDelivery = orderTotal >= zone.freeDeliveryOver
  return {
    fee: freeDelivery ? 0 : zone.fee,
    freeDelivery
  }
}

/**
 * Validate minimum order for zone
 */
export function validateMinOrder(zoneId: string, orderTotal: number): boolean {
  const zone = DELIVERY_ZONES.find(z => z.id === zoneId)
  if (!zone) return true
  return orderTotal >= zone.minOrder
}

/**
 * Generate price list PDF content (to be used with PDF generation library)
 */
export interface PriceListData {
  validFrom: Date
  validUntil: Date
  retailProducts: Array<{
    name: string
    description: string
    price: number
    unit: string
  }>
  wholesaleProducts: Array<{
    name: string
    description: string
    price: number
    minQuantity: number
    unit: string
  }>
  deliveryZones: DeliveryZone[]
  contact: {
    phone: string
    whatsapp: string
    email: string
    address: string
  }
}

export function generatePriceListData(): PriceListData {
  const validFrom = new Date()
  const validUntil = new Date()
  validUntil.setMonth(validUntil.getMonth() + 1)
  
  return {
    validFrom,
    validUntil,
    retailProducts: [
      { name: 'Huevos por Unidad', description: 'Huevos frescos recién recolectados', price: 800, unit: 'unidad' },
      { name: 'Bandeja de 12 Huevos', description: 'Docena fresca', price: 9500, unit: 'docena' },
      { name: 'Maple de 30 Huevos', description: 'Caja de 30 unidades', price: 22000, unit: 'maple' },
      { name: 'Pollo Entero', description: 'Aprox. 2-2.5kg, limpio y listo', price: 35000, unit: 'unidad' },
      { name: 'Pollito Tierno', description: 'Aprox. 1-1.2kg, carne suave', price: 22000, unit: 'unidad' },
      { name: 'Fertilizante 10kg', description: 'Gallinaza compostada', price: 15000, unit: 'bolsa' }
    ],
    wholesaleProducts: [
      { name: 'Huevos', description: 'Desde 100 unidades', price: 600, minQuantity: 100, unit: 'unidad' },
      { name: 'Maples de 30', description: 'Desde 5 maples', price: 18000, minQuantity: 5, unit: 'maple' },
      { name: 'Bandejas de 12', description: 'Desde 10 bandejas', price: 7200, minQuantity: 10, unit: 'bandeja' },
      { name: 'Pollo Entero', description: 'Desde 5 unidades', price: 30000, minQuantity: 5, unit: 'unidad' },
      { name: 'Fertilizante', description: 'Desde 5 bolsas', price: 12000, minQuantity: 5, unit: 'bolsa' }
    ],
    deliveryZones: DELIVERY_ZONES,
    contact: {
      phone: '+595 981 000 000',
      whatsapp: '+595 981 000 000',
      email: 'info@granjacabral.com',
      address: 'Ruta 2, Km 125-140, Coronel Oviedo'
    }
  }
}

/**
 * Recipe content for content marketing
 */
export interface Recipe {
  id: string
  title: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  ingredients: string[]
  instructions: string[]
  tips?: string[]
  image?: string
  tags: string[]
}

export const RECIPES: Recipe[] = [
  {
    id: 'tortilla-clasica',
    title: 'Tortilla de Huevos Clásica',
    description: 'La tortilla perfecta, jugosa por dentro y dorada por fuera. Ideal para cualquier momento del día.',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'Fácil',
    ingredients: [
      '4 huevos frescos Granja Cabral',
      'Sal y pimienta al gusto',
      '2 cucharadas de aceite de oliva',
      'Opcional: cebolla, pimiento, jamón, queso'
    ],
    instructions: [
      'Batir los huevos en un bowl con sal y pimienta',
      'Calentar el aceite en sartén a fuego medio',
      'Verter los huevos y dejar cocinar sin revolver',
      'Cuando los bordes estén listos, doblar por la mitad',
      'Cocinar 1-2 minutos más y servir caliente'
    ],
    tips: [
      'Usar huevos a temperatura ambiente para mejor resultado',
      'No batir en exceso para mantener la textura esponjosa'
    ],
    tags: ['desayuno', 'rápido', 'clásico', 'gluten-free']
  },
  {
    id: 'huevos-rancheros',
    title: 'Huevos Rancheros',
    description: 'Desayuno energético con huevos estrellados sobre tortilla y salsa.',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'Medio',
    ingredients: [
      '4 huevos frescos Granja Cabral',
      '2 tortillas de maíz',
      '1 taza de salsa de tomate',
      'Frijoles refritos',
      'Aguacate',
      'Queso fresco'
    ],
    instructions: [
      'Freír ligeramente las tortillas',
      'Calentar la salsa de tomate',
      'Freír los huevos estrellados',
      'Montar: tortilla, frijoles, huevo, salsa',
      'Decorar con aguacate y queso'
    ],
    tags: ['desayuno', 'mexicano', 'sustancioso']
  },
  {
    id: 'flan-casero',
    title: 'Flan de Huevo Casero',
    description: 'Postre clásico, cremoso y delicioso. Solo 4 ingredientes.',
    prepTime: 15,
    cookTime: 45,
    servings: 6,
    difficulty: 'Medio',
    ingredients: [
      '6 huevos frescos Granja Cabral',
      '1 litro de leche',
      '1 taza de azúcar',
      '1 cucharadita de esencia de vainilla',
      'Caramelo para el molde'
    ],
    instructions: [
      'Precalentar horno a 180°C',
      'Preparar caramelo y cubrir el fondo del molde',
      'Batir huevos con azúcar y vainilla',
      'Agregar leche tibia y mezclar',
      'Verter en molde y hornear a baño María por 45 min',
      'Dejar enfriar y desmoldar'
    ],
    tips: [
      'El baño María evita que se cuarte',
      'Dejar reposar toda la noche para mejor sabor'
    ],
    tags: ['postre', 'clásico', 'horno']
  }
]

/**
 * Customer review template
 */
export interface Review {
  id: string
  author: string
  location: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  date: Date
  type: 'cliente' | 'negocio' | 'restaurante'
  verified: boolean
}

/**
 * Request review via WhatsApp (3 days after delivery)
 */
export function buildReviewRequestUrl(phone: string, customerName: string): string {
  const template = `Hola {{name}}! 👋\n\nEsperamos que hayas disfrutado los huevos de Granja Cabral.\n\n¿Podés contarnos qué te parecieron? Tu opinión nos ayuda mucho.\n\n⭐ Dejar reseña: [LINK]\n\nGracias por confiar en nosotros! 💚`
  
  return buildWhatsAppUrl({
    phone,
    template,
    variables: { name: customerName }
  })
}

/**
 * Referral program utilities
 */
export function generateReferralCode(customerName: string): string {
  // Generate code like: LAURA10, MARIA25
  const normalized = customerName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6)
  const random = Math.floor(Math.random() * 90) + 10
  return `${normalized}${random}`
}

export function buildReferralMessage(referralCode: string): string {
  return `🥚 ¡Granja Cabral tiene una oferta para vos!\n\nUsá mi código: *${referralCode}*\n\n✅ Vos obtenés: 10% OFF en tu primera compra\n✅ Yo obtengo: Un maple de huevos gratis\n\n🛒 Comprar: https://granjacabral.com.py?ref=${referralCode}`
}

/**
 * Seasonal promotions calendar
 */
export interface Promotion {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  discount: number
  applicableProducts: string[]
  code: string
  terms: string
}

export const SEASONAL_PROMOTIONS: Promotion[] = [
  {
    id: 'semana-santa-2026',
    name: 'Semana Santa',
    description: '20% de descuento en docenas de huevos',
    startDate: new Date('2026-03-30'),
    endDate: new Date('2026-04-05'),
    discount: 20,
    applicableProducts: ['Bandeja de 12 Huevos', 'Maple de 30 Huevos'],
    code: 'SEMANA20',
    terms: 'Válido hasta agotar stock. Máximo 5 maples por cliente.'
  },
  {
    id: 'dia-madre-2026',
    name: 'Día de la Madre',
    description: 'Pack desayuno especial con huevos orgánicos',
    startDate: new Date('2026-05-10'),
    endDate: new Date('2026-05-15'),
    discount: 15,
    applicableProducts: ['Maple de 30 Huevos'],
    code: 'MAMA15',
    terms: 'Incluye recetario digital gratis.'
  }
]

/**
 * Analytics events for tracking
 */
export const ANALYTICS_EVENTS = {
  // Product interactions
  PRODUCT_VIEW: 'product_view',
  PRODUCT_CLICK_WHATSAPP: 'product_click_whatsapp',
  PRODUCT_ADD_TO_CART: 'product_add_to_cart',
  
  // Order flow
  ORDER_STARTED: 'order_started',
  ORDER_COMPLETED: 'order_completed',
  ORDER_CANCELLED: 'order_cancelled',
  
  // Page interactions
  PAGE_VIEW: 'page_view',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  
  // B2B specific
  WHOLESALE_INQUIRY: 'wholesale_inquiry',
  PRICE_LIST_DOWNLOAD: 'price_list_download',
  
  // Content
  RECIPE_VIEW: 'recipe_view',
  RECIPE_PRINT: 'recipe_print',
  
  // Reviews
  REVIEW_SUBMITTED: 'review_submitted',
  
  // Referrals
  REFERRAL_CODE_USED: 'referral_code_used',
  REFERRAL_SHARE: 'referral_share'
} as const

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]

/**
 * Track event helper
 */
export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  // Implementation would integrate with Google Analytics, Plausible, etc.
  console.log(`[Analytics] ${event}`, properties)
  
  // Example: gtag('event', event, properties)
}
