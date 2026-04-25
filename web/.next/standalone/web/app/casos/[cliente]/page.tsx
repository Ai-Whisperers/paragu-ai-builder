import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, ExternalLink, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { CASE_STUDIES } from '@/lib/landing/case-studies'
import { REAL_CLIENTS, waLink } from '@/lib/landing/marketing-data'

type Params = { cliente: string }

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ cliente: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { cliente } = await params
  const cs = CASE_STUDIES.find((c) => c.slug === cliente)
  if (!cs) return { title: 'Caso no encontrado' }
  return {
    title: cs.headline,
    description: cs.lead,
    alternates: { canonical: `/casos/${cliente}` },
    openGraph: { title: cs.headline, description: cs.lead, type: 'article' },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { cliente } = await params
  const cs = CASE_STUDIES.find((c) => c.slug === cliente)
  if (!cs) notFound()

  const client = REAL_CLIENTS.find((c) => c.slug === cs.slug)
  const color = client?.color ?? '#6366f1'
  const next = CASE_STUDIES[(CASE_STUDIES.findIndex((c) => c.slug === cliente) + 1) % CASE_STUDIES.length]

  const waMessage = `Hola, vi el caso de ${cs.slug.replace(/-/g, ' ')} en ParaguAI y quiero algo similar para mi negocio.`

  return (
    <>
      <SiteNav />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-10"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${color} 0%, transparent 60%)`,
            }}
          />
          <Container>
            <div className="mx-auto max-w-3xl">
              <Link
                href="/casos"
                className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-light)] hover:text-[var(--primary)]"
              >
                ← Todos los casos
              </Link>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color }}>
                {cs.vertical} · {cs.period}
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl">
                {cs.headline}
              </h1>
              <p className="mb-8 text-lg text-[var(--text-light)] md:text-xl">{cs.lead}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={cs.liveUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-bold text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Ver el sitio en vivo
                  <ExternalLink size={18} />
                </Link>
                <a
                  href={waLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:opacity-90"
                >
                  <MessageCircle size={18} />
                  Quiero algo así
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Outcomes */}
        <section className="border-y border-[var(--border)] bg-[var(--surface-light)] py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-2xl font-bold text-[var(--text)]">Lo que cambió</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {cs.outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      <Check size={14} />
                    </span>
                    <span className="text-sm text-[var(--text)]">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Story body */}
        <section className="py-20">
          <Container>
            <article className="mx-auto max-w-3xl space-y-10">
              <div>
                <h2 className="mb-3 text-2xl font-bold text-[var(--text)]">El desafío</h2>
                <p className="text-lg leading-relaxed text-[var(--text-light)]">{cs.challenge}</p>
              </div>
              <div>
                <h2 className="mb-3 text-2xl font-bold text-[var(--text)]">Lo que hicimos</h2>
                <p className="text-lg leading-relaxed text-[var(--text-light)]">{cs.approach}</p>
              </div>
            </article>
          </Container>
        </section>

        {/* CTA + next */}
        <section className="border-t border-[var(--border)] bg-[var(--surface-light)] py-16">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-2xl font-bold text-[var(--text)]">
                ¿Tu negocio puede ser el próximo caso?
              </h2>
              <p className="mb-6 text-[var(--text-light)]">
                Mandanos los datos por WhatsApp y armamos tu demo en 48 horas.
              </p>
              <a
                href={waLink('Hola, vi un caso en ParaguAI y quiero hablar de mi negocio.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1"
              >
                <MessageCircle size={18} />
                Pedir demo gratis
              </a>
            </div>

            <div className="mx-auto mt-16 max-w-3xl">
              <Link
                href={`/casos/${next.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-md"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Próximo caso
                  </p>
                  <p className="mt-1 font-bold text-[var(--text)]">{next.headline}</p>
                </div>
                <ArrowRight
                  size={20}
                  className="shrink-0 text-[var(--primary)] transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
