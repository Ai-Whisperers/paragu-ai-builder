import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isLocale, type Locale } from '@/lib/i18n/config'
import { listSiteSlugs, loadSite } from '@/lib/engine/site-loader'
import { listBlogSlugs, loadBlogPost } from '@/lib/engine/blog-loader'
import { resolveSiteTokens } from '@/lib/engine/resolve-site-tokens'
import { BlogPostSection } from '@/components/sections/blog-post-section'
import { alternatesFor } from '@/lib/i18n/routing'

export const runtime = 'edge'

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
          coverImage={post.coverImage}
          html={post.html}
          backLabel="← Blog"
          backHref={`/s/${locale}/${siteSlug}/blog`}
        />
      </div>
    </>
  )
}
