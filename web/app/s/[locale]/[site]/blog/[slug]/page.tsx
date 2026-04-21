import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { listSiteSlugs, loadSite } from '@/lib/engine/site-loader'
import { listBlogSlugs, listBlogPosts, loadBlogPost } from '@/lib/engine/blog-loader'
import { loadImagesManifest, resolveImage } from '@/lib/engine/images-loader'
import { resolveSiteTokens } from '@/lib/engine/resolve-site-tokens'
import { BlogPostSection } from '@/components/sections/blog-post-section'
import { RelatedPostsSection } from '@/components/sections/related-posts-section'
import { alternatesFor } from '@/lib/i18n/routing'

/**
 * Convert "my-post-slug" → "myPostSlug" for the images manifest lookup.
 */
function slugToCamel(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

/**
 * Pick a cover image: explicit frontmatter → manifest `blog.<camelSlug>` →
 * manifest `brand.placeholder` → undefined.
 */
function resolveCoverImage(
  explicit: string | undefined,
  siteSlug: string,
  postSlug: string,
): string | undefined {
  if (explicit) return explicit
  const manifest = loadImagesManifest(siteSlug)
  const camel = slugToCamel(postSlug)
  const fromManifest = resolveImage(manifest, `blog.${camel}`)
  if (fromManifest) return fromManifest.src
  const fallback = resolveImage(manifest, 'brand.placeholder')
  return fallback?.src
}

/**
 * Compute up to N related posts: prefer same category, exclude current
 * post, pad with the most-recent remainder so we always have something
 * to show when the category is thin.
 */
function pickRelated(
  siteSlug: string,
  locale: Locale,
  currentSlug: string,
  currentCategory: string | undefined,
  max = 3,
) {
  const all = listBlogPosts(siteSlug, locale).filter((p) => p.slug !== currentSlug)
  const sameCat = currentCategory
    ? all.filter((p) => p.category === currentCategory)
    : []
  const rest = all.filter((p) => !sameCat.includes(p))
  const picked = [...sameCat, ...rest].slice(0, max)
  return picked.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    coverImage: resolveCoverImage(p.coverImage, siteSlug, p.slug),
    href: `/s/${locale}/${siteSlug}/blog/${p.slug}`,
  }))
}

const RELATED_TITLE: Record<string, string> = {
  en: 'Related posts',
  es: 'Artículos relacionados',
  nl: 'Gerelateerde artikelen',
  de: 'Verwandte Artikel',
  pt: 'Artigos relacionados',
}

export const runtime = 'nodejs'

interface Props {
  params: Promise<{ locale: string; site: string; slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const params: Array<{ locale: string; site: string; slug: string }> = []
  for (const siteSlug of listSiteSlugs()) {
    let site
    try { site = loadSite(siteSlug) } catch { continue }
    for (const loc of site.locales) {
      for (const slug of listBlogSlugs(siteSlug, loc)) {
        params.push({ locale: loc, site: siteSlug, slug })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, site: siteSlug, slug } = await params
  if (!isLocale(locale)) return { title: 'Not found' }
  const post = loadBlogPost(siteSlug, locale as Locale, slug)
  if (!post) return { title: 'Not found' }
  let site
  try { site = loadSite(siteSlug) } catch { return { title: post.title } }
  return {
    title: `${post.title} — ${site.slug}`,
    description: post.excerpt,
    alternates: {
      languages: alternatesFor(siteSlug, site.locales, `blog/${slug}`),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, site: siteSlug, slug } = await params
  if (!isLocale(locale)) notFound()
  const post = loadBlogPost(siteSlug, locale as Locale, slug)
  if (!post) notFound()
  let site
  try { site = loadSite(siteSlug) } catch { notFound() }

  const tokens = resolveSiteTokens(site!.vertical, siteSlug)
  const coverImage = resolveCoverImage(post.coverImage, siteSlug, post.slug)
  const related = pickRelated(siteSlug, locale as Locale, post.slug, post.category, 3)
  const relatedTitle = RELATED_TITLE[locale] ?? RELATED_TITLE.en

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
        <BlogPostSection
          title={post.title}
          date={post.date}
          author={post.author}
          category={post.category}
          coverImage={coverImage}
          html={post.html}
          backLabel="← Blog"
          backHref={`/s/${locale}/${siteSlug}/blog`}
        />
        <RelatedPostsSection title={relatedTitle} posts={related} />
      </div>
    </>
  )
}
