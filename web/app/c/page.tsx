import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { CITIES } from '@/lib/landing/cities'

export const metadata: Metadata = {
  title: 'Sitios web por ciudad — Paraguay',
  description:
    'Plantillas y casos de éxito por ciudad: Asunción, Ciudad del Este, Encarnación, Luque, San Lorenzo y más.',
  alternates: { canonical: '/c' },
}

export default function CitiesIndexPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
              Por ciudad
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
              ¿Dónde está tu negocio?
            </h1>
            <p className="text-lg text-[var(--text-light)]">
              Mostramos la realidad de cada ciudad: cuántos negocios mapeamos, cuántos sin web,
              y qué rubros tienen mayor concentración.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/c/${c.slug}`}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-md"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <MapPin size={18} />
                </div>
                <h2 className="text-xl font-bold text-[var(--text)]">{c.name}</h2>
                <p className="mt-2 text-sm text-[var(--text-light)]">{c.positioning}</p>
                <p className="mt-4 text-sm text-[var(--text-muted)]">
                  <strong className="text-[var(--text)]">{c.businesses.toLocaleString('es-PY')}</strong> negocios mapeados ·{' '}
                  <strong className="text-[var(--text)]">{c.noWebPct}%</strong> sin web
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                  Ver ciudad
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
