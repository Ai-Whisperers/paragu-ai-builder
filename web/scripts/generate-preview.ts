#!/usr/bin/env npx tsx
/**
 * Generate a preview of all demo business sites.
 * Runs composition for each demo business and outputs a summary.
 *
 * Usage:
 *   npx tsx scripts/generate-preview.ts
 *   npx tsx scripts/generate-preview.ts --type peluqueria
 */

import { resolve } from 'path'

process.chdir(resolve(__dirname, '..'))

async function main() {
  const args = process.argv.slice(2)
  const filterType = args.includes('--type') ? args[args.indexOf('--type') + 1] : undefined

  const { loadAllBusinesses } = await import('../lib/engine/data-loader')
  const { composePage } = await import('../lib/engine/compose')

  let businesses = await loadAllBusinesses()

  if (filterType) {
    businesses = businesses.filter(b => b.type === filterType)
  }

  console.log(`Generating previews for ${businesses.length} businesses...\n`)

  const results: Array<{
    slug: string
    name: string
    type: string
    sections: number
    meta: { title: string; description: string }
    status: 'ok' | 'error'
    error?: string
  }> = []

  for (const business of businesses) {
    try {
      const page = await composePage(business)
      results.push({
        slug: business.slug,
        name: business.name,
        type: business.type,
        sections: page.sections.length,
        meta: page.meta,
        status: 'ok',
      })
      console.log(`  ✓ /${business.slug} — ${business.name} (${business.type}, ${page.sections.length} sections)`)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({
        slug: business.slug,
        name: business.name,
        type: business.type,
        sections: 0,
        meta: { title: '', description: '' },
        status: 'error',
        error: message,
      })
      console.error(`  ✗ /${business.slug} — ${business.name}: ${message}`)
    }
  }

  const ok = results.filter(r => r.status === 'ok').length
  const errored = results.filter(r => r.status === 'error').length

  console.log(`\n${ok} succeeded, ${errored} failed out of ${results.length} total`)

  if (errored > 0) {
    process.exit(1)
  }
}

main().catch(err => {
  console.error('Preview generation failed:', err)
  process.exit(1)
})
