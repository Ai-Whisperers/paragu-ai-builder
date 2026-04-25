import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, ExternalLink, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { CITIES, getCity } from '@/lib/landing/cities'
import { LIVE_TEMPLATES, waLink, type Template } from '@/lib/landing/marketing-data'

type Params = { ciudad: string; rubro: string }

function findTemplate(rubro: string): Template | undefined {
  return LIVE_TEMPLATES.find((t) => (t.seoSlug ?? t.id.replace(/_/g, '-')) === rubro)
}

/**
 * Generate every (city × live-template) combination — 5 × 16 = 80 SSG pages
 * targeting "sitio web para <vertical> en <ciudad>" queries.
 */
export function generateStaticParams() {
  const params: Params[] = []
  for (const city of CITIES) {
    for (const t of LIVE_TEMPLATES) {
      params.push({
        ciudad: city.slug,
        rubro: t.seoSlug ?? t.id.replace(/_/g, '-'),
      })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ciudad, rubro } = await params
  const city = getCity(ciudad)
  const t = findTemplate(rubro)
  if (!city || !t) return { title: 'Página no encontrada' }
  const title = `Sitio web para ${t.name.toLowerCase()} en ${city.name}, Paraguay`
  const description = `Plantilla profesional para ${t.name.toLowerCase()} en ${city.name}. Demo gratis en 48h, dominio .com.py incluido.`
  return {
    title,
    description,
    alternates: { canonical: `/c/${ciudad}/${rubro}` },
    openGraph: { title, description, type: 'website' },
  }
}

export default async function CityVerticalPage({ params }: { params: Promise<Params> }) {
  const { ciudad, rubro } = await params
  const city = getCity(ciudad)
  const t = findTemplate(rubro)
  if (!city || !t) notFound()

  const isCityFavorite = city.topVerticals.includes(t.id)
  const waMessage = `Hola, tengo un ${t.name.toLowerCase()} en ${city.name} y quiero una demo de ParaguAI.`
  const verticalSlug = t.seoSlug ?? t.id.replace(/_/g, '-')

  // Sister verticals: other top verticals in this same city.
  const sister = city.topVerticals
    .filter((id) => id !== t.id)
    .map((id) => LIVE_TEMPLATES.find((x) => x.id === id))
    .filter((x): x is Template => x !== undefined)
    .slice(0, 4)

  return (
    <>
      <SiteNav />
      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-15"
            style={{ background: `radial-gradient(circle at 70% 30%, ${t.color}33 0%, transparent 50%)` }}
          />
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                <MapPin size={14} />
                {city.name} · {t.name}
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl md:text-6xl">
                Sitio web para {t.name.toLowerCase()} en {city.name}
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--text-light)] md:text-xl">
                {t.seoLead ??
                  `Plantilla profesional especializada para ${t.name.toLowerCase()}, lista para tu negocio en ${city.name}.`}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={waLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-8 py-4 text-lg font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <MessageCircle size={20} />
                  Pedir demo gratis
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </a>
                {t.demoSlug && (
                  <Link
                    href={`/${t.demoSlug}`}
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-8 py-4 text-lg font-bold text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Ver demo en vivo
                    <ExternalLink size={18} />
                  </Link>
                )}
              </div>

              {/* Local market context */}
              <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-left">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    Mercado total {t.name}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[var(--primary)]">
                    {t.leads > 0 ? `${t.leads.toLocaleString('es-PY')} negocios` : 'Datos en curso'}
                  </p>
                  {t.pct > 0 && (
                    <p className="text-xs text-[var(--text-muted)]">
                      {t.pct}% sin web propia
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                    Mercado total {city.name}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[var(--primary)]">
                    {city.businesses.toLocaleString('es-PY')} negocios
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {city.noWebPct}% sin web propia
                  </p>
                </div>
              </div>

              {isCityFavorite && (
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--success)]/10 px-4 py-2 text-sm font-medium text-[var(--success)]">
                  <Sparkles size={14} />
                  Rubro con alta concentración en {city.name}
                </p>
              )}
            </div>
          </Container>
        </section>

        {/* What's included */}
        <section className="border-y border-[var(--border)] bg-[var(--surface-light)] py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-[var(--text)]">
                Lo que incluye tu sitio
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  'Hero adaptado al rubro',
                  `Optimizado para "${t.name.toLowerCase()} ${city.name}" en Google`,
                  'WhatsApp Business + Google Maps',
                  'Galería de fotos de tu local',
                  'Servicios o catálogo claro',
                  'Formulario de contacto',
                  'SEO + Schema.org listo',
                  'Hosting + SSL incluidos',
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
                      <Check size={14} />
                    </span>
                    <span className="text-sm text-[var(--text)]">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Sister verticals + city link */}
        <section className="py-16">
          <Container>
            {sister.length > 0 && (
              <div className="mx-auto mb-12 max-w-5xl">
                <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Otros rubros con demanda en {city.name}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {sister.map((s) => (
                    <Link
                      key={s.id}
                      href={`/c/${ciudad}/${s.seoSlug ?? s.id.replace(/_/g, '-')}`}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-md"
                    >
                      <div className="mb-2 h-1 w-8 rounded-full" style={{ backgroundColor: s.color }} />
                      <p className="font-bold text-[var(--text)]">{s.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">en {city.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href={`/p/${verticalSlug}`}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                {t.name} en todo Paraguay
                <ArrowRight size={14} />
              </Link>
              <Link
                href={`/c/${ciudad}`}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Todos los rubros en {city.name}
                <ArrowRight size={14} />
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
