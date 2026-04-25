#!/usr/bin/env node
/**
 * Bulk-seed business types from a declarative list.
 *
 * Produces three files per entry if they don't already exist:
 *   src/registry/<id>.type.json
 *   src/tokens/<id>.tokens.json  (thin "extends: vertical:<id>" wrapper)
 *   src/content/<id>.content.json
 *
 * Re-runnable. Existing files are never overwritten — delete and re-run if you
 * want to regenerate one.
 *
 * Every entry inherits from a vertical base (via `extends`), so registry files
 * stay around 20 lines each. Content follows a standard hero/about/services/
 * testimonials/faq/footer skeleton; per-business copy authoring comes later.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const REGISTRY = path.join(ROOT, 'src/registry')
const TOKENS = path.join(ROOT, 'src/tokens')
const CONTENT = path.join(ROOT, 'src/content')

interface Seed {
  id: string
  nameEs: string
  nameEn: string
  verticalId: string
  extendsType: string
  schemaType: string
  headlineHook: string
  subheadline: string
  serviceCategories?: Array<{ id: string; name: string; description: string }>
  keywords?: string[]
  /** Optional: override the CTA pair at the registry hero level. */
  ctaPrimary?: { text: string; action: string }
  ctaSecondary?: { text: string; action: string }
  /** If true, this type gets its own palette file (not a vertical wrapper). */
  customTokens?: {
    paletteName: string
    colors: { primary: string; secondary: string; accent: string; background: string; surface: string; text: string }
    heading?: string
  }
}

const SEEDS: Seed[] = [
  // ========== beauty-personal-care P1 (5) ==========
  {
    id: 'masajes',
    nameEs: 'Masajes',
    nameEn: 'Massage Therapy',
    verticalId: 'beauty-personal-care',
    extendsType: 'spa',
    schemaType: 'HealthAndBeautyBusiness',
    headlineHook: 'Descansa, sana, renueva',
    subheadline: 'Masajes terapeuticos, descontracturantes y relajantes en {{city}}.',
    serviceCategories: [
      { id: 'relajante', name: 'Masaje Relajante', description: 'Alivia el estres del dia a dia.' },
      { id: 'descontracturante', name: 'Descontracturante', description: 'Para zonas cargadas por postura o deporte.' },
      { id: 'terapeutico', name: 'Terapeutico', description: 'Con conocimiento anatomico para lesiones y dolencias.' },
      { id: 'piedras', name: 'Piedras Calientes', description: 'Relajacion profunda con piedras volcanicas.' }
    ],
    keywords: ['masajes {{city}}', 'masajista {{city}}', 'masaje descontracturante {{city}}']
  },
  {
    id: 'alisado_capilar',
    nameEs: 'Alisado Capilar',
    nameEn: 'Hair Straightening',
    verticalId: 'beauty-personal-care',
    extendsType: 'peluqueria',
    schemaType: 'HairSalon',
    headlineHook: 'Cabello liso, sano y brilloso',
    subheadline: 'Alisado profesional con keratina y tecnicas sin formol en {{city}}.',
    serviceCategories: [
      { id: 'keratina', name: 'Keratina', description: 'Liso perfecto de 3 a 5 meses.' },
      { id: 'botox', name: 'Botox Capilar', description: 'Hidratacion profunda y efecto liso natural.' },
      { id: 'progresiva', name: 'Progresiva', description: 'Alisado de larga duracion.' }
    ],
    keywords: ['alisado {{city}}', 'keratina {{city}}', 'botox capilar {{city}}']
  },
  {
    id: 'extensiones_cabello',
    nameEs: 'Extensiones de Cabello',
    nameEn: 'Hair Extensions',
    verticalId: 'beauty-personal-care',
    extendsType: 'peluqueria',
    schemaType: 'HairSalon',
    headlineHook: 'Mas volumen, mas largo, mas vos',
    subheadline: 'Extensiones con cabello 100% natural aplicadas por expertas en {{city}}.',
    serviceCategories: [
      { id: 'queratina', name: 'Queratina', description: 'Sistema invisible, duradero.' },
      { id: 'microanillos', name: 'Microanillos', description: 'Sin calor, reutilizables.' },
      { id: 'clip', name: 'Clip', description: 'Temporarias para eventos.' }
    ],
    keywords: ['extensiones cabello {{city}}', 'extensiones pelo {{city}}']
  },
  {
    id: 'peluqueria_canina',
    nameEs: 'Peluqueria Canina',
    nameEn: 'Pet Grooming',
    verticalId: 'beauty-personal-care',
    extendsType: 'beauty_base',
    schemaType: 'PetStore',
    headlineHook: 'Tu mascota siempre impecable',
    subheadline: 'Bano, corte y estetica canina en {{city}} con productos hipoalergenicos.',
    serviceCategories: [
      { id: 'bano', name: 'Bano', description: 'Shampoo medicado, perfume y secado.' },
      { id: 'corte', name: 'Corte de Raza', description: 'Segun estandar de cada raza.' },
      { id: 'desanudar', name: 'Desenredado', description: 'Mascotas con pelo muy enredado.' }
    ],
    keywords: ['peluqueria canina {{city}}', 'bano perros {{city}}', 'estetica canina {{city}}']
  },
  {
    id: 'micropigmentacion',
    nameEs: 'Micropigmentacion',
    nameEn: 'Permanent Makeup',
    verticalId: 'beauty-personal-care',
    extendsType: 'beauty_base',
    schemaType: 'BeautySalon',
    headlineHook: 'Maquillaje que dura meses',
    subheadline: 'Cejas, labios y delineado con tecnicas de ultima generacion.',
    serviceCategories: [
      { id: 'cejas', name: 'Cejas Pelo a Pelo', description: 'Disenos naturales.' },
      { id: 'labios', name: 'Micropigmentacion de Labios', description: 'Color uniforme y larga duracion.' },
      { id: 'delineado', name: 'Delineado de Ojos', description: 'Sutil y elegante.' }
    ],
    keywords: ['micropigmentacion {{city}}', 'cejas pelo a pelo {{city}}']
  },

  // ========== health-wellness P1 (8) ==========
  {
    id: 'consultorio_odontologico',
    nameEs: 'Consultorio Odontologico',
    nameEn: 'Dental Clinic',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Dentist',
    headlineHook: 'Tu sonrisa en manos expertas',
    subheadline: 'Odontologia general, estetica y especialidades en {{city}}.',
    serviceCategories: [
      { id: 'consulta', name: 'Consulta y Diagnostico', description: 'Evaluacion integral y plan de tratamiento.' },
      { id: 'limpieza', name: 'Limpieza y Prevencion', description: 'Profilaxis y control de placa.' },
      { id: 'estetica', name: 'Odontologia Estetica', description: 'Blanqueamiento, carillas, diseno de sonrisa.' },
      { id: 'ortodoncia', name: 'Ortodoncia', description: 'Brackets tradicionales e invisibles.' },
      { id: 'implantes', name: 'Implantes', description: 'Reemplazo definitivo de piezas dentales.' }
    ],
    keywords: ['odontologo {{city}}', 'dentista {{city}}', 'implantes dentales {{city}}', 'ortodoncia {{city}}']
  },
  {
    id: 'pediatria',
    nameEs: 'Pediatria',
    nameEn: 'Pediatrics',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'MedicalClinic',
    headlineHook: 'Cuidado integral para tus hijos',
    subheadline: 'Pediatria desde el nacimiento hasta la adolescencia en {{city}}.',
    serviceCategories: [
      { id: 'consulta', name: 'Consulta Pediatrica', description: 'Controles de salud y desarrollo.' },
      { id: 'vacunas', name: 'Vacunacion', description: 'Esquema completo al dia.' },
      { id: 'nutricion', name: 'Nutricion Infantil', description: 'Orientacion alimentaria por edad.' }
    ],
    keywords: ['pediatra {{city}}', 'medico ninos {{city}}']
  },
  {
    id: 'psicologia',
    nameEs: 'Psicologia',
    nameEn: 'Psychology',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Psychologist',
    headlineHook: 'Un espacio para ti',
    subheadline: 'Terapia individual, de pareja y familiar con enfoque humanista en {{city}}.',
    serviceCategories: [
      { id: 'individual', name: 'Terapia Individual', description: 'Adultos y adolescentes.' },
      { id: 'pareja', name: 'Terapia de Pareja', description: 'Acompañamiento con ambas personas.' },
      { id: 'familiar', name: 'Terapia Familiar', description: 'Espacio para toda la familia.' },
      { id: 'online', name: 'Sesiones Online', description: 'Para pacientes fuera del pais.' }
    ],
    keywords: ['psicologo {{city}}', 'terapia {{city}}', 'terapia pareja {{city}}']
  },
  {
    id: 'nutricionista',
    nameEs: 'Nutricionista',
    nameEn: 'Nutritionist',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'MedicalBusiness',
    headlineHook: 'Come mejor, vive mejor',
    subheadline: 'Planes nutricionales personalizados para cada objetivo en {{city}}.',
    serviceCategories: [
      { id: 'peso', name: 'Control de Peso', description: 'Planes realistas y sostenibles.' },
      { id: 'deportiva', name: 'Nutricion Deportiva', description: 'Para rendimiento y recuperacion.' },
      { id: 'clinica', name: 'Nutricion Clinica', description: 'Diabetes, hipertension, gastritis.' },
      { id: 'infantil', name: 'Nutricion Infantil', description: 'Alimentacion por edades.' }
    ],
    keywords: ['nutricionista {{city}}', 'licenciada en nutricion {{city}}']
  },
  {
    id: 'kinesiologia',
    nameEs: 'Kinesiologia',
    nameEn: 'Physiotherapy',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Physiotherapy',
    headlineHook: 'Rehabilitacion que te devuelve movilidad',
    subheadline: 'Fisioterapia, rehabilitacion y terapia deportiva en {{city}}.',
    serviceCategories: [
      { id: 'rehabilitacion', name: 'Rehabilitacion', description: 'Post-quirurgica, traumatica y neurologica.' },
      { id: 'deportiva', name: 'Terapia Deportiva', description: 'Prevencion y tratamiento de lesiones.' },
      { id: 'respiratoria', name: 'Kinesiologia Respiratoria', description: 'Pediatrica y adulta.' }
    ],
    keywords: ['kinesiologo {{city}}', 'fisioterapia {{city}}', 'rehabilitacion {{city}}']
  },
  {
    id: 'dermatologia',
    nameEs: 'Dermatologia',
    nameEn: 'Dermatology',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Physician',
    headlineHook: 'Piel sana, piel segura',
    subheadline: 'Consulta dermatologica, control de lunares y estetica medica en {{city}}.',
    serviceCategories: [
      { id: 'consulta', name: 'Consulta Dermatologica', description: 'Diagnostico y tratamiento.' },
      { id: 'lunares', name: 'Control de Lunares', description: 'Dermatoscopia y seguimiento.' },
      { id: 'estetica', name: 'Dermatologia Estetica', description: 'Peelings, toxina, rellenos.' }
    ],
    keywords: ['dermatologo {{city}}', 'control lunares {{city}}', 'dermatologia estetica {{city}}']
  },
  {
    id: 'oftalmologia',
    nameEs: 'Oftalmologia / Optica',
    nameEn: 'Ophthalmology / Optician',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'Optician',
    headlineHook: 'Cuidamos tu vision',
    subheadline: 'Examenes visuales, anteojos y lentes de contacto en {{city}}.',
    serviceCategories: [
      { id: 'examen', name: 'Examen Visual', description: 'Graduacion y salud ocular.' },
      { id: 'anteojos', name: 'Anteojos', description: 'Amplia variedad de marcos y cristales.' },
      { id: 'lentes_contacto', name: 'Lentes de Contacto', description: 'Adaptacion y seguimiento.' }
    ],
    keywords: ['oftalmologo {{city}}', 'optica {{city}}', 'anteojos {{city}}']
  },
  {
    id: 'laboratorio_analisis',
    nameEs: 'Laboratorio Clinico',
    nameEn: 'Medical Lab',
    verticalId: 'health-wellness',
    extendsType: 'health_wellness_base',
    schemaType: 'MedicalLaboratory',
    headlineHook: 'Resultados confiables, rapidos',
    subheadline: 'Analisis clinicos con tecnologia de ultima generacion en {{city}}.',
    serviceCategories: [
      { id: 'rutina', name: 'Analisis de Rutina', description: 'Hemograma, glucemia, colesterol.' },
      { id: 'hormonal', name: 'Panel Hormonal', description: 'Tiroides, reproductivas, stress.' },
      { id: 'covid', name: 'Test COVID', description: 'PCR y antigenos con resultado en horas.' },
      { id: 'domicilio', name: 'Extraccion a Domicilio', description: 'En {{city}} y alrededores.' }
    ],
    keywords: ['laboratorio {{city}}', 'analisis clinicos {{city}}', 'extraccion domicilio {{city}}']
  },

  // ========== food-beverage P1 (10) ==========
  {
    id: 'parrilla_asador',
    nameEs: 'Parrillada',
    nameEn: 'Steakhouse',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'Carne a las brasas como la tradicion manda',
    subheadline: 'Cortes premium, parrilla a leña y ambiente familiar en {{city}}.',
    serviceCategories: [
      { id: 'cortes', name: 'Cortes de Carne', description: 'Bife ancho, vacio, asado de tira, chorizo.' },
      { id: 'acompañamientos', name: 'Acompañamientos', description: 'Papas, ensaladas, mandioca.' },
      { id: 'pastas', name: 'Pastas', description: 'Caseras, salsas tradicionales.' }
    ],
    keywords: ['parrilla {{city}}', 'asador {{city}}', 'steakhouse {{city}}']
  },
  {
    id: 'pizzeria',
    nameEs: 'Pizzeria',
    nameEn: 'Pizzeria',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'Pizza al horno, tradicion de barrio',
    subheadline: 'Pizzas artesanales al horno a leña en {{city}}.',
    serviceCategories: [
      { id: 'tradicionales', name: 'Pizzas Tradicionales', description: 'Napolitana, mozzarella, fugazetta.' },
      { id: 'especiales', name: 'Especiales', description: 'Pepperoni, roquefort, cuatro quesos.' },
      { id: 'empanadas', name: 'Empanadas y Piqueos', description: 'Carne, pollo, jamon y queso.' }
    ],
    keywords: ['pizzeria {{city}}', 'pizza {{city}}', 'delivery pizza {{city}}']
  },
  {
    id: 'hamburgueseria',
    nameEs: 'Hamburgueseria',
    nameEn: 'Burger Joint',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'Hamburguesas smash, papas crispy',
    subheadline: 'Hamburguesas artesanales con carne 100% de calidad en {{city}}.',
    serviceCategories: [
      { id: 'burgers', name: 'Hamburguesas', description: 'Smash clasica, cheese, doble, bacon.' },
      { id: 'papas', name: 'Papas', description: 'Papas fritas, con queso, con pulled pork.' },
      { id: 'combos', name: 'Combos', description: 'Burger + papas + bebida.' }
    ],
    keywords: ['hamburguesas {{city}}', 'burger {{city}}', 'smash burger {{city}}']
  },
  {
    id: 'lomiteria',
    nameEs: 'Lomiteria',
    nameEn: 'Lomito Shop',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'El lomito paraguayo como corresponde',
    subheadline: 'Lomitos completos, chorizos y minutas al paso en {{city}}.',
    serviceCategories: [
      { id: 'lomitos', name: 'Lomitos', description: 'Completo, arabe, al plato.' },
      { id: 'chorizo', name: 'Chorizos', description: 'Especial, criollo, con papas.' },
      { id: 'picaditas', name: 'Picaditas', description: 'Con salame, queso, aceitunas.' }
    ],
    keywords: ['lomiteria {{city}}', 'lomitos {{city}}', 'chorizos {{city}}']
  },
  {
    id: 'chiperia',
    nameEs: 'Chiperia',
    nameEn: 'Chipa Shop',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Bakery',
    headlineHook: 'La chipa de siempre, recien hornada',
    subheadline: 'Chipa, mbeyu, sopa paraguaya y chipa guasu recien hechos en {{city}}.',
    serviceCategories: [
      { id: 'chipas', name: 'Chipas', description: 'Almidon, so o, con queso especial.' },
      { id: 'tipicos', name: 'Tipicos', description: 'Sopa paraguaya, chipa guasu, mbeyu.' },
      { id: 'bebidas', name: 'Bebidas', description: 'Cocido, mate, terere.' }
    ],
    keywords: ['chiperia {{city}}', 'chipa {{city}}', 'comida paraguaya {{city}}']
  },
  {
    id: 'cafeteria',
    nameEs: 'Cafeteria',
    nameEn: 'Coffee Shop',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'CafeOrCoffeeShop',
    headlineHook: 'Tu cafe, tu lugar',
    subheadline: 'Cafes de especialidad, desayunos y meriendas en {{city}}.',
    serviceCategories: [
      { id: 'cafes', name: 'Cafes', description: 'Espresso, latte, capuccino, frapes.' },
      { id: 'desayunos', name: 'Desayunos', description: 'Tostados, medialunas, bowls.' },
      { id: 'pasteleria', name: 'Pasteleria', description: 'Tortas, cookies, pie.' }
    ],
    keywords: ['cafeteria {{city}}', 'cafe especialidad {{city}}', 'desayuno {{city}}']
  },
  {
    id: 'heladeria',
    nameEs: 'Heladeria',
    nameEn: 'Ice Cream Shop',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'IceCreamShop',
    headlineHook: 'Helado artesanal, sabores de verdad',
    subheadline: 'Helados artesanales, cucuruchos y paletas en {{city}}.',
    serviceCategories: [
      { id: 'cremosos', name: 'Cremosos', description: 'Dulce de leche, chocolate, crema americana.' },
      { id: 'frutales', name: 'Frutales', description: 'Frutilla, mango, limon.' },
      { id: 'paletas', name: 'Paletas', description: 'Gourmet con ingredientes naturales.' }
    ],
    keywords: ['heladeria {{city}}', 'helado artesanal {{city}}']
  },
  {
    id: 'pollo_brasa',
    nameEs: 'Pollo a la Brasa',
    nameEn: 'Rotisserie Chicken',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'Restaurant',
    headlineHook: 'Pollo dorado, crocante, jugoso',
    subheadline: 'Pollo a la brasa con papas doradas y aji panca en {{city}}.',
    serviceCategories: [
      { id: 'pollo', name: 'Pollo a la Brasa', description: 'Entero, medio, cuarto.' },
      { id: 'combos', name: 'Combos Familiares', description: 'Con papas y ensalada.' },
      { id: 'bebidas', name: 'Bebidas', description: 'Gaseosas, chicha morada.' }
    ],
    keywords: ['pollo brasa {{city}}', 'rotiseria {{city}}']
  },
  {
    id: 'catering',
    nameEs: 'Catering',
    nameEn: 'Catering',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'FoodService',
    headlineHook: 'La gastronomia de tu evento',
    subheadline: 'Catering para eventos corporativos, bodas y reuniones en {{city}}.',
    serviceCategories: [
      { id: 'corporativo', name: 'Corporativo', description: 'Coffee breaks, almuerzos ejecutivos.' },
      { id: 'social', name: 'Eventos Sociales', description: 'Bodas, quinceañeras, cumpleaños.' },
      { id: 'finger_food', name: 'Finger Food', description: 'Canapes y bocaditos gourmet.' }
    ],
    keywords: ['catering {{city}}', 'catering bodas {{city}}', 'catering empresas {{city}}']
  },
  {
    id: 'bar_pub',
    nameEs: 'Bar / Pub',
    nameEn: 'Bar / Pub',
    verticalId: 'food-beverage',
    extendsType: 'restaurant',
    schemaType: 'BarOrPub',
    headlineHook: 'Despues del trabajo, lo mejor del barrio',
    subheadline: 'Cervezas tiradas, tragos de autor y picadas en {{city}}.',
    serviceCategories: [
      { id: 'cervezas', name: 'Cervezas', description: 'Tiradas y artesanales.' },
      { id: 'tragos', name: 'Tragos', description: 'Clasicos y de autor.' },
      { id: 'picadas', name: 'Picadas', description: 'Tablas, nachos, alitas.' }
    ],
    keywords: ['bar {{city}}', 'pub {{city}}', 'happy hour {{city}}']
  },

  // ========== trades-home-services P1 (8) ==========
  {
    id: 'aire_acondicionado',
    nameEs: 'Servicio Tecnico Aires',
    nameEn: 'HVAC Service',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HVACBusiness',
    headlineHook: 'Tu aire siempre andando',
    subheadline: 'Instalacion, limpieza y reparacion de aires acondicionados en {{city}}.',
    serviceCategories: [
      { id: 'instalacion', name: 'Instalacion', description: 'Split, cassette, piso-techo.' },
      { id: 'limpieza', name: 'Limpieza', description: 'Filtros, serpentines, sistema completo.' },
      { id: 'reparacion', name: 'Reparacion', description: 'Diagnostico y arreglos en el dia.' },
      { id: 'carga_gas', name: 'Carga de Gas', description: 'R22, R410 y refrigerantes modernos.' }
    ],
    keywords: ['aire acondicionado {{city}}', 'instalacion aire {{city}}', 'carga gas aire {{city}}']
  },
  {
    id: 'fumigacion',
    nameEs: 'Fumigacion y Control de Plagas',
    nameEn: 'Pest Control',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'PestControl',
    headlineHook: 'Tu casa sin plagas, garantizado',
    subheadline: 'Control profesional de insectos, roedores y termitas en {{city}}.',
    serviceCategories: [
      { id: 'insectos', name: 'Insectos', description: 'Cucarachas, hormigas, pulgas.' },
      { id: 'roedores', name: 'Roedores', description: 'Desratizacion domiciliaria y comercial.' },
      { id: 'termitas', name: 'Termitas', description: 'Inspeccion y tratamiento.' },
      { id: 'mosquitos', name: 'Mosquitos', description: 'Fumigacion espacial y patios.' }
    ],
    keywords: ['fumigacion {{city}}', 'control plagas {{city}}', 'desratizacion {{city}}']
  },
  {
    id: 'jardineria',
    nameEs: 'Jardineria',
    nameEn: 'Landscaping',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Tu jardin de revista',
    subheadline: 'Diseno, mantenimiento y paisajismo en {{city}}.',
    serviceCategories: [
      { id: 'mantenimiento', name: 'Mantenimiento', description: 'Corte de cesped, poda, riego.' },
      { id: 'diseño', name: 'Diseño de Jardin', description: 'Plan, seleccion de plantas, ejecucion.' },
      { id: 'parquizacion', name: 'Parquizacion', description: 'Arboles, cesped, sistema de riego.' }
    ],
    keywords: ['jardineria {{city}}', 'mantenimiento jardin {{city}}', 'paisajismo {{city}}']
  },
  {
    id: 'mudanzas',
    nameEs: 'Mudanzas',
    nameEn: 'Moving Services',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'MovingCompany',
    headlineHook: 'Tu mudanza sin estres',
    subheadline: 'Mudanzas residenciales y corporativas en {{city}}. Embalaje incluido.',
    serviceCategories: [
      { id: 'residencial', name: 'Mudanza Residencial', description: 'Casas y departamentos.' },
      { id: 'corporativa', name: 'Mudanza Corporativa', description: 'Oficinas y empresas.' },
      { id: 'embalaje', name: 'Embalaje', description: 'Cajas, plastico burbuja, proteccion muebles.' },
      { id: 'deposito', name: 'Deposito Temporal', description: 'Guardado seguro.' }
    ],
    keywords: ['mudanzas {{city}}', 'flete mudanza {{city}}']
  },
  {
    id: 'albanil',
    nameEs: 'Albañil / Construccion',
    nameEn: 'Mason / Builder',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'De la idea a la obra',
    subheadline: 'Albañileria, remodelaciones y ampliaciones en {{city}}.',
    serviceCategories: [
      { id: 'construccion', name: 'Construccion', description: 'Casas, locales, galpones.' },
      { id: 'remodelacion', name: 'Remodelaciones', description: 'Baños, cocinas, espacios completos.' },
      { id: 'ampliacion', name: 'Ampliaciones', description: 'Dormitorios, quinchos, pisos nuevos.' }
    ],
    keywords: ['albañil {{city}}', 'constructor {{city}}', 'remodelacion {{city}}']
  },
  {
    id: 'pintor',
    nameEs: 'Pintor',
    nameEn: 'Painter',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Colores que transforman',
    subheadline: 'Pintura interior y exterior, residencial y comercial en {{city}}.',
    serviceCategories: [
      { id: 'interior', name: 'Pintura Interior', description: 'Paredes, cielorrasos, detalles.' },
      { id: 'exterior', name: 'Pintura Exterior', description: 'Fachadas, muros, portones.' },
      { id: 'especiales', name: 'Tecnicas Especiales', description: 'Estucos, texturas, empapelado.' }
    ],
    keywords: ['pintor {{city}}', 'pintura casa {{city}}', 'pintura fachada {{city}}']
  },
  {
    id: 'piscinas',
    nameEs: 'Mantenimiento de Piscinas',
    nameEn: 'Pool Service',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Agua cristalina todo el año',
    subheadline: 'Mantenimiento, reparacion y construccion de piscinas en {{city}}.',
    serviceCategories: [
      { id: 'mantenimiento', name: 'Mantenimiento', description: 'Limpieza semanal, productos quimicos.' },
      { id: 'reparacion', name: 'Reparacion', description: 'Bomba, filtro, fugas.' },
      { id: 'construccion', name: 'Construccion', description: 'Piscinas de hormigon y fibra.' }
    ],
    keywords: ['mantenimiento piscinas {{city}}', 'piscinero {{city}}']
  },
  {
    id: 'paneles_solares',
    nameEs: 'Paneles Solares',
    nameEn: 'Solar Installation',
    verticalId: 'trades-home-services',
    extendsType: 'trades_base',
    schemaType: 'HomeAndConstructionBusiness',
    headlineHook: 'Energia del sol, ahorro real',
    subheadline: 'Sistemas solares para viviendas, comercios e industrias en {{city}}.',
    serviceCategories: [
      { id: 'residencial', name: 'Sistemas Residenciales', description: 'Autoconsumo hogares.' },
      { id: 'comercial', name: 'Sistemas Comerciales', description: 'Locales, oficinas, galpones.' },
      { id: 'mantenimiento', name: 'Mantenimiento', description: 'Limpieza, inversores, bateras.' }
    ],
    keywords: ['paneles solares {{city}}', 'energia solar {{city}}']
  },

  // ========== automotive P1 (6) ==========
  {
    id: 'taller_chaperia_pintura',
    nameEs: 'Chaperia y Pintura',
    nameEn: 'Auto Body Shop',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutoBodyShop',
    headlineHook: 'Tu auto como nuevo',
    subheadline: 'Chaperia, pintura y restauracion integral en {{city}}.',
    serviceCategories: [
      { id: 'chaperia', name: 'Chaperia', description: 'Reparacion de golpes y deformaciones.' },
      { id: 'pintura', name: 'Pintura', description: 'Pintura completa y retoques.' },
      { id: 'pulido', name: 'Pulido', description: 'Eliminacion de rayones y devolver brillo.' }
    ],
    keywords: ['chaperia pintura {{city}}', 'reparacion auto {{city}}', 'pintura auto {{city}}']
  },
  {
    id: 'lavadero_autos',
    nameEs: 'Lavadero de Autos',
    nameEn: 'Car Wash',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutoWash',
    headlineHook: 'Tu auto reluciente',
    subheadline: 'Lavado completo, encerado y detailing en {{city}}.',
    serviceCategories: [
      { id: 'lavado', name: 'Lavado Completo', description: 'Exterior, interior, alfombras.' },
      { id: 'encerado', name: 'Encerado', description: 'Protege la pintura y da brillo.' },
      { id: 'motor', name: 'Lavado de Motor', description: 'Limpieza profunda del motor.' }
    ],
    keywords: ['lavadero autos {{city}}', 'lavado auto {{city}}', 'encerado {{city}}']
  },
  {
    id: 'gomeria',
    nameEs: 'Gomeria',
    nameEn: 'Tire Shop',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'TireShop',
    headlineHook: 'Ruedas nuevas, viaje tranquilo',
    subheadline: 'Venta, montaje y balanceo de neumaticos en {{city}}.',
    serviceCategories: [
      { id: 'venta', name: 'Venta de Neumaticos', description: 'Todas las marcas y medidas.' },
      { id: 'montaje', name: 'Montaje y Balanceo', description: 'Rapido y con equipamiento moderno.' },
      { id: 'alineacion', name: 'Alineacion', description: 'Previene desgaste irregular.' }
    ],
    keywords: ['gomeria {{city}}', 'neumaticos {{city}}', 'alineacion balanceo {{city}}']
  },
  {
    id: 'polarizado',
    nameEs: 'Polarizado de Vidrios',
    nameEn: 'Window Tinting',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'AutomotiveBusiness',
    headlineHook: 'Privacidad, frescura, estilo',
    subheadline: 'Polarizado profesional con peliculas de alta calidad en {{city}}.',
    serviceCategories: [
      { id: 'estandar', name: 'Polarizado Estandar', description: 'Duracion 2-3 años.' },
      { id: 'premium', name: 'Polarizado Premium', description: 'Rechazo termico alto.' },
      { id: 'arquitectonico', name: 'Polarizado Arquitectonico', description: 'Oficinas y viviendas.' }
    ],
    keywords: ['polarizado {{city}}', 'polarizado vidrios {{city}}']
  },
  {
    id: 'remiseria',
    nameEs: 'Remiseria',
    nameEn: 'Private Car Service',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'TaxiService',
    headlineHook: 'Viajes seguros todos los dias',
    subheadline: 'Remises particulares y corporativos en {{city}}. 24 horas.',
    serviceCategories: [
      { id: 'ciudad', name: 'Viajes en Ciudad', description: 'Tarifa plana, sin sorpresas.' },
      { id: 'aeropuerto', name: 'Aeropuerto', description: 'Tarifa fija ida y vuelta.' },
      { id: 'empresa', name: 'Cuentas Corporativas', description: 'Servicio facturado para empresas.' }
    ],
    keywords: ['remiseria {{city}}', 'remis {{city}}', 'traslado aeropuerto {{city}}']
  },
  {
    id: 'escuela_conducir',
    nameEs: 'Autoescuela',
    nameEn: 'Driving School',
    verticalId: 'automotive',
    extendsType: 'automotive_base',
    schemaType: 'DrivingSchool',
    headlineHook: 'Aprende a manejar con confianza',
    subheadline: 'Clases practicas y teoricas para licencia en {{city}}.',
    serviceCategories: [
      { id: 'auto', name: 'Licencia de Auto', description: 'Clases desde cero.' },
      { id: 'moto', name: 'Licencia de Moto', description: 'Practica en pista y calle.' },
      { id: 'profesional', name: 'Licencia Profesional', description: 'Para camiones y colectivos.' }
    ],
    keywords: ['autoescuela {{city}}', 'escuela conducir {{city}}', 'licencia conducir {{city}}']
  },

  // ========== retail-local P1 (10) ==========
  {
    id: 'tienda_ropa',
    nameEs: 'Tienda de Ropa',
    nameEn: 'Clothing Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'ClothingStore',
    headlineHook: 'Tu estilo, nuestra seleccion',
    subheadline: 'Moda para ella y el con lo mejor de cada temporada en {{city}}.',
    serviceCategories: [
      { id: 'mujer', name: 'Mujer', description: 'Vestidos, tops, pantalones.' },
      { id: 'hombre', name: 'Hombre', description: 'Camisas, pantalones, camperas.' },
      { id: 'accesorios', name: 'Accesorios', description: 'Carteras, cinturones, joyas.' }
    ],
    keywords: ['tienda ropa {{city}}', 'moda {{city}}', 'ropa femenina {{city}}']
  },
  {
    id: 'boutique',
    nameEs: 'Boutique',
    nameEn: 'Boutique',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'ClothingStore',
    headlineHook: 'Moda curada con amor',
    subheadline: 'Boutique con prendas exclusivas y seleccion personalizada en {{city}}.',
    serviceCategories: [
      { id: 'nueva_temporada', name: 'Nueva Temporada', description: 'Las ultimas tendencias.' },
      { id: 'exclusivos', name: 'Exclusivos', description: 'Prendas de autor.' },
      { id: 'accesorios', name: 'Accesorios', description: 'Complementos unicos.' }
    ],
    keywords: ['boutique {{city}}', 'ropa exclusiva {{city}}']
  },
  {
    id: 'zapateria',
    nameEs: 'Zapateria',
    nameEn: 'Shoe Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'ShoeStore',
    headlineHook: 'Calza bien, vive bien',
    subheadline: 'Calzado de calidad para toda la familia en {{city}}.',
    serviceCategories: [
      { id: 'mujer', name: 'Mujer', description: 'Botas, zapatillas, tacos.' },
      { id: 'hombre', name: 'Hombre', description: 'De vestir, casual, deportivas.' },
      { id: 'niños', name: 'Niños', description: 'Escolar, deportivo, fiesta.' }
    ],
    keywords: ['zapateria {{city}}', 'zapatos {{city}}', 'calzado {{city}}']
  },
  {
    id: 'celulares_accesorios',
    nameEs: 'Celulares y Accesorios',
    nameEn: 'Phone Shop',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'ElectronicsStore',
    headlineHook: 'Tu proximo celular al mejor precio',
    subheadline: 'Celulares nuevos, usados, accesorios y servicio tecnico en {{city}}.',
    serviceCategories: [
      { id: 'celulares', name: 'Celulares', description: 'Nuevos y usados de todas las marcas.' },
      { id: 'accesorios', name: 'Accesorios', description: 'Fundas, cargadores, audifonos.' },
      { id: 'reparacion', name: 'Reparacion', description: 'Pantallas, bateras, pines de carga.' }
    ],
    keywords: ['celulares {{city}}', 'tienda celulares {{city}}', 'reparacion celular {{city}}']
  },
  {
    id: 'libreria',
    nameEs: 'Libreria / Utiles',
    nameEn: 'Bookstore & Stationery',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Store',
    headlineHook: 'Libros, cuadernos y material escolar',
    subheadline: 'Libreria y papeleria con todo para el colegio, oficina y creativos en {{city}}.',
    serviceCategories: [
      { id: 'utiles', name: 'Utiles Escolares', description: 'Lista escolar completa.' },
      { id: 'oficina', name: 'Oficina', description: 'Papel, lapiceras, carpetas.' },
      { id: 'libros', name: 'Libros', description: 'Literatura, infantil, escolares.' }
    ],
    keywords: ['libreria {{city}}', 'utiles escolares {{city}}', 'papeleria {{city}}']
  },
  {
    id: 'florista',
    nameEs: 'Floreria',
    nameEn: 'Florist',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'Florist',
    headlineHook: 'Flores que emocionan',
    subheadline: 'Ramos, coronas y decoracion floral con entrega a domicilio en {{city}}.',
    serviceCategories: [
      { id: 'ramos', name: 'Ramos', description: 'Para cumpleaños, aniversarios, romanticos.' },
      { id: 'eventos', name: 'Decoracion de Eventos', description: 'Bodas, bautismos, corporativos.' },
      { id: 'coronas', name: 'Coronas Funebres', description: 'Entrega rapida.' }
    ],
    keywords: ['floreria {{city}}', 'ramo flores {{city}}', 'envio flores {{city}}']
  },
  {
    id: 'muebleria',
    nameEs: 'Muebleria',
    nameEn: 'Furniture Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'FurnitureStore',
    headlineHook: 'Tu casa, tu estilo',
    subheadline: 'Muebles modernos y clasicos para todos los ambientes en {{city}}.',
    serviceCategories: [
      { id: 'living', name: 'Living y Comedor', description: 'Sofas, mesas, bufeteros.' },
      { id: 'dormitorio', name: 'Dormitorio', description: 'Camas, placares, mesitas.' },
      { id: 'oficina', name: 'Oficina', description: 'Escritorios, sillas, bibliotecas.' }
    ],
    keywords: ['muebleria {{city}}', 'muebles {{city}}']
  },
  {
    id: 'ferreteria',
    nameEs: 'Ferreteria',
    nameEn: 'Hardware Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'HardwareStore',
    headlineHook: 'Todo para tu obra y reparaciones',
    subheadline: 'Ferreteria con herramientas, electricidad, plomeria y materiales en {{city}}.',
    serviceCategories: [
      { id: 'herramientas', name: 'Herramientas', description: 'Manuales y electricas.' },
      { id: 'electricidad', name: 'Electricidad', description: 'Cables, llaves, tableros.' },
      { id: 'plomeria', name: 'Plomeria', description: 'Caños, grifos, accesorios.' }
    ],
    keywords: ['ferreteria {{city}}', 'herramientas {{city}}', 'materiales construccion {{city}}']
  },
  {
    id: 'tienda_mascotas',
    nameEs: 'Pet Shop',
    nameEn: 'Pet Shop',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'PetStore',
    headlineHook: 'Todo para tu mejor amigo',
    subheadline: 'Alimentos, accesorios y cuidado para mascotas en {{city}}.',
    serviceCategories: [
      { id: 'alimentos', name: 'Alimentos', description: 'Perros, gatos, aves, roedores.' },
      { id: 'accesorios', name: 'Accesorios', description: 'Correas, camas, juguetes.' },
      { id: 'higiene', name: 'Higiene', description: 'Shampoo, pipetas, limpieza.' }
    ],
    keywords: ['pet shop {{city}}', 'alimento mascotas {{city}}', 'veterinaria {{city}}']
  },
  {
    id: 'licoreria',
    nameEs: 'Licoreria / Vinoteca',
    nameEn: 'Liquor & Wine Store',
    verticalId: 'retail-local',
    extendsType: 'retail_base',
    schemaType: 'LiquorStore',
    headlineHook: 'La bebida justa para tu momento',
    subheadline: 'Vinos, destilados y cervezas seleccionadas en {{city}}.',
    serviceCategories: [
      { id: 'vinos', name: 'Vinos', description: 'Nacionales e importados.' },
      { id: 'destilados', name: 'Destilados', description: 'Whisky, vodka, gin, tequila.' },
      { id: 'cervezas', name: 'Cervezas', description: 'Artesanales e importadas.' }
    ],
    keywords: ['vinoteca {{city}}', 'licoreria {{city}}', 'vino {{city}}']
  },

  // ========== education-training P1 (6) ==========
  {
    id: 'jardin_infantes',
    nameEs: 'Jardin de Infantes',
    nameEn: 'Preschool',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'Preschool',
    headlineHook: 'Primera infancia con amor y juego',
    subheadline: 'Jardin de infantes con pedagogia activa y ambiente seguro en {{city}}.',
    serviceCategories: [
      { id: 'maternal', name: 'Maternal', description: 'De 1 a 2 años.' },
      { id: 'jardin', name: 'Jardin', description: 'De 3 a 5 años.' },
      { id: 'extensiones', name: 'Talleres', description: 'Musica, ingles, arte.' }
    ],
    keywords: ['jardin infantes {{city}}', 'guarderia {{city}}', 'preescolar {{city}}']
  },
  {
    id: 'academia_idiomas',
    nameEs: 'Academia de Idiomas',
    nameEn: 'Language Academy',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Aprende idiomas con metodo',
    subheadline: 'Cursos de ingles, portugues y otros idiomas en {{city}}. Todos los niveles.',
    serviceCategories: [
      { id: 'ingles', name: 'Ingles', description: 'General, business, examenes.' },
      { id: 'portugues', name: 'Portugues', description: 'Para turismo, negocios y exámenes.' },
      { id: 'otros', name: 'Otros Idiomas', description: 'Frances, aleman, italiano.' }
    ],
    keywords: ['academia ingles {{city}}', 'clases ingles {{city}}', 'portugues {{city}}']
  },
  {
    id: 'apoyo_escolar',
    nameEs: 'Apoyo Escolar',
    nameEn: 'Tutoring',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Refuerzo academico personalizado',
    subheadline: 'Clases de apoyo para primaria, secundaria y universidad en {{city}}.',
    serviceCategories: [
      { id: 'primaria', name: 'Primaria', description: 'Todas las materias.' },
      { id: 'secundaria', name: 'Secundaria', description: 'Matematica, lengua, ciencias.' },
      { id: 'universitario', name: 'Universitario', description: 'Calculo, estadistica, tesis.' }
    ],
    keywords: ['apoyo escolar {{city}}', 'clases particulares {{city}}', 'profesor matematica {{city}}']
  },
  {
    id: 'instituto_tecnico',
    nameEs: 'Instituto Tecnico',
    nameEn: 'Technical Institute',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Formacion con salida laboral',
    subheadline: 'Carreras tecnicas cortas y certificaciones profesionales en {{city}}.',
    serviceCategories: [
      { id: 'informatica', name: 'Informatica', description: 'Desarrollo, redes, soporte.' },
      { id: 'administracion', name: 'Administracion', description: 'Contabilidad, RRHH, marketing.' },
      { id: 'gastronomia', name: 'Gastronomia', description: 'Cocina, pasteleria, bartender.' }
    ],
    keywords: ['instituto tecnico {{city}}', 'carrera corta {{city}}', 'capacitacion {{city}}']
  },
  {
    id: 'escuela_musica',
    nameEs: 'Escuela de Musica',
    nameEn: 'Music School',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'EducationalOrganization',
    headlineHook: 'La musica como camino',
    subheadline: 'Clases de instrumentos, canto y teoria musical en {{city}}.',
    serviceCategories: [
      { id: 'guitarra', name: 'Guitarra y Cuerdas', description: 'Acustica, electrica, bajo.' },
      { id: 'piano', name: 'Piano', description: 'Clasico, moderno, ninos.' },
      { id: 'canto', name: 'Canto', description: 'Tecnica vocal, interpretacion.' }
    ],
    keywords: ['clases musica {{city}}', 'escuela musica {{city}}']
  },
  {
    id: 'centro_capacitacion',
    nameEs: 'Centro de Capacitacion',
    nameEn: 'Training Center',
    verticalId: 'education-training',
    extendsType: 'educacion',
    schemaType: 'EducationalOrganization',
    headlineHook: 'Tu proxima habilidad, aqui',
    subheadline: 'Talleres y cursos cortos para profesionales en {{city}}.',
    serviceCategories: [
      { id: 'digital', name: 'Herramientas Digitales', description: 'Excel, Google Workspace, IA.' },
      { id: 'soft', name: 'Habilidades Blandas', description: 'Liderazgo, comunicacion, ventas.' },
      { id: 'especializacion', name: 'Especializaciones', description: 'Diplomados y cursos intensivos.' }
    ],
    keywords: ['capacitacion {{city}}', 'curso corto {{city}}', 'taller profesional {{city}}']
  },

  // ========== b2b-professional P1 (6) ==========
  {
    id: 'contador',
    nameEs: 'Estudio Contable',
    nameEn: 'Accounting Firm',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'AccountingService',
    headlineHook: 'Tus numeros en buenas manos',
    subheadline: 'Contabilidad, impuestos y asesoramiento para empresas y profesionales en {{city}}.',
    serviceCategories: [
      { id: 'contabilidad', name: 'Contabilidad Mensual', description: 'Libros al dia, balances anuales.' },
      { id: 'impuestos', name: 'Impuestos', description: 'IVA, IRACIS, IRE. Presentacion y planificacion.' },
      { id: 'sueldos', name: 'Sueldos y IPS', description: 'Liquidacion y presentaciones.' },
      { id: 'asesoria', name: 'Asesoria General', description: 'Constitucion de empresas y consultas puntuales.' }
    ],
    keywords: ['contador {{city}}', 'contabilidad {{city}}', 'estudio contable {{city}}']
  },
  {
    id: 'notaria_escribania',
    nameEs: 'Escribania',
    nameEn: 'Notary',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'Notary',
    headlineHook: 'Escrituras y poderes, rapido y seguro',
    subheadline: 'Servicios notariales para personas y empresas en {{city}}.',
    serviceCategories: [
      { id: 'escrituras', name: 'Escrituras', description: 'Compraventa, donacion, permuta.' },
      { id: 'poderes', name: 'Poderes', description: 'General, especial, judicial.' },
      { id: 'empresas', name: 'Constitucion de Empresas', description: 'SA, SRL, sociedades de hecho.' }
    ],
    keywords: ['escribania {{city}}', 'notaria {{city}}', 'escritura publica {{city}}']
  },
  {
    id: 'consultora_rrhh',
    nameEs: 'Consultora de RRHH',
    nameEn: 'HR Consulting',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'ProfessionalService',
    headlineHook: 'El mejor equipo para tu empresa',
    subheadline: 'Seleccion de personal, capacitacion y desarrollo organizacional en {{city}}.',
    serviceCategories: [
      { id: 'seleccion', name: 'Seleccion de Personal', description: 'Busqueda y evaluacion.' },
      { id: 'capacitacion', name: 'Capacitacion', description: 'Planes in company.' },
      { id: 'clima', name: 'Clima Organizacional', description: 'Encuestas y planes de accion.' }
    ],
    keywords: ['rrhh {{city}}', 'consultora rrhh {{city}}', 'reclutamiento {{city}}']
  },
  {
    id: 'traduccion',
    nameEs: 'Traduccion Jurada',
    nameEn: 'Certified Translation',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'ProfessionalService',
    headlineHook: 'Documentos traducidos con validez legal',
    subheadline: 'Traducciones juradas y especializadas en multiples idiomas en {{city}}.',
    serviceCategories: [
      { id: 'juradas', name: 'Traducciones Juradas', description: 'Documentos oficiales.' },
      { id: 'tecnicas', name: 'Tecnicas y Legales', description: 'Contratos, manuales.' },
      { id: 'interpretacion', name: 'Interpretacion', description: 'Reuniones, eventos.' }
    ],
    keywords: ['traductor jurado {{city}}', 'traduccion documentos {{city}}']
  },
  {
    id: 'despachante',
    nameEs: 'Despachante de Aduanas',
    nameEn: 'Customs Broker',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'ProfessionalService',
    headlineHook: 'Aduana sin dolores de cabeza',
    subheadline: 'Despacho de importacion y exportacion en {{city}} y Ciudad del Este.',
    serviceCategories: [
      { id: 'importacion', name: 'Importacion', description: 'Gestion completa aduanera.' },
      { id: 'exportacion', name: 'Exportacion', description: 'Documentos y tramites.' },
      { id: 'transito', name: 'Transito', description: 'Entre paises de MERCOSUR.' }
    ],
    keywords: ['despachante aduanas {{city}}', 'importacion {{city}}', 'exportacion {{city}}']
  },
  {
    id: 'agronomo',
    nameEs: 'Ingeniero Agronomo',
    nameEn: 'Agronomist',
    verticalId: 'b2b-professional',
    extendsType: 'professional_services_base',
    schemaType: 'ProfessionalService',
    headlineHook: 'Tu campo, tu mejor inversion',
    subheadline: 'Asesoramiento agronomico, planificacion y seguimiento en el campo.',
    serviceCategories: [
      { id: 'cultivos', name: 'Gestion de Cultivos', description: 'Soja, maiz, trigo.' },
      { id: 'ganaderia', name: 'Ganaderia', description: 'Nutricion y manejo.' },
      { id: 'ambiental', name: 'Gestion Ambiental', description: 'Estudios y certificaciones.' }
    ],
    keywords: ['agronomo {{city}}', 'asesoria agricola {{city}}']
  },

  // ========== service-booking P1 (4) ==========
  {
    id: 'crossfit',
    nameEs: 'CrossFit Box',
    nameEn: 'CrossFit Box',
    verticalId: 'service-booking',
    extendsType: 'gimnasio',
    schemaType: 'HealthClub',
    headlineHook: 'Mueve con proposito',
    subheadline: 'Entrenamiento funcional de alta intensidad con coaches certificados en {{city}}.',
    serviceCategories: [
      { id: 'wods', name: 'WODs Diarios', description: 'Clases grupales de 1 hora.' },
      { id: 'foundations', name: 'Foundations', description: 'Para principiantes.' },
      { id: 'open_gym', name: 'Open Gym', description: 'Entrenamiento libre.' }
    ],
    keywords: ['crossfit {{city}}', 'crossfit box {{city}}', 'entrenamiento funcional {{city}}']
  },
  {
    id: 'artes_marciales',
    nameEs: 'Artes Marciales',
    nameEn: 'Martial Arts',
    verticalId: 'service-booking',
    extendsType: 'gimnasio',
    schemaType: 'HealthClub',
    headlineHook: 'Disciplina que transforma',
    subheadline: 'Karate, BJJ, muay thai y otras artes marciales para todas las edades en {{city}}.',
    serviceCategories: [
      { id: 'karate', name: 'Karate', description: 'Niños, adultos, competicion.' },
      { id: 'bjj', name: 'Jiu-Jitsu Brasileño', description: 'Gi y no-gi.' },
      { id: 'muay_thai', name: 'Muay Thai', description: 'Boxeo tailandes.' }
    ],
    keywords: ['artes marciales {{city}}', 'karate {{city}}', 'jiu jitsu {{city}}', 'muay thai {{city}}']
  },
  {
    id: 'natacion',
    nameEs: 'Escuela de Natacion',
    nameEn: 'Swim School',
    verticalId: 'service-booking',
    extendsType: 'gimnasio',
    schemaType: 'HealthClub',
    headlineHook: 'En el agua, en confianza',
    subheadline: 'Clases de natacion para niños y adultos en {{city}}. Piscina climatizada.',
    serviceCategories: [
      { id: 'bebes', name: 'Bebes', description: 'Estimulacion acuatica.' },
      { id: 'niños', name: 'Niños', description: 'Aprendizaje y perfeccionamiento.' },
      { id: 'adultos', name: 'Adultos', description: 'Principiantes y avanzados.' }
    ],
    keywords: ['natacion {{city}}', 'clases natacion {{city}}', 'escuela natacion {{city}}']
  },
  {
    id: 'tenis_paddle',
    nameEs: 'Tenis y Paddle',
    nameEn: 'Tennis & Padel',
    verticalId: 'service-booking',
    extendsType: 'gimnasio',
    schemaType: 'SportsActivityLocation',
    headlineHook: 'Juga, entrena, divertite',
    subheadline: 'Canchas de tenis y paddle con profesores disponibles en {{city}}.',
    serviceCategories: [
      { id: 'alquiler', name: 'Alquiler de Canchas', description: 'Por hora, diurno y nocturno.' },
      { id: 'clases', name: 'Clases', description: 'Individuales y grupales.' },
      { id: 'torneos', name: 'Torneos', description: 'Internos y oficiales.' }
    ],
    keywords: ['paddle {{city}}', 'cancha paddle {{city}}', 'tenis {{city}}']
  }
]

// ========== generation ==========

function generateRegistry(seed: Seed): object {
  const registry: Record<string, unknown> = {
    id: seed.id,
    nameEs: seed.nameEs,
    nameEn: seed.nameEn,
    verticalId: seed.verticalId,
    extends: seed.extendsType,
    tokens: seed.id,
    seo: {
      schemaType: seed.schemaType,
      titleTemplate: `{{businessName}} - ${seed.nameEs} en {{city}}`,
      descriptionTemplate: seed.subheadline,
      keywords: seed.keywords || []
    },
    hero: {
      headlineTemplate: `{{businessName}} - ${seed.headlineHook}`,
      subheadlineTemplate: seed.subheadline
    }
  }
  if (seed.serviceCategories) {
    registry.serviceCategories = seed.serviceCategories.map((c) => c.id)
  }
  if (seed.ctaPrimary) {
    ;(registry.hero as Record<string, unknown>).ctaPrimary = seed.ctaPrimary
  }
  if (seed.ctaSecondary) {
    ;(registry.hero as Record<string, unknown>).ctaSecondary = seed.ctaSecondary
  }
  return registry
}

function generateTokens(seed: Seed): object {
  if (seed.customTokens) {
    return {
      name: seed.customTokens.paletteName,
      theme: 'light',
      palettes: {
        default: { name: seed.customTokens.paletteName, colors: seed.customTokens.colors }
      },
      defaultPalette: 'default',
      typography: {
        heading: seed.customTokens.heading || "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        headingWeight: '600',
        bodyWeight: '400'
      },
      googleFonts: ['Inter:wght@400;500;600;700']
    }
  }
  return {
    $comment: `Inherits ${seed.verticalId} vertical defaults`,
    extends: `vertical:${seed.verticalId}`
  }
}

function generateContent(seed: Seed): object {
  const services = seed.serviceCategories || [
    { id: 'general', name: 'Servicio Principal', description: 'Servicios profesionales a medida.' }
  ]
  return {
    id: seed.id,
    locale: 'es-PY',
    hero: {
      headline: `{{businessName}} - ${seed.headlineHook}`,
      subheadline: seed.subheadline,
      ctaPrimary: seed.ctaPrimary?.text || 'Consultar por WhatsApp',
      ctaSecondary: seed.ctaSecondary?.text || 'Ver Servicios'
    },
    about: {
      title: 'Sobre {{businessName}}',
      content: `En {{businessName}} brindamos ${seed.nameEs.toLowerCase()} en {{city}}. Combinamos experiencia, herramientas modernas y atencion personalizada para cada cliente.`
    },
    services: {
      title: 'Nuestros Servicios',
      categories: services.map((s) => ({ id: s.id, name: s.name, description: s.description }))
    },
    testimonials: [
      { quote: `Excelente servicio y trato profesional. Muy recomendable.`, author: 'Cliente Satisfecho', rating: 5 },
      { quote: `Cumplieron con todo lo prometido y mas. Los volveria a elegir.`, author: 'Cliente Habitual', rating: 5 }
    ],
    faq: [
      { q: '¿Como puedo contactarlos?', a: `Escribinos por WhatsApp o llamanos. Respondemos en el dia.` },
      { q: '¿Atienden en mi zona?', a: `Si, trabajamos en {{city}} y alrededores. Consultanos por otras zonas.` },
      { q: '¿Dan presupuesto sin cargo?', a: `Si, todos nuestros presupuestos son sin compromiso.` }
    ],
    footer: {
      tagline: `{{businessName}} - ${seed.nameEs} profesional en {{city}}`,
      copyright: '© {{year}} {{businessName}}'
    }
  }
}

function writeIfMissing(filePath: string, payload: object): boolean {
  if (fs.existsSync(filePath)) return false
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + '\n', 'utf-8')
  return true
}

let created = 0
let skipped = 0

for (const seed of SEEDS) {
  const registryPath = path.join(REGISTRY, `${seed.id}.type.json`)
  const tokensPath = path.join(TOKENS, `${seed.id}.tokens.json`)
  const contentPath = path.join(CONTENT, `${seed.id}.content.json`)

  const wroteRegistry = writeIfMissing(registryPath, generateRegistry(seed))
  const wroteTokens = writeIfMissing(tokensPath, generateTokens(seed))
  const wroteContent = writeIfMissing(contentPath, generateContent(seed))

  if (wroteRegistry || wroteTokens || wroteContent) {
    created++
    const parts: string[] = []
    if (wroteRegistry) parts.push('registry')
    if (wroteTokens) parts.push('tokens')
    if (wroteContent) parts.push('content')
    console.log(`+ ${seed.id} (${seed.verticalId}) [${parts.join(', ')}]`)
  } else {
    skipped++
  }
}

console.log(`\nDone. ${created} seeded, ${skipped} already existed. Total seeds: ${SEEDS.length}`)
