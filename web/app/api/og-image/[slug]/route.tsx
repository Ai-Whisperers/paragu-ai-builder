/**
 * GET /api/og-image/:slug — dynamic Open Graph image per tenant.
 *
 * Uses Next.js's ImageResponse (Satori) to render a 1200×630 preview with the
 * tenant name + tagline loaded from site.json. Cached at the edge for 24h.
 */

import { ImageResponse } from 'next/og'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export const runtime = 'nodejs'

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const sitePath = resolve(process.cwd(), '..', 'sites', slug, 'site.json')

  let title = slug
  let tagline = ''
  let primaryColor = '#1B2A4A'

  if (existsSync(sitePath)) {
    try {
      const site = JSON.parse(readFileSync(sitePath, 'utf-8')) as {
        vertical?: string
        businessType?: string
        domain?: string
      }
      title = site.domain || slug
      tagline = site.vertical || site.businessType || ''
    } catch {
      // keep defaults
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: primaryColor,
          color: 'white',
          fontFamily: 'system-ui',
          padding: 80,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>{title}</div>
        {tagline && (
          <div style={{ fontSize: 32, opacity: 0.8, marginTop: 24 }}>{tagline}</div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    },
  )
}
