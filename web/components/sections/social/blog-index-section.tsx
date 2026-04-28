import { Section } from '@/components/ui/section'
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
    <Section fullWidth spacing="lg" background="background" className="font-heading">
      <Container>
        <AnimatedSectionHeader>
          <Heading level={1}>{title}</Heading>
          {subtitle && (
            <p className="font-heading mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {safePosts.length === 0 ? (
          <p className="font-heading mt-12 text-center text-muted-foreground">{emptyLabel}</p>
        ) : variant === 'list' ? (
          <List posts={safePosts} />
        ) : (
          <Grid posts={safePosts} />
        )}
      </Container>
    </Section>
  )
}

function Grid({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <div className="font-heading mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <AnimateOnScroll key={p.slug} stagger={((i % 3) + 1) as 1 | 2 | 3}>
          <a href={p.href} className="font-heading group block overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover">
            <div className="font-heading aspect-[16/9] bg-surface-light">
              {p.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt={p.title} className="font-heading h-full w-full object-cover" loading="lazy" />
              )}
            </div>
            <div className="font-heading p-6">
              {p.category && (
                <span className="font-heading mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-secondary">
                  {p.category}
                </span>
              )}
              <Heading level={3} className="font-heading mb-2 text-lg font-semibold text-primary group-hover:underline">
                {p.title}
              </Heading>
              {p.excerpt && <p className="font-heading mb-3 text-sm text-muted-foreground">{p.excerpt}</p>}
              <div className="font-heading flex items-center gap-3 text-xs text-muted-foreground">
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
    <ul className="font-heading mt-10 divide-y divide-[var(--border)]">
      {posts.map((p) => (
        <li key={p.slug} className="font-heading py-6">
          <a href={p.href} className="font-heading group block">
            <Heading level={3} className="font-heading text-xl font-semibold text-primary group-hover:underline">
              {p.title}
            </Heading>
            {p.excerpt && <p className="font-heading mt-1 text-muted-foreground">{p.excerpt}</p>}
            <div className="font-heading mt-2 flex items-center gap-3 text-xs text-muted-foreground">
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
