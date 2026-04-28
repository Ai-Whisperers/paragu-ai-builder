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
  const n = p.name
  if (n.includes('Carpa')) return `Carpa de camping impermeable en Asuncion. Ideal para 2 a 8 personas. Resistente al agua y facil de armar. Comprá tu carpa para camping en El Viajero Comercio.`
  if (n.includes('Bolsa') && n.includes('Dormir')) return `Bolsas de dormir para camping en Paraguay. Temperatura confort optima para tus noches al aire libre. Comprá online en El Viajero Comercio.`
  if (n.includes('Colchon')) return `Colchon inflable para camping queen size. Comodidad donde vayas. Con bomba incluida. Ideal para acampar en Paraguay.`
  if (n.includes('Silla') && n.includes('Pescador')) return `Silla plegable tipo pescador con posavasos. Comoda y resistente para camping, pesca y outdoor. Envio en Asuncion.`
  if (n.includes('Silla')) return `Sillas plegables para camping y playa. Comodas y portatiles. Ideales para actividades al aire libre en Paraguay.`
  if (n.includes('Mesa')) return `Mesa plegable portatil de aluminio para camping. Ideal para 4 personas. Facil de transportar y guardar.`
  if (n.includes('Hamaca')) return `Hamacas para camping y tiempo libre. Comodas, portatiles y resistentes. Ideales para el jardin o la playa.`
  if (n.includes('Linterna') || n.includes('Lampara')) return `Linternas y lamparas LED recargables para camping. Potentes, duraderas y resistentes al agua. Comprá en Asuncion.`
  if (n.includes('Parrilla')) return `Parrilla portatil plegable de acero inoxidable para camping y picnics. Practica, liviana y facil de transportar.`
  if (n.includes('Cocina')) return `Cocina portatil a gas para camping con 2 hornallas. Ideal para cocinar al aire libre. Garrafa incluida.`
  if (n.includes('Garrafa')) return `Garrafa de gas portatil para cocina de camping. Rosca larga. 230g. Repuesto para tus equipos outdoor.`
  if (n.includes('Conservadora')) return `Conservadora termica para camping. Mantiene tus alimentos y bebidas frios por horas. Ideal para el clima de Paraguay.`
  if (n.includes('Aislante')) return `Aislante termico EVA para camping. Protege del frio del suelo. Liviano y facil de guardar.`
  if (n.includes('Toldo')) return `Toldo plegable 3x3m con laterales para sombra en camping y eventos al aire libre. Proteccion solar portatil.`
  if (n.includes('Catre')) return `Catre plegable de camping con colchoneta. Descansa comodamente donde sea. Ideal para acampar en familia.`
  if (n.includes('Alfombra')) return `Alfombra termica aislante para colocar dentro de la carpa. Protege del suelo humedo y el frio.`
  if (n.includes('Cana') || n.includes('Caña')) return `Caña de pescar telescopica de fibra de vidrio. Ideal para pesca deportiva en rios y lagunas de Paraguay. Comprá online.`
  if (n.includes('Reel') || n.includes('Molinete')) return `Reel y molinetes de pesca de alto rendimiento. Ideales para pesca deportiva en Paraguay. Calidad profesional.`
  if (n.includes('Caja') && n.includes('Pesca')) return `Cajas organizadoras para equipos y accesorios de pesca. Compartimentos ajustables. Practicas y resistentes.`
  if (n.includes('Chaleco')) return `Chaleco salvavidas aprobado por autoridad maritima. Seguridad en el agua para toda la familia. Varios talles.`
  if (n.includes('Señuelo') || n.includes('senuelo')) return `Señuelos de pesca profesionales. Variedad de colores y tamanos para todo tipo de pesca en Paraguay.`
  if (n.includes('Anzuelo')) return `Kit de anzuelos de pesca de alta calidad. Varios tamanos. Ideal para pescadores principiantes y expertos.`
  if (n.includes('Hilo') || n.includes('Linana') || n.includes('liñada')) return `Hilos y liñadas de pesca resistentes. Nylon de alta calidad. Varios calibres disponibles en Asuncion.`
  if (n.includes('Plomada')) return `Plomadas de pesca de varios pesos. Ideales para todo tipo de pesca en rios y lagunas de Paraguay.`
  if (n.includes('Flotador')) return `Flotadores de pesca de varios tamanos y colores. Alta visibilidad en el agua. Ideal para pesca deportiva.`
  if (n.includes('Alicate')) return `Alicates profesionales para pesca de acero inoxidable con funda. Resistentes a la corrosion del agua.`
  if (n.includes('Cuchillo') && n.includes('Fileteador')) return `Cuchillo fileteador profesional para limpieza de pescado. Acero inoxidable. Mango ergonomico.`
  if (n.includes('Red')) return `Red de pesca tipo tirita para captura segura. Ideal para pesca deportiva en Paraguay.`
  if (n.includes('Boya')) return `Boya de pesca luminosa LED para pesca nocturna. Alta visibilidad. Ideal para pescar de noche.`
  if (n.includes('Mochila') && n.includes('60')) return `Mochila 60L impermeable con multiple compartimientos. Ideal para camping y viajes. Resistente y comoda.`
  if (n.includes('Mochila') && n.includes('30')) return `Mochila 30L urbana outdoor. Comoda y funcional para el dia a dia y actividades al aire libre.`
  if (n.includes('Mochila')) return `Mochilas resistentes para outdoor, camping y viajes. Varios tamanos y estilos en Asuncion.`
  if (n.includes('Cuchillo') && n.includes('Multiuso')) return `Cuchillo multiuso plegable con 15 herramientas. Ideal para camping, pesca y outdoor. Incluye funda.`
  if (n.includes('Cuchillo') && n.includes('Tactico')) return `Cuchillo tactico de alto rendimiento para outdoor y supervivencia. Acero inoxidable. Diseno profesional.`
  if (n.includes('Brujula')) return `Brujula profesional con clinometro para orientacion y senderismo. Ideal para explorar Paraguay.`
  if (n.includes('Binocular')) return `Binoculares profesionales 12x50 con vision nocturna. Ideales para observacion de naturaleza y avistamiento de aves.`
  if (n.includes('Cantimplora')) return `Cantimplora portatil de acero inoxidable para hidratacion en actividades outdoor. 1 litro de capacidad.`
  if (n.includes('Termo')) return `Termo de acero inoxidable 1 litro. Mantiene la temperatura por horas. Ideal para trabajar, viajar o camping.`
  if (n.includes('Machete')) return `Machete de acero para trabajo de campo y monte. Ideal para agricultura, jardineria y supervivencia.`
  if (n.includes('Sombrero') || n.includes('Kepis')) return `Sombreros y kepis con proteccion UV para actividades al aire libre. Ideales para el sol de Paraguay.`
  if (n.includes('Guantes') && (n.includes('Tactico') || n.includes('Outdoor'))) return `Guantes tacticos con proteccion y agarre. Ideales para outdoor, airsoft y actividades al aire libre.`
  if (n.includes('Botiquin')) return `Botiquin portatil de primeros auxilios para camping y viajes. Incluye los esenciales para emergencias.`
  if (n.includes('Dashcam') || (n.includes('Camara') && n.includes('Full'))) return `Camara dashcam Full HD 1080p con vision nocturna para auto. Graba tus viajes con seguridad. Instalacion facil.`
  if (n.includes('Dashcam')) return `Camara dashcam 4K con WiFi para auto. Vision nocturna, deteccion de movimiento. La mejor calidad de grabacion.`
  if (n.includes('Inflador') || n.includes('Compresor')) return `Compresor inflador portatil 12V digital para auto. Infla neumaticos, pelotas y colchones. Apagado automatico.`
  if (n.includes('GPS') && n.includes('Navegador')) return `GPS navegador para automovil con pantalla de 7 pulgadas. Mapas actualizados. Ideal para viajar por Paraguay.`
  if (n.includes('Eslinga')) return `Eslinga de remolque 3 toneladas para vehiculos. Resistente y segura para emergencias en ruta.`
  if (n.includes('Catraca')) return `Catraca / cincha de amarre para carga segura. 5 metros, 500kg de capacidad. Ideal para mudanzas.`
  if (n.includes('Extintor')) return `Extintor de incendios ABC 2kg para vehiculo. Polvo quimico seco. Recargable. Obligatorio en Paraguay.`
  if (n.includes('Escobillas') || n.includes('Limpiaparabrisas')) return `Escobillas limpiaparabrisas premium para auto. Varias medidas. Mayor durabilidad y mejor visibilidad.`
  if (n.includes('Organizador') && n.includes('Baul')) return `Organizador plegable para baul del auto. Mantene tu maletero ordenado. Ideal para compras y viajes.`
  if (n.includes('Asiento') && n.includes('Coche')) return `Asiento de seguridad para bebe en auto. Grupo 0+. Aprobado. Viaja tranquilo con tu bebe.`
  if (n.includes('Cargador') && n.includes('USB')) return `Cargador USB para automovil de 2 puertos. Carga rapida 3.1A. Compatible con todos los dispositivos.`
  if (n.includes('Soporte') && n.includes('Celular')) return `Soporte universal para celular en el auto con ventosa. Compatible con todos los telefonos.`
  if (n.includes('Cable') && n.includes('Auxiliar')) return `Cable auxiliar de audio 3.5mm para auto. Conecta tu telefono al stereo del auto.`
  if (n.includes('Casco') && n.includes('Integral')) return `Casco integral para moto certificado DOT. Visor claro. Seguridad y estilo para motociclistas en Paraguay.`
  if (n.includes('Casco') && n.includes('Abierto')) return `Casco abierto para moto con visor solar. Ideal para ciudad. Comodo y seguro. Varios colores.`
  if (n.includes('Casco') && n.includes('Infantil')) return `Casco infantil para moto. Disenos divertidos. Seguridad certificada para los mas pequenos.`
  if (n.includes('Casco')) return `Cascos de proteccion para moto en Asuncion. Certificados. Variedad de estilos y talles.`
  if (n.includes('Guantes') && n.includes('Moto') && n.includes('Cuero')) return `Guantes de cuero para moto con proteccion. Comodos y seguros para rutear por Paraguay.`
  if (n.includes('Guantes') && n.includes('Moto') && n.includes('Invierno')) return `Guantes impermeables para moto. Proteccion termica para el invierno. Ideales para rutear.`
  if (n.includes('Guantes') && n.includes('Moto')) return `Guantes para motociclista. Varios estilos y talles. Proteccion y comodidad en Asuncion.`
  if (n.includes('Camara') && n.includes('Casco')) return `Camara de accion 1080p para casco de moto. Graba tus rutas. Resistente al agua.`
  if (n.includes('GPS') && n.includes('Antirrobo')) return `GPS rastreador antirrobo para moto. Seguimiento en tiempo real. Alarma. Protege tu moto en Paraguay.`
  if (n.includes('Candado') && n.includes('Moto')) return `Candado de seguridad para moto en U de acero endurecido. Anticorte. Protege tu motocicleta.`
  if (n.includes('Funda') && n.includes('Moto')) return `Funda impermeable para proteger tu moto de la lluvia y el sol. Cubierta completa. Ideal para Paraguay.`
  if (n.includes('Intercomunicador')) return `Intercomunicador bluetooth para casco de moto. Manos libres, musica y GPS. Ideal para rutear en grupo.`
  if (n.includes('Kit') && n.includes('Herramientas')) return `Kit de herramientas para campo: pala, azada y rastrillo desarmables. Ideal para agricultura y jardineria.`
  if (n.includes('Pala')) return `Pala agricola reforzada de acero para trabajo de campo. Mango resistente. Ideal para jardineria y construccion.`
  if (n.includes('Azada')) return `Azada agricola 1.5kg con mango de madera. Ideal para labranza y trabajo de campo en Paraguay.`
  if (n.includes('Machete') && n.includes('Agricola')) return `Machete agricola 22 pulgadas con mango de madera. Ideal para trabajo de campo y monte.`
  if (n.includes('Rastrillo')) return `Rastrillo de jardin de acero de 12 dientes. Ideal para limpieza de hojas y mantenimiento del jardin.`
  if (n.includes('Horquilla')) return `Horquilla agricola 4 puntas con mango de madera. Ideal para movimiento de tierra y abono.`
  if (n.includes('Carretilla')) return `Carretilla de construccion y jardin de acero. Capacidad 80L. Rueda neumatica. Resistente.`
  if (n.includes('Bebedero')) return `Bebedero automatico para gallinas y aves de corral. Capacidad 5L. Facil de instalar y limpiar.`
  if (n.includes('Comedero')) return `Comedero para animales de granja. Capacidad 10kg. Resistente para uso exterior. Ideal para pollos y cerdos.`
  if (n.includes('Cerca') || n.includes('Malla')) return `Malla de alambre tejido para cercado de campo. 1.5m x 10m. Ideal para delimitar terrenos.`
  if (n.includes('Fumigador')) return `Fumigador manual de mochila 16L para agricultura y jardin. Ideal para el cuidado de tus cultivos.`
  if (n.includes('Tijera') && n.includes('Poda')) return `Tijera de poda profesional de acero. Corte preciso. Ideal para jardineria y mantenimiento de arboles.`
  if (n.includes('Serrucho')) return `Serrucho de poda curvo 300mm. Ideal para jardineria y mantenimiento de arboles frutales.`
  if (n.includes('Guantes') && n.includes('Trabajo')) return `Guantes de trabajo para campo de cuero. Resistentes y comodos. Proteccion para tus manos.`
  if (n.includes('Balde')) return `Balde plastico reforzado 20 litros. Uso multiple. Ideal para agricultura, limpieza y construccion.`
  if (n.includes('Tractor') && n.includes('Juguete')) return `Tractor de juguete agricola didactico. Ideal para regalar a ninos. Fomenta el amor por el campo.`
  if (n.includes('Gas Pimienta') || n.includes('gas pimienta')) return `Gas pimienta spray para defensa personal. 50ml. Efectivo e instantaneo. Llevá tu seguridad a donde vayas en Paraguay.`
  if (n.includes('Picana')) return `Picana electrica para defensa personal. 1M voltios. Disuasiva y efectiva. Ideal para seguridad personal.`
  if (n.includes('Baston') && n.includes('Tactico')) return `Baston tactico extensible de acero 21 pulgadas. Ideal para seguridad personal y actividades tacticas.`
  if (n.includes('Chaleco') && n.includes('Tactico')) return `Chaleco tactico multibolsillos ajustable. Ideal para airsoft, paintball y actividades outdoor.`
  if (n.includes('Walkie')) return `Walkie talkie profesional 16 canales con alcance de 5km. Ideal para excursiones y trabajo en equipo.`
  if (n.includes('Kit') && n.includes('Supervivencia')) return `Kit de supervivencia 18 piezas en caja. Incluye brujula, linterna, silbato y mas. Ideal para emergencias.`
  if (n.includes('Navaja') || (n.includes('Cuchillo') && n.includes('Plegable') && !n.includes('Multiuso'))) return `Navaja y cuchillos tacticos plegables con seguro. Acero inoxidable. Ideales para outdoor y EDC.`
  return `Productos de calidad en ${p.brand || 'El Viajero Comercio'}. Comprá online con envio en Asuncion y todo Paraguay. Consultá por WhatsApp.`
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
