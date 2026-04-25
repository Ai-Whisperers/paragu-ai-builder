#!/usr/bin/env node
/**
 * Enable commerce on all 201 preview sites.
 *
 * For each preview:
 *   1. Add commerce features to site.json
 *   2. Add product-catalog section to pages/home.json
 *   3. Generate product content in content/es.json
 *   4. Upsert products to Supabase commerce_products table
 *
 * Usage: npx tsx scripts/enable-commerce-for-previews.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { randomUUID } from 'crypto'

const ROOT = path.resolve(__dirname, '..')
const SITES_DIR = path.join(ROOT, 'sites')

// --- Product templates per business type ---
interface ProductTemplate {
  name: string
  description: string
  priceCents: number
  category: string
  tags: string[]
  imageCategory: string
}

const TYPE_PRODUCTS: Record<string, ProductTemplate[]> = {
  peluqueria: [
    { name: "Corte de Dama", description: "Corte profesional con lavado y styling", priceCents: 80000, category: "Cortes", tags: ["corte", "dama", "styling"], imageCategory: "hair-salon" },
    { name: "Corte de Caballero", description: "Corte moderno o clásico con acabado profesional", priceCents: 50000, category: "Cortes", tags: ["corte", "caballero", "barberia"], imageCategory: "hair-salon" },
    { name: "Coloración Completa", description: "Color base completo con productos profesionales", priceCents: 200000, category: "Coloración", tags: ["color", "tinte", "base"], imageCategory: "hair-salon" },
    { name: "Mechas/Highlights", description: "Mechas naturales con técnica de papel aluminio", priceCents: 250000, category: "Coloración", tags: ["mechas", "highlights", "reflejos"], imageCategory: "hair-salon" },
    { name: "Balayage", description: "Técnica francesa de mano alzada para look natural", priceCents: 350000, category: "Coloración", tags: ["balayage", "mano alzada", "natural"], imageCategory: "hair-salon" },
    { name: "Lavado y Peinado", description: "Lavado con productos profesionales más peinado", priceCents: 40000, category: "Peinados", tags: ["lavado", "peinado", "basico"], imageCategory: "hair-salon" },
    { name: "Peinado para Eventos", description: "Peinado elaborado para bodas, fiestas y graduaciones", priceCents: 150000, category: "Peinados", tags: ["eventos", "novia", "fiesta"], imageCategory: "hair-salon" },
    { name: "Keratina Intensiva", description: "Tratamiento alisador con keratina que repara y alisa", priceCents: 350000, category: "Tratamientos", tags: ["keratina", "alisado", "reparacion"], imageCategory: "hair-salon" },
    { name: "Hidratación Profunda", description: "Tratamiento hidratante para cabello seco o maltratado", priceCents: 80000, category: "Tratamientos", tags: ["hidratacion", "reparacion", "nutricion"], imageCategory: "hair-salon" },
    { name: "Botox Capilar", description: "Tratamiento reconstructor que elimina el frizz", priceCents: 250000, category: "Tratamientos", tags: ["botox", "frizz", "reconstruccion"], imageCategory: "hair-salon" },
    { name: "Alisado Permanente", description: "Alisado con ácido tioglicólico, resultado liso por meses", priceCents: 500000, category: "Tratamientos", tags: ["alisado", "permanente", "liso"], imageCategory: "hair-salon" },
    { name: "Set de Cuidado Capilar", description: "Kit shampoo + acondicionador profesional 300ml", priceCents: 120000, category: "Productos", tags: ["shampoo", "acondicionador", "cuidado"], imageCategory: "products" },
  ],
  barberia: [
    { name: "Corte Clásico", description: "Corte tradicional con tijera y máquina", priceCents: 45000, category: "Cortes", tags: ["clasico", "tijera", "tradicional"], imageCategory: "barber" },
    { name: "Fade Moderno", description: "Degradado moderno con línea definida", priceCents: 55000, category: "Cortes", tags: ["fade", "moderno", "degradado"], imageCategory: "barber" },
    { name: "Afeitado Clásico", description: "Afeitado con toalla caliente y navaja", priceCents: 50000, category: "Afeitado", tags: ["afeitado", "navaja", "clasico"], imageCategory: "barber" },
    { name: "Arreglo de Barba", description: "Perfilado de barba con máquina y tijera", priceCents: 30000, category: "Barba", tags: ["barba", "perfilado", "recorte"], imageCategory: "barber" },
    { name: "Corte + Barba", description: "Combo corte y arreglo de barba completo", priceCents: 70000, category: "Paquetes", tags: ["combo", "corte", "barba"], imageCategory: "barber" },
    { name: "Corte Infantil", description: "Corte para niños hasta 12 años", priceCents: 35000, category: "Cortes", tags: ["infantil", "niños", "corte"], imageCategory: "barber" },
    { name: "Corte Degradado + Barba", description: "Fade degradado completo más perfilado de barba", priceCents: 80000, category: "Paquetes", tags: ["fade", "barba", "degradado"], imageCategory: "barber" },
    { name: "Cera para Cabello", description: "Cera premium con fijación fuerte 100g", priceCents: 45000, category: "Productos", tags: ["cera", "fijacion", "cabello"], imageCategory: "products" },
    { name: "Aceite para Barba", description: "Aceite hidratante con aroma amaderado 30ml", priceCents: 55000, category: "Productos", tags: ["aceite", "barba", "hidratante"], imageCategory: "products" },
    { name: "Corte + Afeitado + Barba", description: "Paquete completo de grooming", priceCents: 100000, category: "Paquetes", tags: ["completo", "premium", "grooming"], imageCategory: "barber" },
  ],
  gimnasio: [
    { name: "Membresía Mensual", description: "Acceso ilimitado al gimnasio por 30 días", priceCents: 200000, category: "Membresías", tags: ["mensual", "ilimitado"], imageCategory: "gym" },
    { name: "Membresía Trimestral", description: "Acceso ilimitado por 3 meses — ahorra 15%", priceCents: 510000, category: "Membresías", tags: ["trimestral", "ilimitado", "ahorro"], imageCategory: "gym" },
    { name: "Membresía Anual", description: "Acceso ilimitado por 12 meses — ahorra 30%", priceCents: 1680000, category: "Membresías", tags: ["anual", "ilimitado", "ahorro"], imageCategory: "gym" },
    { name: "Clase Grupal de Yoga", description: "Clase de yoga para todos los niveles — 1 hora", priceCents: 30000, category: "Clases Grupales", tags: ["yoga", "grupo", "flexibilidad"], imageCategory: "gym" },
    { name: "Clase Grupal de Spinning", description: "Spinning intensivo con música motivacional", priceCents: 30000, category: "Clases Grupales", tags: ["spinning", "cardio", "intensivo"], imageCategory: "gym" },
    { name: "CrossFit", description: "Entrenamiento funcional de alta intensidad", priceCents: 35000, category: "Clases Grupales", tags: ["crossfit", "funcional", "hiit"], imageCategory: "gym" },
    { name: "Entrenamiento Personal", description: "1 sesión con entrenador personal certificado", priceCents: 80000, category: "Entrenamiento Personal", tags: ["personal", "uno a uno", "certificado"], imageCategory: "gym" },
    { name: "Plan 5 Sesiones Personal", description: "5 sesiones de entrenamiento personal", priceCents: 350000, category: "Entrenamiento Personal", tags: ["personal", "paquete", "sesiones"], imageCategory: "gym" },
    { name: "Plan 10 Sesiones Personal", description: "10 sesiones de entrenamiento personal — ahorra 20%", priceCents: 640000, category: "Entrenamiento Personal", tags: ["personal", "paquete", "ahorro"], imageCategory: "gym" },
    { name: "Proteína Whey 1kg", description: "Proteína de suero de leche sabor vainilla 1kg", priceCents: 180000, category: "Suplementos", tags: ["proteina", "whey", "suplemento"], imageCategory: "products" },
    { name: "Batidora Shaker", description: "Shaker profesional 600ml con mezclador", priceCents: 45000, category: "Accesorios", tags: ["shaker", "batidora", "accesorio"], imageCategory: "products" },
    { name: "Toalla Deportiva", description: "Toalla microfibra 40x80cm con logo", priceCents: 35000, category: "Accesorios", tags: ["toalla", "microfibra", "deporte"], imageCategory: "products" },
  ],
  spa: [
    { name: "Masaje Relaxante 60min", description: "Masaje descontracturante de cuerpo completo", priceCents: 150000, category: "Masajes", tags: ["masaje", "relax", "60min"], imageCategory: "spa" },
    { name: "Masaje con Piedras Calientes 75min", description: "Masaje terapéutico con piedras volcánicas", priceCents: 220000, category: "Masajes", tags: ["piedras", "termico", "muscular"], imageCategory: "spa" },
    { name: "Masaje Deportivo 45min", description: "Masaje enfocado en recuperación muscular", priceCents: 130000, category: "Masajes", tags: ["deportivo", "muscular", "recuperacion"], imageCategory: "spa" },
    { name: "Facial Hidratante 45min", description: "Limpieza facial profunda con mascarilla hidratante", priceCents: 120000, category: "Faciales", tags: ["facial", "hidratacion", "limpieza"], imageCategory: "spa" },
    { name: "Facial Anti-Edad 60min", description: "Tratamiento rejuvenecedor con radiofrecuencia", priceCents: 250000, category: "Faciales", tags: ["anti-edad", "rejuvenecimiento", "radiofrecuencia"], imageCategory: "spa" },
    { name: "Exfoliación Corporal 45min", description: "Exfoliación de cuerpo completo con sales marinas", priceCents: 140000, category: "Corporales", tags: ["exfoliacion", "corporal", "sales"], imageCategory: "spa" },
    { name: "Envoltura Corporal 60min", description: "Envoltura desintoxicante con algas marinas", priceCents: 180000, category: "Corporales", tags: ["envoltura", "desintoxicante", "algas"], imageCategory: "spa" },
    { name: "Paquete Bienestar", description: "Masaje relax + facial hidratante + exfoliación", priceCents: 350000, category: "Paquetes", tags: ["paquete", "bienestar", "combo"], imageCategory: "spa" },
    { name: "Paquete Premium", description: "Masaje piedras + facial anti-edad + envoltura", priceCents: 520000, category: "Paquetes", tags: ["premium", "completo", "luxury"], imageCategory: "spa" },
    { name: "Vela Aromática", description: "Vela de soya con aceites esenciales lavanda 200g", priceCents: 60000, category: "Productos", tags: ["vela", "aroma", "lavanda"], imageCategory: "products" },
    { name: "Aceite de Masaje", description: "Aceite de masaje con aceites esenciales 250ml", priceCents: 80000, category: "Productos", tags: ["aceite", "masaje", "esenciales"], imageCategory: "products" },
    { name: "Gift Card 200.000", description: "Tarjeta de regalo canjeable por cualquier tratamiento", priceCents: 200000, category: "Gift Cards", tags: ["gift", "regalo", "canjeable"], imageCategory: "products" },
  ],
  depilacion: [
    { name: "Depilación Láser Axilas", description: "Sesión de depilación láser definitiva en axilas", priceCents: 80000, category: "Láser", tags: ["laser", "axilas", "definitiva"], imageCategory: "beauty" },
    { name: "Depilación Láser Piernas Completas", description: "Sesión completa de piernas con láser", priceCents: 250000, category: "Láser", tags: ["laser", "piernas", "completa"], imageCategory: "beauty" },
    { name: "Depilación Láser Línea Bikini", description: "Sesión bikini con láser definitivo", priceCents: 100000, category: "Láser", tags: ["laser", "bikini", "definitiva"], imageCategory: "beauty" },
    { name: "Depilación Láser Rostro", description: "Sesión de depilación láser facial", priceCents: 60000, category: "Láser", tags: ["laser", "rostro", "facial"], imageCategory: "beauty" },
    { name: "Paquete 6 Sesiones Axilas", description: "6 sesiones láser en axilas — resultados permanentes", priceCents: 400000, category: "Paquetes", tags: ["paquete", "laser", "axilas", "ahorro"], imageCategory: "beauty" },
    { name: "Paquete 8 Sesiones Piernas", description: "8 sesiones de láser en piernas completas", priceCents: 1500000, category: "Paquetes", tags: ["paquete", "laser", "piernas", "ahorro"], imageCategory: "beauty" },
    { name: "Cera Tradicional Piernas", description: "Depilación con cera tradicional", priceCents: 50000, category: "Cera", tags: ["cera", "piernas", "tradicional"], imageCategory: "beauty" },
    { name: "Cera Brasileña", description: "Depilación completa con cera", priceCents: 70000, category: "Cera", tags: ["cera", "brasilena", "completa"], imageCategory: "beauty" },
    { name: "Crema Post-Depilación", description: "Crema calmante post-depilación con aloe vera 200ml", priceCents: 55000, category: "Productos", tags: ["crema", "calmante", "post-depilacion"], imageCategory: "products" },
    { name: "Gift Card Depilación", description: "Tarjeta de regalo canjeable por sesiones de depilación", priceCents: 150000, category: "Gift Cards", tags: ["gift", "regalo", "depilacion"], imageCategory: "products" },
  ],
  maquillaje: [
    { name: "Maquillaje Social", description: "Maquillaje para eventos sociales, fiestas y reuniones", priceCents: 120000, category: "Maquillaje", tags: ["social", "evento", "fiesta"], imageCategory: "makeup" },
    { name: "Maquillaje de Novia", description: "Maquillaje profesional para novias, incluye prueba", priceCents: 350000, category: "Novias", tags: ["novia", "bodas", "prueba"], imageCategory: "makeup" },
    { name: "Maquillaje Editorial", description: "Maquillaje artístico para sesiones de fotos", priceCents: 200000, category: "Maquillaje", tags: ["editorial", "fotos", "artistico"], imageCategory: "makeup" },
    { name: "Maquillaje de 15 Años", description: "Maquillaje especial para fiestas de 15", priceCents: 250000, category: "Eventos", tags: ["quince", "fiesta", "especial"], imageCategory: "makeup" },
    { name: "Clase de Maquillaje", description: "Clase personalizada de 2 horas, incluye productos", priceCents: 180000, category: "Lecciones", tags: ["clase", "aprender", "personalizado"], imageCategory: "makeup" },
    { name: "Prueba de Maquillaje", description: "Sesión de prueba antes del evento, incluye look completo", priceCents: 80000, category: "Novias", tags: ["prueba", "novia", "sesion"], imageCategory: "makeup" },
    { name: "Maquillaje + Peinado Novia", description: "Combo maquillaje novia más peinado profesional", priceCents: 600000, category: "Paquetes", tags: ["combo", "novia", "peinado"], imageCategory: "makeup" },
    { name: "Maquillaje + Peinado Evento", description: "Completo para fiestas y eventos especiales", priceCents: 250000, category: "Paquetes", tags: ["combo", "evento", "maquillaje"], imageCategory: "makeup" },
    { name: "Labial Mate", description: "Labial mate profesional de larga duración", priceCents: 45000, category: "Productos", tags: ["labial", "mate", "larga duracion"], imageCategory: "products" },
    { name: "Paleta de Sombras", description: "Paleta profesional 24 colores neutros y vibrantes", priceCents: 180000, category: "Productos", tags: ["paleta", "sombras", "profesional"], imageCategory: "products" },
  ],
}

// --- Script ---
async function main() {
  console.log('=== Commerce Activation for Previews ===\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase creds not found. Will update files only (no DB seeding).')
  }

  const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

  // Get all preview directories
  const entries = fs.readdirSync(SITES_DIR, { withFileTypes: true })
  const previewSlugs = entries
    .filter(e => e.isDirectory() && e.name.startsWith('preview-'))
    .map(e => e.name)
    .sort()

  console.log(`Found ${previewSlugs.length} preview sites\n`)

  let updated = 0
  let skipped = 0
  let productsCreated = 0

  for (const slug of previewSlugs) {
    const siteJsonPath = path.join(SITES_DIR, slug, 'site.json')
    const contentEsPath = path.join(SITES_DIR, slug, 'content', 'es.json')
    const pagesHomePath = path.join(SITES_DIR, slug, 'pages', 'home.json')

    if (!fs.existsSync(siteJsonPath) || !fs.existsSync(contentEsPath)) {
      skipped++
      continue
    }

    // Read site.json
    const site = JSON.parse(fs.readFileSync(siteJsonPath, 'utf-8'))
    const bizType = site.businessType || ''
    const phone = site.contact?.whatsapp || site.contact?.phone || ''

    // --- STEP 1: Add commerce features to site.json ---
    const newFeatures: Record<string, boolean> = {
      whatsappFloat: true,
      testimonials: true,
      productCatalog: true,
      commerce: true,
      featuredProducts: true,
      shop: true,
      giftCards: true,
    }

    // Add delivery features for certain types
    if (['peluqueria', 'spa', 'barberia'].includes(bizType)) {
      newFeatures.booking = true
    }
    if (['gimnasio', 'spa'].includes(bizType)) {
      newFeatures.membershipPlans = true
    }

    // Merge features (keep existing)
    site.features = { ...site.features, ...newFeatures }

    // Add commerce config to site.json
    site.commerce = site.commerce || {}
    site.commerce.enabled = true
    site.commerce.currency = 'PYG'
    site.commerce.provider = 'pagopar'
    site.commerce.whatsappEnabled = true

    // Add delivery settings
    site.settings = site.settings || {}
    site.settings.currency = 'PYG'
    site.settings.locale = 'es-PY'
    site.settings.timezone = 'America/Asuncion'

    fs.writeFileSync(siteJsonPath, JSON.stringify(site, null, 2) + '\n')

    // --- STEP 2: Add product-catalog section to pages/home.json ---
    if (fs.existsSync(pagesHomePath)) {
      const home = JSON.parse(fs.readFileSync(pagesHomePath, 'utf-8'))
      const sections = home.sections || []

      // Check if product-catalog already exists
      const hasProducts = sections.some(s => s.id === 'product-catalog' || s.id === 'featured-products')

      if (!hasProducts) {
        // Insert after services section (or after hero if no services)
        const servicesIdx = sections.findIndex(s => s.id === 'services')
        const insertAt = servicesIdx >= 0 ? servicesIdx + 1 : 2 // after hero+promo if services not found

        sections.splice(insertAt, 0,
          { id: 'product-catalog', variant: 'cards', content: 'home.products' }
        )
        home.sections = sections
        fs.writeFileSync(pagesHomePath, JSON.stringify(home, null, 2) + '\n')
      }
    }

    // --- STEP 3: Generate products in content/es.json ---
    const content = JSON.parse(fs.readFileSync(contentEsPath, 'utf-8'))
    const templates = TYPE_PRODUCTS[bizType] || TYPE_PRODUCTS['peluqueria']
    const businessName = content.placeholders?.businessName || slug.replace('preview-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const city = content.placeholders?.city || 'Asunción'

    const products = templates.map(t => ({
      ...t,
      slug: t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      imageUrl: `https://images.unsplash.com/photo-placeholder?${t.imageCategory}`,
      available: true,
    }))

    content.home = content.home || {}
    content.home.products = {
      title: 'Nuestros Productos y Servicios',
      subtitle: `${businessName} — Precios en Paraguay`,
      items: products,
    }

    // Add delivery info content
    content.home.delivery = {
      title: 'Zonas de Entrega',
      subtitle: `Consultá por delivery en ${city} y alrededores`,
      zones: ['Asunción', 'Fernando de la Mora', 'San Lorenzo', 'Lambaré', 'Luque'],
      minimumOrder: 50000,
      deliveryFee: 15000,
      freeDeliveryOver: 200000,
    }

    // Add WhatsApp ordering info
    content.home.whatsappOrder = {
      title: 'Pedí por WhatsApp',
      subtitle: 'Elegí tus productos y te respondemos al instante',
      instructions: [
        'Hacé clic en "Consultar por WhatsApp" en cada producto',
        'Te atenderemos personalmente',
        'Confirmamos stock y precio',
        'Acordamos forma de pago y entrega',
      ],
    }

    // Add gift cards
    content.home.giftCards = {
      title: 'Tarjetas de Regalo',
      subtitle: 'Regalá una experiencia única',
      items: [
        { id: 'gc-basic', amount: 100000, description: 'Tarjeta de regalo por 100.000 Gs' },
        { id: 'gc-premium', amount: 250000, description: 'Tarjeta de regalo por 250.000 Gs' },
        { id: 'gc-vip', amount: 500000, description: 'Tarjeta de regalo por 500.000 Gs' },
      ],
    }

    fs.writeFileSync(contentEsPath, JSON.stringify(content, null, 2) + '\n')
    productsCreated += products.length
    updated++
  }

  console.log(`\n=== Results ===`)
  console.log(`Sites updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Products generated: ${productsCreated}`)
  console.log(`\nDONE — files updated for all previews.`)
  console.log(`Run the Supabase seeding script separately or add DB access.`)
}

main().catch(console.error)
