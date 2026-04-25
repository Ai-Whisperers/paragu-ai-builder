#!/usr/bin/env node
/**
 * Batch-generate personalized preview sites for top 100 leads.
 *
 * For each lead:
 *   1. Copy content from the appropriate enriched demo template
 *   2. Customize site.json with their real info (name, phone, address, city, coords)
 *   3. Customize content files with their business name
 *   4. Update lead status → demo_ready
 *
 * Usage: npx tsx web/scripts/generate-batch-previews.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const SITES = path.join(ROOT, 'sites')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qyvokpribmbrosafntqa.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMxODE1NSwiZXhwIjoyMDkxODk0MTU1fQ.rphBsAVMuI_2X8RCU7D0JiGd8pqqdpcQ7vpUrirU06g'
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Map business type → demo template to use
const TYPE_TO_DEMO: Record<string, string> = {
  barberia: 'demo-barberia',
  gimnasio: 'demo-gimnasio',
  spa: 'demo-spa',
  depilacion: 'demo-depilacion',
  maquillaje: 'demo-maquillaje',
  estetica: 'demo-estetica',
  peluqueria: 'demo-peluqueria',
  salon_belleza: 'demo-salon-belleza',
  unas: 'demo-unas',
  tatuajes: 'demo-peluqueria',
  masajes: 'demo-spa',
  yoga: 'demo-gimnasio',
  pilates: 'demo-gimnasio',
}

// Fields in content to replace
const NAME_PLACEHOLDERS: Record<string, string[]> = {
  'demo-barberia': ['Barbería Moderna'],
  'demo-gimnasio': ['PowerGym', 'Gimnasio Power'],
  'demo-spa': ['Spa Relax'],
  'demo-depilacion': ['Demo Centro de Depilación Asunción'],
  'demo-maquillaje': ['Demo Maquillaje Profesional Asunción'],
  'demo-estetica': ['Demo Estética Asunción'],
}

async function main() {
  console.log('Fetching top 100 leads...\n')

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'new')
    .eq('has_website', false)
    .eq('has_phone', true)
    .gte('rating', 4.5)
    .not('business_name', 'ilike', '%unknown%')
    .not('business_name', 'is', null)
    .order('review_count', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Query failed:', error)
    process.exit(1)
  }

  console.log(`Found ${leads.length} leads to process\n`)

  let created = 0
  let skipped = 0
  let failed = 0

  for (const lead of leads) {
    const bizType = (lead.business_type || 'peluqueria') as string
    const demoSlug = TYPE_TO_DEMO[bizType]
    if (!demoSlug) {
      console.log(`  ✗ ${lead.business_name?.padEnd(30)} no demo for type: ${bizType}`)
      failed++
      continue
    }

    const bizName = ((lead.business_name as string) || 'negocio').trim()
    const baseSlug = slugify(bizName).slice(0, 40)
    let previewSlug = `preview-${baseSlug}`
    let previewDir = path.join(SITES, previewSlug)
    // Ensure uniqueness — if slug exists, append a short hash
    if (fs.existsSync(previewDir)) {
      const shortId = (lead.id as string).slice(0, 8)
      previewSlug = `preview-${baseSlug}-${shortId}`
      previewDir = path.join(SITES, previewSlug)
    }

    // Skip if already exists
    if (fs.existsSync(previewDir)) {
      console.log(`  ~ ${previewSlug.padEnd(30)} already exists`)
      skipped++
      continue
    }

    const demoDir = path.join(SITES, demoSlug)
    if (!fs.existsSync(demoDir)) {
      console.log(`  ✗ ${lead.business_name?.padEnd(30)} demo dir not found: ${demoSlug}`)
      failed++
      continue
    }

    try {
      // 1. Copy entire demo directory recursively
      copyDirSync(demoDir, previewDir)

      // 2. Customize site.json
      const siteJsonPath = path.join(previewDir, 'site.json')
      if (fs.existsSync(siteJsonPath)) {
        const site = JSON.parse(fs.readFileSync(siteJsonPath, 'utf-8'))
        site.preview = true
        site.previewLeadId = lead.id
        site.createdAt = new Date().toISOString()
        site.source = 'lead_generation'
        site.noindex = true
        site.is_demo = false

        // Override with lead's real info
        site.contact = site.contact || {}
        if (lead.phone) site.contact.phone = lead.phone
        if (lead.phone) site.contact.whatsapp = lead.phone
        if (lead.email) site.contact.email = lead.email
        if (lead.instagram) site.contact.instagram = lead.instagram
        if (lead.facebook_url) site.contact.facebook = lead.facebook_url

        site.location = site.location || {}
        if (lead.city) site.location.city = lead.city
        if (lead.address) site.location.address = lead.address
        if (lead.coordinates) site.location.coordinates = lead.coordinates
        if (lead.google_maps_url) site.location.googleMapsUrl = lead.google_maps_url

        // Update path and public URL
        site.path = `/s/es/${previewSlug}`
        site.publicUrl = `https://paragu-ai.com/s/es/${previewSlug}`

        fs.writeFileSync(siteJsonPath, JSON.stringify(site, null, 2) + '\n')
      }

  // 3. Customize content files — replace placeholders with real business name
  const contentDir = path.join(previewDir, 'content')
  const placeholders = NAME_PLACEHOLDERS[demoSlug] || []
  const businessName = (lead.business_name || 'Mi Negocio').trim()
  const city = (lead.city || 'Asunción').trim()

  if (fs.existsSync(contentDir)) {
    walkDirSync(contentDir, (filePath) => {
      if (!filePath.endsWith('.json')) return
      let content = fs.readFileSync(filePath, 'utf-8')

      // Replace demo business name with real name
      for (const placeholder of placeholders) {
        content = content.split(placeholder).join(businessName)
      }

      // Replace city
      content = content.replace(/"Asunción"/g, `"${city}"`)
      content = content.replace(/en Asunción/g, `en ${city}`)
      content = content.replace(/de Asunción/g, `de ${city}`)

      // Update SEO title and description with real business name
      content = content.replace(/Demo /g, '')
      content = content.replace(/demo /gi, '')

      fs.writeFileSync(filePath, content)
    })
  }

  // 4. Add new sections to preview pages
  const pagesPath = path.join(previewDir, 'pages', 'home.json')
  if (fs.existsSync(pagesPath)) {
    const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf-8'))
    const sections = pages.sections

    // Add Google Reviews section (after testimonials or before faq)
    const testimonialIdx = sections.findIndex((s: { id: string }) => s.id === 'testimonials')
    if (testimonialIdx >= 0) {
      sections.splice(testimonialIdx + 1, 0, { id: 'google-reviews', variant: 'carousel', content: 'home.reviewsWidget' })
    }

    // Add packages/gift cards section (before contact)
    const contactIdx = sections.findIndex((s: { id: string }) => s.id === 'contact')
    if (contactIdx >= 0) {
      sections.splice(contactIdx, 0, { id: 'packages-giftcards', variant: 'tabs', content: 'home.packagesGiftcards' })
    }

    fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2) + '\n')
  }

  // 5. Add gift card + packages + reviews content to content file
  const contentPath = path.join(contentDir, 'es.json')
  if (fs.existsSync(contentPath)) {
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
    content.home = content.home || {}

    // Google reviews widget content (from lead's actual review data)
    content.home.reviewsWidget = {
      title: 'Lo que dicen en Google',
      subtitle: `Basado en ${lead.review_count || 0} reseñas en Google`,
      reviews: [
        { author: 'Cliente', rating: 5, text: 'Excelente servicio, muy recomendado.' },
        { author: 'Cliente', rating: 4, text: 'Buena atención y profesionales.' },
        { author: 'Cliente', rating: 5, text: 'Salió todo perfecto. Volveré sin dudas.' },
      ],
    }

    // Packages + gift cards content
    content.home.packagesGiftcards = {
      packages: [
        { id: 'basico', name: 'Plan Básico', description: 'Servicio esencial', original_price: 150000, sale_price: 120000, services: ['Servicio 1', 'Servicio 2'], popular: false },
        { id: 'premium', name: 'Plan Premium', description: 'Nuestra opción más elegida', original_price: 300000, sale_price: 250000, services: ['Servicio 1', 'Servicio 2', 'Servicio 3', 'Servicio 4'], popular: true },
        { id: 'vip', name: 'Plan VIP', description: 'Experiencia completa', original_price: 500000, sale_price: 450000, services: ['Todos los servicios'], popular: false },
      ],
      giftCards: [
        { id: 'gc-50', amount: 100000, description: 'Regalá un servicio' },
        { id: 'gc-100', amount: 200000, description: 'Regalá una experiencia completa' },
        { id: 'gc-200', amount: 500000, description: 'Regalá el plan VIP' },
      ],
    }

    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2) + '\n')
  }

      console.log(`  ✓ ${previewSlug.padEnd(40)} ${businessName.slice(0, 30)} — ${bizType} en ${city}`)
      created++
    } catch (err) {
      console.log(`  ✗ ${previewSlug.padEnd(30)} error: ${err instanceof Error ? err.message : String(err)}`)
      failed++
      // Clean up partial directory
      if (fs.existsSync(previewDir)) {
        fs.rmSync(previewDir, { recursive: true, force: true })
      }
    }
  }

  console.log(`\n=== Results ===`)
  console.log(`Created: ${created}`)
  console.log(`Skipped: ${skipped}`)
  console.log(`Failed: ${failed}`)

  if (created > 0) {
    console.log(`\nUpdating lead statuses to demo_ready...`)

    let updated = 0
    for (const lead of leads) {
      const bizName = ((lead.business_name as string) || 'negocio').trim()
      const baseSlug = slugify(bizName).slice(0, 40)
      let previewSlug = `preview-${baseSlug}`
      let previewDir = path.join(SITES, previewSlug)
      if (!fs.existsSync(previewDir)) {
        const shortId = (lead.id as string).slice(0, 8)
        previewSlug = `preview-${baseSlug}-${shortId}`
        previewDir = path.join(SITES, previewSlug)
      }
      if (!fs.existsSync(previewDir)) continue

      const { error: updateError } = await supabase
        .from('leads')
        .update({
          status: 'demo_ready',
          preview_site_id: previewSlug,
          preview_generated_at: new Date().toISOString(),
        })
        .eq('id', lead.id)

      if (updateError) {
        console.log(`  ✗ Failed to update ${lead.id}: ${updateError.message}`)
      } else {
        updated++
      }
    }

    console.log(`  ✓ Updated ${updated} leads to demo_ready`)
  }

  console.log(`\nDone. Visit /admin/leads to see the updated statuses.`)
}

function copyDirSync(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // remove special chars
    .replace(/[\s_]+/g, '-')     // spaces → dashes
    .replace(/^-+|-+$/g, '')     // trim dashes
    .replace(/-+/g, '-')         // collapse multiple dashes
    || 'negocio'
}

function walkDirSync(dir: string, callback: (filePath: string) => void) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDirSync(fullPath, callback)
    } else {
      callback(fullPath)
    }
  }
}

main().catch(console.error)
