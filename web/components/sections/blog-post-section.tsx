import { BlogSocialShare } from './blog-social-share'
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
    <article className="bg-[var(--background)] py-16 sm:py-24">
      <Container>
        {backHref && backLabel && (
          <a href={backHref} className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--secondary)] hover:underline">
            ← {backLabel}
          </a>
        )}
        {category && (
          <a
            href={`../blog/categoria/${categoryToSlug(category)}`}
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--secondary)] hover:underline"
          >
            {category}
          </a>
        )}
        <Heading level={1}>{title}</Heading>
        <div className="mt-4 flex items-center gap-3 text-sm text-[var(--text-muted)]">
          {date && <time dateTime={date}>{date}</time>}
          {author && <span>· {author}</span>}
        </div>

        {coverImage && (
          <div className="mt-8 overflow-hidden rounded-lg bg-[var(--surface-light)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt={title} className="h-auto w-full" loading="lazy" decoding="async" />
          </div>
        )}

        <div
          className="prose prose-lg mt-10 max-w-none"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text)',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {shareUrl && <BlogSocialShare url={shareUrl} title={title} locale={locale} />}

        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-[var(--border)] pt-12">
            <Heading level={2} className="mb-6 text-2xl font-semibold text-[var(--primary)]">
              {relatedLabel}
            </Heading>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <a
                  key={p.slug}
                  href={p.href}
                  className="group block overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-card transition-all hover:shadow-card-hover"
                >
                  <div className="aspect-[16/9] bg-[var(--surface-light)]">
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="p-5">
                    {p.category && (
                      <span
                        className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--secondary)]"
                      >
                        {p.category}
                      </span>
                    )}
                    <Heading
                      level={3}
                      className="mb-2 text-base font-semibold text-[var(--primary)] group-hover:underline"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {p.title}
                    </Heading>
                    {p.excerpt && (
                      <p className="line-clamp-2 text-sm text-[var(--text-light)]">{p.excerpt}</p>
                    )}
                    {p.date && (
                      <p className="mt-3 text-xs text-[var(--text-muted)]">
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
