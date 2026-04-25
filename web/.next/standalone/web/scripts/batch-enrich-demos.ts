#!/usr/bin/env node
/**
 * Batch-enrich skeleton demo sites with full section content.
 *
 * Reads sites/_demo-roster.json, finds skeleton demos (5 sections only),
 * and expands them with services, team, gallery, testimonials, FAQ, hours,
 * and booking sections using realistic content per business type.
 *
 * Usage: npx tsx web/scripts/batch-enrich-demos.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')
const REGISTRY = path.join(ROOT, 'src/registry')

const ROSTER_PATH = path.join(SITES, '_demo-roster.json')
const ENRICHED_LOG = path.join(SITES, '.enriched-demos.json')

type RosterEntry = {
  slug: string
  rubro: string
  nameEs: string
  city: string
  wave: number
  cluster: string
}

interface TypeFile {
  id: string
  nameEs?: string
  nameEn?: string
  verticalId: string
  features?: Record<string, unknown>
}

const enriched: string[] = fs.existsSync(ENRICHED_LOG)
  ? JSON.parse(fs.readFileSync(ENRICHED_LOG, 'utf-8'))
  : []

const roster: { rubros: RosterEntry[] } = JSON.parse(fs.readFileSync(ROSTER_PATH, 'utf-8'))

// ---- Business-type-specific content templates ----

const SERVICE_TEMPLATES: Record<string, { name: string; items: { name: string; description: string; price: string; icon: string; duration?: number; category?: string }[] }> = {
  default: {
    name: 'Servicios',
    items: [
      { name: 'Consulta inicial', description: 'Primera visita con evaluación completa', price: 'Gs. 80.000', icon: 'ClipboardList', duration: 30, category: 'Consultas' },
      { name: 'Servicio básico', description: 'Servicio estándar con resultados garantizados', price: 'Gs. 120.000', icon: 'Star', duration: 45, category: 'Principal' },
      { name: 'Servicio premium', description: 'Experiencia completa con atención personalizada', price: 'Gs. 200.000', icon: 'Sparkles', duration: 60, category: 'Principal' },
      { name: 'Servicio express', description: 'Solución rápida sin perder calidad', price: 'Gs. 60.000', icon: 'Zap', duration: 20, category: 'Express' },
      { name: 'Combo ahorro', description: 'Paquete de 3 servicios con descuento', price: 'Gs. 280.000', icon: 'Package', duration: 90, category: 'Combos' },
      { name: 'A domicilio', description: 'Atención en la comodidad de tu hogar', price: 'Gs. 150.000', icon: 'Home', duration: 60, category: 'Domicilio' },
    ],
  },
  taller_mecanico: {
    name: 'Servicios',
    items: [
      { name: 'Cambio de aceite', description: 'Aceite sintético + filtro incluido', price: 'Gs. 120.000', icon: 'Droplets' },
      { name: 'Diagnóstico computarizado', description: 'Escaneo completo del vehículo', price: 'Gs. 80.000', icon: 'Monitor' },
      { name: 'Frenos', description: 'Cambio de pastillas y discos', price: 'Gs. 250.000', icon: 'CircleOff' },
      { name: 'Suspensión', description: 'Amortiguadores y bieletas', price: 'Gs. 350.000', icon: 'ArrowUpDown' },
      { name: 'Alineación y balanceo', description: 'Alineación 3D + balanceo dinámico', price: 'Gs. 90.000', icon: 'RefreshCw' },
      { name: 'Reparación motor', description: 'Diagnóstico y reparación de motor naftero/diesel', price: 'Gs. 500.000', icon: 'Wrench' },
    ],
  },
  gomeria: {
    name: 'Servicios',
    items: [
      { name: 'Parche de neumático', description: 'Reparación de pinchadura', price: 'Gs. 30.000', icon: 'Crosshair' },
      { name: 'Cambio de neumático', description: 'Venta y montaje de neumáticos nuevos', price: 'Gs. 200.000', icon: 'Circle' },
      { name: 'Balanceo', description: 'Balanceo dinámico de ruedas', price: 'Gs. 25.000', icon: 'RefreshCw' },
      { name: 'Alineación', description: 'Alineación computarizada', price: 'Gs. 50.000', icon: 'Move' },
      { name: 'Rotación', description: 'Rotación cruzada de neumáticos', price: 'Gs. 20.000', icon: 'RotateCw' },
      { name: 'Nitrógeno', description: 'Carga de nitrógeno para las 4 ruedas', price: 'Gs. 15.000', icon: 'Wind' },
    ],
  },
  panaderia: {
    name: 'Productos',
    items: [
      { name: 'Pan artesanal', description: 'Pan de masa madre, integral y de centeno', price: 'Gs. 8.000', icon: 'Bread' },
      { name: 'Chipa', description: 'Chipa tradicional paraguaya horneada', price: 'Gs. 3.000', icon: 'CircleDot' },
      { name: 'Facturas', description: 'Medialunas, vigilantes y cañoncitos', price: 'Gs. 4.000', icon: 'Croissant' },
      { name: 'Pastelitos', description: 'Pastelitos de dulce de leche y membrillo', price: 'Gs. 5.000', icon: 'Cookie' },
      { name: 'Tortas', description: 'Tortas por encargo: choco, vainilla, frutal', price: 'Gs. 80.000', icon: 'Cake' },
      { name: 'Pan para sánguche', description: 'Pan lactal artesanal sin conservantes', price: 'Gs. 10.000', icon: 'Slice' },
    ],
  },
  ferreteria: {
    name: 'Productos',
    items: [
      { name: 'Pinturas', description: 'Látex, esmalte sintético y óleo', price: 'Gs. 45.000', icon: 'PaintBucket' },
      { name: 'Herramientas manuales', description: 'Martillos, destornilladores, llaves', price: 'Gs. 25.000', icon: 'Hammer' },
      { name: 'Electricidad', description: 'Cables, tomas, interruptores y llaves térmicas', price: 'Gs. 5.000', icon: 'Zap' },
      { name: 'Plomería', description: 'Caños, conexiones y grifería', price: 'Gs. 8.000', icon: 'Droplets' },
      { name: 'Ferretería general', description: 'Clavos, tornillos, bulones y anclajes', price: 'Gs. 1.000', icon: 'CircleDot' },
      { name: 'Jardinería', description: 'Mangueras, regadores y accesorios', price: 'Gs. 35.000', icon: 'Flower2' },
    ],
  },
  farmacia: {
    name: 'Productos',
    items: [
      { name: 'Medicamentos genéricos', description: 'Amplia variedad de medicamentos genéricos', price: 'Gs. 15.000', icon: 'Pill' },
      { name: 'Medicamentos de marca', description: 'Medicamentos originales importados', price: 'Gs. 45.000', icon: 'Pill' },
      { name: 'Cosmética y cuidado', description: 'Cremas, protectores solares y dermo', price: 'Gs. 60.000', icon: 'Sparkles' },
      { name: 'Vitaminas y suplementos', description: 'Complejos vitamínicos y suplementos', price: 'Gs. 80.000', icon: 'Apple' },
      { name: 'Primeros auxilios', description: 'Botiquines, vendas, gasas y apósitos', price: 'Gs. 25.000', icon: 'Crosshair' },
      { name: 'Bienestar infantil', description: 'Pañales, leches, chupetes y más', price: 'Gs. 35.000', icon: 'Baby' },
    ],
  },
  inmobiliaria: {
    name: 'Propiedades',
    items: [
      { name: 'Casas en venta', description: 'Casas de 2 a 4 dormitorios en Asunción', price: 'USD 120.000', icon: 'Home' },
      { name: 'Departamentos', description: 'De 1 a 3 dormitorios en zonas céntricas', price: 'USD 75.000', icon: 'Building' },
      { name: 'Terrenos', description: 'Lotes en zonas residenciales en desarrollo', price: 'USD 40.000', icon: 'Map' },
      { name: 'Locales comerciales', description: 'Puntos comerciales en zonas estratégicas', price: 'USD 150.000', icon: 'Store' },
      { name: 'Alquiler temporal', description: 'Alquiler por mes para extranjeros', price: 'USD 500', icon: 'Calendar' },
      { name: 'Propiedades rurales', description: 'Quintas y estancias en el interior', price: 'USD 200.000', icon: 'TreePine' },
    ],
  },
  veterinaria: {
    name: 'Servicios',
    items: [
      { name: 'Consulta general', description: 'Revisión completa de tu mascota', price: 'Gs. 70.000', icon: 'Stethoscope', duration: 30, category: 'Consultas' },
      { name: 'Vacunación', description: 'Vacunas anuales y refuerzos', price: 'Gs. 50.000', icon: 'Syringe', duration: 15, category: 'Vacunación' },
      { name: 'Castración', description: 'Cirugía de castración con anestesia', price: 'Gs. 350.000', icon: 'Crosshair', duration: 60, category: 'Cirugía' },
      { name: 'Análisis clínicos', description: 'Análisis de sangre, orina y heces', price: 'Gs. 80.000', icon: 'Flask', duration: 15, category: 'Diagnóstico' },
      { name: 'Peluquería canina', description: 'Baño, corte y cepillado', price: 'Gs. 90.000', icon: 'Scissors', duration: 45, category: 'Estética' },
      { name: 'Emergencia 24h', description: 'Atención de urgencia veterinaria', price: 'Gs. 150.000', icon: 'Ambulance', duration: 60, category: 'Emergencia' },
    ],
  },
  contador: {
    name: 'Servicios',
    items: [
      { name: 'Liquidación de impuestos', description: 'IRP, IVA, IRE y más', price: 'Gs. 250.000', icon: 'FileText' },
      { name: 'Contabilidad mensual', description: 'Registro contable mensual completo', price: 'Gs. 350.000', icon: 'BookOpen' },
      { name: 'Constitución de empresas', description: 'SRL, SA, EAS y unipersonal', price: 'Gs. 1.200.000', icon: 'Building' },
      { name: 'Facturación electrónica', description: 'Instalación y gestión de e-Kuatia', price: 'Gs. 150.000', icon: 'Printer' },
      { name: 'Planilla laboral', description: 'Cálculo de salarios, cargas e IPS', price: 'Gs. 180.000', icon: 'Users' },
      { name: 'Auditoría', description: 'Auditoría contable y financiera', price: 'Gs. 500.000', icon: 'Search' },
    ],
  },
  carniceria: {
    name: 'Productos',
    items: [
      { name: 'Carne vacuna', description: 'Corte al gusto: lomo, cuadril, asado', price: 'Gs. 25.000/kg', icon: 'Beef' },
      { name: 'Carne porcina', description: 'Cerdo fresco: costilla, lomo, pierna', price: 'Gs. 20.000/kg', icon: 'Beef' },
      { name: 'Pollo fresco', description: 'Pollo entero o en presas', price: 'Gs. 15.000/kg', icon: 'Drumstick' },
      { name: 'Embutidos', description: 'Salchichas, chorizos, morcilla', price: 'Gs. 30.000', icon: 'Beef' },
      { name: 'Carne molida', description: 'Carne molida especial para hamburguesas', price: 'Gs. 28.000/kg', icon: 'CircleDot' },
      { name: 'Combos parrilla', description: 'Mix de carnes para 6 personas', price: 'Gs. 180.000', icon: 'Flame' },
    ],
  },
  electricista: {
    name: 'Servicios',
    items: [
      { name: 'Instalación eléctrica', description: 'Instalación completa para casa o local', price: 'Gs. 400.000', icon: 'Zap' },
      { name: 'Reparaciones', description: 'Cortocircuitos, llaves térmicas y tomas', price: 'Gs. 80.000', icon: 'Tool' },
      { name: 'Tablero eléctrico', description: 'Instalación y mantenimiento de tableros', price: 'Gs. 250.000', icon: 'Monitor' },
      { name: 'Aire acondicionado', description: 'Instalación y mantenimiento de AA', price: 'Gs. 200.000', icon: 'Snowflake' },
      { name: 'Cámaras de seguridad', description: 'Instalación de cámaras y alarmas', price: 'Gs. 350.000', icon: 'Camera' },
      { name: 'Emergencia 24h', description: 'Servicio de urgencia eléctrica', price: 'Gs. 120.000', icon: 'Ambulance' },
    ],
  },
  plomero: {
    name: 'Servicios',
    items: [
      { name: 'Destapaciones', description: 'Destapación de caños y desagües', price: 'Gs. 100.000', icon: 'Droplets' },
      { name: 'Instalación de agua', description: 'Instalación de cañerías de agua fría/caliente', price: 'Gs. 350.000', icon: 'Pipe' },
      { name: 'Reparación de pérdidas', description: 'Detección y reparación de fugas', price: 'Gs. 80.000', icon: 'Search' },
      { name: 'Instalación de gas', description: 'Conexión de gas para cocina y calefón', price: 'Gs. 300.000', icon: 'Flame' },
      { name: 'Termofón y calefón', description: 'Instalación y mantenimiento', price: 'Gs. 150.000', icon: 'Thermometer' },
      { name: 'Emergencia 24h', description: 'Servicio urgente de plomería', price: 'Gs. 120.000', icon: 'Ambulance' },
    ],
  },
}

function getServicesFor(rubro: string) {
  return SERVICE_TEMPLATES[rubro] || SERVICE_TEMPLATES.default
}

function getTeamFor(rubro: string, city: string) {
  const name = rubro.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: 'Nuestro equipo',
    subtitle: `Profesionales dedicados en ${city}`,
    items: [
      { name: 'Carlos Mendoza', role: `Director de ${name}`, description: `Más de 10 años de experiencia en ${city}` },
      { name: 'María López', role: 'Profesional Senior', description: 'Especialista en atención al cliente' },
      { name: 'Juan Pérez', role: 'Asistente Técnico', description: 'Comprometido con la calidad' },
    ],
  }
}

function enrichSite(entry: RosterEntry) {
  const { slug, rubro, nameEs, city, cluster } = entry
  const dir = path.join(SITES, slug)
  const pagesDir = path.join(dir, 'pages')
  const contentPath = path.join(dir, 'content', 'es.json')
  const pagesPath = path.join(pagesDir, 'home.json')

  if (!fs.existsSync(contentPath) || !fs.existsSync(pagesPath)) {
    return { ok: false, reason: 'missing content or pages' }
  }

  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
  const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf-8'))

  // Check if already enriched (>5 sections)
  if (pages.sections.length > 7) {
    return { ok: false, reason: 'already enriched' }
  }

  const svc = getServicesFor(rubro)
  const team = getTeamFor(rubro, city)

  // Enrich page sections
  const extraSections = [
    { id: 'promo-banner', variant: 'simple', content: 'home.promoBanner' },
    { id: 'services', variant: 'cards', content: 'home.services' },
    { id: 'trust-badges', variant: 'strip', content: 'home.trustBadges' },
  ]

  // Add type-appropriate sections
  if (['peluqueria', 'salon_belleza', 'spa', 'barberia', 'unas', 'estetica', 'veterinaria', 'clinica_integral', 'psicologia', 'odontologia', 'gimnasio'].includes(rubro)) {
    extraSections.push({ id: 'gallery', variant: 'grid', content: 'home.gallery' })
    extraSections.push({ id: 'team', variant: 'grid', content: 'home.team' })
    extraSections.push({ id: 'booking', variant: 'wizard', content: 'home.booking' })
  } else {
    extraSections.push({ id: 'testimonials', variant: 'carousel', content: 'home.testimonials' })
  }

  extraSections.push(
    { id: 'faq', variant: 'accordion', content: 'home.faq' },
    { id: 'open-hours-status', variant: 'standard', content: 'home.hours' },
  )

  // Insert after hero
  const heroIdx = pages.sections.findIndex((s: { id: string }) => s.id === 'hero')
  pages.sections.splice(heroIdx + 1, 0, ...extraSections)

  // Enrich content
  content.home.services = content.home.services || {
    eyebrow: 'Servicios',
    title: svc.name,
    items: svc.items.map((item, i) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      icon: item.icon,
    })),
  }

  content.home.trustBadges = content.home.trustBadges || {
    items: ['Atención personalizada', `${city} y alrededores`, 'Resultados garantizados', 'Precios accesibles'],
  }

  content.home.team = content.home.team || team

  content.home.testimonials = content.home.testimonials || {
    title: 'Lo que dicen nuestros clientes',
    columns: 2,
    items: [
      { name: 'Cliente Satisfecho', text: 'Excelente servicio, súper recomendado.', rating: 5 },
      { name: 'Cliente Frecuente', text: 'Siempre cumplen con lo prometido. Muy profesionales.', rating: 5 },
      { name: 'Nuevo Cliente', text: 'Me atendieron muy bien, volveré sin dudas.', rating: 4 },
    ],
  }

  if (['peluqueria', 'salon_belleza', 'spa', 'barberia', 'unas', 'estetica', 'veterinaria', 'clinica_integral', 'psicologia', 'odontologia', 'gimnasio'].includes(rubro)) {
    content.home.booking = content.home.booking || {
      title: 'Reservá tu turno',
      subtitle: 'Elegí el servicio y el horario que más te convenga',
      services: svc.items.filter(s => s.duration).map(s => ({
        name: s.name,
        duration: s.duration || 30,
        category: s.category || 'General',
      })),
    }
    content.home.gallery = content.home.gallery || {
      title: 'Nuestros trabajos',
      subtitle: 'Mirá algunos de nuestros trabajos',
      columns: 3,
      images: [
        { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600', alt: 'Trabajo 1', caption: 'Calidad profesional' },
        { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', alt: 'Trabajo 2', caption: 'Atención personalizada' },
        { src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600', alt: 'Trabajo 3', caption: 'Resultados garantizados' },
        { src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', alt: 'Trabajo 4', caption: 'Profesionales expertos' },
        { src: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=600', alt: 'Trabajo 5', caption: 'Instalaciones modernas' },
        { src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600', alt: 'Trabajo 6', caption: 'Tu mejor opción' },
      ],
    }
  }

  content.home.faq = content.home.faq || {
    title: 'Preguntas frecuentes',
    items: [
      { question: '¿Aceptan tarjetas?', answer: 'Sí, aceptamos tarjetas de crédito, débito, efectivo y transferencia.' },
      { question: '¿Cuál es el horario?', answer: 'Abrimos de lunes a sábado en horario comercial.' },
      { question: '¿Hacen envíos?', answer: 'Sí, hacemos envíos a toda la ciudad.' },
      { question: '¿Cómo puedo contactarlos?', answer: 'Por WhatsApp, teléfono o directamente en nuestro local.' },
    ],
  }

  content.home.hours = content.home.hours || {
    title: 'Horarios',
    schedules: {
      'Lunes a Viernes': '09:00 - 19:00',
      'Sábado': '09:00 - 17:00',
    },
  }

  content.home.promoBanner = content.home.promoBanner || {
    title: '¡Visitános!',
    subtitle: `Conocé nuestros servicios en ${city}`,
    ctaText: 'Contactar ahora',
    variant: 'standard',
    dismissible: true,
  }

  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2) + '\n')
  fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2) + '\n')

  return { ok: true }
}

// ----- MAIN -----
let enriched_count = 0
let skipped_count = 0
let failed_count = 0
const failures: string[] = []

for (const entry of roster.rubros) {
  const result = enrichSite(entry)
  if (result.ok) {
    console.log(`  ✓ ${entry.slug.padEnd(34)} enriched`)
    enriched_count++
  } else if (result.reason === 'already enriched') {
    skipped_count++
  } else {
    console.log(`  ✗ ${entry.slug.padEnd(34)} ${result.reason}`)
    failed_count++
    failures.push(entry.slug)
  }
}

console.log(`\nDone. enriched=${enriched_count} skipped=${skipped_count} failed=${failed_count}`)
if (failures.length > 0) {
  console.log(`Failures: ${failures.join(', ')}`)
}
