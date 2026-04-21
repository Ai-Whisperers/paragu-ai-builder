import { ImageResponse } from 'next/og'
import { loadSite, loadSiteContent, loadSiteTokens } from '@/lib/engine/site-loader'
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

  // Prefer a pre-rendered brand OG card when the tenant ships one —
  // skips the dynamic render and lets designers own the composition.
  const manifest = loadImagesManifest(slug)
  const preRendered = resolveImage(manifest, 'brand.ogDefault')
  if (preRendered) {
    return new Response(null, {
      status: 302,
      headers: { Location: preRendered.src, 'Cache-Control': 'public, max-age=3600' },
    })
  }

  let siteName = slug
  let tagline = ''
  let primary = '#6366f1'
  let surface = '#0f172a'

  try {
    const site = loadSite(slug)
    const tokens = loadSiteTokens(slug) as {
      color?: { primary?: string; surface?: string; background?: string }
    }
    primary = tokens?.color?.primary || primary
    surface = tokens?.color?.background || tokens?.color?.surface || surface
    const content = loadSiteContent(slug, locale) as {
      siteName?: string
      tagline?: string
    }
    siteName = content.siteName || site.slug
    tagline = content.tagline || ''
  } catch {
    // Fall back to defaults — the OG still renders usefully.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: `linear-gradient(135deg, ${surface} 0%, ${primary} 100%)`,
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {siteName}
        </div>
        {tagline && (
          <div
            style={{
              display: 'flex',
              fontSize: 36,
              fontWeight: 500,
              opacity: 0.9,
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    ),
    size,
  )
}
