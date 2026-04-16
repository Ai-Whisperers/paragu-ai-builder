import type { MetadataRoute } from 'next'
import { loadAllSlugs } from '@/lib/engine/data-loader'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://paragu-ai-builder.pages.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await loadAllSlugs()

  const businessPages = slugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...businessPages,
  ]
}
