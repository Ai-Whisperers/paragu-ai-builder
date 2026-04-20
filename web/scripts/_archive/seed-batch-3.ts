#!/usr/bin/env node
/**
 * Batch 3: P2 long-tail fill across all verticals.
 */

import { runSeeds, type Seed } from './seed-utils'

const SEEDS: Seed[] = [
  // ========== beauty-personal-care P2 (4) ==========
  {
    id: 'bronceado',
    nameEs: 'Bronceado / Tanning',
    nameEn: 'Tanning Studio',
    verticalId: 'beauty-personal-care',
    extendsType: 'beauty_base',
    schemaType: 'BeautySalon',
    headlineHook: 'Piel bronceada todo el año',
    subheadline: 'Bronceado en cabina, spray tan y tratamientos corporales.',
    serviceCategories: [
      { id: 'cabina', name: 'Bronceado en Cabina', description: 'UVA de nueva generacion.' },
      { id: 'spray', name: 'Spray Tan', description: 'Sin UV, resultado inmediato.' }
    ],
    keywords: ['bronceado {{city}}', 'spray tan {{city}}']
  },
  {
    id: 'podologia_estetica',
    nameEs: 'Podologia Estetica',
    nameEn: 'Podiatry & Pedicure',
    verticalId: 'beauty-personal-care',
    extendsType: 'beauty_base',
    schemaType: 'HealthAndBeautyBusiness',
    headlineHook: 'Pies sanos, pies lindos',
    subheadline: 'Pedicuria estetica y clinica: uñas encarnadas, callosidades, hongos.',
    serviceCategories: [
      { id: 'pedicuria', name: 'Pedicuria Estetica', description: 'Limpieza profunda y estetica.' },
      { id: 'clinica', name: 'Podologia Clinica', description: 'Uñas encarnadas, callos, hongos.' }
    ],
    keywords: ['podologia {{city}}', 'pedicuria {{city}}']
  },
  {
    id: 'centro_integral_belleza',
    nameEs: 'Centro Integral de Belleza',
    nameEn: 'Beauty Center',
    verticalId: 'beauty-personal-care',
    extendsType: 'salon_belleza',
    schemaType: 'BeautySalon',
    headlineHook: 'Todo lo que necesitas, en un solo lugar',
    subheadline: 'Peluqueria, estetica, uñas, masajes y tratamientos en {{city}}.',
    keywords: ['centro belleza {{city}}', 'salon integral {{city}}']
  },
  {
    id: 'escuela_belleza',
    nameEs: 'Escuela de Estetica',
    nameEn: 'Beauty Academy',
    verticalId: 'beauty-personal-care',
    extendsType: 'educacion',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Tu carrera en belleza empieza aqui',
    subheadline: 'Cursos de peluqueria, estetica, uñas y maquillaje con certificado.',
    serviceCategories: [
      { id: 'peluqueria', name: 'Peluqueria', description: 'Corte, color, peinado.' },
      { id: 'estetica', name: 'Estetica Facial y Corporal', description: 'Tratamientos profesionales.' },
      { id: 'uñas', name: 'Uñas', description: 'Esculpidas, gelificadas, nail art.' }
    ],
    keywords: ['escuela estetica {{city}}', 'curso peluqueria {{city}}']
  },

  // ========== health-wellness P2 (7) ==========
  {
    id: 'ginecologia',
    nameEs: 'Ginecologia',
    nameEn: 'OB-GYN',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Physician',
    headlineHook: 'Tu salud, prioridad',
    subheadline: 'Consultas ginecologicas, control prenatal y obstetricia en {{city}}.',
    serviceCategories: [
      { id: 'consulta', name: 'Consulta Ginecologica', description: 'Control anual, PAP.' },
      { id: 'prenatal', name: 'Control Prenatal', description: 'Seguimiento de embarazo.' },
      { id: 'obstetricia', name: 'Obstetricia', description: 'Parto natural y cesarea.' }
    ],
    keywords: ['ginecologo {{city}}', 'obstetra {{city}}', 'pap {{city}}']
  },
  {
    id: 'cirugia_estetica',
    nameEs: 'Cirugia Estetica',
    nameEn: 'Cosmetic Surgery',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Physician',
    headlineHook: 'Tu mejor version, en buenas manos',
    subheadline: 'Cirugia estetica y plastica con especialistas certificados en {{city}}.',
    serviceCategories: [
      { id: 'rostro', name: 'Rostro', description: 'Rinoplastia, blefaroplastia, lifting.' },
      { id: 'cuerpo', name: 'Cuerpo', description: 'Liposuccion, abdominoplastia, mamoplastia.' },
      { id: 'minimamente_invasivos', name: 'No Quirurgicos', description: 'Toxina, rellenos, hilos.' }
    ],
    keywords: ['cirugia estetica {{city}}', 'cirujano plastico {{city}}']
  },
  {
    id: 'farmacia',
    nameEs: 'Farmacia',
    nameEn: 'Pharmacy',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Pharmacy',
    headlineHook: 'Tu salud, siempre cerca',
    subheadline: 'Medicamentos, perfumeria y cuidado personal con delivery en {{city}}.',
    serviceCategories: [
      { id: 'medicamentos', name: 'Medicamentos', description: 'Recetados y libre venta.' },
      { id: 'perfumeria', name: 'Perfumeria', description: 'Cuidado personal y belleza.' },
      { id: 'receta_magistral', name: 'Recetas Magistrales', description: 'Formulaciones a medida.' }
    ],
    keywords: ['farmacia {{city}}', 'farmacia 24 horas {{city}}']
  },
  {
    id: 'geriatria',
    nameEs: 'Geriatria / Cuidados Mayores',
    nameEn: 'Senior Care',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'NursingHome',
    headlineHook: 'Cuidado con amor para nuestros mayores',
    subheadline: 'Residencia, atencion domiciliaria y terapias para adultos mayores.',
    serviceCategories: [
      { id: 'residencia', name: 'Residencia Geriatrica', description: 'Atencion 24 horas.' },
      { id: 'domicilio', name: 'Cuidado Domiciliario', description: 'Acompañantes y enfermeros.' },
      { id: 'terapias', name: 'Terapias', description: 'Fisio, ocupacional, estimulacion.' }
    ],
    keywords: ['geriatrico {{city}}', 'residencia adultos mayores {{city}}']
  },
  {
    id: 'clinica_integral',
    nameEs: 'Clinica Multidisciplinaria',
    nameEn: 'Multi-Specialty Clinic',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'MedicalClinic',
    headlineHook: 'Todas las especialidades, un solo lugar',
    subheadline: 'Clinica con especialistas en medicina general, ginecologia, pediatria, cardiologia y mas.',
    keywords: ['clinica {{city}}', 'centro medico {{city}}']
  },
  {
    id: 'centro_diagnostico',
    nameEs: 'Centro de Diagnostico por Imagenes',
    nameEn: 'Imaging Center',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'DiagnosticLab',
    headlineHook: 'Imagenes que orientan tu diagnostico',
    subheadline: 'Radiografias, ecografias, resonancias y tomografias con equipamiento moderno.',
    serviceCategories: [
      { id: 'radiografia', name: 'Radiografia', description: 'Digital, baja dosis.' },
      { id: 'ecografia', name: 'Ecografia', description: 'Abdominal, ginecologica, obstetrica.' },
      { id: 'resonancia', name: 'Resonancia Magnetica', description: 'Alta definicion.' },
      { id: 'tomografia', name: 'Tomografia', description: 'Multicorte con contraste.' }
    ],
    keywords: ['radiografia {{city}}', 'ecografia {{city}}', 'resonancia {{city}}']
  },
  {
    id: 'fonoaudiologia',
    nameEs: 'Fonoaudiologia',
    nameEn: 'Speech Therapy',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Physiotherapy',
    headlineHook: 'Comunicacion y audicion en buenas manos',
    subheadline: 'Terapia de lenguaje, voz y audicion para niños y adultos.',
    keywords: ['fonoaudiologo {{city}}', 'terapia lenguaje {{city}}']
  },

  // ========== food-beverage P2 (9) ==========
  {
    id: 'comida_tipica',
    nameEs: 'Comida Tipica Paraguaya',
    nameEn: 'Paraguayan Cuisine',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'La cocina paraguaya en su mejor version',
    subheadline: 'Sopa paraguaya, chipa guasu, mbeyu, asado con mandioca y mas.',
    keywords: ['comida tipica paraguaya {{city}}', 'sopa paraguaya {{city}}']
  },
  {
    id: 'comida_china',
    nameEs: 'Restaurante Chino',
    nameEn: 'Chinese Restaurant',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'Sabores del oriente, en tu barrio',
    subheadline: 'Comida china tradicional con especialidades cantonesas.',
    keywords: ['comida china {{city}}', 'restaurante chino {{city}}']
  },
  {
    id: 'comida_italiana',
    nameEs: 'Cocina Italiana',
    nameEn: 'Italian Restaurant',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'Autentica Italia en la mesa',
    subheadline: 'Pastas frescas, antipasti, pizzas napoletanas y vinos italianos.',
    keywords: ['restaurante italiano {{city}}', 'pasta fresca {{city}}']
  },
  {
    id: 'vegetariano_vegano',
    nameEs: 'Vegetariano / Vegano',
    nameEn: 'Vegetarian / Vegan',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'Cocina sin carne, sin renunciar al sabor',
    subheadline: 'Platos vegetarianos y veganos hechos con productos de estacion.',
    keywords: ['restaurante vegano {{city}}', 'comida vegetariana {{city}}']
  },
  {
    id: 'food_truck',
    nameEs: 'Food Truck',
    nameEn: 'Food Truck',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'FoodEstablishment',
    headlineHook: 'Street food con onda',
    subheadline: 'Cocina movil que va a eventos, ferias y barrios de {{city}}.',
    keywords: ['food truck {{city}}', 'street food {{city}}']
  },
  {
    id: 'cerveceria_artesanal',
    nameEs: 'Cerveceria Artesanal',
    nameEn: 'Craft Brewery',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Brewery',
    headlineHook: 'Cerveza hecha aqui, con pasion',
    subheadline: 'Cervezas artesanales tiradas, growlers y cocina de acompañamiento.',
    keywords: ['cerveceria artesanal {{city}}', 'cerveza craft {{city}}']
  },
  {
    id: 'tercera_ola_cafe',
    nameEs: 'Cafe de Especialidad',
    nameEn: 'Specialty Coffee',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'CafeOrCoffeeShop',
    headlineHook: 'Cafe de origen, preparado con metodo',
    subheadline: 'Granos seleccionados, metodos filtrados y espresso de alta gama.',
    keywords: ['cafe especialidad {{city}}', 'cafe tercera ola {{city}}']
  },
  {
    id: 'jugueria',
    nameEs: 'Jugueria / Licuados',
    nameEn: 'Juice Bar',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'FoodEstablishment',
    headlineHook: 'Jugos naturales, energia real',
    subheadline: 'Jugos, licuados y bowls con frutas naturales y superfoods.',
    keywords: ['jugueria {{city}}', 'licuados {{city}}', 'smoothie {{city}}']
  },
  {
    id: 'rotiseria',
    nameEs: 'Rotiseria / Comida para Llevar',
    nameEn: 'Deli / Takeaway',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'FoodEstablishment',
    headlineHook: 'Comida casera, como en casa',
    subheadline: 'Platos del dia, minutas y bandejas para llevar o delivery.',
    keywords: ['rotiseria {{city}}', 'comida para llevar {{city}}', 'vianda {{city}}']
  },

  // ========== trades-home-services P2 (10) ==========
  {
    id: 'herreria',
    nameEs: 'Herreria',
    nameEn: 'Metalworker',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Trabajos en hierro, con terminacion impecable',
    subheadline: 'Portones, rejas, escaleras y estructuras metalicas a medida.',
    keywords: ['herreria {{city}}', 'rejas {{city}}', 'portones {{city}}']
  },
  {
    id: 'carpintero',
    nameEs: 'Carpinteria',
    nameEn: 'Carpenter',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Madera trabajada con oficio',
    subheadline: 'Muebles a medida, placares, cocinas y carpinteria de obra.',
    keywords: ['carpintero {{city}}', 'muebles a medida {{city}}', 'placares {{city}}']
  },
  {
    id: 'refrigeracion',
    nameEs: 'Refrigeracion',
    nameEn: 'Refrigeration',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Cadena de frio sin interrupciones',
    subheadline: 'Servicio tecnico de heladeras, camaras frigorificas y freezers.',
    keywords: ['refrigeracion {{city}}', 'servicio heladeras {{city}}']
  },
  {
    id: 'limpieza_hogar',
    nameEs: 'Limpieza Domestica',
    nameEn: 'House Cleaning',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Casa limpia, vida tranquila',
    subheadline: 'Servicio de limpieza domestica por horas, dias o mensual en {{city}}.',
    keywords: ['limpieza hogar {{city}}', 'empleada domestica {{city}}']
  },
  {
    id: 'limpieza_oficinas',
    nameEs: 'Limpieza de Oficinas',
    nameEn: 'Office Cleaning',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'ProfessionalService',
    headlineHook: 'Oficinas impecables, equipos productivos',
    subheadline: 'Limpieza de oficinas, locales comerciales y edificios.',
    keywords: ['limpieza oficinas {{city}}', 'limpieza comercial {{city}}']
  },
  {
    id: 'flete',
    nameEs: 'Fletes / Carga',
    nameEn: 'Hauling',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'MovingCompany',
    headlineHook: 'Cargo lo que necesites, rapido',
    subheadline: 'Fletes con camiones y camionetas. Residencial, comercial, industrial.',
    keywords: ['flete {{city}}', 'camion mudanza {{city}}']
  },
  {
    id: 'destapaciones',
    nameEs: 'Destapaciones',
    nameEn: 'Drain Cleaning',
    verticalId: 'trades-home-services',
    extendsType: 'plomero',
    schemaType: 'Plumber',
    headlineHook: 'Destapamos lo que sea, rapido',
    subheadline: 'Destapaciones con maquina rotativa y cameras. Urgencias 24h.',
    keywords: ['destapaciones {{city}}', 'destapar cañeria {{city}}']
  },
  {
    id: 'seguridad_alarmas',
    nameEs: 'Alarmas y Seguridad',
    nameEn: 'Security & Alarms',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Tu hogar, protegido 24/7',
    subheadline: 'Sistemas de alarma, monitoreo y seguridad integral en {{city}}.',
    keywords: ['alarmas {{city}}', 'seguridad hogar {{city}}', 'monitoreo {{city}}']
  },
  {
    id: 'cctv_camaras',
    nameEs: 'Camaras de Seguridad',
    nameEn: 'CCTV Installation',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Mira tu casa desde cualquier lugar',
    subheadline: 'Instalacion de camaras HD, DVR y acceso remoto desde celular.',
    keywords: ['camaras seguridad {{city}}', 'cctv {{city}}']
  },
  {
    id: 'tecnico_electrodomesticos',
    nameEs: 'Servicio Tecnico de Electrodomesticos',
    nameEn: 'Appliance Repair',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Reparamos lo que parece perdido',
    subheadline: 'Lavarropas, heladeras, microondas, cocinas y mas.',
    keywords: ['reparacion electrodomesticos {{city}}', 'tecnico lavarropas {{city}}']
  },

  // ========== automotive P2 (8) ==========
  {
    id: 'detailing',
    nameEs: 'Detailing Automotor',
    nameEn: 'Auto Detailing',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutomotiveBusiness',
    headlineHook: 'Tu auto premium, como recien salido',
    subheadline: 'Detailing profesional: pulido, ceramic coating, tratamientos especializados.',
    keywords: ['detailing {{city}}', 'pulido auto {{city}}', 'ceramic coating {{city}}']
  },
  {
    id: 'alineacion_balanceo',
    nameEs: 'Alineacion y Balanceo',
    nameEn: 'Alignment Shop',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutomotiveBusiness',
    headlineHook: 'Neumaticos que duran, manejo mas seguro',
    subheadline: 'Alineacion computarizada y balanceo dinamico en {{city}}.',
    keywords: ['alineacion balanceo {{city}}']
  },
  {
    id: 'auxilio_mecanico',
    nameEs: 'Auxilio Mecanico 24h',
    nameEn: 'Roadside Assistance',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutomotiveBusiness',
    headlineHook: 'Asistencia cuando mas la necesitas',
    subheadline: 'Auxilio mecanico 24 horas: bateria, nafta, neumaticos, remolque.',
    keywords: ['auxilio mecanico {{city}}', 'auxilio 24 horas {{city}}']
  },
  {
    id: 'grua_remolque',
    nameEs: 'Grua / Remolque',
    nameEn: 'Tow Truck',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutomotiveBusiness',
    headlineHook: 'Remolque rapido, sin dañar tu vehiculo',
    subheadline: 'Servicio de grua 24h con plataforma hidraulica.',
    keywords: ['grua {{city}}', 'remolque auto {{city}}']
  },
  {
    id: 'concesionaria_autos',
    nameEs: 'Concesionaria de Autos',
    nameEn: 'Car Dealership',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutoDealer',
    headlineHook: 'Tu proximo auto, con confianza',
    subheadline: 'Autos 0km y usados seleccionados. Financiacion y canje.',
    keywords: ['concesionaria {{city}}', 'venta autos {{city}}']
  },
  {
    id: 'venta_autos_usados',
    nameEs: 'Autos Usados',
    nameEn: 'Used Car Lot',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutoDealer',
    headlineHook: 'Usados revisados, precios justos',
    subheadline: 'Autos usados con revision mecanica, financiacion y garantia.',
    keywords: ['autos usados {{city}}', 'compra venta autos {{city}}']
  },
  {
    id: 'taller_motos',
    nameEs: 'Taller de Motos',
    nameEn: 'Motorcycle Repair',
    verticalId: 'automotive',
    extendsType: 'taller_mecanico',
    schemaType: 'AutoRepair',
    headlineHook: 'Tu moto, siempre a punto',
    subheadline: 'Servicio tecnico de motos de todas las marcas y cilindradas.',
    keywords: ['taller motos {{city}}', 'mecanico motos {{city}}']
  },
  {
    id: 'transporte_escolar',
    nameEs: 'Transporte Escolar',
    nameEn: 'School Transport',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'TaxiService',
    headlineHook: 'Tus hijos, seguros al colegio',
    subheadline: 'Transporte escolar puerta a puerta con choferes verificados.',
    keywords: ['transporte escolar {{city}}']
  },

  // ========== retail-local P2 (14) ==========
  {
    id: 'carniceria',
    nameEs: 'Carniceria',
    nameEn: 'Butcher Shop',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Store',
    headlineHook: 'Cortes frescos, atencion personal',
    subheadline: 'Carniceria con cortes seleccionados, embutidos y pollo fresco.',
    keywords: ['carniceria {{city}}']
  },
  {
    id: 'panaderia_pasteleria',
    nameEs: 'Panaderia y Pasteleria',
    nameEn: 'Bakery Retail',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Bakery',
    headlineHook: 'Pan y dulce para cada momento',
    subheadline: 'Panaderia clasica con pastelera, facturas, tortas y chipa.',
    keywords: ['panaderia pasteleria {{city}}']
  },
  {
    id: 'joyeria',
    nameEs: 'Joyeria',
    nameEn: 'Jewelry Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'JewelryStore',
    headlineHook: 'Joyas que cuentan historias',
    subheadline: 'Oro, plata, anillos de compromiso, relojes y reparacion.',
    keywords: ['joyeria {{city}}', 'anillo compromiso {{city}}']
  },
  {
    id: 'optica_retail',
    nameEs: 'Optica',
    nameEn: 'Optical Shop',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Optician',
    headlineHook: 'Ver bien, verte bien',
    subheadline: 'Examen visual, anteojos, lentes de contacto y accesorios.',
    keywords: ['optica {{city}}', 'anteojos {{city}}']
  },
  {
    id: 'vivero',
    nameEs: 'Vivero / Plantas',
    nameEn: 'Nursery Garden Center',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Store',
    headlineHook: 'Plantas que alegran tu hogar',
    subheadline: 'Amplio surtido de plantas de interior y exterior, macetas, tierra y asesoramiento.',
    keywords: ['vivero {{city}}', 'plantas {{city}}']
  },
  {
    id: 'decoracion_hogar',
    nameEs: 'Decoracion del Hogar',
    nameEn: 'Home Decor',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Store',
    headlineHook: 'Detalles que hacen hogar',
    subheadline: 'Decoracion, textiles, lamparas y objetos de diseño.',
    keywords: ['decoracion hogar {{city}}']
  },
  {
    id: 'electrodomesticos_venta',
    nameEs: 'Tienda de Electrodomesticos',
    nameEn: 'Appliance Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'HomeGoodsStore',
    headlineHook: 'Los mejores electrodomesticos, al mejor precio',
    subheadline: 'Heladeras, lavarropas, aires, cocinas y pequeños electrodomesticos.',
    keywords: ['electrodomesticos {{city}}']
  },
  {
    id: 'informatica_venta',
    nameEs: 'Informatica / Computadoras',
    nameEn: 'Computer Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'ElectronicsStore',
    headlineHook: 'Equipos tecnologicos, asesoramiento experto',
    subheadline: 'Notebooks, PCs, accesorios, impresoras y servicio tecnico.',
    keywords: ['informatica {{city}}', 'computadoras {{city}}']
  },
  {
    id: 'bicicleteria',
    nameEs: 'Bicicleteria',
    nameEn: 'Bike Shop',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Store',
    headlineHook: 'La bici perfecta te espera',
    subheadline: 'Venta, reparacion y accesorios para ciclismo urbano y mountain bike.',
    keywords: ['bicicleteria {{city}}', 'taller bicicletas {{city}}']
  },
  {
    id: 'materiales_construccion',
    nameEs: 'Materiales de Construccion',
    nameEn: 'Construction Materials',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'HardwareStore',
    headlineHook: 'Todo para tu obra',
    subheadline: 'Cemento, ladrillos, arena, hierros y acabados con entrega a obra.',
    keywords: ['materiales construccion {{city}}']
  },
  {
    id: 'lenceria',
    nameEs: 'Lenceria',
    nameEn: 'Lingerie',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'ClothingStore',
    headlineHook: 'Lenceria que te hace sentir bien',
    subheadline: 'Corseteria, pijamas y ropa interior con marcas importadas.',
    keywords: ['lenceria {{city}}']
  },
  {
    id: 'tienda_bebes',
    nameEs: 'Tienda de Bebes',
    nameEn: 'Baby Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Store',
    headlineHook: 'Todo para el bebe, con cuidado',
    subheadline: 'Ropa, cunas, coches, accesorios y pañales en un solo lugar.',
    keywords: ['tienda bebes {{city}}']
  },
  {
    id: 'jugueteria',
    nameEs: 'Jugueteria',
    nameEn: 'Toy Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Store',
    headlineHook: 'Juegos que hacen felices a los chicos',
    subheadline: 'Juguetes educativos, didacticos y para todas las edades.',
    keywords: ['jugueteria {{city}}']
  },
  {
    id: 'cosmetica_venta',
    nameEs: 'Tienda de Cosmeticos',
    nameEn: 'Cosmetics Retail',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Store',
    headlineHook: 'Lo mejor de la cosmetica, al alcance',
    subheadline: 'Maquillaje, skincare, perfumes y cosmetica coreana.',
    keywords: ['cosmetica {{city}}', 'maquillaje retail {{city}}']
  },

  // ========== education-training P2 (6) ==========
  {
    id: 'colegio_privado',
    nameEs: 'Colegio Privado',
    nameEn: 'Private School',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'School',
    headlineHook: 'Formacion integral de excelencia',
    subheadline: 'Colegio con propuesta pedagogica moderna, deportes y arte.',
    keywords: ['colegio privado {{city}}']
  },
  {
    id: 'colegio_bilingue',
    nameEs: 'Colegio Bilingue',
    nameEn: 'Bilingual School',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'School',
    headlineHook: 'Educacion bilingue desde el inicio',
    subheadline: 'Colegio bilingue español-ingles con certificaciones internacionales.',
    keywords: ['colegio bilingue {{city}}', 'ingles colegio {{city}}']
  },
  {
    id: 'instituto_ingles',
    nameEs: 'Instituto de Ingles',
    nameEn: 'English Institute',
    verticalId: 'education-training',
    extendsType: 'academia_idiomas',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Ingles que usas en el mundo real',
    subheadline: 'Cursos generales, business, preparacion TOEFL/IELTS y conversacion.',
    keywords: ['ingles {{city}}', 'instituto ingles {{city}}', 'toefl {{city}}']
  },
  {
    id: 'academia_portugues',
    nameEs: 'Portugues',
    nameEn: 'Portuguese School',
    verticalId: 'education-training',
    extendsType: 'academia_idiomas',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Portugues para viajar, trabajar y vivir',
    subheadline: 'Cursos de portugues de Brasil y Portugal, todos los niveles.',
    keywords: ['portugues {{city}}', 'clases portugues {{city}}']
  },
  {
    id: 'curso_corto_online',
    nameEs: 'Cursos Cortos / Talleres',
    nameEn: 'Short Courses',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Aprende algo nuevo en pocos dias',
    subheadline: 'Cursos cortos y talleres presenciales y online.',
    keywords: ['curso corto {{city}}', 'taller online {{city}}']
  },
  {
    id: 'academia_cocina',
    nameEs: 'Academia de Cocina',
    nameEn: 'Culinary School',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Cocina profesional, paso a paso',
    subheadline: 'Cursos de cocina, pasteleria, panaderia y bartender.',
    keywords: ['academia cocina {{city}}', 'curso pasteleria {{city}}']
  },

  // ========== b2b-professional P2 (8) ==========
  {
    id: 'reclutamiento',
    nameEs: 'Reclutamiento / Headhunting',
    nameEn: 'Recruiting',
    verticalId: 'b2b-professional',
    extendsType: 'consultora_rrhh',
    schemaType: 'ProfessionalService',
    headlineHook: 'Encontramos el talento que tu empresa necesita',
    subheadline: 'Reclutamiento ejecutivo, middle management y mandos medios.',
    keywords: ['headhunting {{city}}', 'reclutamiento ejecutivo {{city}}']
  },
  {
    id: 'asesor_financiero',
    nameEs: 'Asesor Financiero',
    nameEn: 'Financial Advisor',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'FinancialService',
    headlineHook: 'Tu patrimonio, planificado',
    subheadline: 'Asesoramiento financiero personal y corporativo: inversion, seguros, planes.',
    keywords: ['asesor financiero {{city}}']
  },
  {
    id: 'broker_seguros',
    nameEs: 'Corredor de Seguros',
    nameEn: 'Insurance Broker',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'InsuranceAgency',
    headlineHook: 'Protege lo que te importa',
    subheadline: 'Seguros de auto, hogar, vida, salud y empresariales.',
    keywords: ['seguros {{city}}', 'corredor seguros {{city}}']
  },
  {
    id: 'agencia_aduana',
    nameEs: 'Agencia de Aduanas',
    nameEn: 'Customs Agency',
    verticalId: 'b2b-professional',
    extendsType: 'despachante',
    schemaType: 'ProfessionalService',
    headlineHook: 'Aduanas sin complicaciones',
    subheadline: 'Gestion aduanera integral en Asuncion y Ciudad del Este.',
    keywords: ['agencia aduanas {{city}}']
  },
  {
    id: 'auditoria',
    nameEs: 'Auditoria',
    nameEn: 'Auditing',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'AccountingService',
    headlineHook: 'Transparencia que genera confianza',
    subheadline: 'Auditoria externa, interna y financiera para empresas.',
    keywords: ['auditoria {{city}}', 'auditor externo {{city}}']
  },
  {
    id: 'consultora_ti',
    nameEs: 'Consultora TI',
    nameEn: 'IT Consulting',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'ProfessionalService',
    headlineHook: 'Tecnologia que potencia tu negocio',
    subheadline: 'Consultoria en ERP, cloud, ciberseguridad y transformacion digital.',
    keywords: ['consultora ti {{city}}', 'erp {{city}}', 'cloud {{city}}']
  },
  {
    id: 'desarrollo_software_empresa',
    nameEs: 'Software House',
    nameEn: 'Software Agency',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'ProfessionalService',
    headlineHook: 'Software a medida para tu empresa',
    subheadline: 'Desarrollo corporativo: sistemas internos, integraciones, automatizacion.',
    keywords: ['software house {{city}}', 'desarrollo empresa {{city}}']
  },
  {
    id: 'consultora_agro',
    nameEs: 'Consultora Agropecuaria',
    nameEn: 'Agri Consulting',
    verticalId: 'b2b-professional',
    extendsType: 'agronomo',
    schemaType: 'ProfessionalService',
    headlineHook: 'Rentabilidad en el campo, con datos',
    subheadline: 'Consultoria agronomica integral para productores y empresas.',
    keywords: ['consultora agropecuaria paraguay']
  },

  // ========== service-booking P2 (7) ==========
  {
    id: 'funcional',
    nameEs: 'Entrenamiento Funcional',
    nameEn: 'Functional Training',
    verticalId: 'service-booking',
    extendsType: 'gimnasio',
    schemaType: 'HealthClub',
    headlineHook: 'Entrenamiento real para tu vida real',
    subheadline: 'Entrenamiento funcional grupal y personal con coaches certificados.',
    keywords: ['entrenamiento funcional {{city}}']
  },
  {
    id: 'academia_baile',
    nameEs: 'Academia de Baile',
    nameEn: 'Dance Studio',
    verticalId: 'service-booking',
    extendsType: 'gimnasio',
    schemaType: 'DanceSchool',
    headlineHook: 'Bailar como siempre quisiste',
    subheadline: 'Clases de salsa, bachata, hip hop, contemporaneo y baile urbano.',
    keywords: ['academia baile {{city}}', 'salsa {{city}}', 'bachata {{city}}']
  },
  {
    id: 'futbol_campo',
    nameEs: 'Cancha de Futbol',
    nameEn: 'Soccer Field Rental',
    verticalId: 'service-booking',
    extendsType: 'gimnasio',
    schemaType: 'SportsActivityLocation',
    headlineHook: 'La cancha que tu grupo necesita',
    subheadline: 'Alquiler de canchas de futbol 5 y 7 con pasto sintetico e iluminacion.',
    keywords: ['cancha futbol 5 {{city}}', 'alquiler cancha {{city}}']
  },
  {
    id: 'personal_trainer',
    nameEs: 'Personal Trainer',
    nameEn: 'Personal Trainer',
    verticalId: 'service-booking',
    extendsType: 'gimnasio',
    schemaType: 'ProfessionalService',
    headlineHook: 'Entrenamiento uno a uno, resultados reales',
    subheadline: 'Personal trainer certificado con plan personalizado y seguimiento.',
    keywords: ['personal trainer {{city}}']
  },
  {
    id: 'nutricion_deportiva',
    nameEs: 'Nutricion Deportiva',
    nameEn: 'Sports Nutrition',
    verticalId: 'service-booking',
    extendsType: 'nutricionista',
    schemaType: 'MedicalBusiness',
    headlineHook: 'Nutricion que optimiza tu rendimiento',
    subheadline: 'Planes nutricionales para atletas amateur y profesionales.',
    keywords: ['nutricion deportiva {{city}}']
  },
  {
    id: 'coach_life',
    nameEs: 'Life Coach',
    nameEn: 'Life Coach',
    verticalId: 'service-booking',
    extendsType: 'psicologia',
    schemaType: 'ProfessionalService',
    headlineHook: 'Acompañamiento para la vida que queres',
    subheadline: 'Coaching personal y profesional con metodologia estructurada.',
    keywords: ['life coach {{city}}', 'coaching personal {{city}}']
  },
  {
    id: 'terapia_pareja',
    nameEs: 'Terapia de Pareja',
    nameEn: 'Couples Therapy',
    verticalId: 'service-booking',
    extendsType: 'psicologia',
    schemaType: 'Psychologist',
    headlineHook: 'Un espacio para ustedes',
    subheadline: 'Terapia de pareja con enfoque sistemico y tecnicas probadas.',
    keywords: ['terapia pareja {{city}}']
  }
]

runSeeds(SEEDS, 'batch-3 (P2 long-tail)')
