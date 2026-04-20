/**
 * Emit a <link rel="preload" as="image"> for the LCP hero asset.
 * Call this from the page head with the tenant's hero image URL so the
 * browser starts fetching the LCP asset in parallel with HTML parsing.
 *
 * Usage (in `app/[business]/page.tsx` or site renderer):
 *
 *   const preload = buildLcpPreloadTags(page.heroImage)
 *   <head>{preload}</head>
 */

export interface LcpPreloadInput {
  heroImage?: string
  heroImageMobile?: string
}

export function buildLcpPreloadTags(input: LcpPreloadInput): Array<{
  rel: 'preload'
  as: 'image'
  href: string
  media?: string
  fetchPriority: 'high'
  imageSrcSet?: string
}> {
  const tags: Array<{
    rel: 'preload'
    as: 'image'
    href: string
    media?: string
    fetchPriority: 'high'
    imageSrcSet?: string
  }> = []
  if (input.heroImage) {
    tags.push({ rel: 'preload', as: 'image', href: input.heroImage, fetchPriority: 'high' })
  }
  if (input.heroImageMobile && input.heroImageMobile !== input.heroImage) {
    tags.push({
      rel: 'preload',
      as: 'image',
      href: input.heroImageMobile,
      media: '(max-width: 768px)',
      fetchPriority: 'high',
    })
  }
  return tags
}
