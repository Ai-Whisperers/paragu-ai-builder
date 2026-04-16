/**
 * Lead Import Script
 *
 * Reads priority leads from the paragu-ai-leads CSV and generates
 * BusinessData entries that can be used to create preview websites.
 *
 * Usage:
 *   npx tsx scripts/import-leads.ts [--limit N] [--type TYPE]
 *
 * Input:  ../data/processed/paraguay_priority_a.csv (from paragu-ai-leads repo)
 * Output: lib/engine/lead-data.ts (auto-generated module)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

interface LeadRow {
  name: string
  type: string
  city: string
  phone: string
  address?: string
  neighborhood?: string
  rating?: string
  reviews?: string
}

const TYPE_MAP: Record<string, string> = {
  'hair salon': 'peluqueria',
  'beauty salon': 'salon_belleza',
  'peluqueria': 'peluqueria',
  'salon de belleza': 'salon_belleza',
  'gym': 'gimnasio',
  'gimnasio': 'gimnasio',
  'fitness': 'gimnasio',
  'spa': 'spa',
  'nail salon': 'unas',
  'unas': 'unas',
  'tattoo': 'tatuajes',
  'tatuajes': 'tatuajes',
  'barbershop': 'barberia',
  'barberia': 'barberia',
  'aesthetics': 'estetica',
  'estetica': 'estetica',
  'makeup': 'maquillaje',
  'maquillaje': 'maquillaje',
  'hair removal': 'depilacion',
  'depilacion': 'depilacion',
  'lashes': 'pestanas',
  'pestanas': 'pestanas',
}

function generateSlug(name: string, city: string): string {
  return `${name}-${city}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function parseCSV(content: string): LeadRow[] {
  const lines = content.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''))
  const rows: LeadRow[] = []

  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parsing (handles quoted fields with commas)
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      if (idx < values.length) row[h] = values[idx]
    })

    if (row.name && row.city) {
      rows.push({
        name: row.name,
        type: row.type || row.category || 'peluqueria',
        city: row.city,
        phone: row.phone || row.telefono || '',
        address: row.address || row.direccion || undefined,
        neighborhood: row.neighborhood || row.barrio || undefined,
        rating: row.rating || undefined,
        reviews: row.reviews || row.review_count || undefined,
      })
    }
  }

  return rows
}

function main() {
  const args = process.argv.slice(2)
  let limit = 50
  let typeFilter = ''

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1], 10)
      i++
    }
    if (args[i] === '--type' && args[i + 1]) {
      typeFilter = args[i + 1]
      i++
    }
  }

  // Try multiple possible CSV locations
  const csvPaths = [
    resolve(__dirname, '../../../paragu-ai-leads/data/processed/paraguay_priority_a.csv'),
    resolve(__dirname, '../../data/processed/paraguay_priority_a.csv'),
    resolve(process.cwd(), '../paragu-ai-leads/data/processed/paraguay_priority_a.csv'),
  ]

  let csvContent = ''
  let csvPath = ''

  for (const p of csvPaths) {
    if (existsSync(p)) {
      csvContent = readFileSync(p, 'utf-8')
      csvPath = p
      break
    }
  }

  if (!csvContent) {
    console.error('[import-leads] CSV file not found. Tried:')
    csvPaths.forEach((p) => console.error(`  - ${p}`))
    console.error('\nMake sure the paragu-ai-leads repo is cloned alongside this project.')
    process.exit(1)
  }

  console.log(`[import-leads] Reading from: ${csvPath}`)

  const leads = parseCSV(csvContent)
  console.log(`[import-leads] Parsed ${leads.length} leads from CSV`)

  // Filter by type if specified
  let filtered = leads
  if (typeFilter) {
    filtered = leads.filter((l) => {
      const mapped = TYPE_MAP[l.type.toLowerCase()] || l.type.toLowerCase()
      return mapped === typeFilter
    })
    console.log(`[import-leads] Filtered to ${filtered.length} leads of type "${typeFilter}"`)
  }

  // Limit
  const selected = filtered.slice(0, limit)
  console.log(`[import-leads] Generating ${selected.length} business entries`)

  // Build output
  const businesses: Record<string, unknown> = {}
  const seenSlugs = new Set<string>()

  for (const lead of selected) {
    const mappedType = TYPE_MAP[lead.type.toLowerCase()] || 'peluqueria'
    let slug = generateSlug(lead.name, lead.city)

    // Ensure unique slug
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
    }
    seenSlugs.add(slug)

    businesses[slug] = {
      name: lead.name,
      slug,
      type: mappedType,
      city: lead.city,
      neighborhood: lead.neighborhood || undefined,
      address: lead.address || undefined,
      phone: lead.phone || undefined,
      whatsapp: lead.phone || undefined,
    }
  }

  // Write output file
  const outputPath = resolve(__dirname, '../lib/engine/lead-data.ts')
  const output = `/**
 * AUTO-GENERATED by scripts/import-leads.ts
 * Do not edit manually.
 *
 * Generated: ${new Date().toISOString()}
 * Source: ${csvPath}
 * Count: ${Object.keys(businesses).length}
 */

import type { BusinessData } from './compose'

export const LEAD_BUSINESSES: Record<string, BusinessData> = ${JSON.stringify(businesses, null, 2)} as unknown as Record<string, BusinessData>
`

  writeFileSync(outputPath, output)
  console.log(`[import-leads] Written ${Object.keys(businesses).length} businesses to ${outputPath}`)
  console.log('[import-leads] Done!')
}

main()
