import { Container } from '@/components/ui/container'
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--secondary)]">
            {category}
          </p>
        )}
        <Heading level={1}>{title}</Heading>
        <div className="mt-4 flex items-center gap-3 text-sm text-[var(--text-muted)]">
          {date && <time dateTime={date}>{date}</time>}
          {author && <span>· {author}</span>}
        </div>

        {coverImage && (
          <div className="mt-8 overflow-hidden rounded-lg bg-[var(--surface-light)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt={title} className="h-auto w-full" />
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
      </Container>
    </article>
  )
}
