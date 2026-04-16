#!/usr/bin/env npx tsx
/**
 * Generate a site for a specific business from its data.
 *
 * Usage:
 *   npx tsx scripts/generate-site.ts <slug>
 *   npx tsx scripts/generate-site.ts salon-maria --palette optionB
 *
 * This runs the composition engine and outputs the composed page JSON,
 * useful for debugging the generation pipeline without starting the dev server.
 */

import { resolve } from 'path'

// Set cwd to web/ parent so token/registry loading works
process.chdir(resolve(__dirname, '..'))

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage: npx tsx scripts/generate-site.ts <slug> [options]

Options:
  --palette <id>    Override default palette (e.g., optionA, optionB)
  --sections        Show section list only
  --theme           Show theme CSS only
  --meta            Show SEO metadata only
  --help            Show this help
`)
    process.exit(0)
  }

  const slug = args[0]
  const showSections = args.includes('--sections')
  const showTheme = args.includes('--theme')
  const showMeta = args.includes('--meta')

  // Dynamic import to let cwd take effect
  const { loadBusiness } = await import('../lib/engine/data-loader')
  const { composePage } = await import('../lib/engine/compose')

  const business = await loadBusiness(slug)
  if (!business) {
    console.error(`Business not found: "${slug}"`)
    console.error('Available demo slugs: salon-maria, gymfit-py, spa-serenidad')
    process.exit(1)
  }

  console.error(`Composing site for: ${business.name} (${business.type})`)
  const page = composePage(business)

  if (showSections) {
    console.log(JSON.stringify(page.sections.map(s => ({ type: s.type, order: s.order })), null, 2))
  } else if (showTheme) {
    console.log(page.theme.cssString)
  } else if (showMeta) {
    console.log(JSON.stringify(page.meta, null, 2))
  } else {
    console.log(JSON.stringify({
      business: { name: page.business.name, slug: page.business.slug, type: page.business.type },
      meta: page.meta,
      sectionCount: page.sections.length,
      sections: page.sections.map(s => ({ type: s.type, order: s.order, dataKeys: Object.keys(s.data) })),
      theme: { isDark: page.theme.isDark, googleFontsUrl: page.theme.googleFontsUrl },
    }, null, 2))
  }

  console.error(`\nGenerated ${page.sections.length} sections for "${business.name}"`)
}

main().catch(err => {
  console.error('Generation failed:', err)
  process.exit(1)
})
