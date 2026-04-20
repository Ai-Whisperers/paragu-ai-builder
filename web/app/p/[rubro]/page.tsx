import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, ExternalLink, MessageCircle, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { LIVE_TEMPLATES, TEMPLATES, waLink, type Template } from '@/lib/landing/marketing-data'

type Params = { rubro: string }

function findTemplate(rubro: string): Template | undefined {
  return LIVE_TEMPLATES.find((t) => (t.seoSlug ?? t.id.replace(/_/g, '-')) === rubro)
}

export function generateStaticParams() {
  return LIVE_TEMPLATES.map((t) => ({ rubro: t.seoSlug ?? t.id.replace(/_/g, '-') }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { rubro } = await params
  const t = findTemplate(rubro)
  if (!t) return { title: 'Plantilla no encontrada' }
  const title = t.seoHeadline ?? `Sitio web para ${t.name.toLowerCase()} — listo en 48 horas`
  const description =
    t.seoLead ??
    `Plantilla profesional especializada para ${t.name.toLowerCase()} en Paraguay. Demo gratis antes de pagar.`
  return {
    title,
    description,
    alternates: { canonical: `/p/${rubro}` },
    openGraph: { title, description, type: 'website' },
  }
}

export default async function VerticalLandingPage({ params }: { params: Promise<Params> }) {
  const { rubro } = await params
  const t = findTemplate(rubro)
  if (!t) notFound()

  const headline = t.seoHeadline ?? `Sitio web para ${t.name.toLowerCase()}, listo en 48 horas`
  const lead =
    t.seoLead ??
    `Plantilla profesional pensada específicamente para ${t.name.toLowerCase()}. Vos no tocás nada — nosotros publicamos.`

  const waMessage = `Hola, me interesa la plantilla de ${t.name} para mi negocio en Paraguay.`

  const sister = LIVE_TEMPLATES.filter((x) => x.id !== t.id).slice(0, 4)

  return (
    <>
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-20"
            style={{
              background: `radial-gradient(circle at 70% 30%, ${t.color}33 0%, transparent 50%)`,
            }}
          />
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <div
                className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${t.color}15`, color: t.color }}
              >
                <Sparkles size={28} />
              </div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: t.color }}>
                Plantilla {t.name}
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-[var(--text)] sm:text-5xl md:text-6xl">
                {headline}
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--text-light)] md:text-xl">
                {lead}
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

              {t.leads > 0 && (
                <p className="mt-8 text-sm text-[var(--text-muted)]">
                  Mercado PY: <strong className="text-[var(--text)]">{t.leads.toLocaleString('es-PY')}</strong> negocios mapeados · <strong className="text-[var(--text)]">{t.pct}%</strong> sin web propia
                </p>
              )}
            </div>
          </Container>
        </section>

        {/* What's included */}
        <section className="border-y border-[var(--border)] bg-[var(--surface-light)] py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-[var(--text)]">
                Qué incluye tu sitio
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  'Hero con tu propuesta única',
                  'Servicios o catálogo',
                  'Galería de fotos',
                  'WhatsApp Business',
                  'Google Maps + horarios',
                  'Formulario de contacto',
                  'SEO + Schema.org',
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

        {/* CTA + sister verticals */}
        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)]">Listo en 48 horas</h2>
              <p className="mb-8 text-[var(--text-light)]">
                Mandá el nombre de tu {t.name.toLowerCase()} por WhatsApp. Te enviamos la demo
                personalizada antes de cobrarte un solo guaraní.
              </p>
              <a
                href={waLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 text-lg font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1"
              >
                <MessageCircle size={20} />
                Pedir demo gratis
              </a>
            </div>

            <div className="mx-auto mt-20 max-w-5xl">
              <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
                ¿Tu rubro es otro? Mirá estas plantillas
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sister.map((s) => (
                  <Link
                    key={s.id}
                    href={`/p/${s.seoSlug ?? s.id.replace(/_/g, '-')}`}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-md"
                  >
                    <div
                      className="mb-2 h-1 w-8 rounded-full"
                      style={{ backgroundColor: s.color }}
                      aria-hidden
                    />
                    <p className="font-bold text-[var(--text)]">{s.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">Ver plantilla</p>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/p"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]"
                >
                  Ver las {TEMPLATES.length} plantillas
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
