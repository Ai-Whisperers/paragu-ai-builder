import {
  Wand2,
  Check,
  ArrowRight,
  Star,
  ChevronDown,
  Sparkles,
  Shield,
  Zap,
  MessageCircle,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { HomeAnimations } from '@/components/home/home-animations'

/* ── Pricing tiers ─────────────────────────────────────────────────── */

const TIERS = [
  {
    name: 'Gratis / Vista Previa',
    price: 'Gs. 0',
    period: '',
    description: 'Ideal para conocer la plataforma y ver como queda tu sitio antes de publicarlo.',
    icon: Sparkles,
    highlighted: false,
    features: [
      'Sitio de vista previa',
      '1 pagina',
      'Diseno basico',
      'URL temporal (negocio.paragu.ai)',
      'Contenido generado con IA',
    ],
    cta: 'Probar Gratis',
    ctaHref: '/admin',
  },
  {
    name: 'Profesional',
    price: 'Gs. 150.000',
    period: '/mes',
    description: 'Todo lo que necesitas para tener una presencia web profesional y atraer clientes.',
    icon: Star,
    highlighted: true,
    badge: 'Mas Popular',
    features: [
      'Todo lo del plan Gratis',
      'Dominio propio',
      'SEO optimizado',
      'WhatsApp integrado',
      'Google Maps',
      'Galeria de fotos (hasta 20)',
      'Equipo y testimonios',
      'Soporte por WhatsApp',
    ],
    cta: 'Elegir Plan',
    ctaHref: '/admin',
  },
  {
    name: 'Premium',
    price: 'Gs. 300.000',
    period: '/mes',
    description: 'Para negocios que quieren el maximo rendimiento y soporte dedicado.',
    icon: Shield,
    highlighted: false,
    features: [
      'Todo lo del plan Profesional',
      'Fotos ilimitadas',
      'Reservas online',
      'Panel de analiticas',
      'Reportes SEO mensuales',
      'Actualizacion de contenido con IA',
      'Soporte prioritario',
    ],
    cta: 'Contactar Ventas',
    ctaHref: '/admin',
  },
] as const

/* ── FAQ ───────────────────────────────────────────────────────────── */

const FAQS = [
  {
    question: 'Puedo probar la plataforma antes de pagar?',
    answer:
      'Si, el plan Gratis te permite generar un sitio de vista previa completo sin costo. Podes ver como queda tu sitio antes de comprometerte con un plan de pago.',
  },
  {
    question: 'Que metodos de pago aceptan?',
    answer:
      'Aceptamos transferencia bancaria, pagos por Tigo Money, Personal Pay y tarjetas de credito/debito. Tambien podes pagar en efectivo en nuestras oficinas.',
  },
  {
    question: 'Puedo cambiar de plan en cualquier momento?',
    answer:
      'Si, podes actualizar o cambiar tu plan en cualquier momento. Si actualizas, solo pagas la diferencia proporcional. Si bajas de plan, el cambio se aplica en tu proximo ciclo de facturacion.',
  },
  {
    question: 'Que pasa con mi sitio si cancelo?',
    answer:
      'Si cancelas tu plan de pago, tu sitio se convierte automaticamente en un sitio de vista previa (plan Gratis). No perdes tu contenido, simplemente se desactivan las funcionalidades premium.',
  },
  {
    question: 'Necesito conocimientos tecnicos para usar la plataforma?',
    answer:
      'No, para nada. Nuestra IA genera todo el contenido, diseno y configuracion automaticamente. Solo necesitas proporcionar la informacion basica de tu negocio y nosotros nos encargamos del resto.',
  },
  {
    question: 'El dominio propio esta incluido en el precio?',
    answer:
      'El registro del dominio tiene un costo adicional anual (aproximadamente Gs. 80.000/ano), pero la configuracion, el certificado SSL y el hosting estan incluidos en los planes Profesional y Premium.',
  },
  {
    question: 'Cuanto tiempo tarda en estar listo mi sitio?',
    answer:
      'Tu sitio de vista previa se genera en minutos. Una vez que elegis un plan de pago y proporcionas tu informacion completa, el sitio publicado esta listo en menos de 24 horas.',
  },
]

/* ── FAQ Item (uses native details/summary for no-JS accordion) ──── */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-normal hover:shadow-card">
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-left text-base font-semibold text-[var(--text)] [&::-webkit-details-marker]:hidden">
        {question}
        <ChevronDown
          size={20}
          className="shrink-0 text-[var(--text-muted)] transition-transform duration-normal group-open:rotate-180"
        />
      </summary>
      <div className="px-6 pb-6 text-sm leading-relaxed text-[var(--text-light)]">
        {answer}
      </div>
    </details>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <>
      <HomeAnimations />

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Wand2 size={20} />
              </div>
              <span className="text-lg font-bold text-[var(--text)]">
                Paragu<span className="text-[var(--primary)]">AI</span>
              </span>
            </a>
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="/"
                className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]"
              >
                Inicio
              </a>
              <a
                href="/#plantillas"
                className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]"
              >
                Plantillas
              </a>
              <a
                href="/pricing"
                className="text-sm font-medium text-[var(--primary)]"
              >
                Precios
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/admin"
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-all hover:bg-[var(--surface-light)]"
              >
                Panel Admin
              </a>
            </div>
          </div>
        </Container>
      </nav>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5" />
            <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--primary)]/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/2 -translate-x-1/4 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container size="md">
            <div className="mx-auto max-w-3xl text-center">
              <div className="hero-animate mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm text-[var(--text-light)]">
                <Zap size={14} className="text-[var(--primary)]" />
                Planes simples, sin sorpresas
              </div>

              <h1 className="hero-animate-delay-1 mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--text)] sm:text-5xl md:text-6xl">
                El precio justo para{' '}
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                  tu negocio
                </span>
              </h1>

              <p className="hero-animate-delay-2 mx-auto mb-4 max-w-2xl text-lg text-[var(--text-light)] md:text-xl">
                Empeza gratis con una vista previa y actualiza cuando estes listo.
                Sin contratos, sin permanencia minima.
              </p>
            </div>
          </Container>
        </section>

        {/* ── Pricing Cards ───────────────────────────────────────── */}
        <section className="relative pb-20 md:pb-28">
          <Container>
            <div className="section-fade mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
              {TIERS.map((tier) => {
                const Icon = tier.icon
                return (
                  <div
                    key={tier.name}
                    className={`relative flex flex-col rounded-2xl border bg-[var(--surface)] p-8 transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover ${
                      tier.highlighted
                        ? 'border-[var(--primary)] shadow-card-hover ring-1 ring-[var(--primary)] lg:scale-105'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    {/* Badge for highlighted tier */}
                    {tier.highlighted && 'badge' in tier && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-1.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-button">
                          <Star size={14} className="fill-current" />
                          {tier.badge}
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="mb-6">
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                          tier.highlighted
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                            : 'bg-[var(--primary)]/10 text-[var(--primary)]'
                        }`}
                      >
                        <Icon size={24} />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-[var(--text)]">{tier.name}</h3>
                      <p className="text-sm text-[var(--text-muted)]">{tier.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tight text-[var(--text)]">
                          {tier.price}
                        </span>
                        {tier.period && (
                          <span className="text-base font-medium text-[var(--text-muted)]">
                            {tier.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mb-6 h-px bg-[var(--border)]" />

                    {/* Features */}
                    <ul className="mb-8 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              tier.highlighted
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                : 'bg-[var(--success)]/15 text-[var(--success)]'
                            }`}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span className="text-sm leading-snug text-[var(--text-light)]">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <a
                      href={tier.ctaHref}
                      className={`mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold transition-all duration-normal hover:-translate-y-0.5 ${
                        tier.highlighted
                          ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-button hover:shadow-card-hover'
                          : 'border-2 border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                      }`}
                    >
                      {tier.cta}
                      <ArrowRight size={18} />
                    </a>
                  </div>
                )
              })}
            </div>

            {/* Trust line */}
            <div className="section-fade mt-12 text-center">
              <p className="text-sm text-[var(--text-muted)]">
                <MessageCircle size={14} className="mr-1.5 inline-block align-[-2px]" />
                Tenes dudas? Escribinos por{' '}
                <a
                  href="https://wa.me/595981000000"
                  className="font-medium text-[var(--primary)] underline-offset-2 hover:underline"
                >
                  WhatsApp
                </a>{' '}
                y te ayudamos a elegir el plan ideal.
              </p>
            </div>
          </Container>
        </section>

        {/* ── Comparison highlight ────────────────────────────────── */}
        <section className="bg-[var(--surface-light)] py-20 md:py-28">
          <Container size="md">
            <div className="section-fade mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                Por que ParaguAI?
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Mucho mas que un sitio web
              </h2>
              <p className="mb-12 text-[var(--text-light)]">
                Compara el costo de un desarrollador web tradicional contra la solucion
                automatizada de ParaguAI Builder.
              </p>
            </div>

            <div className="section-fade grid gap-6 sm:grid-cols-2">
              {/* Traditional */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
                <h3 className="mb-2 text-lg font-bold text-[var(--text)]">
                  Desarrollo Web Tradicional
                </h3>
                <p className="mb-6 text-3xl font-extrabold text-[var(--text-muted)]">
                  Gs. 3.000.000+
                </p>
                <ul className="space-y-3">
                  {[
                    'Tiempo de entrega: 2-4 semanas',
                    'Costo de mantenimiento adicional',
                    'Actualizaciones manuales',
                    'SEO no garantizado',
                    'Sin soporte continuo incluido',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-muted)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ParaguAI */}
              <div className="rounded-2xl border-2 border-[var(--primary)] bg-[var(--surface)] p-8 shadow-card-hover">
                <h3 className="mb-2 text-lg font-bold text-[var(--primary)]">
                  ParaguAI Builder
                </h3>
                <p className="mb-6 text-3xl font-extrabold text-[var(--text)]">
                  Gs. 150.000<span className="text-base font-medium text-[var(--text-muted)]">/mes</span>
                </p>
                <ul className="space-y-3">
                  {[
                    'Listo en minutos, no semanas',
                    'Hosting y mantenimiento incluido',
                    'Contenido actualizado con IA',
                    'SEO optimizado automaticamente',
                    'Soporte por WhatsApp incluido',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-light)]">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <Container size="md">
            <div className="section-fade mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                Preguntas Frecuentes
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Resolvemos tus dudas
              </h2>
              <p className="text-[var(--text-light)]">
                Todo lo que necesitas saber sobre nuestros planes y la plataforma.
              </p>
            </div>

            <div className="section-fade mx-auto max-w-3xl space-y-4">
              {FAQS.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className="section-fade mt-10 text-center">
              <p className="text-sm text-[var(--text-muted)]">
                No encontras lo que buscas?{' '}
                <a
                  href="https://wa.me/595981000000"
                  className="font-medium text-[var(--primary)] underline-offset-2 hover:underline"
                >
                  Contactanos por WhatsApp
                </a>
              </p>
            </div>
          </Container>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]" />
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />
            <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-white blur-3xl" />
          </div>

          <Container size="md">
            <div className="section-fade mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-[var(--primary-foreground)] sm:text-4xl">
                Empeza hoy, es gratis
              </h2>
              <p className="mb-8 text-lg text-[var(--primary-foreground)]/80">
                Genera tu sitio de vista previa sin costo y ve como se transforma
                la presencia digital de tu negocio.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[var(--primary)] shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  Crear Mi Sitio Gratis
                  <ArrowRight size={18} />
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all duration-normal hover:border-white/60"
                >
                  Ver Ejemplos
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
                  <Wand2 size={16} />
                </div>
                <span className="text-lg font-bold text-[var(--text)]">
                  Paragu<span className="text-[var(--primary)]">AI</span> Builder
                </span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
                Motor de generacion de sitios web con inteligencia artificial para negocios
                de belleza y bienestar en Paraguay.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-[var(--text)]">Plataforma</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>
                  <a href="/#plantillas" className="transition-colors hover:text-[var(--primary)]">
                    Plantillas
                  </a>
                </li>
                <li>
                  <a href="/#proyectos" className="transition-colors hover:text-[var(--primary)]">
                    Proyectos
                  </a>
                </li>
                <li>
                  <a href="/#funcionalidades" className="transition-colors hover:text-[var(--primary)]">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="transition-colors hover:text-[var(--primary)]">
                    Precios
                  </a>
                </li>
              </ul>
            </div>

            {/* Business Types */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-[var(--text)]">Categorias</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>Peluquerias</li>
                <li>Gimnasios & Fitness</li>
                <li>Spas & Wellness</li>
                <li>Barberias</li>
                <li>
                  <a href="/#plantillas" className="text-[var(--primary)]">
                    +6 categorias mas
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} ParaguAI Builder. Todos los derechos reservados.
          </div>
        </Container>
      </footer>
    </>
  )
}
