import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { TEMPLATES } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Plantillas por rubro — sitios web profesionales en 48 horas',
  description:
    'Plantillas especializadas por rubro: peluquería, gimnasio, spa, restaurante, barbería, sushi y más. Cada una pensada para el negocio paraguayo.',
  alternates: { canonical: '/p' },
}

export default function TemplatesIndexPage() {
  const live = TEMPLATES.filter((t) => t.demoSlug !== null)
  const upcoming = TEMPLATES.filter((t) => t.demoSlug === null)

  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
              Plantillas
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
              Diseños especializados por rubro
            </h1>
            <p className="text-lg text-[var(--text-light)]">
              Cada plantilla está pensada para un tipo de negocio específico — con las secciones,
              el lenguaje y los flujos que tu rubro realmente necesita.
            </p>
          </div>

          <h2 className="mb-6 text-xl font-bold text-[var(--text)]">Disponibles ahora</h2>
          <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {live.map((t) => {
              const seoSlug = t.seoSlug ?? t.id.replace(/_/g, '-')
              return (
                <Link
                  key={t.id}
                  href={`/p/${seoSlug}`}
                  className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-xl"
                >
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${t.color}15`, color: t.color }}
                    aria-hidden
                  >
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text)]">{t.name}</h3>
                  {t.leads > 0 ? (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Mercado PY: {t.leads.toLocaleString('es-PY')} negocios · {t.pct}% sin web
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">Demo lista para ver</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                    Ver landing y demo
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              )
            })}
          </div>

          <h2 className="mb-6 text-xl font-bold text-[var(--text)]">Próximamente</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcoming.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 p-4 text-sm"
              >
                <p className="font-semibold text-[var(--text)]">{t.name}</p>
                <p className="text-xs text-[var(--text-muted)]">Plantilla en desarrollo</p>
              </div>
            ))}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
