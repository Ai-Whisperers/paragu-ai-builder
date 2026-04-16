/**
 * Demo business data for development and testing.
 * In production, this data comes from Supabase.
 */

import type { BusinessData } from './compose'

export const DEMO_BUSINESSES: Record<string, BusinessData> = {
  'salon-maria': {
    name: 'Salon Maria',
    slug: 'salon-maria',
    type: 'peluqueria',
    tagline: 'Tu mejor look comienza aqui',
    city: 'Asuncion',
    neighborhood: 'Villa Morra',
    address: 'Av. Mcal. Lopez 3245',
    phone: '+595981234567',
    email: 'info@salonmaria.com.py',
    whatsapp: '+595981234567',
    instagram: '@salonmaria.py',
    facebook: 'salonmaria.py',
    hours: {
      'Lunes - Viernes': '08:00 - 19:00',
      'Sabado': '09:00 - 17:00',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Corte Dama', price: '80.000 Gs', duration: 45, description: 'Corte y style profesional', category: 'Cortes' },
      { name: 'Corte Caballero', price: '50.000 Gs', duration: 30, description: 'Corte moderno y clasico', category: 'Cortes' },
      { name: 'Coloracion Completa', priceFrom: '150.000 Gs', duration: 90, description: 'Color base completo', category: 'Color' },
      { name: 'Mechas/Highlighting', priceFrom: '200.000 Gs', duration: 120, description: 'Para brillo natural', category: 'Color' },
      { name: 'Balayage', priceFrom: '250.000 Gs', duration: 150, description: 'Tecnica francesa de mano alzada', category: 'Color' },
      { name: 'Keratina Intensiva', price: '300.000 Gs', duration: 120, description: 'Alisa y repara', category: 'Tratamientos' },
    ],
    team: [
      { name: 'Maria Gonzalez', role: 'Directora & Estilista Senior', bio: 'Con 15 anos de experiencia en coloracion y cortes de tendencia.' },
      { name: 'Ana Benitez', role: 'Colorista', bio: 'Especialista en balayage y mechas naturales.' },
      { name: 'Carlos Ruiz', role: 'Estilista', bio: 'Experto en cortes modernos para dama y caballero.' },
    ],
    testimonials: [
      { quote: 'El mejor salon de Asuncion! Maria siempre sabe exactamente lo que quiero.', author: 'Laura P.', rating: 5 },
      { quote: 'Mi balayage quedo increible. Totalmente recomendado.', author: 'Patricia M.', rating: 5 },
      { quote: 'Atencion de primera. Siempre salgo feliz del salon.', author: 'Sofia R.', rating: 4 },
    ],
  },

  'gymfit-py': {
    name: 'GymFit Paraguay',
    slug: 'gymfit-py',
    type: 'gimnasio',
    tagline: 'Transforma tu cuerpo, transforma tu vida',
    city: 'Asuncion',
    neighborhood: 'Centro',
    address: 'Av. Espana 1234',
    phone: '+595987654321',
    whatsapp: '+595987654321',
    instagram: '@gymfit.py',
    hours: {
      'Lunes - Viernes': '06:00 - 22:00',
      'Sabado': '07:00 - 18:00',
      'Domingo': '08:00 - 14:00',
    },
    services: [
      { name: 'Musculacion', price: '150.000 Gs/mes', description: 'Acceso completo a la sala de pesas' },
      { name: 'Crossfit', price: '200.000 Gs/mes', description: 'Clases de alta intensidad' },
      { name: 'Yoga', price: '120.000 Gs/mes', description: 'Clases de yoga y meditacion' },
      { name: 'Personal Trainer', priceFrom: '300.000 Gs/mes', description: 'Entrenamiento personalizado' },
      { name: 'Plan Full', price: '250.000 Gs/mes', description: 'Acceso a todas las actividades' },
    ],
    team: [
      { name: 'Carlos Benitez', role: 'Entrenador Principal', bio: 'Certificado NSCA con 10 anos de experiencia.' },
      { name: 'Lucia Fernandez', role: 'Instructora de Yoga', bio: 'Formada en India, 8 anos ensenando.' },
    ],
    testimonials: [
      { quote: 'Baje 15 kilos en 6 meses. El equipo de GymFit es increible.', author: 'Roberto G.', rating: 5 },
      { quote: 'Las clases de crossfit son brutales pero los resultados hablan.', author: 'Marcos V.', rating: 5 },
    ],
  },

  'spa-serenidad': {
    name: 'Spa Serenidad',
    slug: 'spa-serenidad',
    type: 'spa',
    tagline: 'Tu oasis de paz en la ciudad',
    city: 'Asuncion',
    neighborhood: 'Carmelitas',
    address: 'Calle Primera 567',
    phone: '+595976543210',
    email: 'reservas@spaserenidad.com.py',
    whatsapp: '+595976543210',
    instagram: '@spa.serenidad',
    services: [
      { name: 'Masaje Relajante', price: '180.000 Gs', duration: 60, description: 'Masaje de cuerpo completo' },
      { name: 'Facial Anti-Edad', price: '200.000 Gs', duration: 75, description: 'Tratamiento rejuvenecedor' },
      { name: 'Circuito Spa', price: '250.000 Gs', duration: 120, description: 'Sauna + piscina + masaje' },
      { name: 'Aromaterapia', price: '150.000 Gs', duration: 60, description: 'Masaje con aceites esenciales' },
    ],
    testimonials: [
      { quote: 'Un lugar magico. Sali flotando despues del circuito spa.', author: 'Carmen L.', rating: 5 },
      { quote: 'El mejor spa de Asuncion sin duda. Servicio impecable.', author: 'Diana R.', rating: 5 },
    ],
  },

  'lealtis-py': {
    name: 'Lealtis',
    slug: 'lealtis-py',
    type: 'relocation',
    tagline: 'Establecimiento operativo en Paraguay. Profesional, integrado, sin sorpresas.',
    city: 'Asuncion',
    address: 'Asuncion, Paraguay',
    phone: '+595981000000',
    email: 'info@lealtis.com',
    whatsapp: '+595981000000',
    instagram: '@lealtis.py',
    hours: {
      'Lunes - Viernes': '09:00 - 18:00',
      'Sabado': '10:00 - 14:00',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Residencia Paraguaya', description: 'Gestion integral del proceso de residencia permanente. Validacion documental, presentacion ante autoridades, seguimiento hasta emision (45-60 dias).', category: 'Servicios Migratorios' },
      { name: 'Cedula de Identidad', description: 'Gestion coordinada del documento de identidad nacional, procesada junto con la residencia.', category: 'Servicios Migratorios' },
      { name: 'Constitucion de Sociedad', description: 'Analisis del tipo societario (EAS, SA), redaccion de estatutos, inscripcion registral. Sociedad operativa desde el primer dia.', category: 'Servicios Empresariales' },
      { name: 'Registro Fiscal (RUC)', description: 'Inscripcion ante DNIT, estructuracion de obligaciones fiscales, habilitacion para facturacion.', category: 'Servicios Empresariales' },
      { name: 'Cuenta Bancaria Empresarial', description: 'Preparacion de perfil financiero, coordinacion institucional, documentacion AML/KYC, seguimiento hasta habilitacion.', category: 'Servicios Bancarios' },
      { name: 'Tour Inmobiliario Estrategico', description: 'Visitas privadas a desarrolladoras, proyectos en curso, analisis tecnico y conversaciones con actores del sector.', category: 'Servicios de Inversion' },
      { name: 'Contabilidad Empresarial (12 meses)', description: 'Gestion contable mensual, presentaciones tributarias, reportes de cumplimiento fiscal.', category: 'Contabilidad y Asesoria' },
      { name: 'Asesoria Legal y Fiscal (12 meses)', description: 'Consultas legales continuas, revision de contratos, evaluacion normativa, estructuracion fiscal.', category: 'Contabilidad y Asesoria' },
    ],
    team: [
      { name: 'Daniel', role: 'Director de Operaciones', bio: 'Liderazgo operativo en Paraguay. Relaciones institucionales y bancarias construidas durante anos. Supervision del equipo tecnico.' },
      { name: 'Equipo Legal', role: 'Abogados', bio: 'Expedientes migratorios, constitucion societaria y asesoria juridica continua. Experiencia directa en el mercado paraguayo.' },
      { name: 'Equipo Contable', role: 'Contadores', bio: 'Gestion fiscal, contabilidad, cumplimiento tributario e inscripcion de RUC ante DNIT.' },
      { name: 'Asesor Financiero', role: 'Coordinacion Bancaria', bio: 'Perfil KYC, coordinacion con entidades bancarias, orientacion de inversiones.' },
      { name: 'Coordinacion', role: 'Logistica y Seguimiento', bio: 'Chofer exclusivo, traslados, coordinacion de agenda y seguimiento de procesos.' },
    ],
    testimonials: [
      { quote: 'Todo el proceso fue impecable. Llegue a Paraguay y en una manana tenia todo presentado. Increible eficiencia.', author: 'Jan V.', role: 'Inversor, Paises Bajos', rating: 5 },
      { quote: 'La apertura de cuenta bancaria es lo mas dificil para extranjeros, y ellos lo resolvieron de manera profesional.', author: 'Thomas K.', role: 'Consultor, Alemania', rating: 5 },
      { quote: 'Un equipo que habla nuestro idioma y entiende nuestras preocupaciones. Nos sentimos acompanados en cada paso.', author: 'Erik & Sophie', role: 'Familia, Belgica', rating: 5 },
    ],
  },

  'dayah-litworks': {
    name: 'Dayah LitWorks',
    slug: 'dayah-litworks',
    type: 'diseno_grafico',
    tagline: 'Donde la fantasia se convierte en realidad',
    city: 'Asuncion',
    email: 'dayah@litworks.com',
    whatsapp: '+595981000000',
    instagram: '@dayah.litworks',
    services: [
      { name: 'Portada Personalizada - Ebook', price: 'Consultar', description: 'Diseno exclusivo para tu ebook, incluye revisiones', category: 'Portadas Personalizadas' },
      { name: 'Portada Personalizada - Tapa Blanda', price: 'Consultar', description: 'Portada completa (frente, lomo y contra) para impresion', category: 'Portadas Personalizadas' },
      { name: 'Mockup 3D Estatico', price: 'Consultar', description: 'Imagen realista de tu libro en 3D', category: 'Mockups 3D' },
      { name: 'Video Mockup 3D', price: 'Consultar', description: 'Animacion profesional de tu portada', category: 'Mockups 3D' },
    ],
    products: [
      { name: 'Susurros del Bosque', price: '$35', description: 'Portada premade - Fantasia/Romance', category: 'Fantasia', imageUrl: '', available: true },
      { name: 'Corazon de Cenizas', price: '$35', description: 'Portada premade - Romance Oscuro', category: 'Romance', imageUrl: '', available: true },
      { name: 'El Ultimo Codigo', price: '$30', description: 'Portada premade - Thriller/Suspenso', category: 'Thriller', imageUrl: '', available: true },
      { name: 'Galaxia Interior', price: '$35', description: 'Portada premade - Ciencia Ficcion', category: 'Ciencia Ficcion', imageUrl: '', available: true },
      { name: 'Sombras en el Espejo', price: '$30', description: 'Portada premade - Terror/Horror', category: 'Terror', imageUrl: '', available: true },
      { name: 'Alas de Cristal', price: '$35', description: 'Portada premade - Fantasia Juvenil', category: 'Fantasia', imageUrl: '', available: true },
      { name: 'Renacer', price: '$30', description: 'Portada premade - No Ficcion/Autoayuda', category: 'No Ficcion', imageUrl: '', available: true },
      { name: 'Laberinto de Rosas', price: '$35', description: 'Portada premade - Romance Historico', category: 'Romance', imageUrl: '', available: true },
      { name: 'Noche Eterna', price: '$30', description: 'Portada premade - Fantasia Oscura', category: 'Fantasia', imageUrl: '', available: true },
      { name: 'El Despertar', price: '$35', description: 'Portada premade - Ciencia Ficcion', category: 'Ciencia Ficcion', imageUrl: '', available: true },
      { name: 'Fuego y Destino', price: '$35', description: 'Portada premade - Fantasia Epica', category: 'Fantasia', imageUrl: '', available: true },
      { name: 'Verdades Ocultas', price: '$30', description: 'Portada premade - Thriller Psicologico', category: 'Thriller', imageUrl: '', available: true },
    ],
    testimonials: [
      { quote: 'Mi portada quedo increible! Dayah entendio perfectamente la esencia de mi libro.', author: 'Maria G.', rating: 5 },
      { quote: 'Profesional, creativa y super rapida. Mi portada premade fue amor a primera vista.', author: 'Carlos R.', rating: 5 },
      { quote: 'El mockup 3D le dio vida a mi libro antes de publicarlo. Totalmente recomendada.', author: 'Ana L.', rating: 5 },
    ],
  },
}

/**
 * Get a demo business by slug, or null if not found.
 */
export function getDemoBusiness(slug: string): BusinessData | null {
  return DEMO_BUSINESSES[slug] || null
}

/**
 * Get all demo business slugs for static generation.
 */
export function getAllDemoSlugs(): string[] {
  return Object.keys(DEMO_BUSINESSES)
}
