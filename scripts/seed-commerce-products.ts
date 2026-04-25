#!/usr/bin/env node
/**
 * Seed Supabase businesses + products for all preview sites.
 * Processes in batches of 5 to avoid rate limits.
 *
 * Usage: npx tsx scripts/seed-commerce-products.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { randomUUID } from 'crypto'

const ROOT = path.resolve(__dirname, '..')
const SITES_DIR = path.join(ROOT, 'sites')

// Load env from .env.local
const envPath = path.join(ROOT, 'web', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*(\w+)=(.+)$/)
    if (m) process.env[m[1]] = m[2]
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Supabase credentials required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

// Map preview businessType to schema enum
const TYPE_MAP: Record<string, string> = {
  peluqueria: 'peluqueria',
  salon_belleza: 'salon_belleza',
  gimnasio: 'gimnasio',
  spa: 'spa',
  unas: 'unas',
  tatuajes: 'tatuajes',
  barberia: 'barberia',
  estetica: 'estetica',
  maquillaje: 'maquillaje',
  depilacion: 'depilacion',
  pestanas: 'pestanas',
  diseno_grafico: 'diseno_grafico',
}

async function main() {
  console.log('=== Seeding Commerce Data for Previews ===\n')

  const entries = fs.readdirSync(SITES_DIR, { withFileTypes: true })
  const previewSlugs = entries
    .filter(e => e.isDirectory() && e.name.startsWith('preview-'))
    .map(e => e.name)
    .sort()

  console.log(`${previewSlugs.length} previews\n`)

  let bizOk = 0
  let bizErr = 0
  let prodOk = 0
  let prodErr = 0
  let skipped = 0

  // Process in batches of 5
  const BATCH = 5
  for (let i = 0; i < previewSlugs.length; i += BATCH) {
    const batch = previewSlugs.slice(i, i + BATCH)

    for (const slug of batch) {
      const contentPath = path.join(SITES_DIR, slug, 'content', 'es.json')
      const sitePath = path.join(SITES_DIR, slug, 'site.json')
      if (!fs.existsSync(contentPath) || !fs.existsSync(sitePath)) {
        skipped++
        continue
      }

      const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
      const site = JSON.parse(fs.readFileSync(sitePath, 'utf-8'))
      const products = content.home?.products?.items
      const bizName = content.placeholders?.businessName || slug
      const bizType: string = TYPE_MAP[site.businessType] || 'salon_belleza'
      const phone = site.contact?.phone || ''

      // Upsert business
      const bizRow = {
        slug,
        name: bizName,
        type: bizType,
        phone,
        city: site.location?.city || 'Asunción',
        data_json: {
          features: site.features || {},
          vertical: site.vertical || 'beauty-personal-care',
          country: 'PY',
        },
      }

      const { data: biz, error: bizError } = await supabase
        .from('businesses')
        .upsert(bizRow, { onConflict: 'slug', ignoreDuplicates: false })
        .select('id')
        .single()

      if (bizError) {
        console.error(`  ✗ ${slug}: ${bizError.message.slice(0, 120)}`)
        bizErr++
        continue
      }
      bizOk++

      // Upsert products
      if (!products || products.length === 0) {
        skipped++
        continue
      }

      const productRows = products.map((p: any, idx: number) => ({
        id: p.id || uuidV4(),
        slug: slugify(p.name || p.slug || `prod-${idx}`),
        business_id: biz.id,
        name: p.name || `Producto ${idx + 1}`,
        description: p.description || null,
        category: p.category || (site.businessType === 'gimnasio' ? 'Membresías' : 'Servicios'),
        price_cents: p.priceCents || 50000,
        currency: 'PYG',
        inventory_qty: 999,
        inventory_policy: 'continue',
        status: 'active',
        is_seed: true,
        images: p.imageUrl ? [{ url: p.imageUrl, alt: p.name, isCover: true }] : [],
        metadata: { tags: p.tags || [] },
      }))

      const { error: prodError } = await supabase
        .from('products')
        .upsert(productRows, { onConflict: 'business_id,slug' })

      if (prodError) {
        console.error(`  ✗ ${slug} products: ${prodError.message.slice(0, 120)}`)
        prodErr += productRows.length
      } else {
        prodOk += productRows.length
      }
    }

    const pct = Math.round(Math.min(i + BATCH, previewSlugs.length) / previewSlugs.length * 100)
    console.log(`  ${Math.min(i + BATCH, previewSlugs.length)}/${previewSlugs.length} (${pct}%) — ${bizOk} biz, ${prodOk} products`)
  }

  console.log(`\n=== Done ===`)
  console.log(`  Businesses created/updated: ${bizOk}`)
  console.log(`  Business errors: ${bizErr}`)
  console.log(`  Products inserted: ${prodOk}`)
  console.log(`  Product errors: ${prodErr}`)
  console.log(`  Skipped (no data): ${skipped}`)
}

function uuidV4() { return randomUUID() }
function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
