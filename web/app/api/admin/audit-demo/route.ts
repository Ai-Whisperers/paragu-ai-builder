import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listSiteSlugs, loadSite, loadPage, listPageSlugs } from '@/lib/engine/site-loader'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface SiteHealth {
  slug: string
  exists: boolean
  hasPages: boolean
  pageCount: number
  isDemo: boolean
  issues: string[]
}

export async function GET() {
  try {
    const slugs = listSiteSlugs()
    const results: SiteHealth[] = []

    for (const slug of slugs) {
      const issues: string[] = []
      let exists = false
      let hasPages = false
      let pageCount = 0
      let isDemo = false

      try {
        const site = loadSite(slug)
        exists = true
        isDemo = Boolean((site as unknown as { is_demo?: boolean }).is_demo)

        const pageSlugs = listPageSlugs(slug)
        hasPages = pageSlugs.length > 0
        pageCount = pageSlugs.length

        if (pageSlugs.length === 0) {
          issues.push('no_pages_defined')
        }

        if (!site.locales || site.locales.length === 0) {
          issues.push('no_locales_defined')
        }

        if (!site.vertical) {
          issues.push('no_vertical_defined')
        }

        const missingHome = !pageSlugs.includes('home')
        if (missingHome && pageSlugs.length > 0) {
          const closest = pageSlugs[0]
          issues.push(`no_home_page_found_will_use_${closest}`)
        }
      } catch (err) {
        issues.push(`load_failed: ${err instanceof Error ? err.message : String(err)}`)
      }

      results.push({ slug, exists, hasPages, pageCount, isDemo, issues })
    }

    const demos = results.filter((r) => r.isDemo)
    const broken = results.filter((r) => r.issues.length > 0)
    const brokenDemos = demos.filter((r) => r.issues.length > 0)

    return NextResponse.json({
      totalSites: results.length,
      totalDemos: demos.length,
      sitesWithIssues: broken.length,
      demoSlugs: demos.map((d) => d.slug),
      demosWithIssues: brokenDemos.length,
      brokenDemos: brokenDemos.map((d) => ({ slug: d.slug, issues: d.issues })),
      allSites: results,
    })
  } catch (err) {
    logger.error('[audit-demo] failed', { error: String(err) })
    return NextResponse.json({ error: 'audit_failed' }, { status: 500 })
  }
}
