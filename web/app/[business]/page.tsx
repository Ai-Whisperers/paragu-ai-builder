import { notFound } from 'next/navigation'
import { composePage } from '@/lib/engine/compose'
import { renderSections } from '@/lib/engine/renderer'
import { loadBusiness, loadAllSlugs } from '@/lib/engine/data-loader'

interface Props {
  params: Promise<{ business: string }>
}

// Only serve statically generated slugs — return 404 for unknown slugs
export const dynamicParams = false

/**
 * Pre-generate business sites at build time.
 * Loads slugs from both demo data and Supabase (when configured).
 */
export async function generateStaticParams() {
  const slugs = await loadAllSlugs()
  return slugs.map((slug) => ({ business: slug }))
}

export async function generateMetadata({ params }: Props) {
  const { business: slug } = await params
  const businessData = await loadBusiness(slug)
  if (!businessData) return { title: 'No encontrado' }

  const page = await composePage(businessData)
  return {
    title: page.meta.title,
    description: page.meta.description,
  }
}

/**
 * Generated business site page.
 * Composition engine reads registry + tokens + content,
 * fills templates with business data, and renders all sections.
 *
 * Data source: Supabase (when configured) or demo-data.ts (fallback).
 */
export default async function BusinessPage({ params }: Props) {
  const { business: slug } = await params
  const businessData = await loadBusiness(slug)
  if (!businessData) notFound()

  const page = await composePage(businessData)

  return (
    <>
      {/* Inject theme CSS variables from tokens */}
      <style dangerouslySetInnerHTML={{ __html: page.theme.cssString }} />

      {/* Google Fonts — precedence tells React 19 to manage this as a
          blocking style resource so it doesn't get orphan-preloaded. */}
      {page.theme.googleFontsUrl && (
        <link rel="stylesheet" href={page.theme.googleFontsUrl} precedence="default" />
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
