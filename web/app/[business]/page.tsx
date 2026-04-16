import { notFound } from 'next/navigation'
import { composePage } from '@/lib/engine/compose'
import { renderSections } from '@/lib/engine/renderer'
import { getDemoBusiness, getAllDemoSlugs } from '@/lib/engine/demo-data'

interface Props {
  params: Promise<{ business: string }>
}

// Only serve statically generated slugs — return 404 for unknown slugs
export const dynamicParams = false

/**
 * Pre-generate demo business sites at build time.
 */
export async function generateStaticParams() {
  return getAllDemoSlugs().map((slug) => ({ business: slug }))
}

export async function generateMetadata({ params }: Props) {
  const { business: slug } = await params
  const businessData = getDemoBusiness(slug)
  if (!businessData) return { title: 'No encontrado' }

  const page = composePage(businessData)
  return {
    title: page.meta.title,
    description: page.meta.description,
  }
}

/**
 * Generated business site page.
 * Composition engine reads registry + tokens + content,
 * fills templates with business data, and renders all sections.
 */
export default async function BusinessPage({ params }: Props) {
  const { business: slug } = await params
  const businessData = getDemoBusiness(slug)
  if (!businessData) notFound()

  const page = composePage(businessData)

  return (
    <>
      {/* Inject theme CSS variables from tokens */}
      <style dangerouslySetInnerHTML={{ __html: page.theme.cssString }} />

      {/* Google Fonts */}
      {page.theme.googleFontsUrl && (
        <link rel="stylesheet" href={page.theme.googleFontsUrl} />
      )}

      {/* Render all composed sections */}
      <div
        className="min-h-screen"
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--background)',
          color: 'var(--text)',
        }}
      >
        {renderSections(page.sections)}
      </div>
    </>
  )
}
