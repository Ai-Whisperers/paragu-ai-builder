import { loadSite, loadPage, listPageSlugs } from '@/lib/engine/site-loader'
import { allSectionIds } from '@/lib/engine/section-registry'
import { loadVertical } from '@/lib/engine/site-loader'

export interface SectionUsageReport {
  slug: string
  isDemo: boolean
  vertical: string
  usedSections: string[]
  allowedSections: string[]
  missingSections: string[]
  unexpectedSections: string[]
  sectionCount: number
  uniqueVariants: string[]
  coverage: number
}

export function analyzeSectionUsage(slug: string): SectionUsageReport {
  const site = loadSite(slug)
  const isDemo = Boolean((site as unknown as { is_demo?: boolean }).is_demo)
  const pageSlugs = listPageSlugs(slug)
  const allSections = allSectionIds()

  const usedSet = new Set<string>()
  const variants: string[] = []

  for (const pageSlug of pageSlugs) {
    const page = loadPage(slug, pageSlug)
    if (!page) continue
    for (const section of page.sections) {
      usedSet.add(section.id)
      if (section.variant) variants.push(section.variant)
    }
  }

  let vertical: string | undefined
  try { vertical = site.vertical } catch {}

  let allowedSections: string[] = []
  if (vertical) {
    try {
      const vertDef = loadVertical(vertical)
      allowedSections = vertDef.allowedSections ?? []
    } catch {}
  }

  const used = [...usedSet]
  const missing = allowedSections.filter((s) => !usedSet.has(s))
  const unexpected = used.filter((s) => allowedSections.length > 0 && !allowedSections.includes(s))
  const allowed = allowedSections.length > 0 ? allowedSections.length : allSections.length
  const coverage = allowed > 0 ? Math.round((used.filter((s) => !allowedSections.length || allowedSections.includes(s)).length / allowed) * 100) : 0

  return {
    slug, isDemo, vertical: vertical || 'unknown',
    usedSections: used, allowedSections,
    missingSections: missing,
    unexpectedSections: unexpected,
    sectionCount: used.length,
    uniqueVariants: [...new Set(variants)],
    coverage,
  }
}

export function analyzeAllDemos(): SectionUsageReport[] {
  const slugs = listPageSlugs as unknown as (slug: string) => string[]
  const allSlugs = Object.keys(require('@/lib/engine/site-loader').SITES || {})
  return allSlugs.filter((s) => s.startsWith('demo-') || s.startsWith('preview-')).map(analyzeSectionUsage)
}

export interface ContentGap {
  section: string
  severity: 'high' | 'medium' | 'low'
  message: string
  suggestion: string
}

export function generateContentGaps(report: SectionUsageReport): ContentGap[] {
  const gaps: ContentGap[] = []
  const { vertical, usedSections, missingSections } = report

  const RECOMMENDED_BY_VERTICAL: Record<string, string[]> = {
    'beauty-personal-care': ['before-after', 'portfolio', 'team', 'instagram-feed'],
    'food-beverage': ['menu-categorized-priced', 'reservation-form', 'daily-menu'],
    'health-wellness': ['doctor-profile', 'insurance-accepted', 'telemedicine-banner'],
    'automotive': ['vehicle-listing', 'service-scheduler', 'part-finder'],
    'trades-home-services': ['quote-form', 'service-area-map-zones', 'emergency-indicator'],
    'pets-animals': ['pet-profile', 'vet-services', 'adoption-form'],
    'education-training': ['course-catalog', 'class-enrollment', 'instructor-profile'],
    'real-estate-relocation': ['property-listings', 'property-search', 'agent-profile'],
    'sports-recreation': ['class-schedule', 'membership-plans', 'event-calendar'],
  }

  const recommended = RECOMMENDED_BY_VERTICAL[vertical] || []
  for (const section of missingSections) {
    const isRecommended = recommended.includes(section)
    gaps.push({
      section,
      severity: isRecommended ? 'high' : 'medium',
      message: isRecommended
        ? `Section "${section}" is recommended for ${vertical} sites but not used`
        : `Section "${section}" is in the allowed list but not used on any page`,
      suggestion: `Add a "${section}" section to one of the pages in the site config`,
    })
  }

  for (const section of report.unexpectedSections) {
    gaps.push({
      section,
      severity: 'low',
      message: `Section "${section}" is used but not in the allowed list for ${vertical}`,
      suggestion: `Either add "${section}" to the vertical's allowedSections or remove it from page configs`,
    })
  }

  return gaps
}
