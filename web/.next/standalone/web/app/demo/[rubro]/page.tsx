import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { composeSitePage } from '@/lib/engine/compose-site'
import { renderPage } from '@/lib/engine/site-renderer'
import { listSiteSlugs } from '@/lib/engine/site-loader'
import { jsonLdForPage } from '@/lib/engine/schema-org'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

interface Props {
  params: Promise<{ rubro: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  return listSiteSlugs()
    .filter((slug) => slug.startsWith('demo-'))
    .map((slug) => ({ rubro: slug.slice('demo-'.length) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rubro } = await params
  const siteSlug = `demo-${rubro}`
  try {
    const composed = composeSitePage({ siteSlug, locale: 'es', pageSlug: 'home' })
    return {
      title: composed.meta.title,
      description: composed.meta.description,
      alternates: { canonical: `/demo/${rubro}` },
      // Decision locked (leads repo docs/05_strategy/DEMO_ROSTER_100_RUBROS.md §10):
      // demos are sales artifacts, not SEO assets. SEO weight lives on /p/<rubro>.
      robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    }
  } catch {
    return { title: 'Demo no encontrada', robots: { index: false, follow: false } }
  }
}

export default async function DemoRubroPage({ params }: Props) {
  const { rubro } = await params
  const siteSlug = `demo-${rubro}`

  let composed
  try {
    composed = composeSitePage({ siteSlug, locale: 'es', pageSlug: 'home' })
  } catch (error) {
    logger.error('DemoRubroPage composition failed — rendering 404', {
      action: 'composeSitePage',
      rubro,
      siteSlug,
      error: error instanceof Error ? error.message : String(error),
    })
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paragu-ai.com'
  const jsonLd = jsonLdForPage(composed, baseUrl)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: composed.theme.cssString }} />
      {composed.theme.googleFontsUrl && (
        <link rel="stylesheet" href={composed.theme.googleFontsUrl} />
      )}

      {jsonLd.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <div
        className="min-h-screen"
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--background)',
          color: 'var(--text)',
        }}
      >
        {renderPage(composed)}
      </div>
    </>
  )
}
