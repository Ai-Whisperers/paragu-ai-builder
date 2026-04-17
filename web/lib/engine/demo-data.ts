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
    classSchedule: [
      { day: 'Lunes', classes: [
        { time: '07:00', name: 'Crossfit', instructor: 'Carlos', duration: 45, spots: 15 },
        { time: '09:00', name: 'Yoga Flow', instructor: 'Lucia', duration: 60, spots: 20 },
        { time: '12:00', name: 'Spinning', instructor: 'Maria', duration: 45, spots: 25 },
        { time: '18:00', name: 'HIIT', instructor: 'Carlos', duration: 30, spots: 15 },
        { time: '19:30', name: 'Pilates', instructor: 'Lucia', duration: 50, spots: 20 },
      ]},
      { day: 'Martes', classes: [
        { time: '07:00', name: 'Funcional', instructor: 'Pedro', duration: 45, spots: 15 },
        { time: '09:00', name: 'Yoga Principiantes', instructor: 'Lucia', duration: 60, spots: 20 },
        { time: '12:00', name: 'Musculacion', instructor: 'Carlos', duration: 60, spots: 30 },
        { time: '18:00', name: 'Boxeo', instructor: 'Pedro', duration: 45, spots: 20 },
        { time: '20:00', name: 'Stretching', instructor: 'Lucia', duration: 45, spots: 20 },
      ]},
      { day: 'Miercoles', classes: [
        { time: '07:00', name: 'Crossfit', instructor: 'Carlos', duration: 45, spots: 15 },
        { time: '09:00', name: 'Yoga Vinyasa', instructor: 'Lucia', duration: 60, spots: 20 },
        { time: '12:00', name: 'Spinning', instructor: 'Maria', duration: 45, spots: 25 },
        { time: '18:00', name: 'TRX', instructor: 'Pedro', duration: 45, spots: 15 },
        { time: '19:30', name: 'Yoga Restaurativo', instructor: 'Lucia', duration: 60, spots: 20 },
      ]},
      { day: 'Jueves', classes: [
        { time: '07:00', name: 'Funcional', instructor: 'Pedro', duration: 45, spots: 15 },
        { time: '09:00', name: 'Yoga Flow', instructor: 'Lucia', duration: 60, spots: 20 },
        { time: '12:00', name: 'Musculacion', instructor: 'Carlos', duration: 60, spots: 30 },
        { time: '18:00', name: 'HIIT', instructor: 'Carlos', duration: 30, spots: 15 },
        { time: '20:00', name: 'Boxeo', instructor: 'Pedro', duration: 45, spots: 20 },
      ]},
      { day: 'Viernes', classes: [
        { time: '07:00', name: 'Crossfit', instructor: 'Carlos', duration: 45, spots: 15 },
        { time: '09:00', name: 'Yoga Principiantes', instructor: 'Lucia', duration: 60, spots: 20 },
        { time: '12:00', name: 'Spinning', instructor: 'Maria', duration: 45, spots: 25 },
        { time: '18:00', name: 'Funcional', instructor: 'Pedro', duration: 45, spots: 15 },
      ]},
      { day: 'Sabado', classes: [
        { time: '09:00', name: 'Crossfit', instructor: 'Carlos', duration: 60, spots: 15 },
        { time: '11:00', name: 'Yoga', instructor: 'Lucia', duration: 60, spots: 20 },
      ]},
    ],
    membershipPlans: [
      { name: 'Basico', price: '120.000', period: 'mes', description: 'Acceso a sala de pesas', features: ['Sala de pesas', 'Guardarropa', 'Agua'], popular: false },
      { name: 'Clases Ilimitadas', price: '200.000', period: 'mes', description: 'Acceso a todas las clases', features: ['Sala de pesas', 'Todas las clases', 'Spinning', 'Acceso 24/7'], popular: true },
      { name: 'Premium', price: '350.000', period: 'mes', description: 'Todo incluido + trainer', features: ['Todo del Plan Clases', '4 trainer/month', 'Plan nutricional', 'App propia'], popular: false },
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
    ],
    testimonials: [
      { quote: 'Mi portada quedo increible! Dayah entendio perfectamente la esencia de mi libro.', author: 'Maria G.', rating: 5 },
      { quote: 'Profesional, creativa y super rapida. Mi portada premade fue amor a primera vista.', author: 'Carlos R.', rating: 5 },
    ],
  },

  'barberia-clasica': {
    name: 'Barberia Clasica',
    slug: 'barberia-clasica',
    type: 'barberia',
    tagline: 'Tradicion y estilo en cada corte',
    city: 'Asuncion',
    neighborhood: 'Centro',
    address: 'Av. Colon 1234',
    phone: '+595982222222',
    whatsapp: '+595982222222',
    instagram: '@barberiaclasica.py',
    facebook: 'BarberiaClasicaPy',
    hours: {
      'Lunes - Viernes': '08:00 - 20:00',
      'Sabado': '08:00 - 18:00',
      'Domingo': '09:00 - 14:00',
    },
    services: [
      { name: 'Corte Clasico', price: '45.000 Gs', duration: 30, description: 'Corte con maquina y tijera estilo tradicional' },
      { name: 'Corte Moderno', price: '50.000 Gs', duration: 35, description: 'Corte con fade y disenos' },
      { name: 'Arreglo de Barba', price: '25.000 Gs', duration: 20, description: 'Arreglo y perfilado de barba' },
      { name: 'Afeitado Tradicional', price: '35.000 Gs', duration: 30, description: 'Afeitado con navaja y toalla caliente' },
      { name: 'Corte + Barba', price: '60.000 Gs', duration: 50, description: 'Paquete completo' },
    ],
    team: [
      { name: 'Roberto Diaz', role: 'Barbero Principal', bio: '20 anos de experiencia en cortes clasicos' },
      { name: 'Jorge Meza', role: 'Especialista en Barba', bio: 'Maestro del afeitado tradicional' },
    ],
    testimonials: [
      { quote: 'El mejor lugar para un corte serio. Roberto es un artista.', author: 'Miguel A.', rating: 5 },
      { quote: 'Afeitado perfecto, como en los viejos tiempos.', author: 'Juan C.', rating: 5 },
    ],
  },

  'unas-y-mas': {
    name: 'Unas Y Mas',
    slug: 'unas-y-mas',
    type: 'unas',
    tagline: 'Manos y pies perfectos',
    city: 'Asuncion',
    neighborhood: 'Mburuvicha',
    address: 'Av. Mburuvicha 2345',
    phone: '+595983333333',
    whatsapp: '+595983333333',
    instagram: '@unasymaas.py',
    hours: {
      'Lunes - Sabado': '09:00 - 19:00',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Manicure Classic', price: '40.000 Gs', duration: 45, description: 'Manicure basico con-esmaltado' },
      { name: 'Manicure Spa', price: '55.000 Gs', duration: 60, description: 'Con hidratacion y masajes' },
      { name: 'Pedicure Spa', price: '65.000 Gs', duration: 60, description: 'Exfoliacion, hidradacion y-esmaltado' },
      { name: 'Uñas Acrilicas', price: '100.000 Gs', duration: 90, description: 'Esculpidas con diseno basico' },
      { name: 'Nail Art', price: '30.000 Gs', duration: 30, description: 'Decoracion artesanal por uña' },
      { name: 'Gel Polish', price: '50.000 Gs', duration: 45, description: 'Esmalte semipermanente' },
    ],
    team: [
      { name: 'Claudia Fernandez', role: 'Nail Artist', bio: 'Especialista en Nail Art con 10 anos de experiencia' },
    ],
    testimonials: [
      { quote: 'Mis unas nunca lucieron tan bien. Claudia es una artista!', author: 'Silvia R.', rating: 5 },
      { quote: 'El mejor nail spa de la ciudad. Muy limpio y profesional.', author: 'Andrea M.', rating: 5 },
    ],
  },

  'tinta-viva': {
    name: 'Tinta Viva Tattoo',
    slug: 'tinta-viva',
    type: 'tatuajes',
    tagline: 'Arte permanente en tu piel',
    city: 'Asuncion',
    neighborhood: 'Villa Morra',
    address: 'Cambaspy 567',
    phone: '+595984444444',
    whatsapp: '+595984444444',
    instagram: '@tintaviva.tattoo',
    hours: {
      'Martes - Domingo': '14:00 - 22:00',
      'Lunes': 'Cerrado',
    },
    services: [
      { name: 'Tatuaje Pequeno', price: 'Desde 150.000 Gs', duration: 60, description: 'Hasta 5cm, lineas simples' },
      { name: 'Tatuaje Mediano', price: 'Desde 300.000 Gs', duration: 120, description: '5-15cm, detalle moderado' },
      { name: 'Tatuaje Grande', price: 'Desde 600.000 Gs', duration: 180, description: 'Mas de 15cm, alta complejidad' },
      { name: 'Cover Up', price: 'Consultar', duration: 180, description: 'Cobertura de tatuajes anteriores' },
      { name: 'Consulta de Diseno', price: 'Gratis', duration: 30, description: 'Revision y propuesta de diseno' },
    ],
    team: [
      { name: 'Lucas Pereira', role: 'Tatuador Principal', bio: 'Especialista en realismo y blackwork' },
      { name: 'Sofia Lopez', role: 'Artista', bio: 'Especialista enacuarela y dise nos minimalistas' },
    ],
    testimonials: [
      { quote: 'Increible trabajo. Mi realismo quedo exactamente como lo queria.', author: 'Diego K.', rating: 5 },
      { quote: 'Ambiente muy limpio y profesional. Recomendado 100%.', author: 'Pablo R.', rating: 5 },
    ],
  },

  'belleza-integral': {
    name: 'Belleza Integral Center',
    slug: 'belleza-integral',
    type: 'estetica',
    tagline: 'Tu belleza nuestra prioridad',
    city: 'Asuncion',
    neighborhood: 'Las Carmelitas',
    address: 'Av. Madame Lynch 890',
    phone: '+595985555555',
    whatsapp: '+595985555555',
    instagram: '@bellezaintegral.py',
    hours: {
      'Lunes - Viernes': '08:00 - 20:00',
      'Sabado': '08:00 - 16:00',
    },
    services: [
      { name: 'Limpieza Facial', price: '80.000 Gs', duration: 60, description: 'Limpieza profunda con extraccion' },
      { name: 'Facial Anti-Edad', price: '120.000 Gs', duration: 90, description: 'Tratamiento con radiofrecuencia y laboratorios' },
      { name: 'Drenaje Linfatico', price: '90.000 Gs', duration: 60, description: 'Masaje reductor y detox' },
      { name: 'Tratamiento Corporal', price: '100.000 Gs', duration: 75, description: 'Celulitis y flacidez' },
      { name: 'Depilacion Laser', price: '200.000 Gs', duration: 60, description: 'Zona completa, paquete de 6 sesiones' },
    ],
    team: [
      { name: 'Dra. Maria Jose Ruiz', role: 'Esteticista', bio: 'Medicina estetica con 15 anos de experiencia' },
      { name: 'Lic. Ana Garcia', role: 'Cosmetologa', bio: 'Especialista en tratamientos faciales' },
    ],
    testimonials: [
      { quote: 'Mis tratamientos faciales aqui son incomparables. Resultados reales.', author: 'Patricia S.', rating: 5 },
      { quote: 'Excelente atencion profesional. El drenaje linfatico es perfecto.', author: 'Monica L.', rating: 5 },
    ],
  },

  'studio-belleza': {
    name: 'Studio Belleza Makeup',
    slug: 'studio-belleza',
    type: 'salon_belleza',
    tagline: 'Estilo y glamour para cada ocasion',
    city: 'Asuncion',
    neighborhood: 'Punta Bravo',
    address: 'Av. Santa Teresa 456',
    phone: '+595986666666',
    whatsapp: '+595986666666',
    instagram: '@studiobelleza.py',
    facebook: 'StudioBellezaMakeup',
    hours: {
      'Lunes - Sabado': '09:00 - 19:00',
    },
    services: [
      { name: 'Maquillaje Social', price: '120.000 Gs', duration: 60, description: 'Maquillaje para eventos diurnos' },
      { name: 'Maquillaje Novia', price: '350.000 Gs', duration: 120, description: 'Maquillaje completo incluye prueba' },
      { name: 'Peinado Novia', price: '250.000 Gs', duration: 90, description: 'Peinado con prueba incluida' },
      { name: 'Maquillaje Artistico', price: '150.000 Gs', duration: 90, description: 'Disenos especiales, karneval, halloween' },
      { name: 'Maquillaje FX', price: '200.000 Gs', duration: 120, description: 'Efectos especiales, zombies, fantasia' },
    ],
    team: [
      { name: 'Camila Rodriguez', role: 'Maquilladora Profesional', bio: 'Certificada en Maquillaje Profissional, especializada en novias' },
    ],
    testimonials: [
      { quote: 'Mi boda fue perfecta. El maquillaje dure todo el dia y noche.', author: 'Florencia M.', rating: 5 },
      { quote: 'La mejor artista de maquillaje en Paraguay.神的 trabajo.', author: 'Karina B.', rating: 5 },
    ],
  },

  'pestanas-flore': {
    name: 'Pestanas Flore',
    slug: 'pestanas-flore',
    type: 'pestanas',
    tagline: 'Tu mirada nossa especialidade',
    city: 'Asuncion',
    neighborhood: 'Capiata',
    address: 'Av. Principal 789',
    phone: '+595987777777',
    whatsapp: '+595987777777',
    instagram: '@pestanasflore',
    hours: {
      'Lunes - Viernes': '09:00 - 18:00',
      'Sabado': '09:00 - 14:00',
    },
    services: [
      { name: 'Extension de Pestanas Clasicas', price: '180.000 Gs', duration: 90, description: 'Una extension por pestana natural' },
      { name: 'Extension de Pestanas Volumen', price: '220.000 Gs', duration: 120, description: 'Multiple extensiones por pestana' },
      { name: 'Extension de Pestanas Hibridas', price: '200.000 Gs', duration: 110, description: 'Mix de clasicas y volumen' },
      { name: 'Lifting de Pestanas', price: '85.000 Gs', duration: 60, description: 'Curvatura natural permanente' },
      { name: 'Diseño de Cejas', price: '35.000 Gs', duration: 30, description: 'Cejas perfectamente perfiladas' },
      { name: 'Retoque (2 semanas)', price: '80.000 Gs', duration: 45, description: 'Mantenimiento de extensiones' },
    ],
    team: [
      { name: 'Flore Martinez', role: 'Lash Artist', bio: 'Especialista en extensiones con certificacion internacional' },
    ],
    testimonials: [
      { quote: 'Mis pestanas nunca Lucian tan naturales y perfectas.', author: 'Romina D.', rating: 5 },
      { quote: 'La mejor! Me encanto el lifting. Mis pestanas tiene una curvatura hermosa.', author: 'Tamara V.', rating: 5 },
    ],
  },

  'depilacion-perfecta': {
    name: 'Depilacion Perfecta',
    slug: 'depilacion-perfecta',
    type: 'depilacion',
    tagline: 'Piel suave, libre de vello',
    city: 'Asuncion',
    neighborhood: 'Ninos',
    address: 'Av. Defensores del Chaco 123',
    phone: '+595988888888',
    whatsapp: '+595988888888',
    instagram: '@depilacionperfecta',
    hours: {
      'Lunes - Viernes': '08:00 - 20:00',
      'Sabado': '08:00 - 16:00',
    },
    services: [
      { name: 'Depilacion con Cera Caliente', price: '45.000 Gs', duration: 30, description: 'Zona:axilas, labio, menton' },
      { name: 'Depilacion Piernas Completo', price: '120.000 Gs', duration: 60, description: 'Piernas enteras' },
      { name: 'Depilacion Bikini', price: '50.000 Gs', duration: 30, description: 'Zona bikini clasica' },
      { name: 'Depilacion Brazilena', price: '70.000 Gs', duration: 40, description: 'Remocion completa' },
      { name: 'Depilacion Laser - Facial', price: '250.000 Gs', duration: 30, description: 'Sesion facial completa' },
      { name: 'Depilacion Laser - Cuerpo', price: '350.000 Gs', duration: 60, description: 'Sesion cuerpo completo' },
    ],
    testimonials: [
      { quote: 'La mejor depilacion. Piel super suave por semanas.', author: 'Elena G.', rating: 5 },
      { quote: 'Personal muy profesional y locales immaculados.', author: 'Lorena P.', rating: 5 },
    ],
  },

  'maquillaje-arte': {
    name: 'Maquillaje Arte',
    slug: 'maquillaje-arte',
    type: 'maquillaje',
    tagline: 'Tu look perfecto para cada ocasion',
    city: 'Asuncion',
    neighborhood: 'Villa Morra',
    address: 'Av. Espana 1450',
    phone: '+595981555444',
    whatsapp: '+595981555444',
    instagram: '@maquillajearte.py',
    hours: {
      'Lunes - Viernes': '09:00 - 19:00',
      'Sabado': '08:00 - 18:00',
      'Domingo': 'Solo con cita previa',
    },
    services: [
      { name: 'Maquillaje Social', price: '180.000 Gs', duration: 60, description: 'Ideal para eventos, fiestas y reuniones' },
      { name: 'Maquillaje de Novia', price: '650.000 Gs', duration: 120, description: 'Incluye prueba previa y retoque el dia del evento' },
      { name: 'Maquillaje XV Anos', price: '350.000 Gs', duration: 90, description: 'Look glamoroso para tu fiesta de quince' },
      { name: 'Maquillaje Editorial', priceFrom: '250.000 Gs', duration: 90, description: 'Para sesiones de fotos y producciones' },
      { name: 'Curso Basico de Automaquillaje', price: '400.000 Gs', duration: 180, description: 'Aprende a maquillarte paso a paso' },
    ],
    team: [
      { name: 'Lucia Benitez', role: 'Makeup Artist Senior', bio: 'Certificada en Make Up For Ever Academy, 10 anos de experiencia en novias y editorial.' },
      { name: 'Camila Ortega', role: 'Makeup Artist', bio: 'Especialista en maquillaje social y efectos para produccion fotografica.' },
    ],
    testimonials: [
      { quote: 'Lucia hizo mi maquillaje de novia y fue un sueno. Duro todo el dia impecable.', author: 'Valeria C.', rating: 5 },
      { quote: 'La mejor experiencia para mis XV. El look fue exactamente lo que queria.', author: 'Sofia M.', rating: 5 },
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
