/**
 * Test Fixtures - Mock Business Data
 * Win 55: Mock business data for testing
 */
import type { BusinessData } from '@/lib/engine/compose'
import type { BusinessType } from '@/lib/types'

/**
 * Minimal business with only required fields
 */
export const minimalBusiness: BusinessData = {
  name: 'Test Business',
  slug: 'test-business',
  type: 'peluqueria' as BusinessType,
  city: 'Asunción',
}

/**
 * Full peluqueria (hair salon) business data
 */
export const peluqueriaBusiness: BusinessData = {
  name: 'Peluquería Estilo Moderno',
  slug: 'peluqueria-estilo-moderno',
  type: 'peluqueria' as BusinessType,
  tagline: 'Tu imagen, nuestra pasión',
  city: 'Asunción',
  neighborhood: 'Villa Morra',
  address: 'Av. Mariscal López 1234',
  phone: '+595-21-123-4567',
  email: 'contacto@estilomoderno.com',
  whatsapp: '+595-981-123456',
  instagram: '@estilomoderno',
  facebook: 'facebook.com/estilomoderno',
  googleMapsUrl: 'https://maps.google.com/?q=-25.2822,-57.6351',
  hours: {
    'Lunes - Viernes': '08:00 - 20:00',
    'Sábado': '09:00 - 18:00',
    'Domingo': 'Cerrado',
  },
  services: [
    {
      name: 'Corte de Cabello',
      description: 'Corte personalizado según tu estilo',
      price: '80.000',
      priceFrom: undefined,
      duration: 45,
      category: 'Cortes',
    },
    {
      name: 'Tinte Completo',
      description: 'Coloración profesional con productos premium',
      priceFrom: '150.000',
      duration: 120,
      category: 'Coloración',
    },
    {
      name: 'Peinado',
      description: 'Peinado para eventos especiales',
      priceFrom: '60.000',
      duration: 60,
      category: 'Peinados',
    },
  ],
  team: [
    {
      name: 'María González',
      role: 'Estilista Principal',
      bio: 'Especialista en coloración con 10 años de experiencia',
      imageUrl: '/images/team/maria.jpg',
      instagram: '@mariaestilista',
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Barbero',
      bio: 'Experto en cortes masculinos modernos',
      imageUrl: '/images/team/carlos.jpg',
    },
  ],
  gallery: [
    { src: '/images/gallery/corte1.jpg', alt: 'Corte moderno', category: 'Cortes' },
    { src: '/images/gallery/color1.jpg', alt: 'Coloración', category: 'Coloración' },
    { src: '/images/gallery/peinado1.jpg', alt: 'Peinado elegante', category: 'Peinados' },
  ],
  testimonials: [
    {
      quote: 'El mejor lugar para cortarme el pelo. María es una artista!',
      author: 'Ana Martínez',
      role: 'Cliente frecuente',
      rating: 5,
    },
    {
      quote: 'Excelente atención y ambiente muy profesional.',
      author: 'Pedro Gómez',
      role: 'Cliente nuevo',
      rating: 5,
    },
  ],
  heroImage: '/images/hero/peluqueria.jpg',
}

/**
 * Restaurant business data
 */
export const restaurantBusiness: BusinessData = {
  name: 'Sakura Sushi Bar',
  slug: 'sakura-sushi-bar',
  type: 'sushi_bar' as BusinessType,
  tagline: 'Auténtico sushi japonés en Paraguay',
  city: 'Asunción',
  neighborhood: 'Carmelitas',
  address: 'Calle Italia 456',
  phone: '+595-21-654-3210',
  email: 'info@sakurasushi.com',
  whatsapp: '+595-985-654321',
  instagram: '@sakurasushipy',
  hours: {
    'Lunes - Jueves': '12:00 - 23:00',
    'Viernes - Sábado': '12:00 - 00:00',
    'Domingo': '18:00 - 23:00',
  },
  services: [
    {
      name: 'Omakase Experience',
      description: 'Menú degustación del chef',
      priceFrom: '250.000',
      category: 'Experiencias',
    },
    {
      name: 'Sushi Rolls',
      description: 'Variedad de rolls tradicionales y especiales',
      priceFrom: '45.000',
      category: 'Sushi',
    },
  ],
  products: [
    {
      name: 'Sake Premium',
      description: 'Sake japonés importado 720ml',
      price: '180.000',
      category: 'Bebidas',
      available: true,
    },
    {
      name: 'Edamame',
      description: 'Frijoles de soja al vapor',
      price: '25.000',
      category: 'Entradas',
      available: true,
    },
  ],
  gallery: [
    { src: '/images/gallery/sushi1.jpg', alt: 'Nigiri selection', category: 'Sushi' },
    { src: '/images/gallery/interior.jpg', alt: 'Interior del restaurante', category: 'Ambiente' },
  ],
  heroImage: '/images/hero/sushi.jpg',
}

/**
 * Gym/fitness business data
 */
export const gymBusiness: BusinessData = {
  name: 'PowerFit Gimnasio',
  slug: 'powerfit-gimnasio',
  type: 'gimnasio' as BusinessType,
  tagline: 'Transforma tu cuerpo, transforma tu vida',
  city: 'Asunción',
  neighborhood: 'Las Lomas',
  address: 'Av. España 789',
  phone: '+595-21-789-0123',
  whatsapp: '+595-971-234567',
  hours: {
    'Lunes - Viernes': '05:00 - 23:00',
    'Sábado': '07:00 - 20:00',
    'Domingo': '08:00 - 14:00',
  },
  services: [
    { name: 'Musculación', description: 'Área completa de pesas', category: 'Entrenamiento' },
    { name: 'Clases de Yoga', description: 'Yoga para todos los niveles', category: 'Clases' },
    { name: 'Entrenamiento Personal', description: 'Sesiones uno a uno', category: 'Personalizado' },
  ],
  classSchedule: [
    {
      day: 'Lunes',
      classes: [
        { time: '07:00', name: 'Yoga Matutino', instructor: 'Laura', duration: 60, spots: 15 },
        { time: '18:00', name: 'CrossFit', instructor: 'Marcos', duration: 45, spots: 12 },
      ],
    },
    {
      day: 'Martes',
      classes: [
        { time: '08:00', name: 'Pilates', instructor: 'Ana', duration: 50, spots: 10 },
        { time: '19:00', name: 'Spinning', instructor: 'Carlos', duration: 45, spots: 20 },
      ],
    },
  ],
  membershipPlans: [
    {
      name: 'Plan Básico',
      price: '150.000',
      period: 'mes',
      description: 'Acceso a área de musculación',
      features: ['Acceso ilimitado', 'Casillero', '1 clase grupal por semana'],
      cta: 'Suscribirse',
    },
    {
      name: 'Plan Premium',
      price: '280.000',
      period: 'mes',
      description: 'Acceso completo + clases ilimitadas',
      features: ['Todo lo del Plan Básico', 'Clases ilimitadas', 'Sauna', 'Invitados'],
      popular: true,
      cta: 'Suscribirse',
    },
  ],
  team: [
    { name: 'Marcos Silva', role: 'Entrenador Principal', bio: 'Certificado en CrossFit y Powerlifting' },
    { name: 'Laura Benítez', role: 'Instructora de Yoga', bio: 'Instructora certificada 500hrs' },
  ],
}

/**
 * Beauty salon business data
 */
export const beautySalonBusiness: BusinessData = {
  name: 'Elegance Beauty Spa',
  slug: 'elegance-beauty-spa',
  type: 'salon_belleza' as BusinessType,
  tagline: 'Belleza y relajación en un solo lugar',
  city: 'Asunción',
  neighborhood: 'San Jorge',
  address: 'Av. Santa Teresa 321',
  phone: '+595-21-456-7890',
  whatsapp: '+595-984-567890',
  hours: {
    'Lunes - Sábado': '09:00 - 19:00',
    'Domingo': 'Cerrado',
  },
  services: [
    { name: 'Manicure', description: 'Cuidado completo de manos', price: '40.000', duration: 45, category: 'Uñas' },
    { name: 'Pedicure', description: 'Cuidado completo de pies', price: '50.000', duration: 60, category: 'Uñas' },
    { name: 'Facial', description: 'Limpieza facial profunda', priceFrom: '80.000', duration: 75, category: 'Facial' },
    { name: 'Masaje Relajante', description: 'Masaje de cuerpo completo', price: '120.000', duration: 60, category: 'Masajes' },
  ],
}

/**
 * Business without optional fields (minimal data)
 */
export const sparseBusiness: BusinessData = {
  name: 'Minimal Studio',
  slug: 'minimal-studio',
  type: 'diseno_grafico' as BusinessType,
  city: 'Asunción',
}

/**
 * Array of all mock businesses for batch testing
 */
export const allMockBusinesses: BusinessData[] = [
  minimalBusiness,
  peluqueriaBusiness,
  restaurantBusiness,
  gymBusiness,
  beautySalonBusiness,
  sparseBusiness,
]

/**
 * Helper function to create custom business data
 */
export function createMockBusiness(overrides: Partial<BusinessData> = {}): BusinessData {
  return {
    name: 'Mock Business',
    slug: 'mock-business',
    type: 'peluqueria' as BusinessType,
    city: 'Asunción',
    ...overrides,
  }
}

/**
 * Generate array of mock businesses for stress testing
 */
export function generateMockBusinesses(count: number): BusinessData[] {
  return Array.from({ length: count }, (_, i) => ({
    name: `Business ${i + 1}`,
    slug: `business-${i + 1}`,
    type: 'peluqueria' as BusinessType,
    city: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque'][i % 4],
    neighborhood: i % 2 === 0 ? 'Villa Morra' : undefined,
  }))
}

/**
 * Mock data with special characters and edge cases
 */
export const specialCharacterBusiness: BusinessData = {
  name: 'Cafetería "El Buen Sabor" & Co.',
  slug: 'cafeteria-el-buen-sabor-co',
  type: 'restaurant' as BusinessType,
  city: 'Asunción',
  neighborhood: 'Villa Morra',
  address: 'Av. Mcal. López N° 1234, Piso 2',
  phone: '+595 (21) 123-4567',
}

/**
 * Mock lead data for import testing
 */
export const mockLeadData = {
  name: 'María González',
  businessName: 'Salón de Belleza María',
  phone: '+595 981 123456',
  email: 'maria@ejemplo.com',
  city: 'Asunción',
  vertical: 'peluqueria',
  source: 'facebook_ad',
  status: 'new',
}

/**
 * Mock CSV data rows for lead import testing
 */
export const mockCsvRows = [
  {
    Nombre: 'Juan Pérez',
    'Nombre del Negocio': 'Barbería El Estilo',
    Teléfono: '+595 981 111111',
    Email: 'juan@ejemplo.com',
    Ciudad: 'Asunción',
    Rubro: 'barberia',
  },
  {
    Nombre: 'Ana López',
    'Nombre del Negocio': 'Spa Relax',
    Teléfono: '+595 982 222222',
    Email: 'ana@ejemplo.com',
    Ciudad: 'Ciudad del Este',
    Rubro: 'spa',
  },
  {
    Nombre: 'Carlos Ruiz',
    'Nombre del Negocio': '',
    Teléfono: '+595 983 333333',
    Email: 'carlos@ejemplo.com',
    Ciudad: 'San Lorenzo',
    Rubro: 'gimnasio',
  },
]
