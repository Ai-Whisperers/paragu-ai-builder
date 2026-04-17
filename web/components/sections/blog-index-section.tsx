import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export interface BlogPostSummary {
  slug: string
  title: string
  excerpt?: string
  date?: string
  category?: string
  coverImage?: string
  readingMinutes?: number
  href: string
}

export interface BlogIndexSectionProps {
  variant?: 'grid' | 'list'
  title: string
  subtitle?: string
  posts: BlogPostSummary[]
  emptyLabel?: string
}

export function BlogIndexSection({
  variant = 'grid',
  title,
  subtitle,
  posts,
  emptyLabel = 'No posts yet.',
}: BlogIndexSectionProps) {
  // Ensure posts is an array
  const safePosts = posts || []
  
  return (
    <section className="bg-[var(--background)] py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={1}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {safePosts.length === 0 ? (
          <p className="mt-12 text-center text-[var(--text-muted)]">{emptyLabel}</p>
        ) : variant === 'list' ? (
          <List posts={safePosts} />
        ) : (
          <Grid posts={safePosts} />
        )}
      </Container>
    </section>
  )
}

function Grid({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <AnimateOnScroll key={p.slug} stagger={((i % 3) + 1) as 1 | 2 | 3}>
          <a href={p.href} className="group block overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-card transition-all hover:shadow-card-hover">
            <div className="aspect-[16/9] bg-[var(--surface-light)]">
              {p.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
              )}
            </div>
            <div className="p-6">
              {p.category && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--secondary)]">
                  {p.category}
                </p>
              )}
              <h3 className="mb-2 text-lg font-semibold text-[var(--primary)] group-hover:underline" style={{ fontFamily: 'var(--font-heading)' }}>
                {p.title}
              </h3>
              {p.excerpt && <p className="mb-3 text-sm text-[var(--text-light)]">{p.excerpt}</p>}
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                {p.date && <time dateTime={p.date}>{p.date}</time>}
                {p.readingMinutes && <span>· {p.readingMinutes} min</span>}
              </div>
            </div>
          </a>
        </AnimateOnScroll>
      ))}
    </div>
  )
}

function List({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <ul className="mt-10 divide-y divide-[var(--border)]">
      {posts.map((p) => (
        <li key={p.slug} className="py-6">
          <a href={p.href} className="group block">
            <h3 className="text-xl font-semibold text-[var(--primary)] group-hover:underline">
              {p.title}
            </h3>
            {p.excerpt && <p className="mt-1 text-[var(--text-light)]">{p.excerpt}</p>}
            <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-muted)]">
              {p.date && <time dateTime={p.date}>{p.date}</time>}
              {p.category && <span>· {p.category}</span>}
              {p.readingMinutes && <span>· {p.readingMinutes} min</span>}
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
