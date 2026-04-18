import { NextResponse } from 'next/server'
import { loadAllSlugs } from '@/lib/engine/data-loader'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
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

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('[Sitemap] Error:', error)
    return NextResponse.json({ error: 'Error generating sitemap' }, { status: 500 })
  }
}