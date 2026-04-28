'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, X, FileText, HelpCircle, BookOpen, Home, Calculator, ClipboardList, Mail, MessageCircle } from 'lucide-react'
import { BLOG_POSTS, CONTENT } from '@/lib/engine/generated/tenant-data'

/**
 * Global client-side search palette (Cmd/Ctrl + K).
 *
 * Scope: current tenant's blog posts + FAQ items + glossary terms +
 * page titles. Built at mount from the tenant-data bundle, filtered
 * client-side with a naive diacritic-insensitive + case-insensitive
 * substring match (no fuse.js dependency — for an index of ~100 items
 * the cost of a full scan per keystroke is < 1ms).
 *
 * Keyboard support: Cmd/Ctrl+K or / opens, Esc closes, Enter navigates
 * to the first result.
 */

interface SearchItem {
  type: 'post' | 'faq' | 'glossary' | 'page'
  title: string
  excerpt?: string
  href: string
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function buildIndex(siteSlug: string, locale: string): SearchItem[] {
  const items: SearchItem[] = []

  // Blog posts — keys in BLOG_POSTS are "<site>:<locale>:<slug>"
  const prefix = `${siteSlug}:${locale}:`
  for (const key of Object.keys(BLOG_POSTS)) {
    if (!key.startsWith(prefix)) continue
    const slug = key.slice(prefix.length)
    const raw = BLOG_POSTS[key] || ''
    // Parse just the frontmatter for title + excerpt
    const match = raw.match(/^---\n([\s\S]*?)\n---/)
    let title = slug
    let excerpt: string | undefined
    if (match) {
      const fm = match[1]
      const t = fm.match(/^title:\s*"?([^"\n]*)"?/m)
      const e = fm.match(/^excerpt:\s*"?([^"\n]*)"?/m)
      if (t) title = t[1]
      if (e) excerpt = e[1]
    }
    items.push({
      type: 'post',
      title,
      excerpt,
      href: `/s/${locale}/${siteSlug}/blog/${slug}`,
    })
  }

  // FAQ + glossary items from content
  const content = CONTENT[`${siteSlug}:${locale}`] as Record<string, unknown> | undefined
  if (content) {
    const walkers: Array<{ path: string; type: SearchItem['type']; hrefFor: (q: string) => string }> = [
      { path: 'faqPage.full.items', type: 'faq', hrefFor: () => `/s/${locale}/${siteSlug}/faq` },
      { path: 'glossaryPage.glossary.items', type: 'glossary', hrefFor: () => `/s/${locale}/${siteSlug}/glosario` },
    ]
    for (const w of walkers) {
      const parts = w.path.split('.')
      let cur: unknown = content
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
          cur = (cur as Record<string, unknown>)[p]
        } else {
          cur = undefined
          break
        }
      }
      if (Array.isArray(cur)) {
        for (const it of cur as Array<Record<string, unknown>>) {
          if (typeof it.q === 'string') {
            items.push({ type: w.type, title: it.q, excerpt: typeof it.a === 'string' ? String(it.a).slice(0, 120) : undefined, href: w.hrefFor(it.q) })
          }
        }
      }
    }

    // Page titles — from navigation navItems
    const nav = ((content as Record<string, unknown>).navigation as Record<string, unknown> | undefined)?.navItems as Array<{ label: string; href: string }> | undefined
    if (Array.isArray(nav)) {
      for (const n of nav) {
        if (typeof n.label === 'string' && typeof n.href === 'string') {
          items.push({ type: 'page', title: n.label, href: n.href })
        }
      }
    }
  }

  return items
}

function iconFor(type: SearchItem['type']) {
  switch (type) {
    case 'post': return FileText
    case 'faq': return HelpCircle
    case 'glossary': return BookOpen
    case 'page': return Home
  }
}

function actionIcon(name: QuickAction['icon']) {
  switch (name) {
    case 'FileText': return FileText
    case 'HelpCircle': return HelpCircle
    case 'BookOpen': return BookOpen
    case 'Home': return Home
    case 'Calculator': return Calculator
    case 'ClipboardList': return ClipboardList
    case 'MessageCircle': return MessageCircle
    case 'Mail': return Mail
  }
}

interface QuickAction {
  labelKey: string
  href: string
  icon: 'FileText' | 'HelpCircle' | 'BookOpen' | 'Home' | 'Calculator' | 'ClipboardList' | 'MessageCircle' | 'Mail'
}

const ACTIONS: Record<string, Array<{ label: string; href: string; icon: QuickAction['icon'] }>> = {
  de: [
    { label: 'Programm-Assistent starten', href: '/asistente', icon: 'ClipboardList' },
    { label: 'Kostenlose Beratung buchen', href: '/contacto', icon: 'Mail' },
    { label: 'Steuerersparnis-Rechner', href: '/', icon: 'Calculator' },
    { label: 'Programme & Preise', href: '/programas', icon: 'FileText' },
  ],
  en: [
    { label: 'Start program wizard', href: '/asistente', icon: 'ClipboardList' },
    { label: 'Book free consultation', href: '/contacto', icon: 'Mail' },
    { label: 'Tax savings calculator', href: '/', icon: 'Calculator' },
    { label: 'Programs & pricing', href: '/programas', icon: 'FileText' },
  ],
  es: [
    { label: 'Iniciar asistente de programas', href: '/asistente', icon: 'ClipboardList' },
    { label: 'Agendar consulta gratuita', href: '/contacto', icon: 'Mail' },
    { label: 'Calculadora de ahorro fiscal', href: '/', icon: 'Calculator' },
    { label: 'Programas y precios', href: '/programas', icon: 'FileText' },
  ],
  nl: [
    { label: 'Programma-assistent starten', href: '/asistente', icon: 'ClipboardList' },
    { label: 'Gratis consult plannen', href: '/contacto', icon: 'Mail' },
    { label: 'Belastingbesparing-calculator', href: '/', icon: 'Calculator' },
    { label: 'Programma\'s en prijzen', href: '/programas', icon: 'FileText' },
  ],
}

const PLACEHOLDERS: Record<string, string> = {
  de: 'Artikel, FAQs, Glossar durchsuchen…',
  en: 'Search articles, FAQs, glossary…',
  es: 'Buscar artículos, FAQ, glosario…',
  nl: 'Zoek artikelen, FAQ, woordenlijst…',
}

export function SiteSearch({ siteSlug, locale }: { siteSlug: string; locale: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchItem[]>([])

  useEffect(() => {
    setIndex(buildIndex(siteSlug, locale))
  }, [siteSlug, locale])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true); return }
      // Support "/" as open-search shortcut when not typing in a field
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const results = useMemo(() => {
    if (!query.trim()) return index.slice(0, 12)
    const q = norm(query.trim())
    return index
      .map((it) => {
        const titleMatch = norm(it.title).includes(q) ? 2 : 0
        const excerptMatch = it.excerpt && norm(it.excerpt).includes(q) ? 1 : 0
        return { it, score: titleMatch + excerptMatch }
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((r) => r.it)
  }, [index, query])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 px-4 pt-20 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      <div className="w-[min(42rem,100%)] overflow-hidden rounded-xl bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search size={18} className="text-muted-foreground" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={PLACEHOLDERS[locale] || PLACEHOLDERS.es}
            className="flex-1 border-0 bg-transparent text-base text-foreground outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) { window.location.href = results[0].href }
            }}
          />
          <kbd className="hidden rounded bg-surface-light px-2 py-1 text-xs text-muted-foreground sm:inline">Esc</kbd>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-full p-1 text-muted-foreground hover:bg-surface-light hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        {!query.trim() && (
          <ul className="border-b border-border py-2">
            <li className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Acciones rápidas
            </li>
            {(ACTIONS[locale] || ACTIONS.es).map((a) => {
              const Icon = actionIcon(a.icon)
              return (
                <li key={a.href}>
                  <a
                    href={`/s/${locale}/${siteSlug}${a.href}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-surface-light"
                  >
                    <Icon size={18} className="flex-shrink-0 text-secondary" />
                    <span className="text-foreground">{a.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
        <ul className="max-h-[60vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-6 py-8 text-center text-sm text-muted-foreground">—</li>
          ) : (
            results.map((it, i) => {
              const Icon = iconFor(it.type)
              return (
                <li key={`${it.href}-${i}`}>
                  <a
                    href={it.href}
                    className="flex items-start gap-3 px-4 py-3 text-sm hover:bg-surface-light"
                  >
                    <Icon size={18} className="mt-0.5 flex-shrink-0 text-secondary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{it.title}</p>
                      {it.excerpt && (
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{it.excerpt}</p>
                      )}
                    </div>
                    <span className="rounded bg-surface-light px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{it.type}</span>
                  </a>
                </li>
              )
            })
          )}
        </ul>
        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <kbd className="mr-1 rounded bg-surface-light px-1.5 py-0.5">↵</kbd> open
          <kbd className="ml-3 mr-1 rounded bg-surface-light px-1.5 py-0.5">⌘K</kbd> open search
        </div>
      </div>
    </div>
  )
}
