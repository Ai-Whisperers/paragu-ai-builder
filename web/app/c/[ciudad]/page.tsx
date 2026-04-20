import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { CITIES, getCity } from '@/lib/landing/cities'
import { TEMPLATES, waLink } from '@/lib/landing/marketing-data'

type Params = { ciudad: string }

export function generateStaticParams() {
  return CITIES.map((c) => ({ ciudad: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ciudad } = await params
  const city = getCity(ciudad)
  if (!city) return { title: 'Ciudad no encontrada' }
  const title = `Sitios web para negocios en ${city.name}, Paraguay`
  const description = `${city.businesses.toLocaleString('es-PY')} negocios mapeados en ${city.name}, ${city.noWebPct}% sin presencia web. Plantillas listas y demo en 48h.`
  return {
    title,
    description,
    alternates: { canonical: `/c/${ciudad}` },
    openGraph: { title, description, type: 'website' },
  }
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { ciudad } = await params
  const city = getCity(ciudad)
  if (!city) notFound()

  const verticalTemplates = TEMPLATES.filter(
    (t) => city.topVerticals.includes(t.id) && t.demoSlug !== null,
  )

  const waMessage = `Hola, tengo un negocio en ${city.name} y quiero una demo de ParaguAI.`

  return (
    <>
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <MapPin size={22} />
              </div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                {city.name}, Paraguay
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl md:text-6xl">
                Sitios web para negocios de {city.name}
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--text-light)]">{city.positioning}</p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href={waLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-8 py-4 text-lg font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1"
                >
                  <MessageCircle size={20} />
                  Pedir demo gratis
                </a>
                <Link
                  href="/p"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-8 py-4 text-lg font-bold text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Ver todas las plantillas
                </Link>
              </div>

              <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <div>
                  <p className="text-3xl font-bold text-[var(--primary)]">
                    {city.businesses.toLocaleString('es-PY')}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    Negocios mapeados
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--primary)]">{city.noWebPct}%</p>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    Sin web propia
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Top verticals */}
        <section className="border-y border-[var(--border)] bg-[var(--surface-light)] py-16">
          <Container>
            <h2 className="mb-8 text-center text-3xl font-bold text-[var(--text)]">
              Plantillas con más demanda en {city.name}
            </h2>
            <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {verticalTemplates.map((t) => (
                <Link
                  key={t.id}
                  href={`/p/${t.seoSlug ?? t.id.replace(/_/g, '-')}`}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-md"
                >
                  <div
                    className="mb-3 h-1.5 w-12 rounded-full"
                    style={{ backgroundColor: t.color }}
                    aria-hidden
                  />
                  <h3 className="text-lg font-bold text-[var(--text)]">{t.name}</h3>
                  {t.leads > 0 && (
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      Mercado PY total: {t.leads.toLocaleString('es-PY')} negocios
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                    Ver plantilla
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Other cities */}
        <section className="py-16">
          <Container>
            <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Otras ciudades
            </h3>
            <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
              {CITIES.filter((c) => c.slug !== ciudad).map((c) => (
                <Link
                  key={c.slug}
                  href={`/c/${c.slug}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-medium text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
