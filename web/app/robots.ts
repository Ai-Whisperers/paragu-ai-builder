import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/login'],
      },
    ],
    sitemap: 'https://paragu-ai.com/sitemap.xml',
    host: 'https://paragu-ai.com',
  }
}
