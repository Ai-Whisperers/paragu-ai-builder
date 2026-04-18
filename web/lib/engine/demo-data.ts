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

  'de-abasto-a-casa': {
    name: 'De Abasto a Casa',
    slug: 'de-abasto-a-casa',
    type: 'meal_prep',
    tagline: 'Mercado, prep y comidas listas. Puerta a puerta, en San Lorenzo.',
    city: 'San Lorenzo',
    neighborhood: 'Ciudad Universitaria',
    address: 'San Lorenzo (ciudad completa)',
    phone: '+595000000000',
    email: 'hola@deabastoacasa.com.py',
    whatsapp: '+595000000000',
    instagram: '@deabastoacasa',
    hours: {
      'Lunes - Viernes': '08:00 - 19:00 (coordinacion por WhatsApp)',
      'Martes y Jueves': 'Compras en Abasto + mercado',
      'Sabado': '09:00 - 14:00 (entregas)',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Nivel 1 - Basico', price: '250.000 Gs/semana', duration: 120, description: 'Lista corta, 1 proveedor. Hasta 15 productos. Delivery incluido.', category: 'Compras (Raw)' },
      { name: 'Nivel 1 - Completo', price: '400.000 Gs/semana', duration: 180, description: 'Lista completa + Abasto + mercado + almacen. Delivery y organizado.', category: 'Compras (Raw)' },
      { name: 'Nivel 2 - Individual', price: '400.000 Gs/semana', duration: 240, description: '1 persona. Prep basico: proteina + carbos + vegetales, sellado al vacio.', category: 'Mise-en-Place' },
      { name: 'Nivel 2 - Pareja', price: '650.000 Gs/semana', duration: 300, description: '2 personas. Prep completo + organizacion de heladera/freezer.', category: 'Mise-en-Place' },
      { name: 'Nivel 2 - Familia', price: '900.000 Gs/semana', duration: 360, description: '3-4 personas. Variedad, sustituciones y porciones para la semana.', category: 'Mise-en-Place' },
      { name: 'Nivel 3 - 10 comidas/sem', priceFrom: '1.200.000 Gs/semana', duration: 480, description: 'Comidas listas, selladas al vacio. Proximamente (en habilitacion INAN).', category: 'Comidas Listas' },
      { name: 'Nivel 3 - 15 comidas/sem', priceFrom: '1.700.000 Gs/semana', duration: 540, description: 'Pack familiar, 3 comidas/dia. Proximamente (en habilitacion INAN).', category: 'Comidas Listas' },
      { name: 'Add-on: Desayunos', price: '+400.000 Gs/mes', description: 'Desayunos listos para la semana.', category: 'Add-on' },
      { name: 'Add-on: Postres', price: '+200.000 Gs/mes', description: 'Postres caseros sumados al pack.', category: 'Add-on' },
      { name: 'Add-on: Bebidas/snacks', price: '+300.000 Gs/mes', description: 'Bebidas y snacks saludables.', category: 'Add-on' },
    ],
    team: [
      { name: 'Ivan Weiss van der Pol', role: 'Fundador & Chef de Mercado', bio: 'Del caos del mercado y la cocina a sistemas que funcionan. Proveedor propio en Abasto, prep semanal para clientes en San Lorenzo desde 2025.' },
    ],
    testimonials: [
      { quote: 'Recupere 20+ horas al mes. No vuelvo a cocinar todos los dias. [Testimonio ilustrativo - clientes reales pronto]', author: 'Remoto Global', role: 'Cliente ilustrativo', rating: 5 },
      { quote: 'La proteina sellada al vacio dura 4 meses en freezer sin perder sabor. Cambia todo. [Testimonio ilustrativo]', author: 'Profesional Medico', role: 'Cliente ilustrativo', rating: 5 },
      { quote: 'Primera vez que pago un servicio con numeros honestos. No me inflan, me muestran. [Testimonio ilustrativo]', author: 'Pareja Commuter', role: 'Clientes ilustrativos', rating: 5 },
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

  'makeup-studio': {
    name: 'Makeup Studio',
    slug: 'makeup-studio',
    type: 'maquillaje',
    tagline: 'Resalta tu belleza natural',
    city: 'Asuncion',
    neighborhood: 'Villa Morra',
    address: 'Av. Santa Teresa 1234',
    phone: '+595981112233',
    whatsapp: '+595981112233',
    instagram: '@makeupstudio.py',
    facebook: 'makeupstudio.py',
    hours: {
      'Lunes - Sabado': '09:00 - 19:00',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Maquillaje Social', price: '150.000 Gs', duration: 60, description: 'Maquillaje para eventos y fiestas', category: 'Maquillaje' },
      { name: 'Maquillaje Novia', price: '350.000 Gs', duration: 90, description: 'Maquillaje nupcial con prueba incluida', category: 'Novias' },
      { name: 'Maquillaje Quinceañera', price: '200.000 Gs', duration: 60, description: 'Maquillaje especial para 15 años', category: 'Eventos' },
      { name: 'Clases Personalizadas', price: '500.000 Gs', duration: 120, description: 'Curso de automaquillaje individual', category: 'Cursos' },
      { name: 'Maquillaje Fotografico', price: '180.000 Gs', duration: 75, description: 'Maquillaje profesional para sesiones', category: 'Profesional' },
    ],
    team: [
      { name: 'Camila Benitez', role: 'Maquilladora Principal', bio: 'Especialista en maquillaje de novias y eventos sociales.' },
      { name: 'Lucia Mendez', role: 'Maquilladora Creativa', bio: 'Experta en maquillaje artistico y fotografico.' },
    ],
    testimonials: [
      { quote: 'Me maquillaron para mi boda y quede encantada. Duro toda la noche.', author: 'Andrea S.', rating: 5 },
      { quote: 'Las clases de automaquillaje cambiaron mi rutina diaria.', author: 'Maria L.', rating: 5 },
    ],
  },

  'inmobiliaria-py': {
    name: 'Inmobiliaria Paraguay',
    slug: 'inmobiliaria-py',
    type: 'inmobiliaria',
    tagline: 'Tu hogar ideal te espera',
    city: 'Asuncion',
    neighborhood: 'Centro',
    address: 'Av. Mariscal Lopez 1500',
    phone: '+595982223344',
    whatsapp: '+595982223344',
    instagram: '@inmobiliariapy',
    facebook: 'inmobiliariapy',
    hours: {
      'Lunes - Viernes': '08:00 - 18:00',
      'Sabado': '09:00 - 13:00',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Venta de Propiedades', price: 'Consultar', duration: 0, description: 'Casas, departamentos y terrenos', category: 'Ventas' },
      { name: 'Alquileres', price: 'Consultar', duration: 0, description: 'Propiedades en alquiler residencial y comercial', category: 'Alquileres' },
      { name: 'Tasaciones', price: '200.000 Gs', duration: 0, description: 'Valoracion profesional de inmuebles', category: 'Servicios' },
      { name: 'Asesoria Legal', price: 'Consultar', duration: 0, description: 'Tramites de escrituracion y documentacion', category: 'Legal' },
      { name: 'Administracion', price: '10% mensual', duration: 0, description: 'Gestion de propiedades alquiladas', category: 'Gestion' },
    ],
    team: [
      { name: 'Roberto Gonzalez', role: 'Corredor Inmobiliario', bio: '20 años de experiencia en el mercado inmobiliario paraguayo.' },
      { name: 'Patricia Ruiz', role: 'Asesora Comercial', bio: 'Especialista en propiedades residenciales de lujo.' },
      { name: 'Carlos Mendez', role: 'Abogado Inmobiliario', bio: 'Asesor legal especializado en bienes raices.' },
    ],
    testimonials: [
      { quote: 'Encontraron la casa perfecta para mi familia en solo 2 semanas.', author: 'Juan C.', rating: 5 },
      { quote: 'Muy profesionales en toda la documentacion. Sin complicaciones.', author: 'Ana M.', rating: 5 },
    ],
  },

  'legal-services': {
    name: 'Legal Services PY',
    slug: 'legal-services',
    type: 'legal',
    tagline: 'Asesoria legal integral',
    city: 'Asuncion',
    neighborhood: 'Centro',
    address: 'Palma y 14 de Mayo, Piso 3',
    phone: '+595983334455',
    whatsapp: '+595983334455',
    instagram: '@legalservicespy',
    facebook: 'legalservicespy',
    hours: {
      'Lunes - Viernes': '08:00 - 17:00',
      'Sabado': '09:00 - 12:00',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Derecho Civil', price: 'Consultar', duration: 0, description: 'Contratos, familia, sucesiones', category: 'Civil' },
      { name: 'Derecho Comercial', price: 'Consultar', duration: 0, description: 'Constitucion de empresas, contratos mercantiles', category: 'Comercial' },
      { name: 'Derecho Laboral', price: 'Consultar', duration: 0, description: 'Despidos, contratos laborales, accidentes', category: 'Laboral' },
      { name: 'Derecho Penal', price: 'Consultar', duration: 0, description: 'Defensa criminal, audiencias', category: 'Penal' },
      { name: 'Consulta Express', price: '150.000 Gs', duration: 60, description: 'Consulta legal de urgencia', category: 'Consultas' },
    ],
    team: [
      { name: 'Dr. Miguel Fernandez', role: 'Abogado Senior', bio: 'Especialista en derecho comercial y civil. 25 años de experiencia.' },
      { name: 'Dra. Laura Benitez', role: 'Abogada Laboral', bio: 'Experta en derecho laboral y conflictos de trabajo.' },
      { name: 'Dr. Carlos Ruiz', role: 'Abogado Penal', bio: 'Ex fiscal con amplia experiencia en defensa criminal.' },
    ],
    testimonials: [
      { quote: 'Me ayudaron con la constitucion de mi empresa. Excelente servicio.', author: 'Pedro M.', rating: 5 },
      { quote: 'Profesionales y muy atentos. Resolvieron mi caso laboral.', author: 'Luisa G.', rating: 5 },
    ],
  },

  'consultora-py': {
    name: 'Consultora PY',
    slug: 'consultora-py',
    type: 'consultoria',
    tagline: 'Impulsamos tu negocio al siguiente nivel',
    city: 'Asuncion',
    neighborhood: 'San Jorge',
    address: 'Av. Aviadores del Chaco 2500',
    phone: '+595984445566',
    whatsapp: '+595984445566',
    instagram: '@consultorapy',
    facebook: 'consultorapy',
    hours: {
      'Lunes - Viernes': '08:00 - 18:00',
      'Sabado': 'Cerrado',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Consultoria Estrategica', price: 'Consultar', duration: 0, description: 'Planificacion estrategica de negocios', category: 'Estrategia' },
      { name: 'Marketing Digital', price: 'Desde 1.500.000 Gs/mes', duration: 0, description: 'Gestion de redes, SEO, publicidad online', category: 'Marketing' },
      { name: 'Transformacion Digital', price: 'Consultar', duration: 0, description: 'Digitalizacion de procesos empresariales', category: 'Digital' },
      { name: 'Capacitaciones', price: 'Desde 500.000 Gs', duration: 240, description: 'Talleres para equipos de trabajo', category: 'Capacitacion' },
      { name: 'Analisis Financiero', price: 'Consultar', duration: 0, description: 'Evaluacion y optimizacion financiera', category: 'Finanzas' },
    ],
    team: [
      { name: 'Ricardo Mendez', role: 'Director Ejecutivo', bio: 'MBA con experiencia en consultoria para empresas Fortune 500.' },
      { name: 'Sofia Gonzalez', role: 'Consultora de Marketing', bio: 'Especialista en marketing digital y growth hacking.' },
      { name: 'Andres Benitez', role: 'Consultor Financiero', bio: 'Ex analista de inversiones bancarias.' },
    ],
    testimonials: [
      { quote: 'Nos ayudaron a duplicar nuestras ventas en 6 meses.', author: 'Empresa XYZ', rating: 5 },
      { quote: 'Profesionales de primer nivel. Muy recomendados.', author: 'Carlos M.', rating: 5 },
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
 * Relocation service demo businesses (Nexa Paraguay)
 */
export const RELOCATION_DEMO_BUSINESSES: Record<string, BusinessData> = {
  'nexaparaguay': {
    name: 'Nexa Paraguay',
    slug: 'nexaparaguay',
    type: 'relocation',
    tagline: 'Tu nuevo comienzo en Paraguay, simple y tranquilo.',
    city: 'Asuncion',
    neighborhood: 'Asuncion',
    address: 'Asuncion, Paraguay',
    phone: '+595984561234',
    email: 'contact@nexaparaguay.com',
    whatsapp: '+595984561234',
    instagram: '@nexaparaguay',
    facebook: 'nexaparaguay',
    hours: {
      'Lunes - Viernes': '09:00 - 18:00',
      'Sabado': '10:00 - 14:00',
      'Domingo': 'Cerrado',
    },
    services: [
      { name: 'Paraguay Base', price: 'Consultar', duration: 0, description: 'Residencia + cédula. Entrada al sistema.', category: 'Residencia' },
      { name: 'Paraguay Business', price: 'Consultar', duration: 0, description: 'Residencia + sociedad + cuenta bancaria.', category: 'Negocio' },
      { name: 'Paraguay Investor', price: 'Consultar', duration: 0, description: 'Todo + 12 meses acompañamiento.', category: 'Inversion' },
      { name: 'Compra de Tierras', price: 'Consultar', duration: 0, description: 'Asesoría integral para adquisición de tierras.', category: 'Inmuebles' },
    ],
    features: [
      { title: 'Un solo programa', description: 'No coordine entre múltiples proveedores. Todo está integrado.' },
      { title: 'Un solo viaje', description: 'La tramitación presencial se completa en una jornada.' },
      { title: 'Precio transparente', description: 'Sin cargos ocultos. Todo incluido.' },
      { title: 'Equipo profesional', description: 'Abogados, contadores y asesores con experiencia real.' },
      { title: 'Acceso bancario', description: 'Resolvemos el principal obstáculo para foreigners.' },
    ],
    processSteps: [
      { number: 1, title: 'Consulta inicial', description: 'Conversamos sobre su situación y objetivos.' },
      { number: 2, title: 'Validación documental', description: 'Revisamos toda su documentación antes del viaje.' },
      { number: 3, title: 'Jornada operativa', description: 'Ejecutamos todos los trámites en un día.' },
      { number: 4, title: 'Constitución y bancaria', description: 'Constituimos su sociedad y activamos cuenta.' },
      { number: 5, title: 'Entrega y seguimiento', description: 'Recibe documentos y orientación final.' },
    ],
    team: [
      { name: 'Dirección de Operaciones', role: 'Liderazgo operativo en Paraguay', bio: 'Coordinación del equipo técnico.' },
      { name: 'Dirección Comercial', role: 'Puente cultural y lingüístico', bio: 'Atención a clientes internacionales.' },
      { name: 'Equipo Legal', role: 'Expedientes migratorios y societarios', bio: 'Abogados especializados.' },
    ],
    testimonials: [
      { quote: 'Todo el proceso fue transparente y profesional. Recomendado.', author: 'Cliente Netherlands', rating: 5 },
      { quote: 'En un solo viaje resolvimos todo. Increible.', author: 'Cliente Alemania', rating: 5 },
      { quote: 'El equipo legal es excelente. Muy recomendados.', author: 'Cliente Netherlands', rating: 5 },
    ],
  },
}

/**
 * Get all demo business slugs for static generation.
 */
export function getAllDemoSlugs(): string[] {
  return [...Object.keys(DEMO_BUSINESSES), ...Object.keys(RELOCATION_DEMO_BUSINESSES)]
}

/**
 * Get a demo business from any category.
 */
export function getDemoBusinessBySlug(slug: string): BusinessData | null {
  return DEMO_BUSINESSES[slug] || RELOCATION_DEMO_BUSINESSES[slug] || null
}
