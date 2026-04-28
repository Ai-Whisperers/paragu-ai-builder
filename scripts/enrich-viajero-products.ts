#!/usr/bin/env node
/**
 * Enrich Viajero products with brands and second images for hover swap.
 * Run: npx tsx scripts/enrich-viajero-products.ts
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

// Brand mapping by category
const BRANDS_BY_CATEGORY: Record<string, string> = {
  camping: 'Coleman',
  pesca: 'Shimano',
  'accesorios-personales': 'Tramontina',
  automoviles: 'Garmin',
  motos: 'LS2',
  'campo-granja': 'Tramontina',
  'tactico-defensa': 'Smith & Wesson',
}

// Second image mapping by category (different angle/context from primary)
const HOVER_IMAGES: Record<string, string> = {
  camping: 'https://images.unsplash.com/photo-1506976785307-8732e54ad72d?w=1200&q=80',
  pesca: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=1200&q=80',
  'accesorios-personales': 'https://images.unsplash.com/photo-1621800361987-87dfc24e605b?w=1200&q=80',
  automoviles: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80',
  motos: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=80',
  'campo-granja': 'https://images.unsplash.com/photo-1593113598336-86d3a9cb3f79?w=1200&q=80',
  'tactico-defensa': 'https://images.unsplash.com/photo-1537907690979-ee2e10f0d6b3?w=1200&q=80',
}

const HOVER_ALT: Record<string, string> = {
  camping: 'Vista alternativa de producto de camping',
  pesca: 'Equipo de pesca visto desde arriba',
  'accesorios-personales': 'Detalle de accesorio outdoor',
  automoviles: 'Accesorio para automovil en uso',
  motos: 'Accesorio para motocicleta detalle',
  'campo-granja': 'Herramienta de campo en uso',
  'tactico-defensa': 'Equipo tactico vista detalle',
}

async function main() {
  const env = await loadEnv()
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  // Get business
  const { data: biz } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', 'viajero-comercio')
    .single()

  if (!biz) {
    console.error('Business not found')
    process.exit(1)
  }

  // Read seed data
  const seedPath = path.join(ROOT, 'src', 'content', 'commerce-seeds', 'viajero_comercio.seed.json')
  const seedData = JSON.parse(await fs.readFile(seedPath, 'utf-8'))

  let updated = 0
  let errors = 0

  for (const product of seedData.products) {
    const brand = BRANDS_BY_CATEGORY[product.category]
    const hoverUrl = HOVER_IMAGES[product.category]
    const hoverAlt = HOVER_ALT[product.category]

    // Build update object
    const updateData: Record<string, unknown> = {}

    if (brand) {
      updateData.brand = brand
      // Also update the seed file's metadata
      product.brand = brand
    }

    // Add second image for hover if only 1 image exists
    const images = product.images || []
    if (images.length === 1 && hoverUrl) {
      images.push({
        url: hoverUrl,
        alt: hoverAlt || 'Vista alternativa',
        isCover: false,
      })
      updateData.images = images
    }

    if (Object.keys(updateData).length === 0) continue

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('business_id', biz.id)
      .eq('slug', product.slug)

    if (error) {
      console.error(`  Error updating ${product.slug}: ${error.message}`)
      errors++
    } else {
      updated++
    }
  }

  // Write enriched seed back to disk
  await fs.writeFile(seedPath, JSON.stringify(seedData, null, 2))
  console.log(`\nSeed file updated with brands and images`)

  console.log(`\n=== Done ===`)
  console.log(`  Products updated: ${updated}`)
  console.log(`  Errors: ${errors}`)

  // Verify
  const { data: prods } = await supabase
    .from('products')
    .select('name, brand, images')
    .eq('business_id', biz.id)
    .limit(5)

  for (const p of prods || []) {
    const imgCount = (p.images as unknown[])?.length ?? 0
    console.log(`  ${p.name}: brand=${p.brand ?? '-'}, images=${imgCount}`)
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
