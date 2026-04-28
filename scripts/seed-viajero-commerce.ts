#!/usr/bin/env node
/**
 * Seed El Viajero Comercio into Supabase: business + 96 products.
 * Run: npx tsx scripts/seed-viajero-commerce.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs/promises'
import * as path from 'path'

const ROOT = path.resolve(__dirname, '..')

async function loadEnv() {
  const envPath = path.join(ROOT, 'web', '.env.local')
  const content = await fs.readFile(envPath, 'utf-8')
  const vars: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*(\w+)=(.+)$/)
    if (m) vars[m[1]] = m[2]
  }
  return vars
}

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  // 1. Create/upsert business
  const bizRow = {
    slug: 'viajero-comercio',
    name: 'El Viajero Comercio',
    type: 'viajero_comercio',
    phone: '+595981234567',
    city: 'Asunción',
    data_json: {
      features: {
        productCatalog: { enabled: true, whatsappOrder: true, showPrices: true },
        gallery: { enabled: true },
        whatsappFloat: { enabled: true },
        googleMapsEmbed: { enabled: true },
        blog: { enabled: true },
        testimonials: { enabled: true },
        statsCounter: { enabled: true },
        featuresGrid: { enabled: true },
        promoBanner: { enabled: true }
      },
      vertical: 'retail-local',
      country: 'PY',
      whatsapp: '595981234567',
      email: 'info@elviajerocomerc.io.com.py',
      address: 'Av. Mariscal Lopez 1234, Asuncion',
      hours: 'Lun-Vie 08:00-19:00 | Sab 08:00-17:00 | Dom 09:00-13:00',
      deliveryZones: ['Asuncion', 'Fernando de la Mora', 'San Lorenzo', 'Lambare', 'Luque', 'Capiatá'],
      paymentMethods: ['efectivo', 'transferencia', 'bancard', 'mercadopago', 'pagopar'],
      commerce: {
        enabled: true,
        launchPhase: 'beta',
        provider: 'pagopar',
        currency: 'PYG',
        catalog: { source: 'supabase' },
        checkout: {
          anonymousAllowed: true,
          shippingRequired: true,
          phoneRequired: true
        }
      }
    }
  }

  console.log('=== Creating/Updating business: viajero-comercio ===')
  const { data: biz, error: bizError } = await supabase
    .from('businesses')
    .upsert(bizRow, { onConflict: 'slug', ignoreDuplicates: false })
    .select('id')
    .single()

  if (bizError) {
    console.error('ERROR creating business:', bizError.message)
    process.exit(1)
  }
  console.log(`  ✅ Business ID: ${biz!.id}`)

  // 2. Load seed products
  const seedPath = path.join(ROOT, 'src', 'content', 'commerce-seeds', 'viajero_comercio.seed.json')
  const seedData = JSON.parse(await fs.readFile(seedPath, 'utf-8'))
  const products = seedData.products

  console.log(`\n=== Importing ${products.length} products ===`)

  const productRows = products.map((p: any) => ({
    business_id: biz!.id,
    slug: p.slug,
    name: p.name,
    description: getDescription(p),
    category: getCategoryLabel(p.category),
    price_cents: p.priceCents,
    compare_at_price_cents: p.compareAtPriceCents || null,
    currency: 'PYG',
    inventory_qty: p.inventoryQty || 10,
    inventory_policy: 'deny',
    low_stock_threshold: 3,
    images: p.images || [],
    status: 'active',
    is_seed: true,
    metadata: { source: 'seed-viajero-2026-04' }
  }))

  // Batch upsert in groups of 20 to avoid timeouts
  const BATCH = 20
  let ok = 0
  let err = 0

  for (let i = 0; i < productRows.length; i += BATCH) {
    const batch = productRows.slice(i, i + BATCH)
    const { error: upsertError } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'business_id,slug' })

    if (upsertError) {
      console.error(`  ✗ Batch ${i/BATCH + 1}: ${upsertError.message}`)
      err += batch.length
    } else {
      ok += batch.length
    }
  }

  console.log(`\n=== Done ===`)
  console.log(`  Products inserted/updated: ${ok}`)
  console.log(`  Errors: ${err}`)

  if (err === 0) {
    console.log(`\n🎉 Success! El Viajero Comercio is now live with ${ok} products.`)
    console.log(`   Business ID: ${biz!.id}`)
    console.log(`   Products table: SELECT * FROM products WHERE business_id = '${biz!.id}';`)
  }
}

function getDescription(p: any): string {
  if (p.name.includes('Carpa')) return `Carpa de camping ${p.category === 'camping' ? '' : ''}. Ideal para tus aventuras al aire libre. Resistente e impermeable.`
  if (p.name.includes('Bolsa')) return `Bolsa de dormir para camping. Temperatura confort optima para tus noches al aire libre.`
  if (p.name.includes('Colchon')) return `Colchon inflable para camping. Comodidad donde vayas.`
  if (p.name.includes('Silla')) return `Silla plegable comoda para camping, pesca y actividades al aire libre.`
  if (p.name.includes('Mesa')) return `Mesa portatil plegable para camping y outdoor.`
  if (p.name.includes('Hamaca')) return `Hamaca comoda para camping y tiempo libre.`
  if (p.name.includes('Linterna') || p.name.includes('Lampara')) return `Iluminacion LED potente para camping y actividades nocturnas. Recargable.`
  if (p.name.includes('Parrilla')) return `Parrilla portatil para camping y picnics. Practica y facil de transportar.`
  if (p.name.includes('Cocina')) return `Cocina portatil a gas para camping. Ideal para cocinar al aire libre.`
  if (p.name.includes('Garrafa')) return `Garrafa de gas portatil para cocina de camping.`
  if (p.name.includes('Conservadora')) return `Conservadora termica para mantener tus alimentos y bebidas frios.`
  if (p.name.includes('Aislante')) return `Aislante termico para camping. Protege del frio del suelo.`
  if (p.name.includes('Toldo')) return `Toldo plegable para sombra en camping y eventos al aire libre.`
  if (p.name.includes('Catre')) return `Catre plegable para camping. Descansa comodamente donde sea.`
  if (p.name.includes('Alfombra')) return `Alfombra termica aislante para colocar dentro de la carpa.`
  if (p.name.includes('Cana') || p.name.includes('Caña')) return `Caña de pescar de calidad para pesca deportiva.`
  if (p.name.includes('Reel') || p.name.includes('Molinete')) return `Reel/molinete de pesca de alto rendimiento.`
  if (p.name.includes('Caja') && p.name.includes('Pesca')) return `Caja organizadora para equipos y accesorios de pesca.`
  if (p.name.includes('Chaleco')) return `Chaleco salvavidas aprobado. Seguridad en el agua.`
  if (p.name.includes('Señuelo') || p.name.includes('senuelo')) return `Señuelo de pesca profesional.`
  if (p.name.includes('Anzuelo')) return `Anzuelos de pesca de alta calidad. Varios tamanos.`
  if (p.name.includes('Hilo') || p.name.includes('Linana') || p.name.includes('liñada')) return `Hilo/linada de pesca resistente.`
  if (p.name.includes('Plomada')) return `Plomadas de pesca de varios pesos.`
  if (p.name.includes('Flotador')) return `Flotadores de pesca de varios tamanos y colores.`
  if (p.name.includes('Alicate')) return `Alicate profesional para pesca. Acero inoxidable.`
  if (p.name.includes('Cuchillo') && p.name.includes('Fileteador')) return `Cuchillo fileteador para limpieza de pescado.`
  if (p.name.includes('Red')) return `Red de pesca para captura segura.`
  if (p.name.includes('Boya')) return `Boya luminosa LED para pesca nocturna.`
  if (p.name.includes('Mochila')) return `Mochila resistente para actividades outdoor y viajes.`
  if (p.name.includes('Cuchillo') && (p.name.includes('Multiuso') || p.name.includes('Tactico'))) return `Cuchillo de alto rendimiento para outdoor y supervivencia.`
  if (p.name.includes('Brujula')) return `Brujula profesional con clinometro para orientacion.`
  if (p.name.includes('Binocular')) return `Binoculares profesionales para observacion de naturaleza.`
  if (p.name.includes('Cantimplora')) return `Cantimplora portatil para hidratacion en actividades outdoor.`
  if (p.name.includes('Termo')) return `Termo de acero inoxidable. Mantiene la temperatura por horas.`
  if (p.name.includes('Machete')) return `Machete de acero para trabajo de campo y monte.`
  if (p.name.includes('Sombrero') || p.name.includes('Kepis')) return `Proteccion solar para actividades al aire libre.`
  if (p.name.includes('Guantes') && (p.name.includes('Tactico') || p.name.includes('Outdoor'))) return `Guantes de proteccion para actividades outdoor.`
  if (p.name.includes('Botiquin')) return `Botiquin portatil de primeros auxilios para camping y viajes.`
  if (p.name.includes('Dashcam') || p.name.includes('Camara')) return `Camara dashcam para vehiculo. Graba tus viajes con seguridad.`
  if (p.name.includes('Inflador')) return `Compresor portatil 12V para inflar neumaticos.`
  if (p.name.includes('GPS') && p.name.includes('Navegador')) return `GPS navegador para automovil.`
  if (p.name.includes('Eslinga')) return `Eslinga de remolque para vehiculos.`
  if (p.name.includes('Catraca')) return `Cincha/catraca de amarre para carga segura.`
  if (p.name.includes('Extintor')) return `Extintor de incendios para vehiculo.`
  if (p.name.includes('Escobillas') || p.name.includes('Limpiaparabrisas')) return `Escobillas limpiaparabrisas premium.`
  if (p.name.includes('Organizador') && p.name.includes('Baul')) return `Organizador plegable para baul del auto.`
  if (p.name.includes('Asiento') && p.name.includes('Coche')) return `Asiento de seguridad para bebe en auto.`
  if (p.name.includes('Cargador') && p.name.includes('USB')) return `Cargador USB para automovil.`
  if (p.name.includes('Soporte') && p.name.includes('Celular')) return `Soporte universal para celular en el auto.`
  if (p.name.includes('Cable') && p.name.includes('Auxiliar')) return `Cable auxiliar de audio para auto.`
  if (p.name.includes('Casco')) return `Casco de proteccion para moto. Certificado.`
  if (p.name.includes('Guantes') && p.name.includes('Moto')) return `Guantes de proteccion para motociclista.`
  if (p.name.includes('Camara') && p.name.includes('Casco')) return `Camara de accion para casco de moto.`
  if (p.name.includes('GPS') && p.name.includes('Antirrobo')) return `GPS rastreador antirrobo para moto.`
  if (p.name.includes('Candado') && p.name.includes('Moto')) return `Candado de seguridad para moto.`
  if (p.name.includes('Funda') && p.name.includes('Moto')) return `Funda impermeable para proteger tu moto.`
  if (p.name.includes('Intercomunicador')) return `Intercomunicador bluetooth para casco de moto.`
  if (p.name.includes('Kit') && p.name.includes('Herramientas')) return `Kit de herramientas para campo y jardin.`
  if (p.name.includes('Pala')) return `Pala agricola reforzada para trabajo de campo.`
  if (p.name.includes('Azada')) return `Azada agricola para labranza.`
  if (p.name.includes('Machete') && p.name.includes('Agricola')) return `Machete agricola para trabajo de campo.`
  if (p.name.includes('Rastrillo')) return `Rastrillo de jardin para limpieza de hojas y terreno.`
  if (p.name.includes('Horquilla')) return `Horquilla agricola para movimiento de materiales.`
  if (p.name.includes('Carretilla')) return `Carretilla de construccion y jardin.`
  if (p.name.includes('Bebedero')) return `Bebedero automatico para aves de corral.`
  if (p.name.includes('Comedero')) return `Comedero para animales de granja.`
  if (p.name.includes('Cerca') || p.name.includes('Malla')) return `Material para cercado y alambrado de campo.`
  if (p.name.includes('Fumigador')) return `Fumigador manual de mochila para agricultura.`
  if (p.name.includes('Tijera') && p.name.includes('Poda')) return `Tijera de poda profesional.`
  if (p.name.includes('Serrucho')) return `Serrucho de poda para jardin.`
  if (p.name.includes('Guantes') && p.name.includes('Trabajo')) return `Guantes de trabajo para campo.`
  if (p.name.includes('Balde')) return `Balde plastico reforzado de uso multiple.`
  if (p.name.includes('Tractor') && p.name.includes('Juguete')) return `Juguete didactico infantil.`
  return `Producto de calidad de El Viajero Comercio. Consulta por WhatsApp.`
}

function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    'camping': 'Camping',
    'pesca': 'Pesca',
    'accesorios-personales': 'Acc. Personales',
    'automoviles': 'Automoviles',
    'motos': 'Motos',
    'campo-granja': 'Campo'
  }
  return labels[cat] || cat
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
