/**
 * Per-tenant PWA manifest.
 *
 * Uses the tenant's images manifest for icons when available. Falls back
 * to a minimal usable manifest otherwise so the route never 500s.
 *
 * Served from `/s/[locale]/[site]/manifest.webmanifest` — referenced by
 * `generateMetadata` on the catch-all page.
 */
import { loadSite, loadSiteContent, loadSiteTokens } from '@/lib/engine/site-loader'
import { loadImagesManifest, resolveImage } from '@/lib/engine/images-loader'
import { isLocale, type Locale } from '@/lib/i18n/config'

export const runtime = 'nodejs'

interface ManifestIcon {
  src: string
  sizes: string
  type: string
  purpose?: string
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; site: string }> },
) {
  const { locale, site: slug } = await params
  if (!isLocale(locale)) {
    return new Response('Not found', { status: 404 })
  }

  let name = slug
  let shortName = slug
  let description = ''
  let themeColor = '#0f172a'
  let backgroundColor = '#ffffff'
  try {
    const site = loadSite(slug)
    const content = loadSiteContent(slug, locale as Locale) as {
      siteName?: string
      tagline?: string
    }
    name = content.siteName || site.slug
    shortName = (content.siteName || site.slug).slice(0, 12)
    description = content.tagline || ''
    const tokens = loadSiteTokens(slug) as {
      color?: { primary?: string; surface?: string; background?: string }
    }
    themeColor = tokens?.color?.primary || themeColor
    backgroundColor = tokens?.color?.background || backgroundColor
  } catch {
    // Fall back to defaults.
  }

  const manifest = loadImagesManifest(slug)
  const icons: ManifestIcon[] = []
  const favicon = resolveImage(manifest, 'brand.favicon')
  const apple = resolveImage(manifest, 'brand.appleTouchIcon')
  const maskable = resolveImage(manifest, 'brand.maskable')
  if (favicon) icons.push({ src: favicon.src, sizes: '32x32', type: 'image/png' })
  if (apple) icons.push({ src: apple.src, sizes: '180x180', type: 'image/png' })
  if (maskable)
    icons.push({ src: maskable.src, sizes: '512x512', type: 'image/png', purpose: 'maskable' })

  const body = {
    name,
    short_name: shortName,
    description,
    start_url: `/s/${locale}/${slug}`,
    scope: `/s/${locale}/${slug}`,
    display: 'standalone',
    theme_color: themeColor,
    background_color: backgroundColor,
    lang: locale,
    icons,
  }

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
