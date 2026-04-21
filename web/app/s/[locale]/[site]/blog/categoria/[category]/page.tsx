import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { listSiteSlugs, loadSite } from '@/lib/engine/site-loader'
import { listBlogPosts } from '@/lib/engine/blog-loader'
import { resolveSiteTokens } from '@/lib/engine/resolve-site-tokens'
import { BlogIndexSection } from '@/components/sections/blog-index-section'

export const runtime = 'nodejs'

interface Props {
  params: Promise<{ locale: string; site: string; category: string }>
}

/**
 * Slugify a category label the same way categories are rendered on card
 * badges. Keep it simple — strip accents, lowercase, replace non-alnum
 * with hyphens. This MUST match the slug used in the listing URLs emitted
 * by related-posts / blog-index so cross-navigation works.
 */
function categoryToSlug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const dynamicParams = false

export async function generateStaticParams() {
  const params: Array<{ locale: string; site: string; category: string }> = []
  for (const siteSlug of listSiteSlugs()) {
    let site
    try { site = loadSite(siteSlug) } catch { continue }
    for (const loc of site.locales) {
      const cats = new Set<string>()
      for (const p of listBlogPosts(siteSlug, loc as Locale)) {
        if (p.category) cats.add(categoryToSlug(p.category))
      }
      for (const category of cats) {
        params.push({ locale: loc, site: siteSlug, category })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, site: siteSlug, category } = await params
  if (!isLocale(locale)) return { title: 'Not found' }
  try { loadSite(siteSlug) } catch { return { title: 'Not found' } }
  // Find the human-readable category label from the first matching post
  const match = listBlogPosts(siteSlug, locale as Locale).find(
    (p) => p.category && categoryToSlug(p.category) === category,
  )
  if (!match) return { title: 'Not found' }
  return {
    title: `${match.category} — Blog`,
    description: `Artículos en la categoría ${match.category}.`,
  }
}

const INDEX_LABELS: Record<string, { header: string; empty: string }> = {
  de: { header: 'Kategorie', empty: 'Keine Artikel in dieser Kategorie.' },
  en: { header: 'Category', empty: 'No articles in this category.' },
  es: { header: 'Categoría', empty: 'No hay artículos en esta categoría.' },
  nl: { header: 'Categorie', empty: 'Geen artikelen in deze categorie.' },
  pt: { header: 'Categoria', empty: 'Nenhum artigo nesta categoria.' },
}

export default async function BlogCategoryPage({ params }: Props) {
  const { locale, site: siteSlug, category } = await params
  if (!isLocale(locale)) notFound()
  let site
  try { site = loadSite(siteSlug) } catch { notFound() }

  const L = INDEX_LABELS[locale] || INDEX_LABELS.es
  const allPosts = listBlogPosts(siteSlug, locale as Locale)
  const categoryLabel = allPosts.find((p) => p.category && categoryToSlug(p.category) === category)?.category
  if (!categoryLabel) notFound()

  const filtered = allPosts.filter((p) => p.category && categoryToSlug(p.category) === category)
  const posts = filtered.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    category: p.category,
    coverImage: p.coverImage,
    readingMinutes: p.readingMinutes,
    href: `/s/${locale}/${siteSlug}/blog/${p.slug}`,
  }))

  const tokens = resolveSiteTokens(site!.vertical, siteSlug)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tokens.cssString }} />
      {tokens.googleFontsUrl && <link rel="stylesheet" href={tokens.googleFontsUrl} />}
      <div
        className="min-h-screen"
        style={{
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--background)',
          color: 'var(--text)',
        }}
      >
        <BlogIndexSection
          variant="grid"
          title={`${L.header}: ${categoryLabel}`}
          subtitle={`${filtered.length} artículo${filtered.length === 1 ? '' : 's'}`}
          posts={posts}
          emptyLabel={L.empty}
        />
      </div>
    </>
  )
}
