import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { listSiteSlugs, loadSite } from '@/lib/engine/site-loader'
import { listBlogSlugs, loadBlogPost } from '@/lib/engine/blog-loader'
import { resolveSiteTokens } from '@/lib/engine/resolve-site-tokens'
import { BlogPostSection } from '@/components/sections/blog-post-section'
import { alternatesFor } from '@/lib/i18n/routing'

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

  // Article + BreadcrumbList structured data for blog posts. Emitted here
  // rather than in the catch-all page because blog posts bypass the main
  // composeSitePage pipeline — they render BlogPostSection directly.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nexaparaguay.com'
  const postUrl = `${baseUrl}/s/${locale}/${siteSlug}/blog/${slug}`
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: post.author || siteSlug },
    datePublished: post.date,
    image: post.coverImage ? [`${baseUrl}${post.coverImage}`] : undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    inLanguage: locale,
  }
  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/s/${locale}/${siteSlug}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/s/${locale}/${siteSlug}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tokens.cssString }} />
      {tokens.googleFontsUrl && <link rel="stylesheet" href={tokens.googleFontsUrl} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, breadcrumbsJsonLd]) }}
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
          coverImage={post.coverImage}
          html={post.html}
          backLabel="← Blog"
          backHref={`/s/${locale}/${siteSlug}/blog`}
        />
      </div>
    </>
  )
}
