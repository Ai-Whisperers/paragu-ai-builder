import { NextResponse } from 'next/server'
import { loadAllSlugs } from '@/lib/engine/data-loader'
import { createRequestLogger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const log = createRequestLogger(request)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paragu-ai.builder'
  const pages = ['servicios', 'galeria', 'equipo', 'contacto']

  try {
    const slugs = await loadAllSlugs()

    const urls = slugs.flatMap((slug) => [
      `${baseUrl}/${slug}`,
      ...pages.map((page) => `${baseUrl}/${slug}/${page}`)
    ])

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

    log.debug('Sitemap generated', { slugCount: slugs.length, urlCount: urls.length })

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'x-request-id': log.requestId,
      },
    })
  } catch (error) {
    log.error('Sitemap generation failed', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Error generating sitemap', requestId: log.requestId },
      { status: 500, headers: { 'x-request-id': log.requestId } },
    )
  }
}