import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, ExternalLink, MessageCircle, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { LIVE_TEMPLATES, waLink, type Template } from '@/lib/landing/marketing-data'

type Params = { rubro: string }

/**
 * English version of /p/[rubro] vertical landing.
 *
 * Why a parallel route instead of a [locale] segment: marketing copy in
 * Spanish is the default and primary product. EN exists for international
 * audiences (Nexa pattern). Keeping ES at /p/* preserves canonical URLs and
 * SEO equity; EN gets its own canonical at /en/p/*.
 *
 * Translation: hand-written for the 16 live templates' core verbs. The lead
 * paragraph stays vertical-aware via t.seoLead being implicitly Spanish, but
 * here we use generic English copy referencing the same business type.
 */
const VERTICAL_EN: Record<string, { name: string; tagline: string }> = {
  peluqueria: { name: 'Hair Salon', tagline: 'Online booking, work gallery, and price list — all sent through your WhatsApp.' },
  salon_belleza: { name: 'Beauty Salon', tagline: 'Showcase your services, team, and gallery. Clients book through WhatsApp in one click.' },
  gimnasio: { name: 'Gym / Fitness', tagline: 'Memberships, class schedules, trainer profiles, and a free-trial form. Capture members beyond Instagram.' },
  spa: { name: 'Spa & Wellness', tagline: 'Premium design that conveys calm, with treatment packages and WhatsApp bookings.' },
  barberia: { name: 'Barbershop', tagline: 'Classic or modern aesthetic, cut gallery, clear price list, and WhatsApp appointments.' },
  unas: { name: 'Nail Salon', tagline: 'Design showcase, service list with type and duration, and direct WhatsApp bookings.' },
  tatuajes: { name: 'Tattoo Studio', tagline: 'Per-artist portfolio, styles, reference pricing, and WhatsApp consultation booking.' },
  estetica: { name: 'Aesthetic / Facial', tagline: 'Treatments, team, before-and-after, and WhatsApp bookings — all on one professional site.' },
  diseno_grafico: { name: 'Graphic Design', tagline: 'Grid portfolio, work process, USD or local pricing, and direct contact. Made for freelancers.' },
  pestanas: { name: 'Lashes & Brows', tagline: 'Style catalog, work duration, prices, and WhatsApp bookings. Optimized for Instagram traffic.' },
  depilacion: { name: 'Hair Removal', tagline: 'Per-session areas, packages, FAQs, and WhatsApp bookings on a single page.' },
  relocation: { name: 'Relocation Services', tagline: 'Serious site for international clients, multi-language, with process, case studies, and direct contact.' },
  meal_prep: { name: 'Meal Prep & Delivery', tagline: 'Weekly menu with prices, dish selection, and WhatsApp checkout. Ready to scale.' },
  restaurant: { name: 'Restaurant', tagline: 'Digital menu, venue gallery, online or WhatsApp reservations. Mobile-optimized.' },
  sushi_bar: { name: 'Sushi Bar', tagline: 'Minimal Japanese design, photo menu, WhatsApp delivery, venue gallery.' },
  kaiten_zushi: { name: 'Kaiten Sushi', tagline: 'Color-coded plate pricing, locations, promotions, and online reservations.' },
}

function findTemplate(rubro: string): Template | undefined {
  return LIVE_TEMPLATES.find((t) => (t.seoSlug ?? t.id.replace(/_/g, '-')) === rubro)
}

export function generateStaticParams() {
  return LIVE_TEMPLATES.map((t) => ({ rubro: t.seoSlug ?? t.id.replace(/_/g, '-') }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { rubro } = await params
  const t = findTemplate(rubro)
  if (!t) return { title: 'Template not found' }
  const en = VERTICAL_EN[t.id]
  const name = en?.name ?? t.name
  const title = `Website for ${name.toLowerCase()} in Paraguay — live in 48h`
  const description = en?.tagline ?? `Professional website template for ${name.toLowerCase()} in Paraguay. Free demo before payment.`
  return {
    title,
    description,
    alternates: {
      canonical: `/en/p/${rubro}`,
      languages: { 'es-PY': `/p/${rubro}`, 'en': `/en/p/${rubro}` },
    },
    openGraph: { title, description, type: 'website' },
  }
}

export default async function VerticalLandingEnPage({ params }: { params: Promise<Params> }) {
  const { rubro } = await params
  const t = findTemplate(rubro)
  if (!t) notFound()

  const en = VERTICAL_EN[t.id] ?? { name: t.name, tagline: `Professional website for ${t.name.toLowerCase()}.` }
  const waMessage = `Hi, I'm interested in the ${en.name} template for my business in Paraguay.`

  return (
    <>
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-20"
            style={{ background: `radial-gradient(circle at 70% 30%, ${t.color}33 0%, transparent 50%)` }}
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
                {en.name} template
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
                Website for {en.name.toLowerCase()} in Paraguay, live in 48 hours
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                {en.tagline}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={waLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <MessageCircle size={20} />
                  Request free demo
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </a>
                {t.demoSlug && (
                  <Link
                    href={`/${t.demoSlug}`}
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-surface px-8 py-4 text-lg font-bold text-foreground transition-all hover:border-[var(--primary)] hover:text-primary"
                  >
                    See live demo
                    <ExternalLink size={18} />
                  </Link>
                )}
              </div>

              {t.leads > 0 && (
                <p className="mt-8 text-sm text-muted-foreground">
                  PY market: <strong className="text-foreground">{t.leads.toLocaleString('en-US')}</strong> mapped businesses · <strong className="text-foreground">{t.pct}%</strong> without their own website
                </p>
              )}
            </div>
          </Container>
        </section>

        {/* What's included */}
        <section className="border-y border-border bg-surface-light py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
                What your site includes
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  'Hero with your unique offer',
                  'Services or catalog',
                  'Photo gallery',
                  'WhatsApp Business',
                  'Google Maps + hours',
                  'Contact form',
                  'SEO + Schema.org',
                  'Hosting + SSL included',
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-[var(--success)]">
                      <Check size={14} />
                    </span>
                    <span className="text-sm text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* CTA + locale switch */}
        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground">Live in 48 hours</h2>
              <p className="mb-8 text-muted-foreground">
                Send your business name through WhatsApp. We deliver a personalized demo before
                you pay a single guarani.
              </p>
              <a
                href={waLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 text-lg font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1"
              >
                <MessageCircle size={20} />
                Request free demo
              </a>
              <div className="mt-8 text-sm">
                <Link href={`/p/${rubro}`} className="text-primary hover:underline">
                  ¿Hablás español? Ver esta página en español →
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
