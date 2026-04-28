'use client'
import { Section } from '@/components/ui/section'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Search, Tag, User } from 'lucide-react'

type LocalizedString = Partial<Record<'es' | 'en' | 'nl' | 'de', string>>

interface BlogPost {
  slug: string
  title: LocalizedString
  excerpt: LocalizedString
  category: string
  author: string
  date: string
  readTime: string
  image?: string
  tags?: string[]
}

interface BlogSectionProps {
  title?: LocalizedString
  subtitle?: LocalizedString
  posts?: BlogPost[]
  locale?: 'es' | 'en' | 'nl' | 'de'
  showAllLink?: string
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    slug: 'impuesto-territorial-paraguay-2026',
    title: {
      es: 'Impuesto Territorial: Cómo funciona en 2026',
      en: 'Territorial Tax: How it works in 2026',
    },
    excerpt: {
      es: 'El sistema fiscal paraguayo es único en América Latina. Descubrí cómo funciona el impuesto territorial y cuánto podés ahorrar.',
      en: 'The Paraguayan tax system is unique in Latin America. Discover how the territorial tax works and how much you can save.',
    },
    category: 'fiscal',
    author: 'Nexa Team',
    date: '2026-04-15',
    readTime: '8 min',
    tags: ['tax', 'fiscal', 'paraguay'],
  },
  {
    slug: 'residencia-paraguay-paso-a-paso',
    title: {
      es: 'Residencia en Paraguay: Paso a Paso',
      en: 'Residency in Paraguay: Step by Step',
    },
    excerpt: {
      es: 'Guía completa para obtener tu residencia en Paraguay. Documentos, tiempos y consejos prácticos.',
      en: 'Complete guide to obtaining residency in Paraguay. Documents, timelines and practical tips.',
    },
    category: 'residencia',
    author: 'Nexa Team',
    date: '2026-04-10',
    readTime: '12 min',
    tags: ['residency', 'immigration', 'guide'],
  },
  {
    slug: 'costo-de-vida-asuncion',
    title: {
      es: 'Costo de Vida Asunción: Números Reales',
      en: 'Cost of Living Asunción: Real Numbers',
    },
    excerpt: {
      es: 'Cuánto cuesta vivir en Asunción en 2026. Alquileres, comida, transporte y más.',
      en: 'How much does it cost to live in Asunción in 2026. Rent, food, transport and more.',
    },
    category: 'lifestyle',
    author: 'Nexa Team',
    date: '2026-04-05',
    readTime: '6 min',
    tags: ['cost of living', 'asuncion', 'lifestyle'],
  },
]

const CATEGORIES: Array<{ id: string; label: LocalizedString }> = [
  { id: 'all', label: { es: 'Todos', en: 'All' } },
  { id: 'fiscal', label: { es: 'Fiscal', en: 'Tax' } },
  { id: 'residencia', label: { es: 'Residencia', en: 'Residency' } },
  { id: 'lifestyle', label: { es: 'Estilo de Vida', en: 'Lifestyle' } },
  { id: 'negocios', label: { es: 'Negocios', en: 'Business' } },
  { id: 'consejos', label: { es: 'Consejos', en: 'Tips' } },
]

export function BlogSection({
  title,
  subtitle,
  posts = DEFAULT_POSTS,
  locale = 'es',
  showAllLink = '/blog',
}: BlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title[locale]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt[locale]?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Section fullWidth spacing="md" background="surface-light" id="blog">
      <div className="mx-auto  px-6">
        {title && (
          <div className="mb-12 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-foreground">{title[locale] || title.es}</h2>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle[locale] || subtitle.es}</p>}
          </div>
        )}

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-3 pl-12 pr-4 text-foreground placeholder-[var(--text-muted)] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary text-[var(--primary-foreground)]'
                  : 'bg-surface text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {cat.label[locale] || cat.label.es}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              {post.image && (
                <div className="h-48 overflow-hidden bg-surface-light">
                  <img
                    src={post.image}
                    alt={post.title[locale] || post.title.es}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">
                    {post.category}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-primary">
                  {post.title[locale] || post.title.es}
                </h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">
                  {post.excerpt[locale] || post.excerpt.es}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    {post.date}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
                  >
                    Read more
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-muted-foreground">No articles found. Try a different search term or category.</p>
          </div>
        )}

        {showAllLink && (
          <div className="mt-8 text-center">
            <Link
              href={showAllLink}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-primary/90"
            >
              View all articles
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </Section>
  )
}
