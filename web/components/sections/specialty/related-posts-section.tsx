import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export interface RelatedPost {
  slug: string
  title: string
  excerpt?: string
  category?: string
  coverImage?: string
  href: string
}

export interface RelatedPostsSectionProps {
  title: string
  posts: RelatedPost[]
}

/**
 * Renders up to 3 related blog posts as cards, with cover image, title,
 * category and excerpt. Consumed from the blog detail route after the
 * main article body. No-op when the list is empty.
 */
export function RelatedPostsSection({ title, posts }: RelatedPostsSectionProps) {
  if (!posts || posts.length === 0) return null
  const visible = posts.slice(0, 3)
  return (
    <Section spacing="md" background="surface-light" className="border-t border-border">
      <Container>
        <Heading level={2} className="mb-8 text-2xl font-semibold text-primary">
          {title}
        </Heading>
        <div className="grid gap-6 md:grid-cols-3">
          {visible.map((p) => (
            <a
              key={p.slug}
              href={p.href}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-transform hover:-translate-y-1 hover:shadow-card-hover"
            >
              {p.coverImage && (
                <div className="aspect-[16/9] w-full overflow-hidden bg-surface-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                {p.category && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                    {p.category}
                  </p>
                )}
                <Heading level={3} className="mb-2 text-base font-semibold text-foreground">
                  {p.title}
                </Heading>
                {p.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </Container>
    </Section>
  )
}
