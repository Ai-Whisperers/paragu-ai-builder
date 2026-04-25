import { describe, it, expect } from 'vitest'
import { listSiteSlugs, loadSite, listPageSlugs } from '@/lib/engine/site-loader'
import { composeSitePage } from '@/lib/engine/compose-site'
import type { Locale } from '@/lib/i18n/routing'

/**
 * Global compose smoke test: every tenant's every page in every enabled
 * locale must compose without throwing. This is the cheap guard that
 * would have caught the promo-cartagena `promo-form` section-id typo
 * and the garantia `matrix` variant missing-tiers silent-null before
 * merge, not after.
 *
 * Cost: ~40ms per (site × locale × page). At 100+ tenants it still
 * runs in under 30 seconds because composeSitePage is pure in-memory.
 */
describe('all tenants — every page composes', () => {
  const slugs = listSiteSlugs()

  for (const slug of slugs) {
    const site = loadSite(slug)
    const pages = listPageSlugs(slug)
    if (pages.length === 0) continue

    describe(slug, () => {
      for (const locale of site.locales) {
        for (const pageSlug of pages) {
          const pathLabel = pageSlug === 'home' ? '/' : `/${pageSlug}`
          it(`[${locale}] ${pathLabel}`, () => {
            const resolved = composeSitePage({
              siteSlug: slug,
              locale: locale as Locale,
              pageSlug: pageSlug === 'home' ? '' : pageSlug,
            })
            expect(resolved.sections.length).toBeGreaterThan(0)
            for (const section of resolved.sections) {
              expect(section.id).toBeTruthy()
              expect(section.props).toBeDefined()
            }
          })
        }
      }
    })
  }
})
