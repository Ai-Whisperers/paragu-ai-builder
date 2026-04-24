#!/usr/bin/env -3

import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const SECTION_CATEGORIES: Record<string, string> = {
  'age-gate': 'Other',
  'b2b-wholesale': 'Other',
  'before-after': 'Content & Media',
  'before-after-split': 'Content & Media',
  'blog-index': 'Content & Media',
  'blog-post': 'Content & Media',
  'blog-section': 'Content & Media',
  'blog-social-share': 'Content & Media',
  'booking': 'Booking & Scheduling',
  'booking-embed': 'Booking internals',
  'bulk-calculator': 'Calculators & Tools',
  'calc-aguinaldo': 'Calculators & Tools',
  'calc-costo-empleado': 'Calculators & Tools',
  'calc-finiquito': 'Calculators & Tools',
  'calc-ips': 'Calculators & Tools',
  'calc-ire': 'Calculators & Tools',
  'calc-irp': 'Calculators & Tools',
  'calc-iva': 'Calculators & Tools',
  'calc-resimple-qualifier': 'Calculators & Tools',
  'class-schedule': 'Booking & Scheduling',
  'commerce-catalog': 'Pricing & Commerce',
  'compliance-disclaimer-footer': 'Compliance',
  'conveyor-belt': 'Other',
  'conveyor-belt-strip': 'Other',
  'contact': 'Forms & Lead Capture',
  'contact-strip': 'Forms & Lead Capture',
  'countdown-timer': 'Status & Real-time',
  'cta-banner': 'Hero & Landing',
  'currency-toggle': 'Pricing & Commerce',
  'delivery-calculator': 'Calculators & Tools',
  'delivery-slot-picker': 'Booking & Scheduling',
  'emergency-indicator': 'Status & Real-time',
  'enhanced-faq': 'FAQ & Info',
  'event-venues': 'Real Estate & Hospitality',
  'faq': 'FAQ & Info',
  'faq-categorized': 'FAQ & Info',
  'faq-chatbot': 'FAQ & Info',
  'features': 'Features & Services',
  'footer': 'Navigation & Layout',
  'gallery': 'Content & Media',
  'google-reviews-widget': 'Trust & Social Proof',
  'header': 'Navigation & Layout',
  'hero': 'Hero & Landing',
  'illustration': 'Other',
  'instagram-feed': 'Other',
  'intake-questionnaire': 'Forms & Lead Capture',
  'intake-wizard': 'Forms & Lead Capture',
  'language-selector': 'Navigation & Layout',
  'landing': 'Hero & Landing',
  'lead-form': 'Forms & Lead Capture',
  'mattress-quiz': 'Other',
  'maturity-assessment': 'Other',
  'membership-plans': 'Pricing & Commerce',
  'menu-categorized-priced': 'Food & Menu',
  'mortgage-calculator': 'Calculators & Tools',
  'multi-step-form': 'Forms & Lead Capture',
  'newsletter-signup': 'Forms & Lead Capture',
  'omakase': 'Food & Menu',
  'open-hours-status': 'Status & Real-time',
  'our-story': 'Other',
  'packages': 'Other',
  'photo-gallery': 'Content & Media',
  'portfolio': 'Content & Media',
  'preorder-calendar': 'Booking & Scheduling',
  'price-list': 'Pricing & Commerce',
  'pricing-range': 'Pricing & Commerce',
  'pricing-table': 'Pricing & Commerce',
  'process': 'Features & Services',
  'process-timeline': 'Features & Services',
  'product-catalog': 'Pricing & Commerce',
  'programs-comparison': 'Features & Services',
  'property-listings': 'Real Estate & Hospitality',
  'quote-form': 'Forms & Lead Capture',
  'recipe': 'Food & Menu',
  'referral': 'Trust & Social Proof',
  'regulatory-status-badge': 'Compliance',
  'reviews': 'Trust & Social Proof',
  'room-booking': 'Booking & Scheduling',
  'sake-menu': 'Food & Menu',
  'sake-menu-sections': 'Food & Menu',
  'sample-week-preview': 'Booking & Scheduling',
  'savings-calculator': 'Calculators & Tools',
  'service-area-map-zones': 'Other',
  'services': 'Features & Services',
  'smart-whatsapp': 'Navigation & Layout',
  'stock-indicator': 'Status & Real-time',
  'subscription': 'Pricing & Commerce',
  'success-stories': 'Trust & Social Proof',
  'team': 'Trust & Social Proof',
  'testimonial-video': 'Trust & Social Proof',
  'testimonials': 'Trust & Social Proof',
  'tiered-service-ladder': 'Features & Services',
  'timeline-history': 'Features & Services',
  'trust-badges': 'Trust & Social Proof',
  'trust-signals-logos': 'Trust & Social Proof',
  'trust-signals': 'Trust & Social Proof',
  'weekly-attendance-calendar': 'Booking & Scheduling',
  'weekly-schedule': 'Booking & Scheduling',
  'whatsapp-float': 'Navigation & Layout',
  'why-destination': 'Features & Services',
}

function getSectionId(filename: string): string {
  return filename.replace(/-section\.tsx$/, '')
}

function categorizeSection(sectionId: string): string {
  return SECTION_CATEGORIES[sectionId] || 'Other'
}

function extractPropsInterface(filePath: string): string | undefined {
  try {
    const content = readFileSync(filePath, 'utf-8')
    const propsMatch = content.match(/export\s+(?:const|function|interface|type)\s+(\w+)\s+Props/gs)
    return propsMatch ? propsMatch[1] : undefined
  } catch {
    return undefined
  }
}

function generateSectionsMarkdown(sections: any[]): string {
  let markdown = '# Section Component Reference\n\n'
  markdown += 'Every section in \`web/components/sections/\` is listed here. Sections are building blocks tenants compose into pages via \`sites/<slug>/pages/*.json\`. All are referenced by **kebab-case id** in tenant JSON; the renderer normalizes camelCase aliases for backwards compatibility (see \`resolveSectionAlias\` in \`web/lib/engine/section-registry.ts\`).\n\n'
  markdown += '\n**Total: ' + sections.length + ' sections** across functional groups. Every section is theme-driven (\`var(--*)\` tokens only), Server Component by default unless interactive.\n\n'
  markdown += '\nSee [ARCHITECTURE.md § request lifecycle](../../ARCHITECTURE.md#3-request-lifecycle) for where sections fit in the pipeline.\n\n'
  markdown += '---\n\n'

  const grouped: Record<string, any[]> = {}
  for (const section of sections) {
    const category = categorizeSection(section.id)
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(section)
  }

  const order = ['Navigation & Layout', 'Hero & Landing', 'Features & Services', 'Pricing & Commerce', 'Booking & Scheduling', 'Calculators & Tools', 'Forms & Lead Capture', 'Content & Media', 'Trust & Social Proof', 'Status & Real-time', 'Food & Menu', 'FAQ & Info', 'Real Estate & Hospitality', 'Compliance', 'Booking internals', 'Other']
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const idxA = order.indexOf(a)
    const idxB = order.indexOf(b)
    if (idxA === -1 && idxB === -1) return a.localeCompare(b)
    if (idxA === -1) return 1
    if (idxB === -1) return -1
    return idxA - idxB
  })

  for (const category of sortedCategories) {
    if (!grouped[category]) continue

    markdown += '## ' + category + '\n\n'
    markdown += '| Id | File | Purpose |\n'
    markdown += '|---|---|---|\n'

    const categorySections = grouped[category].sort((a, b) => a.id.localeCompare(b.id))
    for (const section of categorySections) {
      const propsNote = section.props ? 'Props: \`' + section.props + '\`' : ''
      markdown += '| \`' + section.id + '\` | \`' + section.file + '\` | ' + section.purpose + ' |' + propsNote + '\n'
    }
    markdown += '\n'
  }

  markdown += '---\n\n'
  markdown += '## Conventions\n\n'
  markdown += '- **Section id**: kebab-case, matches registered key in \`section-registry.ts\`.\n'
  markdown += '- **File**: \`web/components/sections/<id>-section.tsx\` (except when a file exports multiple sections, e.g., \`sushi-menu-sections.tsx\` → \`featured-menu\` + \`full-menu\`).\n'
  markdown += '- **Props**: each section exports a typed Props interface; the renderer passes \`section.data\` as props.\n'
  markdown += '- **Tokens**: components consume \`var(--primary)\`, \`var(--surface)\`, etc. — never hardcoded colors.\n'

  markdown += '---\n\n'
  markdown += '## Adding a new section\n\n'
  markdown += '1. Create \`web/components/sections/<kebab-name>-section.tsx\` with a typed Props interface.\n'
  markdown += '2. Import + register in \`web/lib/engine/section-registry.ts\`:\n'
  markdown += '```tsx\n'
  markdown += "import { NewSection } from '@/components/sections/new-section'\n"
  markdown += '// …\n'
  markdown += '```\n'
  markdown += '3. Add an entry to this file with one-line purpose.\n'
  markdown += '4. Snapshot or component test under \`web/tests/unit/components/\`.\n'
  markdown += '5. If the section is vertical-specific, add it to the relevant \`src/verticals/<vertical>/vertical.json\` and any business types that use it.\n'
  markdown += '\n'
  markdown += 'See [CONTRIBUTING.md § Adding sections](../../CONTRIBUTING.md#adding-sections).\n'

  markdown += '---\n\n'
  markdown += '_Last generated: ' + new Date().toISOString() + ' — Auto-generated from actual section files._\n'

  return markdown
}

function main() {
  const sectionsDir = join(process.cwd(), 'web', 'components', 'sections')
  const files = readdirSync(sectionsDir)
    .filter((f: string) => f.endsWith('-section.tsx') && !f.startsWith('.'))

  const sections: any[] = []
  for (const file of files) {
    const id = getSectionId(file)
    const filePath = join(sectionsDir, file)
    const props = extractPropsInterface(filePath)

    sections.push({ id, file, purpose: SECTION_CATEGORIES[id] || 'See component', props })
  }

  const markdown = generateSectionsMarkdown(sections)

  const outputPath = join(process.cwd(), 'docs', 'reference', 'SECTIONS.md')
  writeFileSync(outputPath, markdown, 'utf-8')

  console.log('Generated ' + sections.length + ' section entries to ' + outputPath)
}

main()
