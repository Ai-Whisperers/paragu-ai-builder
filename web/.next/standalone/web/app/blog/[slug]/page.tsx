import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { BLOG_POSTS, getPost } from '@/lib/landing/blog-posts'
import { waLink } from '@/lib/landing/marketing-data'

type Params = { slug: string }

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Artículo no encontrado' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

/** Render a paragraph that may contain **bold** markdown spans. */
function renderParagraph(text: string, key: number) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p key={key} className="mb-5 leading-relaxed text-[var(--text-light)]">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-[var(--text)]">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </p>
  )
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-24 pb-20">
        <Container size="md">
          <article className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-light)] hover:text-[var(--primary)]"
            >
              <ArrowLeft size={14} />
              Todos los artículos
            </Link>
            <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-wider text-[var(--text-muted)]">
              <span>{post.tag.split(':')[1] ?? post.tag}</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {post.readingTime}
              </span>
              <span>
                {new Date(post.date).toLocaleDateString('es-PY', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl">
              {post.title}
            </h1>
            <p className="mb-10 text-xl leading-relaxed text-[var(--text-light)]">{post.excerpt}</p>

            <div className="prose prose-lg max-w-none text-lg">
              {post.body.map((p, i) => renderParagraph(p, i))}
            </div>

            <footer className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <p className="mb-4 text-sm text-[var(--text-muted)]">
                Por <strong className="text-[var(--text)]">{post.author}</strong>
              </p>
              <a
                href={waLink('Hola, leí un artículo en el blog y quiero hablar de mi negocio.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1"
              >
                <MessageCircle size={16} />
                Pedir mi demo gratis
              </a>
            </footer>
          </article>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
