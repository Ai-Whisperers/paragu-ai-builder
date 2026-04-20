import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { BLOG_POSTS } from '@/lib/landing/blog-posts'
import { waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Blog — guías y casos para negocios paraguayos',
  description:
    'Cómo mejorar la presencia digital de tu negocio: SEO local, conversión por WhatsApp, casos de éxito y errores comunes en sitios para PyMEs en Paraguay.',
  alternates: { canonical: '/blog' },
}

export default function BlogIndexPage() {
  const sorted = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <SiteNav />
      <main className="pt-24 pb-20">
        <Container>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
              Blog
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
              Guías para negocios paraguayos
            </h1>
            <p className="text-lg text-[var(--text-light)]">
              Sin fluff. Lo que aprendimos publicando sitios reales para peluquerías, gimnasios,
              meal prep y más.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6">
            {sorted.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-md md:p-8"
              >
                <p className="mb-2 flex items-center gap-3 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  <span>{post.tag.split(':')[1] ?? post.tag}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingTime}
                  </span>
                  <span>{new Date(post.date).toLocaleDateString('es-PY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
                <h2 className="mb-3 text-2xl font-bold text-[var(--text)]">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[var(--primary)]">
                    {post.title}
                  </Link>
                </h2>
                <p className="mb-4 text-[var(--text-light)]">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]"
                >
                  Leer artículo
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-light)] p-6 text-center">
            <p className="text-sm text-[var(--text-light)]">
              Más artículos en preparación. ¿Querés que escribamos sobre algún tema?{' '}
              <a
                href={waLink('Hola, me interesaría leer un post sobre...')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)]"
              >
                Sugerinos por WhatsApp
              </a>
              .
            </p>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
