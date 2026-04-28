import { createClient } from '@/lib/supabase/server'
import { listSiteSlugs, loadSite, listPageSlugs, loadSiteContent } from '@/lib/engine/site-loader'
import { logger } from '@/lib/logger'

interface SiteQuality {
  slug: string
  isDemo: boolean
  vertical: string
  pageCount: number
  hasContent: boolean
  contentFieldCount: number
  hasImages: boolean
  imageCount: number
  hasTestimonials: boolean
  testimonialCount: number
  hasServices: boolean
  serviceCount: number
  hasTeam: boolean
  teamCount: number
  contentDepth: number
  score: number
}

async function analyze() {
  const slugs = listSiteSlugs()
  const results: SiteQuality[] = []

  for (const slug of slugs) {
    const site = loadSite(slug)
    const isDemo = Boolean((site as unknown as { is_demo?: boolean }).is_demo)
    const pageSlugs = listPageSlugs(slug)

    let contentFieldCount = 0
    let hasContent = false

    for (const locale of site.locales) {
      const content = loadSiteContent(slug, locale)
      const fields = Object.keys(content)
      if (fields.length > 0) {
        hasContent = true
        contentFieldCount = Math.max(contentFieldCount, fields.length)
      }
    }

    const content = loadSiteContent(slug, site.defaultLocale)
    const rawContent = content as Record<string, unknown>
    const services = (rawContent.services as unknown[]) || (rawContent.servicios as unknown[]) || []
    const testimonials = (rawContent.testimonials as unknown[]) || (rawContent.testimonios as unknown[]) || []
    const team = (rawContent.team as unknown[]) || (rawContent.equipo as unknown[]) || []

    let imageCount = 0
    try {
      const { loadImagesManifest } = await import('@/lib/engine/images-loader')
      const manifest = loadImagesManifest(slug)
      imageCount = manifest?.images?.length ?? 0
    } catch {}

    // Content depth: average field value length + number of nested objects
    let contentDepth = 0
    for (const [, val] of Object.entries(rawContent)) {
      if (typeof val === 'string') contentDepth += val.length
      else if (Array.isArray(val)) contentDepth += val.length * 20
      else if (typeof val === 'object' && val) contentDepth += Object.keys(val as Record<string, unknown>).length * 10
    }

    // Quality score: 0-100 based on content richness
    let score = 0
    if (pageCount >= 2) score += 10
    if (pageCount >= 4) score += 10
    if (hasContent) score += 10
    if (contentFieldCount >= 10) score += 10
    if (contentFieldCount >= 20) score += 10
    if (services.length >= 3) score += 10
    if (testimonials.length >= 2) score += 10
    if (team.length >= 1) score += 10
    if (imageCount >= 3) score += 10
    if (imageCount >= 10) score += 10

    results.push({
      slug, isDemo, vertical: site.vertical,
      pageCount, hasContent, contentFieldCount,
      hasImages: imageCount > 0, imageCount,
      hasTestimonials: testimonials.length > 0, testimonialCount: testimonials.length,
      hasServices: services.length > 0, serviceCount: services.length,
      hasTeam: team.length > 0, teamCount: team.length,
      contentDepth, score,
    })
  }

  const demos = results.filter((r) => r.isDemo)
  const real = results.filter((r) => !r.isDemo)

  const avg = (arr: SiteQuality[], key: keyof SiteQuality): number =>
    Math.round(arr.reduce((s, r) => s + (typeof r[key] === 'number' ? (r[key] as number) : 0), 0) / Math.max(arr.length, 1) * 10) / 10

  console.log('\n=== SITE QUALITY COMPARISON ===\n')
  console.log(`Demos: ${demos.length} sites`)
  console.log(`Real tenants: ${real.length} sites\n`)

  console.log('--- Averages ---')
  console.log(`Pages:          Demo: ${avg(demos, 'pageCount')}  |  Real: ${avg(real, 'pageCount')}`)
  console.log(`Content fields: Demo: ${avg(demos, 'contentFieldCount')}  |  Real: ${avg(real, 'contentFieldCount')}`)
  console.log(`Services:       Demo: ${avg(demos, 'serviceCount')}  |  Real: ${avg(real, 'serviceCount')}`)
  console.log(`Testimonials:   Demo: ${avg(demos, 'testimonialCount')}  |  Real: ${avg(real, 'testimonialCount')}`)
  console.log(`Team members:   Demo: ${avg(demos, 'teamCount')}  |  Real: ${avg(real, 'teamCount')}`)
  console.log(`Images:         Demo: ${avg(demos, 'imageCount')}  |  Real: ${avg(real, 'imageCount')}`)
  console.log(`Quality score:  Demo: ${avg(demos, 'score')}/100  |  Real: ${avg(real, 'score')}/100\n`)

  console.log('--- Demos sorted by quality score (worst first) ---')
  const sortedDemos = [...demos].sort((a, b) => a.score - b.score)
  for (const d of sortedDemos.slice(0, 10)) {
    const issues: string[] = []
    if (d.serviceCount === 0) issues.push('no services')
    if (d.testimonialCount === 0) issues.push('no testimonials')
    if (d.teamCount === 0) issues.push('no team')
    if (!d.hasImages) issues.push('no images')
    if (d.pageCount < 3) issues.push(`only ${d.pageCount} pages`)
    console.log(`  ${d.slug}: ${d.score}/100 — ${issues.join(', ') || 'ok'}`)
  }

  console.log('\n--- Quality gap: Real vs Demo ---')
  const realAvg = avg(real, 'score')
  const demoAvg = avg(demos, 'score')
  const gap = realAvg - demoAvg
  console.log(`Real tenant avg score: ${realAvg}/100`)
  console.log(`Demo avg score:       ${demoAvg}/100`)
  console.log(`Quality gap:          ${gap > 0 ? '+' : ''}${gap} points ${gap > 0 ? '(demos need improvement)' : '(demos are on par)'}`)

  const avgDiff = <K extends keyof SiteQuality>(key: K, label: string) => {
    const r = real.length > 0 ? real.reduce((s, x) => s + (typeof x[key] === 'number' ? (x[key] as number) : 0), 0) / real.length : 0
    const d = demos.length > 0 ? demos.reduce((s, x) => s + (typeof x[key] === 'number' ? (x[key] as number) : 0), 0) / demos.length : 0
    const diff = r - d
    if (Math.abs(diff) > 0.5) {
      console.log(`  ${label}: ${diff > 0 ? '+' : ''}${diff.toFixed(1)} (real higher)`)
    }
  }

  console.log('\n--- Key differences ---')
  avgDiff('pageCount', 'Pages')
  avgDiff('contentFieldCount', 'Content fields')
  avgDiff('serviceCount', 'Services')
  avgDiff('imageCount', 'Images')
}

analyze().catch((err) => {
  logger.error('[demo-quality-compare] failed', { error: String(err) })
  process.exit(1)
})
