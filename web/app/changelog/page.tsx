/**
 * Public changelog page. Renders the repo's CHANGELOG.md so prospects
 * and customers can see engineering velocity at a glance.
 *
 * Closes BUG_HUNT_500 #499.
 *
 * Read at build time from the repo root via process.cwd(). Re-deploy is
 * the publish step — same model as the blog.
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { SiteFooter } from '@/components/landing/site-footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog · ParaguAI',
  description:
    'Lo último en mejoras de seguridad, performance, observabilidad y nuevas funciones del Builder. Actualizado continuamente.',
  alternates: { canonical: 'https://paragu-ai.com/changelog' },
  openGraph: {
    title: 'Changelog · ParaguAI',
    description: 'Velocidad de ingeniería en vivo. Cada PR mergeado a Main aparece acá.',
    url: 'https://paragu-ai.com/changelog',
  },
  robots: { index: true, follow: true },
}

// Read at build time only — never re-rendered per request, no env-var risk.
function readChangelog(): string {
  // process.cwd() is the `web/` dir at build time; CHANGELOG.md lives at repo root (../).
  const path = resolve(process.cwd(), '..', 'CHANGELOG.md')
  return readFileSync(path, 'utf-8')
}

/**
 * Narrow markdown → HTML for the changelog. Supports headings, lists,
 * paragraphs, code spans, links, **bold**, *italic*. NO raw HTML
 * passthrough — `inlineMd` only emits the small set of tags above.
 */
function markdownToHtml(src: string): string {
  const lines = src.split('\n')
  const out: string[] = []
  let inUl = false
  let inP: string[] = []

  function flushP() {
    if (inP.length) {
      out.push('<p>' + inlineMd(inP.join(' ').trim()) + '</p>')
      inP = []
    }
  }
  function closeLists() {
    if (inUl) {
      out.push('</ul>')
      inUl = false
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flushP()
      closeLists()
      continue
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flushP()
      closeLists()
      const level = h[1].length
      out.push(`<h${level}>${inlineMd(h[2])}</h${level}>`)
      continue
    }
    if (/^---\s*$/.test(line)) {
      flushP()
      closeLists()
      out.push('<hr />')
      continue
    }
    if (/^>\s+/.test(line)) {
      flushP()
      closeLists()
      out.push('<blockquote>' + inlineMd(line.replace(/^>\s+/, '')) + '</blockquote>')
      continue
    }
    const ul = line.match(/^[-*]\s+(.*)$/)
    if (ul) {
      flushP()
      if (!inUl) {
        out.push('<ul>')
        inUl = true
      }
      out.push('<li>' + inlineMd(ul[1]) + '</li>')
      continue
    }
    inP.push(line)
  }
  flushP()
  closeLists()
  return out.join('\n')
}

function inlineMd(s: string): string {
  return s
    // Escape HTML in source first so user-typed `<` doesn't become a tag.
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;br ?\/?&gt;/g, '<br />')
    // Then re-enable our small allow-list of tags via markdown syntax.
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

export default function ChangelogPage() {
  const md = readChangelog()
  const html = markdownToHtml(md)

  return (
    <>
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
              Engineering velocity, in público
            </p>
            <Heading level={1} className="mb-4 text-3xl md:text-4xl font-bold">
              Changelog
            </Heading>
            <p className="mb-8 text-lg text-[var(--text-muted)]">
              Cada cambio relevante a la plataforma. Actualizado continuamente.
              Para el detalle a nivel commit, mirá{' '}
              <a
                href="https://github.com/Ai-Whisperers/paragu-ai-builder/pulls?q=is%3Apr+is%3Aclosed"
                className="underline hover:text-[var(--primary)]"
                rel="noopener noreferrer"
                target="_blank"
              >
                la lista de PRs en GitHub
              </a>
              .
            </p>

            <article
              className="
                prose prose-neutral max-w-none
                prose-headings:font-bold
                prose-h1:mt-12 prose-h1:mb-4 prose-h1:text-3xl
                prose-h2:mt-12 prose-h2:mb-3 prose-h2:text-2xl prose-h2:border-t prose-h2:pt-6
                prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-lg
                prose-h4:mt-4 prose-h4:mb-1 prose-h4:text-base
                prose-p:my-3 prose-p:leading-relaxed
                prose-li:my-1
                prose-code:bg-[var(--surface-light)] prose-code:px-1 prose-code:rounded
                prose-a:text-[var(--primary)] prose-a:underline
              "
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <div className="mt-16 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <Heading level={3} className="mb-2 font-bold">
                ¿Algo no anda?
              </Heading>
              <p className="text-sm text-[var(--text-muted)]">
                Escribinos por WhatsApp y lo mirames.{' '}
                <Link href="/" className="text-[var(--primary)] underline">
                  Volver al inicio →
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
