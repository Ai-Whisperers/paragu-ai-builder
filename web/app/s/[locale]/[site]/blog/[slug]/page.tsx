import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { listSiteSlugs, loadSite, loadSiteContent } from '@/lib/engine/site-loader'
import { listBlogSlugs, listBlogPosts, loadBlogPost } from '@/lib/engine/blog-loader'
import { loadImagesManifest, resolveImage } from '@/lib/engine/images-loader'
import { resolveSiteTokens } from '@/lib/engine/resolve-site-tokens'
import { BlogPostSection } from '@/components/sections/blog-post-section'
import { RelatedPostsSection } from '@/components/sections/related-posts-section'
import { alternatesFor } from '@/lib/i18n/routing'
import { buildBlogPosting, buildBreadcrumbList } from '@/lib/seo/json-ld'

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

const BLOG_CRUMB: Record<string, string> = {
  en: 'Blog',
  es: 'Blog',
  nl: 'Blog',
  de: 'Blog',
  pt: 'Blog',
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

  const coverImage = resolveCoverImage(post.coverImage, siteSlug, post.slug)

  return {
    title: `${post.title} — ${site.slug}`,
    description: post.excerpt,
    alternates: {
      languages: alternatesFor(siteSlug, site.locales, `blog/${slug}`),
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      locale,
      ...(post.date ? { publishedTime: post.date } : {}),
      ...(post.author ? { authors: [post.author] } : {}),
      ...(coverImage
        ? { images: [{ url: coverImage, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(coverImage ? { images: [coverImage] } : {}),
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paragu-ai.com'
  const manifest = loadImagesManifest(siteSlug)
  let siteContent: { siteName?: string; tagline?: string } = {}
  try {
    const raw = loadSiteContent(siteSlug, locale as Locale) as Record<string, unknown>
    siteContent = {
      siteName: typeof raw.siteName === 'string' ? raw.siteName : undefined,
      tagline: typeof raw.tagline === 'string' ? raw.tagline : undefined,
    }
  } catch {
    // Fall through with empty content; JSON-LD still emits with the slug.
  }

  const blogPostingLd = buildBlogPosting(
    {
      slug: post.slug,
      title: post.title,
      date: post.date,
      author: post.author,
      excerpt: post.excerpt,
      category: post.category,
      coverImage,
    },
    {
      slug: site!.slug,
      country: site!.country,
      defaultLocale: site!.defaultLocale,
      contact: site!.contact,
      social: site!.social,
    },
    siteContent,
    manifest,
    baseUrl,
    locale,
  )

  const breadcrumbLd = buildBreadcrumbList([
    { name: siteContent.siteName || site!.slug, url: `${baseUrl}/s/${locale}/${siteSlug}` },
    { name: BLOG_CRUMB[locale] ?? BLOG_CRUMB.en, url: `${baseUrl}/s/${locale}/${siteSlug}/blog` },
    { name: post.title, url: `${baseUrl}/s/${locale}/${siteSlug}/blog/${post.slug}` },
  ])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tokens.cssString }} />
      {tokens.googleFontsUrl && <link rel="stylesheet" href={tokens.googleFontsUrl} />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

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
