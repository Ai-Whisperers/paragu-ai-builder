import { notFound } from 'next/navigation'
import { composePage } from '@/lib/engine/compose'
import { renderSections } from '@/lib/engine/renderer'
import { loadBusiness, loadAllSlugs } from '@/lib/engine/data-loader'
import { BusinessPageWrapper } from '@/components/business-page-wrapper'
import { OrganizationJsonLd, FAQJsonLd, ServiceJsonLd } from '@/components/seo/structured-data'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://paragu-ai-builder.pages.dev'

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
  const url = `${BASE_URL}/${slug}`
  return {
    title: page.meta.title,
    description: page.meta.description,
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      url,
      siteName: businessData.name,
      type: 'website',
      locale: page.i18n.defaultLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.meta.title,
      description: page.meta.description,
    },
    alternates: {
      canonical: url,
      languages: page.i18n.supportedLocales.reduce<Record<string, string>>((acc, loc) => {
        acc[loc] = url
        return acc
      }, {}),
    },
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

  // Extract FAQ items for structured data
  const faqSection = page.sections.find((s) => s.type === 'faq')
  const faqItems = (faqSection?.data.items as Array<{ q: string; a: string }> | undefined) || []

  return (
    <>
      {/* Inject theme CSS variables from tokens */}
      <style dangerouslySetInnerHTML={{ __html: page.theme.cssString }} />

      {/* Google Fonts */}
      {page.theme.googleFontsUrl && (
        <link rel="stylesheet" href={page.theme.googleFontsUrl} />
      )}

      {/* JSON-LD Structured Data */}
      <OrganizationJsonLd business={businessData} baseUrl={BASE_URL} />
      {faqItems.length > 0 && <FAQJsonLd items={faqItems} />}
      {businessData.services && businessData.services.length > 0 && (
        <ServiceJsonLd business={businessData} services={businessData.services} />
      )}

      {/* Render all composed sections with i18n context */}
      <BusinessPageWrapper
        supportedLocales={page.i18n.supportedLocales}
        defaultLocale={page.i18n.defaultLocale}
      >
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
      </BusinessPageWrapper>
    </>
  )
}
