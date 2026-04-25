/**
 * Tenant Twitter card image.
 *
 * When the tenant ships a `brand.twitterCard` asset we redirect to it.
 * Otherwise we fall back to the tenant's dynamic Open Graph card so we
 * never return a broken image to Twitter.
 */
import { loadImagesManifest, resolveImage } from '@/lib/engine/images-loader'
import { isLocale } from '@/lib/i18n/config'

export const runtime = 'nodejs'
export const alt = 'Tenant website'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; site: string }>
}) {
  const { locale, site: slug } = await params
  if (!isLocale(locale)) {
    return new Response('Not found', { status: 404 })
  }

  const manifest = loadImagesManifest(slug)
  const preRendered =
    resolveImage(manifest, 'brand.twitterCard') ??
    resolveImage(manifest, 'brand.ogDefault')
  if (preRendered) {
    return new Response(null, {
      status: 302,
      headers: { Location: preRendered.src, 'Cache-Control': 'public, max-age=3600' },
    })
  }

  // Fall back to the tenant's dynamic OG card so social previews still
  // show the tenant's name / tagline rather than the platform logo.
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/s/${locale}/${slug}/opengraph-image`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
