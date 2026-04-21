import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { CASE_STUDIES } from '@/lib/landing/case-studies'
import { REAL_CLIENTS } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Casos reales — sitios publicados con ParaguAI',
  description:
    'Historias completas de cómo nuestros clientes pasaron de la idea al sitio en producción. Sin maquetas: links a sitios reales y resultados medibles.',
  alternates: { canonical: '/casos' },
}

export default function CaseStudiesIndexPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
              Casos reales
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
              No son maquetas. Son sitios online hoy.
            </h1>
            <p className="text-lg text-[var(--text-light)]">
              Cada caso es un negocio real, con una historia real y un sitio que podés visitar
              ahora mismo. Click para leer cómo lo construimos.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {CASE_STUDIES.map((cs) => {
              const client = REAL_CLIENTS.find((c) => c.slug === cs.slug)
              const color = client?.color ?? 'var(--primary)'
              return (
                <article
                  key={cs.slug}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-xl"
                >
                  <div className="mb-5 h-1.5 w-16 rounded-full" style={{ backgroundColor: color }} />
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {cs.vertical} · {cs.period}
                  </p>
                  <h2 className="mb-3 text-xl font-bold text-[var(--text)]">{cs.headline}</h2>
                  <p className="mb-6 text-sm text-[var(--text-light)]">{cs.lead}</p>
                  <ul className="mb-6 space-y-1.5 text-sm text-[var(--text)]">
                    {cs.outcomes.slice(0, 3).map((o) => (
                      <li key={o} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                        {o}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <Link
                      href={`/casos/${cs.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]"
                    >
                      Leer caso completo
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href={cs.liveUrl}
                      className="inline-flex items-center gap-1 text-sm text-[var(--text-light)] hover:text-[var(--text)]"
                    >
                      Sitio en vivo
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
