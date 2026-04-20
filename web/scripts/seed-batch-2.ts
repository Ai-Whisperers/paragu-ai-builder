#!/usr/bin/env node
/**
 * Batch 2: hospitality-tourism + portfolio-professional + real-estate-relocation
 *
 * Hospitality uses `restaurant` as a temporary base (the food vertical has the
 * strongest menu/hours/gallery scaffolding). A proper `hospitality_base` can
 * be added later; these types still render correctly because section builders
 * are fully data-driven.
 */

import { runSeeds, type Seed } from './seed-utils'

const SEEDS: Seed[] = [
  // ========== hospitality-tourism (13) ==========
  {
    id: 'hotel',
    nameEs: 'Hotel',
    nameEn: 'Hotel',
    verticalId: 'hospitality-tourism',
    extendsType: 'restaurant',
    schemaType: 'Hotel',
    headlineHook: 'Descansa como te mereces',
    subheadline: 'Hotel con habitaciones confortables, desayuno incluido y atencion 24h en {{city}}.',
    serviceCategories: [
      { id: 'habitaciones', name: 'Habitaciones', description: 'Simples, dobles, suites.' },
      { id: 'desayuno', name: 'Desayuno Buffet', description: 'Incluido en la tarifa.' },
      { id: 'eventos', name: 'Eventos y Corporativo', description: 'Salones y convenios.' }
    ],
    keywords: ['hotel {{city}}', 'alojamiento {{city}}', 'hotel centro {{city}}']
  },
  {
    id: 'hostal',
    nameEs: 'Hostal / Hostel',
    nameEn: 'Hostel',
    verticalId: 'hospitality-tourism',
    extendsType: 'restaurant',
    schemaType: 'Hostel',
    headlineHook: 'Alojate con onda, conecta con viajeros',
    subheadline: 'Hostal con habitaciones compartidas, privadas y areas comunes en {{city}}.',
    serviceCategories: [
      { id: 'dorms', name: 'Dormitorios', description: '4, 6 y 8 camas, mixtos y solo mujeres.' },
      { id: 'privadas', name: 'Habitaciones Privadas', description: 'Con baño compartido o privado.' },
      { id: 'areas', name: 'Areas Comunes', description: 'Cocina, living, patio, terraza.' }
    ],
    keywords: ['hostel {{city}}', 'hostal {{city}}', 'mochilero {{city}}']
  },
  {
    id: 'hotel_boutique',
    nameEs: 'Hotel Boutique',
    nameEn: 'Boutique Hotel',
    verticalId: 'hospitality-tourism',
    extendsType: 'restaurant',
    schemaType: 'Hotel',
    headlineHook: 'Una experiencia unica en cada detalle',
    subheadline: 'Hotel boutique con habitaciones tematicas y atencion personalizada en {{city}}.',
    serviceCategories: [
      { id: 'habitaciones', name: 'Habitaciones Tematicas', description: 'Cada una con diseño propio.' },
      { id: 'gastronomia', name: 'Gastronomia', description: 'Restaurante de autor.' },
      { id: 'spa', name: 'Spa y Bienestar', description: 'Masajes, piscina, sauna.' }
    ],
    keywords: ['hotel boutique {{city}}', 'hotel autor {{city}}']
  },
  {
    id: 'posada',
    nameEs: 'Posada',
    nameEn: 'Inn',
    verticalId: 'hospitality-tourism',
    extendsType: 'restaurant',
    schemaType: 'LodgingBusiness',
    headlineHook: 'Hospitalidad con alma de campo',
    subheadline: 'Posada familiar con ambiente calido, cocina casera y mucha naturaleza.',
    serviceCategories: [
      { id: 'alojamiento', name: 'Alojamiento', description: 'Habitaciones con historia.' },
      { id: 'cocina', name: 'Cocina Casera', description: 'Desayunos, almuerzos, cenas.' },
      { id: 'actividades', name: 'Actividades', description: 'Paseos, cabalgatas, pesca.' }
    ],
    keywords: ['posada {{city}}', 'turismo rural {{city}}']
  },
  {
    id: 'cabanas_turisticas',
    nameEs: 'Cabañas Turisticas',
    nameEn: 'Cabins',
    verticalId: 'hospitality-tourism',
    extendsType: 'restaurant',
    schemaType: 'LodgingBusiness',
    headlineHook: 'Tu escapada en medio de la naturaleza',
    subheadline: 'Cabañas equipadas para descansar en contacto con la naturaleza.',
    serviceCategories: [
      { id: 'cabanas', name: 'Cabañas', description: '2, 4 y 6 personas.' },
      { id: 'piscina', name: 'Piscina y Parque', description: 'Area verde, quincho, parrilla.' },
      { id: 'actividades', name: 'Actividades', description: 'Senderismo, kayak, bicicletas.' }
    ],
    keywords: ['cabañas {{city}}', 'alquiler cabañas {{city}}']
  },
  {
    id: 'apart_hotel',
    nameEs: 'Apart Hotel',
    nameEn: 'Aparthotel',
    verticalId: 'hospitality-tourism',
    extendsType: 'restaurant',
    schemaType: 'Hotel',
    headlineHook: 'La libertad de un apartamento, el servicio de un hotel',
    subheadline: 'Apartamentos equipados con servicios de hotel para estadias cortas o largas.',
    serviceCategories: [
      { id: 'apartamentos', name: 'Apartamentos', description: 'Estudios, 1 y 2 dormitorios.' },
      { id: 'servicios', name: 'Servicios', description: 'Limpieza, lavanderia, gimnasio.' },
      { id: 'corporate', name: 'Estadias Largas', description: 'Convenios corporativos.' }
    ],
    keywords: ['apart hotel {{city}}', 'apartamentos temporales {{city}}']
  },
  {
    id: 'alquiler_temporario',
    nameEs: 'Alquiler Temporario',
    nameEn: 'Vacation Rental',
    verticalId: 'hospitality-tourism',
    extendsType: 'restaurant',
    schemaType: 'LodgingBusiness',
    headlineHook: 'Tu casa temporal en {{city}}',
    subheadline: 'Apartamentos y casas para estadias turisticas y corporativas.',
    serviceCategories: [
      { id: 'turistico', name: 'Turistico', description: 'Desde 2 noches.' },
      { id: 'corporativo', name: 'Corporativo', description: 'Mensual, bonificado.' },
      { id: 'familiar', name: 'Familiar', description: 'Casas con patio y piscina.' }
    ],
    keywords: ['alquiler temporario {{city}}', 'departamento turistico {{city}}']
  },
  {
    id: 'estancia_turistica',
    nameEs: 'Estancia Turistica',
    nameEn: 'Farm Stay',
    verticalId: 'hospitality-tourism',
    extendsType: 'restaurant',
    schemaType: 'LodgingBusiness',
    headlineHook: 'Vive la estancia paraguaya',
    subheadline: 'Turismo rural con cabalgatas, asados y naturaleza intacta.',
    serviceCategories: [
      { id: 'alojamiento', name: 'Alojamiento', description: 'Casa principal y cabañas.' },
      { id: 'actividades', name: 'Actividades', description: 'Cabalgata, pesca, ordeñe.' },
      { id: 'gastronomia', name: 'Asados y Cocina', description: 'Cocina tradicional paraguaya.' }
    ],
    keywords: ['estancia turistica {{city}}', 'turismo rural paraguay']
  },
  {
    id: 'agencia_viajes',
    nameEs: 'Agencia de Viajes',
    nameEn: 'Travel Agency',
    verticalId: 'hospitality-tourism',
    extendsType: 'professional_services_base',
    schemaType: 'TravelAgency',
    headlineHook: 'Tu proximo viaje empieza aqui',
    subheadline: 'Paquetes turisticos, vuelos, hoteles y cruceros a los mejores destinos.',
    serviceCategories: [
      { id: 'paquetes', name: 'Paquetes', description: 'Brasil, Argentina, Europa, Caribe.' },
      { id: 'vuelos', name: 'Vuelos', description: 'Emision de pasajes nacionales e internacionales.' },
      { id: 'corporativo', name: 'Viajes Corporativos', description: 'Gestion de viajes de empresa.' }
    ],
    keywords: ['agencia viajes {{city}}', 'paquete turistico {{city}}', 'viaje europa']
  },
  {
    id: 'operador_turistico',
    nameEs: 'Operador Turistico',
    nameEn: 'Tour Operator',
    verticalId: 'hospitality-tourism',
    extendsType: 'professional_services_base',
    schemaType: 'TravelAgency',
    headlineHook: 'Experiencias locales, inolvidables',
    subheadline: 'Tours guiados por Paraguay: Jesuitas, Itaipu, Chaco, Encarnacion.',
    serviceCategories: [
      { id: 'clasicos', name: 'Tours Clasicos', description: 'Dia completo con guia.' },
      { id: 'aventura', name: 'Aventura', description: 'Trekking, kayak, 4x4.' },
      { id: 'grupos', name: 'Grupos Privados', description: 'Disenamos tu itinerario.' }
    ],
    keywords: ['tour paraguay', 'guia turistico {{city}}', 'itaipu tour', 'jesuitas tour']
  },
  {
    id: 'wedding_planner',
    nameEs: 'Wedding Planner',
    nameEn: 'Wedding Planner',
    verticalId: 'hospitality-tourism',
    extendsType: 'professional_services_base',
    schemaType: 'EventPlanner',
    headlineHook: 'Tu boda, sin estres',
    subheadline: 'Organizacion integral de bodas: proveedores, decoracion, ejecucion dia D.',
    serviceCategories: [
      { id: 'integral', name: 'Organizacion Integral', description: 'Desde la idea hasta el dia D.' },
      { id: 'dia_d', name: 'Dia D', description: 'Coordinacion el dia de la boda.' },
      { id: 'decoracion', name: 'Decoracion', description: 'Diseno estetico y ambientacion.' }
    ],
    keywords: ['wedding planner {{city}}', 'organizador bodas {{city}}']
  },
  {
    id: 'alquiler_vehiculos',
    nameEs: 'Alquiler de Vehiculos',
    nameEn: 'Car Rental',
    verticalId: 'hospitality-tourism',
    extendsType: 'automotive_base',
    schemaType: 'AutoRental',
    headlineHook: 'Manejate por tu cuenta',
    subheadline: 'Alquiler de autos y camionetas por dia, semana o mes en {{city}}.',
    serviceCategories: [
      { id: 'economicos', name: 'Economicos', description: 'Autos urbanos, automaticos.' },
      { id: 'suv', name: 'SUV y Camionetas', description: 'Para viajes y familia.' },
      { id: 'ejecutivos', name: 'Ejecutivos', description: 'Con conductor.' }
    ],
    keywords: ['alquiler autos {{city}}', 'rent a car {{city}}']
  },
  {
    id: 'transfer_aeropuerto',
    nameEs: 'Transfer al Aeropuerto',
    nameEn: 'Airport Transfer',
    verticalId: 'hospitality-tourism',
    extendsType: 'automotive_base',
    schemaType: 'TaxiService',
    headlineHook: 'Llega y sali tranquilo',
    subheadline: 'Traslados al aeropuerto Silvio Pettirossi y viceversa. Tarifa fija.',
    serviceCategories: [
      { id: 'aeropuerto', name: 'Silvio Pettirossi', description: 'Tarifa fija, sedan o van.' },
      { id: 'corporativo', name: 'Corporativo', description: 'Cuenta empresarial.' },
      { id: 'grupos', name: 'Grupos', description: 'Vans hasta 15 pasajeros.' }
    ],
    keywords: ['transfer aeropuerto asuncion', 'traslado aeropuerto {{city}}']
  },

  // ========== portfolio-professional (10) ==========
  {
    id: 'diseno_web',
    nameEs: 'Diseño Web',
    nameEn: 'Web Design',
    verticalId: 'portfolio-professional',
    extendsType: 'diseno_grafico',
    schemaType: 'ProfessionalService',
    headlineHook: 'Sitios web que convierten',
    subheadline: 'Diseño web responsive, optimizado para mobile y Google, con foco en conversion.',
    serviceCategories: [
      { id: 'landing', name: 'Landing Pages', description: 'Una pagina, orientada a conversion.' },
      { id: 'corporativas', name: 'Sitios Corporativos', description: 'Multi-pagina, blog, SEO.' },
      { id: 'ecommerce', name: 'Tiendas Online', description: 'Shopify, WooCommerce, custom.' }
    ],
    keywords: ['diseño web {{city}}', 'pagina web {{city}}', 'desarrollo web {{city}}']
  },
  {
    id: 'desarrollo_software',
    nameEs: 'Desarrollo de Software',
    nameEn: 'Software Development',
    verticalId: 'portfolio-professional',
    extendsType: 'diseno_grafico',
    schemaType: 'ProfessionalService',
    headlineHook: 'Software a medida, resultados a medida',
    subheadline: 'Aplicaciones web, mobile y ERPs a medida para tu negocio.',
    serviceCategories: [
      { id: 'web_apps', name: 'Web Apps', description: 'Dashboards, CRMs, portales.' },
      { id: 'mobile', name: 'Apps Mobile', description: 'iOS y Android.' },
      { id: 'integraciones', name: 'Integraciones', description: 'APIs, sistemas internos.' }
    ],
    keywords: ['desarrollo software {{city}}', 'programadores {{city}}', 'app empresa {{city}}']
  },
  {
    id: 'branding',
    nameEs: 'Branding / Identidad',
    nameEn: 'Branding',
    verticalId: 'portfolio-professional',
    extendsType: 'diseno_grafico',
    schemaType: 'ProfessionalService',
    headlineHook: 'Marcas con identidad clara',
    subheadline: 'Branding estrategico, logotipos, manuales y aplicaciones.',
    serviceCategories: [
      { id: 'branding', name: 'Branding Completo', description: 'Estrategia, nombre, logotipo, manual.' },
      { id: 'rebranding', name: 'Rebranding', description: 'Renovar tu marca existente.' },
      { id: 'aplicaciones', name: 'Aplicaciones', description: 'Papeleria, señaletica, packaging.' }
    ],
    keywords: ['branding {{city}}', 'diseño logo {{city}}', 'identidad corporativa {{city}}']
  },
  {
    id: 'fotografia_eventos',
    nameEs: 'Fotografia de Eventos',
    nameEn: 'Event Photography',
    verticalId: 'portfolio-professional',
    extendsType: 'fotografia_bodas',
    schemaType: 'ProfessionalService',
    headlineHook: 'Tu evento en imagenes',
    subheadline: 'Fotografia profesional para cumpleaños, corporativos, graduaciones.',
    serviceCategories: [
      { id: 'cumpleanos', name: 'Cumpleaños', description: '15 años, adultos, infantiles.' },
      { id: 'corporativo', name: 'Corporativo', description: 'Eventos, lanzamientos.' },
      { id: 'graduaciones', name: 'Graduaciones', description: 'Individual y grupal.' }
    ],
    keywords: ['fotografo eventos {{city}}', 'fotografia cumpleaños {{city}}']
  },
  {
    id: 'fotografia_producto',
    nameEs: 'Fotografia de Producto',
    nameEn: 'Product Photography',
    verticalId: 'portfolio-professional',
    extendsType: 'fotografia_bodas',
    schemaType: 'ProfessionalService',
    headlineHook: 'Tus productos vendidos por la imagen',
    subheadline: 'Fotografia profesional para e-commerce, catalogos y marketing.',
    serviceCategories: [
      { id: 'ecommerce', name: 'E-commerce', description: 'Fondo blanco, ficha de producto.' },
      { id: 'lifestyle', name: 'Lifestyle', description: 'Productos en uso, contexto.' },
      { id: 'gastronomia', name: 'Gastronomia', description: 'Platos, menus, campañas.' }
    ],
    keywords: ['fotografia producto {{city}}', 'fotografia ecommerce {{city}}']
  },
  {
    id: 'video_productora',
    nameEs: 'Productora Audiovisual',
    nameEn: 'Video Production',
    verticalId: 'portfolio-professional',
    extendsType: 'diseno_grafico',
    schemaType: 'ProfessionalService',
    headlineHook: 'Video que genera impacto',
    subheadline: 'Produccion audiovisual: corporativo, publicitario, musica, eventos.',
    serviceCategories: [
      { id: 'corporativo', name: 'Corporativo', description: 'Institucional, capacitacion.' },
      { id: 'publicitario', name: 'Publicitario', description: 'Spots, redes sociales.' },
      { id: 'eventos', name: 'Eventos', description: 'Cobertura en vivo, aftermovie.' }
    ],
    keywords: ['productora {{city}}', 'video corporativo {{city}}', 'filmaciones {{city}}']
  },
  {
    id: 'marketing_digital',
    nameEs: 'Marketing Digital',
    nameEn: 'Digital Marketing',
    verticalId: 'portfolio-professional',
    extendsType: 'diseno_grafico',
    schemaType: 'ProfessionalService',
    headlineHook: 'Crecimiento digital con datos',
    subheadline: 'Estrategia digital: SEO, SEM, redes sociales, email marketing y contenido.',
    serviceCategories: [
      { id: 'seo', name: 'SEO', description: 'Posicionamiento organico.' },
      { id: 'ads', name: 'Google y Meta Ads', description: 'Campañas pagadas.' },
      { id: 'redes', name: 'Gestion de Redes', description: 'Contenido y community.' },
      { id: 'analytics', name: 'Analytics', description: 'Dashboards y reportes.' }
    ],
    keywords: ['marketing digital {{city}}', 'agencia digital {{city}}', 'seo {{city}}']
  },
  {
    id: 'community_manager',
    nameEs: 'Community Manager',
    nameEn: 'Social Media Manager',
    verticalId: 'portfolio-professional',
    extendsType: 'diseno_grafico',
    schemaType: 'ProfessionalService',
    headlineHook: 'Redes sociales que conectan',
    subheadline: 'Gestion de redes sociales para negocios y profesionales.',
    serviceCategories: [
      { id: 'basico', name: 'Plan Basico', description: 'Instagram + Facebook, 3 posts/semana.' },
      { id: 'avanzado', name: 'Plan Avanzado', description: 'Todas las redes + reels + ads.' },
      { id: 'contenido', name: 'Produccion de Contenido', description: 'Fotos, videos, copy.' }
    ],
    keywords: ['community manager {{city}}', 'gestion redes sociales {{city}}']
  },
  {
    id: 'arquitecto',
    nameEs: 'Arquitectura',
    nameEn: 'Architect',
    verticalId: 'portfolio-professional',
    extendsType: 'diseno_grafico',
    schemaType: 'ProfessionalService',
    headlineHook: 'Espacios pensados para vivir',
    subheadline: 'Proyectos arquitectonicos residenciales y comerciales.',
    serviceCategories: [
      { id: 'residencial', name: 'Residencial', description: 'Casas, dúplex, remodelaciones.' },
      { id: 'comercial', name: 'Comercial', description: 'Locales, oficinas, restaurantes.' },
      { id: 'direccion', name: 'Direccion de Obra', description: 'Seguimiento hasta la entrega.' }
    ],
    keywords: ['arquitecto {{city}}', 'proyecto arquitectonico {{city}}']
  },
  {
    id: 'diseno_interiores',
    nameEs: 'Diseño de Interiores',
    nameEn: 'Interior Design',
    verticalId: 'portfolio-professional',
    extendsType: 'diseno_grafico',
    schemaType: 'ProfessionalService',
    headlineHook: 'Tu espacio, tu personalidad',
    subheadline: 'Diseño interior residencial, comercial y gastronomico.',
    serviceCategories: [
      { id: 'residencial', name: 'Residencial', description: 'Living, cocina, dormitorios.' },
      { id: 'comercial', name: 'Comercial', description: 'Oficinas, locales, showrooms.' },
      { id: 'gastronomico', name: 'Gastronomico', description: 'Restaurantes y cafeterias.' }
    ],
    keywords: ['diseño interiores {{city}}', 'decoracion interiores {{city}}']
  },

  // ========== real-estate-relocation extras (8) ==========
  {
    id: 'corredor_inmobiliario',
    nameEs: 'Corredor Inmobiliario',
    nameEn: 'Realtor',
    verticalId: 'real-estate-relocation',
    extendsType: 'inmobiliaria',
    schemaType: 'RealEstateAgent',
    headlineHook: 'Tu corredor de confianza',
    subheadline: 'Compra, venta y alquiler con asesoramiento personalizado en {{city}}.',
    serviceCategories: [
      { id: 'compra', name: 'Compra', description: 'Busqueda y asesoramiento.' },
      { id: 'venta', name: 'Venta', description: 'Tasacion y comercializacion.' },
      { id: 'alquiler', name: 'Alquiler', description: 'Residencial y comercial.' }
    ],
    keywords: ['corredor inmobiliario {{city}}', 'inmobiliaria {{city}}']
  },
  {
    id: 'venta_terrenos',
    nameEs: 'Venta de Terrenos',
    nameEn: 'Land Sales',
    verticalId: 'real-estate-relocation',
    extendsType: 'inmobiliaria',
    schemaType: 'RealEstateAgent',
    headlineHook: 'Terrenos bien ubicados, precio justo',
    subheadline: 'Venta de terrenos urbanos y semirurales en Paraguay. Invertir en tierra.',
    serviceCategories: [
      { id: 'urbanos', name: 'Terrenos Urbanos', description: 'En loteos y barrios cerrados.' },
      { id: 'semirurales', name: 'Semirurales', description: 'Quintas y chacras.' },
      { id: 'inversion', name: 'Oportunidades de Inversion', description: 'Con proyeccion.' }
    ],
    keywords: ['terrenos venta {{city}}', 'lotes {{city}}', 'inversion terrenos paraguay']
  },
  {
    id: 'venta_campos',
    nameEs: 'Venta de Campos',
    nameEn: 'Farm Land Sales',
    verticalId: 'real-estate-relocation',
    extendsType: 'inmobiliaria',
    schemaType: 'RealEstateAgent',
    headlineHook: 'Campos productivos en Paraguay',
    subheadline: 'Venta de campos agricolas y ganaderos con titulos en regla.',
    serviceCategories: [
      { id: 'agricolas', name: 'Agricolas', description: 'Soja, maiz, trigo.' },
      { id: 'ganaderos', name: 'Ganaderos', description: 'Con infraestructura.' },
      { id: 'mixtos', name: 'Mixtos', description: 'Agricola + ganadero.' }
    ],
    keywords: ['campos venta paraguay', 'campo agricola paraguay', 'campo ganadero paraguay']
  },
  {
    id: 'coworking',
    nameEs: 'Coworking',
    nameEn: 'Coworking Space',
    verticalId: 'real-estate-relocation',
    extendsType: 'inmobiliaria',
    schemaType: 'RealEstateAgent',
    headlineHook: 'Trabaja mejor, conecta mas',
    subheadline: 'Espacios de trabajo flexibles, salas de reunion e internet de alta velocidad.',
    serviceCategories: [
      { id: 'open', name: 'Espacio Open', description: 'Escritorios compartidos.' },
      { id: 'privados', name: 'Oficinas Privadas', description: 'De 2 a 10 personas.' },
      { id: 'salas', name: 'Salas de Reunion', description: 'Por hora.' }
    ],
    keywords: ['coworking {{city}}', 'oficina flexible {{city}}']
  },
  {
    id: 'desarrollador_inmobiliario',
    nameEs: 'Desarrolladora Inmobiliaria',
    nameEn: 'Real Estate Developer',
    verticalId: 'real-estate-relocation',
    extendsType: 'inmobiliaria',
    schemaType: 'RealEstateAgent',
    headlineHook: 'Proyectos que se construyen a tiempo',
    subheadline: 'Desarrollos residenciales y comerciales con entrega garantizada.',
    serviceCategories: [
      { id: 'residencial', name: 'Desarrollos Residenciales', description: 'Edificios, casas.' },
      { id: 'comercial', name: 'Desarrollos Comerciales', description: 'Oficinas, locales.' },
      { id: 'preventa', name: 'Preventa', description: 'Precios promocionales de lanzamiento.' }
    ],
    keywords: ['desarrollo inmobiliario {{city}}', 'preventa departamentos {{city}}']
  },
  {
    id: 'immigration_legal',
    nameEs: 'Abogado de Inmigracion',
    nameEn: 'Immigration Law',
    verticalId: 'real-estate-relocation',
    extendsType: 'relocation',
    schemaType: 'Attorney',
    headlineHook: 'Tu residencia, hecha bien',
    subheadline: 'Asesoramiento legal para residencia, ciudadania y estatus fiscal en Paraguay.',
    serviceCategories: [
      { id: 'residencia', name: 'Residencia Permanente', description: 'Tramite completo.' },
      { id: 'ciudadania', name: 'Ciudadania', description: 'Naturalizacion.' },
      { id: 'visas', name: 'Visas y Permisos', description: 'Trabajo, estudio, negocios.' }
    ],
    keywords: ['abogado inmigracion paraguay', 'residencia paraguay', 'ciudadania paraguaya']
  },
  {
    id: 'tax_residency_consulting',
    nameEs: 'Consultoria de Residencia Fiscal',
    nameEn: 'Tax Residency Consulting',
    verticalId: 'real-estate-relocation',
    extendsType: 'relocation',
    schemaType: 'AccountingService',
    headlineHook: 'Optimiza tu carga fiscal, legalmente',
    subheadline: 'Planificacion fiscal internacional: residencia, estructura, compliance.',
    serviceCategories: [
      { id: 'residencia_fiscal', name: 'Residencia Fiscal', description: 'Estrategia y obtencion.' },
      { id: 'estructura', name: 'Estructuracion', description: 'Holdings, sociedades.' },
      { id: 'compliance', name: 'Compliance', description: 'CRS, FATCA, reportes.' }
    ],
    keywords: ['residencia fiscal paraguay', 'tax consulting paraguay', 'planificacion fiscal']
  },
  {
    id: 'investment_visa',
    nameEs: 'Visa de Inversion',
    nameEn: 'Investment Visa',
    verticalId: 'real-estate-relocation',
    extendsType: 'relocation',
    schemaType: 'Attorney',
    headlineHook: 'Tu inversion, tu residencia',
    subheadline: 'Programas de residencia por inversion en Paraguay: simple, rapido, legal.',
    serviceCategories: [
      { id: 'programa', name: 'Programa SUACE', description: 'Inversion minima, tramite completo.' },
      { id: 'acompanamiento', name: 'Acompañamiento Integral', description: 'Desde primer contacto hasta cedula.' },
      { id: 'familia', name: 'Extension a Familia', description: 'Conyuge e hijos.' }
    ],
    keywords: ['visa inversion paraguay', 'residencia inversionista paraguay', 'suace paraguay']
  }
]

runSeeds(SEEDS, 'batch-2 (hospitality + portfolio + real-estate)')
