/**
 * Minimal MDX-ish blog loader. Reads frontmatter + body from the auto-
 * generated tenant-data module (see `scripts/generate-tenant-data.ts`)
 * which bundles `sites/<slug>/blog/<locale>/*.mdx` at build time.
 *
 * Falls back gracefully: if a locale has no posts, returns an empty array.
 *
 * Body is rendered as plain HTML via a narrow markdown converter (not a
 * full MDX runtime) so the build stays Edge-Runtime compatible and free
 * of server-only deps.
 */
import type { Locale } from '@/lib/i18n/config'
import { BLOG_POSTS } from './generated/tenant-data'

export interface BlogPost {
  slug: string
  title: string
  date?: string
  author?: string
  category?: string
  excerpt?: string
  coverImage?: string
  readingMinutes?: number
  draft?: boolean
  html: string
}

export function listBlogSlugs(siteSlug: string, locale: Locale): string[] {
  const prefix = `${siteSlug}:${locale}:`
  const slugs: string[] = []
  for (const key of Object.keys(BLOG_POSTS)) {
    if (key.startsWith(prefix)) slugs.push(key.slice(prefix.length))
  }
  return slugs.sort()
}

export function loadBlogPost(
  siteSlug: string,
  locale: Locale,
  slug: string,
): BlogPost | null {
  const raw = BLOG_POSTS[`${siteSlug}:${locale}:${slug}`]
  if (!raw) return null
  const { frontmatter, body } = parseFrontmatter(raw)
  if (frontmatter.draft) return null
  const asString = (v: string | number | boolean | undefined): string | undefined =>
    v === undefined ? undefined : String(v)
  return {
    slug,
    title: asString(frontmatter.title) || slug,
    date: asString(frontmatter.date),
    author: asString(frontmatter.author),
    category: asString(frontmatter.category),
    excerpt: asString(frontmatter.excerpt),
    coverImage: asString(frontmatter.coverImage),
    readingMinutes: frontmatter.readingMinutes
      ? Number(frontmatter.readingMinutes)
      : estimateReadingMinutes(body),
    draft: false,
    html: markdownToHtml(body),
  }
}

export function listBlogPosts(siteSlug: string, locale: Locale): BlogPost[] {
  return listBlogSlugs(siteSlug, locale)
    .map((slug) => loadBlogPost(siteSlug, locale, slug))
    .filter((p): p is BlogPost => !!p)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

function parseFrontmatter(raw: string): {
  frontmatter: Record<string, string | number | boolean>
  body: string
} {
  if (!raw.startsWith('---\n')) return { frontmatter: {}, body: raw }
  const end = raw.indexOf('\n---', 4)
  if (end < 0) return { frontmatter: {}, body: raw }
  const block = raw.slice(4, end)
  const body = raw.slice(end + 4).trimStart()
  const frontmatter: Record<string, string | number | boolean> = {}
  for (const line of block.split('\n')) {
    const match = line.match(/^(\w+):\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    let val: string | number | boolean = rawValue.trim()
    if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1)
    }
    if (val === 'true') val = true
    else if (val === 'false') val = false
    else if (/^\d+$/.test(String(val))) val = Number(val)
    frontmatter[key] = val
  }
  return { frontmatter, body }
}

function estimateReadingMinutes(body: string): number {
  const words = body.split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

/**
 * Very narrow markdown → HTML for seed content. Supports headings,
 * paragraphs, bold, italic, links, unordered lists, ordered lists,
 * blockquotes. Blog authors upgrading to full MDX can replace this
 * with @mdx-js/mdx without any other changes to the engine.
 */
function markdownToHtml(src: string): string {
  const lines = src.split('\n')
  const out: string[] = []
  let inUl = false
  let inOl = false
  let inP: string[] = []

  function flushP() {
    if (inP.length) {
      out.push('<p>' + inlineMd(inP.join(' ').trim()) + '</p>')
      inP = []
    }
  }
  function closeLists() {
    if (inUl) { out.push('</ul>'); inUl = false }
    if (inOl) { out.push('</ol>'); inOl = false }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) { flushP(); closeLists(); continue }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flushP(); closeLists()
      const level = h[1].length
      out.push(`<h${level}>${inlineMd(h[2])}</h${level}>`)
      continue
    }
    if (/^>\s+/.test(line)) {
      flushP(); closeLists()
      out.push('<blockquote>' + inlineMd(line.replace(/^>\s+/, '')) + '</blockquote>')
      continue
    }
    const ul = line.match(/^[-*]\s+(.*)$/)
    if (ul) {
      flushP()
      if (!inUl) { closeLists(); out.push('<ul>'); inUl = true }
      out.push('<li>' + inlineMd(ul[1]) + '</li>')
      continue
    }
    const ol = line.match(/^(\d+)\.\s+(.*)$/)
    if (ol) {
      flushP()
      if (!inOl) { closeLists(); out.push('<ol>'); inOl = true }
      out.push('<li>' + inlineMd(ol[2]) + '</li>')
      continue
    }
    inP.push(line)
  }
  flushP(); closeLists()
  return out.join('\n')
}

function inlineMd(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}
