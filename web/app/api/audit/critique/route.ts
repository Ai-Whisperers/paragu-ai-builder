import { NextResponse } from 'next/server'
import { listSiteSlugs } from '@/lib/engine/site-loader'
import { analyzeSectionUsage, generateContentGaps } from '@/lib/audit/section-analyzer'
import { generateCritique, generateCrossSiteAnalysis } from '@/lib/audit/critique-engine'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const specificSlug = searchParams.get('slug')
    const slugs = specificSlug ? [specificSlug] : listSiteSlugs()

    const critiques = []
    for (const slug of slugs) {
      try {
        const report = analyzeSectionUsage(slug)
        const gaps = generateContentGaps(report)
        const critique = generateCritique(report, gaps)
        critiques.push(critique)
      } catch (err) {
        logger.warn('[audit:critique] skipped site', { slug, error: String(err) })
      }
    }

    const crossSite = slugs.length > 1 ? generateCrossSiteAnalysis(critiques) : null

    const demos = critiques.filter((c) => c.slug.startsWith('demo-') || c.slug.startsWith('preview-'))
    const real = critiques.filter((c) => !c.slug.startsWith('demo-') && !c.slug.startsWith('preview-'))

    return NextResponse.json({
      siteCount: critiques.length,
      demoCount: demos.length,
      realCount: real.length,
      avgDemoScore: demos.length > 0 ? Math.round(demos.reduce((s, c) => s + c.score, 0) / demos.length) : 0,
      avgRealScore: real.length > 0 ? Math.round(real.reduce((s, c) => s + c.score, 0) / real.length) : 0,
      crossSiteAnalysis: crossSite,
      critiques,
    })
  } catch (err) {
    logger.error('[audit:critique] failed', { error: String(err) })
    return NextResponse.json({ error: 'critique_failed' }, { status: 500 })
  }
}
