import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { resolveBusinessBySlug } from '@/lib/commerce/resolve-business'
import { isCommerceEnabled } from '@/lib/commerce/capability'
import { CommerceHeader } from '@/components/commerce/commerce-header'
import { CommerceChrome } from '@/components/commerce/commerce-chrome'
import { ProductFinderQuiz } from '@/components/commerce/product-finder-quiz'
import type { Locale } from '@/lib/i18n/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>
}): Promise<Metadata> {
  const { site } = await params
  return {
    title: `Ayudame a elegir · ${site}`,
    description: 'Responde 3 preguntas y te mostramos las mejores opciones para vos.',
    robots: { index: false, follow: false },
  }
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ site: string; locale: string }>
}) {
  const { site, locale } = await params
  const business = await resolveBusinessBySlug(site)
  if (!business || !(await isCommerceEnabled(business.type))) notFound()

  return (
    <div className="min-h-screen bg-[color:var(--surface-muted,#f9fafb)]">
      <CommerceHeader siteSlug={site} businessName={business.name} locale={locale} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[color:var(--text,#111)]">
            Ayudame a elegir
          </h1>
          <p className="mt-2 text-[color:var(--text-muted,#6b7280)]">
            3 preguntas. Sin juicios, sin compromiso. Te mostramos opciones a medida.
          </p>
        </header>
        <ProductFinderQuiz siteSlug={site} locale={locale} />
      </main>
      <CommerceChrome siteSlug={site} locale={locale as Locale} />
    </div>
  )
}
