'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

/**
 * Instagram feed — renders a 2×N grid of post thumbnails. Content is passed
 * in (either fetched server-side from IG Graph API or curated manually in
 * content JSON). The component stays dumb on purpose so we don't ship the
 * IG API surface into every tenant.
 */

export interface InstagramFeedProps {
  title?: string
  handle?: string
  posts: Array<{ url: string; imageUrl: string; caption?: string }>
  ctaText?: string
}

export function InstagramFeedSection({
  title = 'Siguenos en Instagram',
  handle,
  posts,
  ctaText,
}: InstagramFeedProps) {
  if (!posts?.length) return null
  return (
    <section className="py-14 bg-[var(--background)]">
      <Container>
        <div className="text-center mb-6">
          <Heading level={2}>{title}</Heading>
          {handle && (
            <a
              href={`https://instagram.com/${handle.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-[var(--primary)]"
            >
              @{handle.replace(/^@/, '')}
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 max-w-5xl mx-auto">
          {posts.slice(0, 12).map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square overflow-hidden rounded"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.caption || 'Instagram post'}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </a>
          ))}
        </div>
        {ctaText && handle && (
          <div className="text-center mt-6">
            <a
              href={`https://instagram.com/${handle.replace(/^@/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--primary)]"
            >
              {ctaText}
            </a>
          </div>
        )}
      </Container>
    </section>
  )
}
