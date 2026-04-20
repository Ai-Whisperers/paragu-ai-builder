import type { MetadataRoute } from 'next'
import { LIVE_TEMPLATES } from '@/lib/landing/marketing-data'
import { CASE_STUDIES } from '@/lib/landing/case-studies'
import { BLOG_POSTS } from '@/lib/landing/blog-posts'

const BASE = 'https://paragu-ai.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/precios`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/casos`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/p`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/comparacion`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/seguridad`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  const verticalRoutes: MetadataRoute.Sitemap = LIVE_TEMPLATES.map((t) => ({
    url: `${BASE}/p/${t.seoSlug ?? t.id.replace(/_/g, '-')}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const caseRoutes: MetadataRoute.Sitemap = CASE_STUDIES.map((c) => ({
    url: `${BASE}/casos/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...verticalRoutes, ...caseRoutes, ...blogRoutes]
}
