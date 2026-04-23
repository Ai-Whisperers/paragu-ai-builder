import { describe, it, expect } from 'vitest'
import { listPageSlugs } from '@/lib/engine/site-loader'

describe('superspuma sitemap coverage', () => {
  it('lists all 6 superspuma pages for sitemap generation', () => {
    const slugs = listPageSlugs('superspuma')
    expect(slugs).toEqual(
      expect.arrayContaining(['home', 'nosotros', 'tiendas', 'guias', 'garantia', 'promo-cartagena']),
    )
  })
})
