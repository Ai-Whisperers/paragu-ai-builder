import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle, Star, Smartphone, Globe, Zap, Shield, BarChart3 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Página Web para Peluquerías en Paraguay | ParaguAI',
  description:
    'Creá tu página web profesional para peluquería en 48 horas. Sin conocimientos técnicos, dominio .com.py incluido, soporte por WhatsApp. Mirá ejemplos reales de peluquerías en Asunción.',
  alternates: { canonical: '/peluqueria' },
  openGraph: {
    title: 'Página Web para Peluquerías — ParaguAI',
    description: 'Sitio web profesional para tu peluquería. Demo gratis, dominio .com.py incluido.',
  },
}

const BENEFITS = [
  { icon: Star, title: 'Mostrá tu trabajo', desc: 'Galería de cortes, coloración y peinados que atrae clientes nuevos todos los días.' },
  { icon: Smartphone, title: 'Reservas online', desc: 'Tus clientes reservan desde el celular, 24/7. Sin llamadas, sin esperar.' },
  { icon: Globe, title: 'Parecé más profesional', desc: 'Una página web da más confianza que solo Instagram. Clientes que investigan antes de ir.' },
  { icon: Zap, title: 'Listo en 48 horas', desc: 'Te creamos el sitio con tus fotos, colores y servicios. Vos no tocás nada.' },
  { icon: Shield, title: 'Dominio .com.py', desc: 'Tu propio dominio profesional. Ej: peluqueria-maria.com.py' },
  { icon: BarChart3, title: 'SEO incluido', desc: 'Aparecés en Google cuando buscan peluquería en tu ciudad. Schema.org para reseñas.' },
]

const PRICING = [
  { name: 'Prueba', setup: 'Gs 0', monthly: 'Gs 0', period: '/ mes', cta: 'Probar gratis', popular: false, features: ['1 página', '3 fotos', 'WhatsApp Business', 'SEO básico'] },
  { name: 'Presencia', setup: 'Gs 350.000', monthly: 'Gs 100.000', period: '/ mes', cta: 'Elegir Presencia', popular: true, features: ['Hasta 5 páginas', '15 fotos', 'WhatsApp + reservas', 'Dominio .com.py', 'Galería de trabajos', 'SEO avanzado'] },
  { name: 'Crecimiento', setup: 'Gs 500.000', monthly: 'Gs 200.000', period: '/ mes', cta: 'Elegir Crecimiento', popular: false, features: ['Páginas ilimitadas', 'Fotos ilimitadas', 'Reservas online', 'E-commerce (20 prod.)', 'Blog + analytics', 'SEO avanzado'] },
]

const FAQS = [
  { q: '¿Necesito conocimientos técnicos?', a: 'No. Nosotros creamos todo, vos solo elegís fotos y colores. Los cambios los pedís por WhatsApp.' },
  { q: '¿Puedo tener reservas online?', a: 'Sí. Todos los planes incluyen sistema de reservas que tus clientes usan desde el celular.' },
  { q: '¿Qué pasa si quiero cancelar?', a: 'Cancelás cuando quieras, sin multa. Te llevás el dominio si lo compraste.' },
  { q: '¿Mi página va a aparecer en Google?', a: 'Sí. Incluimos SEO completo con Schema.org para peluquerías, optimización local y Google Maps.' },
]

export default function PeluqueriaPage() {
  return (
    <div className="hair-theme w-full">
      <SiteNav />
      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5" />
          <Container>
            <div className="relative mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Página web para peluquerías
              </p>
              <h1 className="mb-6 text-4xl font-extrabold text-foreground sm:text-5xl lg:text-6xl leading-tight">
                Tu peluquería en internet,{' '}
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                  lista en 48 horas
                </span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Sitio web profesional con galería de trabajos, reservas online y WhatsApp.
                Sin conocimientos técnicos, sin inversión inicial. Mirá ejemplos de
                peluquerías en Paraguay.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href={waLink('Hola, quiero una demo gratis de página web para mi peluquería.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 text-base font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <MessageCircle size={20} />
                  Quiero mi web gratis
                </a>
                <Link
                  href="/s/es/demo-peluqueria"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-border px-8 py-4 text-base font-bold text-foreground transition-all hover:border-[var(--primary)] hover:text-primary"
                >
                  Ver ejemplo real
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Social proof */}
        <section className="border-y border-border bg-surface-light py-12">
          <Container>
            <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3">
              <div>
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">147+</p>
                <p className="mt-1 text-sm text-muted-foreground">Peluquerías y spas en nuestra base</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">48 hs</p>
                <p className="mt-1 text-sm text-muted-foreground">Tiempo de entrega promedio</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">100%</p>
                <p className="mt-1 text-sm text-muted-foreground">Soporte por WhatsApp incluido</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <Container>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Todo lo que tu peluquería necesita online
              </h2>
              <p className="text-lg text-muted-foreground">
                No es solo una página. Es tu negocio disponible 24/7 para captar clientes.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <b.icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* What's included */}
        <section className="border-t border-border bg-surface-light py-20">
          <Container size="md">
            <div className="mx-auto max-w-3xl">
              <div className="mb-10 text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                  Tu página incluye
                </h2>
                <p className="text-lg text-muted-foreground">
                  Todo lo que una peluquería profesional necesita para brillar online.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  'Galería de trabajos (cortes, color, peinados)',
                  'Lista de servicios con precios',
                  'Perfiles del equipo stylist',
                  'Reservas online 24/7',
                  'WhatsApp Business integrado',
                  'Mapa de Google Maps',
                  'Testimonios de clientes',
                  'SEO local para Google',
                  'Dominio .com.py propio',
                  'Hosting y mantenimiento',
                  'Certificado SSL',
                  'Soporte por WhatsApp',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-[var(--success)]">
                      <Check size={14} />
                    </span>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Live examples */}
        <section className="py-20">
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Ejemplos de peluquerías
              </h2>
              <p className="text-lg text-muted-foreground">
                Sitios reales generados automáticamente. Cada uno con su estilo y servicios.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {[
                { name: 'Peluquería Galilea', slug: 'demo-peluqueria', rating: '5.0', reviews: '395' },
                { name: 'Barbería Tajos', slug: 'demo-barberia', rating: '4.9', reviews: '237' },
                { name: 'Spa Relax', slug: 'demo-spa', rating: '5.0', reviews: '736' },
              ].map((ex) => (
                <a
                  key={ex.slug}
                  href={`/s/es/${ex.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-1 text-sm text-foreground">
                    <Star size={14} className="fill-[var(--warning)] text-[var(--warning)]" />
                    <span className="font-bold">{ex.rating}</span>
                    <span className="text-muted-foreground">({ex.reviews} reseñas)</span>
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-foreground group-hover:text-primary">{ex.name}</h3>
                  <p className="text-sm text-muted-foreground">Ver sitio →</p>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* Pricing */}
        <section className="border-t border-border bg-surface-light py-20" id="precios">
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Planes</p>
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Pagás en guaraníes, cancelás cuando quieras
              </h2>
              <p className="text-lg text-muted-foreground">
                Setup único + mensualidad baja. Sin permanencia. 30 días de garantía.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
              {PRICING.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all hover:-translate-y-1 ${
                    plan.popular
                      ? 'border-[var(--primary)] bg-gradient-to-b from-[var(--primary)]/5 to-transparent'
                      : 'border-border bg-surface'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-1 text-xs font-bold text-[var(--primary-foreground)] shadow">
                      Recomendado
                    </div>
                  )}
                  <h3 className="mb-1 text-xl font-bold text-foreground">{plan.name}</h3>
                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-primary">{plan.setup}</span>
                    {plan.monthly !== 'Gs 0' && (
                      <span className="text-sm text-muted-foreground"> + {plan.monthly}{plan.period}</span>
                    )}
                  </div>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={14} className="mt-0.5 shrink-0 text-[var(--success)]" />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={waLink(`Hola, quiero el plan ${plan.name} para mi peluquería.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto block rounded-xl py-3 text-center text-sm font-bold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] hover:opacity-90'
                        : 'border-2 border-border text-foreground hover:border-[var(--primary)] hover:text-primary'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <Container size="sm">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Preguntas frecuentes</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-border bg-surface p-5 open:border-[var(--primary)]">
                  <summary className="flex cursor-pointer items-center justify-between text-base font-bold text-foreground">
                    {faq.q}
                    <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 py-20">
          <Container size="md">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                ¿Lista para tener tu página web?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Respondemos en menos de 5 minutos por WhatsApp. Sin vueltas, sin compromiso.
              </p>
              <a
                href={waLink('Hola, quiero una página web para mi peluquería. ¿Cómo arrancamos?')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 text-base font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <MessageCircle size={20} />
                Empezar ahora
              </a>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
