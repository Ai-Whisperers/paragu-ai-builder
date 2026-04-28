import { BlogSocialShare } from '@/components/sections/social/blog-social-share'
import { Container } from '@/components/ui/container'

function categoryToSlug(s: string): string {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

import { Heading } from '@/components/ui/heading'

export interface BlogPostSectionProps {
  variant?: 'article'
  title: string
  date?: string
  author?: string
  category?: string
  coverImage?: string
  html: string
  backLabel?: string
  backHref?: string
  relatedPosts?: Array<{
    slug: string
    title: string
    excerpt?: string
    date?: string
    category?: string
    coverImage?: string
    href: string
  }>
  relatedLabel?: string
  shareUrl?: string
  locale?: string
}

export function BlogPostSection({
  title,
  date,
  author,
  category,
  coverImage,
  html,
  backLabel,
  backHref,
  relatedPosts,
  relatedLabel = 'Related posts',
  shareUrl,
  locale = 'es',
}: BlogPostSectionProps) {
  return (
    <article className="font-heading bg-background py-16 sm:py-24">
      <Container>
        {backHref && backLabel && (
          <a href={backHref} className="font-heading mb-6 inline-flex items-center gap-1 text-sm text-secondary hover:underline">
            ← {backLabel}
          </a>
        )}
        {category && (
          <a
            href={`../blog/categoria/${categoryToSlug(category)}`}
            className="font-heading mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-secondary hover:underline"
          >
            {category}
          </a>
        )}
        <Heading level={1}>{title}</Heading>
        <div className="font-heading mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          {date && <time dateTime={date}>{date}</time>}
          {author && <span>· {author}</span>}
        </div>

        {coverImage && (
          <div className="font-heading mt-8 overflow-hidden rounded-lg bg-surface-light">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt={title} className="font-heading h-auto w-full" loading="lazy" decoding="async" />
          </div>
        )}

        <div
          className="font-heading prose prose-lg mt-10 max-w-none"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text)',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {shareUrl && <BlogSocialShare url={shareUrl} title={title} locale={locale} />}

        {relatedPosts && relatedPosts.length > 0 && (
          <section className="font-heading mt-16 border-t border-border pt-12">
            <Heading level={2} className="font-heading mb-6 text-2xl font-semibold text-primary">
              {relatedLabel}
            </Heading>
            <div className="font-heading grid gap-6 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <a
                  key={p.slug}
                  href={p.href}
                  className="font-heading group block overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="font-heading aspect-[16/9] bg-surface-light">
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt={p.title} className="font-heading h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="font-heading p-5">
                    {p.category && (
                      <span className="font-heading mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-secondary">
                        {p.category}
                      </span>
                    )}
                    <Heading
                      level={3}
                      className="font-heading mb-2 text-base font-semibold text-primary group-hover:underline"
                     
                    >
                      {p.title}
                    </Heading>
                    {p.excerpt && (
                      <p className="font-heading line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                    )}
                    {p.date && (
                      <p className="font-heading mt-3 text-xs text-muted-foreground">
                        <time dateTime={p.date}>{p.date}</time>
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  )
}
