import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { cleanInstagram } from '@/lib/format'

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
    <Section spacing="sm" background="background">
      <Container>
        <div className="text-center mb-6">
          <Heading level={2}>{title}</Heading>
          {handle && typeof handle === 'string' && (
            <a
              href={`https://instagram.com/${cleanInstagram(handle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-primary"
            >
              @{cleanInstagram(handle)}
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
        {ctaText && handle && typeof handle === 'string' && (
          <div className="text-center mt-6">
            <a
              href={`https://instagram.com/${cleanInstagram(handle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary"
            >
              {ctaText}
            </a>
          </div>
        )}
      </Container>
    </Section>
  )
}
