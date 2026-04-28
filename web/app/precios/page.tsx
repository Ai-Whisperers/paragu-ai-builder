import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle, X } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { ROICalculator } from '@/components/landing/roi-calculator'
import { PLANS, waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Precios — sitios web profesionales en guaraníes (PYG)',
  description:
    'Setup único + cuota mensual baja, sin permanencia. 4 planes desde gratis hasta multi-sucursal. Mercado Pago o transferencia bancaria. 30 días de garantía.',
  alternates: { canonical: '/precios' },
}

const FEATURE_MATRIX = [
  { row: 'Páginas', prueba: '1', presencia: 'Hasta 5', crecimiento: 'Ilimitadas', profesional: 'Ilimitadas' },
  { row: 'Dominio propio (.com.py)', prueba: false, presencia: '1 año incluido', crecimiento: '1 año incluido', profesional: '1 año incluido' },
  { row: 'Fotos optimizadas', prueba: '3', presencia: '15', crecimiento: 'Ilimitadas', profesional: 'Ilimitadas' },
  { row: 'WhatsApp Business', prueba: true, presencia: true, crecimiento: true, profesional: true },
  { row: 'SEO + Schema.org', prueba: 'Básico', presencia: 'Básico', crecimiento: 'Avanzado', profesional: 'Avanzado' },
  { row: 'Reservas online', prueba: false, presencia: false, crecimiento: true, profesional: true },
  { row: 'E-commerce / Catálogo', prueba: false, presencia: false, crecimiento: 'Hasta 20 productos', profesional: 'Ilimitado' },
  { row: 'Blog y analytics', prueba: false, presencia: false, crecimiento: true, profesional: true },
  { row: 'Multi-idioma (es/en/pt)', prueba: false, presencia: false, crecimiento: false, profesional: true },
  { row: 'Multi-sucursal', prueba: false, presencia: false, crecimiento: false, profesional: 'Hasta 5 locales' },
  { row: 'Cambios de contenido / mes', prueba: '0', presencia: '2', crecimiento: '5', profesional: '10 + 10h dev' },
  { row: 'Account manager dedicado', prueba: false, presencia: false, crecimiento: false, profesional: true },
  { row: 'SLA 99.9% uptime', prueba: false, presencia: false, crecimiento: false, profesional: true },
] as const

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-[var(--success)]">
        <Check size={14} />
      </span>
    )
  if (value === false)
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-border text-muted-foreground">
        <X size={14} />
      </span>
    )
  return <span className="text-sm text-foreground">{value}</span>
}

export default function PreciosPage() {
  return (
    <>
      <SiteNav />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                Precios
              </p>
              <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
                Pagás en guaraníes, cancelás cuando quieras
              </h1>
              <p className="text-lg text-muted-foreground">
                Setup único + mensualidad baja. Sin permanencia, sin sorpresas. 30 días de garantía
                en cualquier plan pago.
              </p>
            </div>
          </Container>
        </section>

        {/* Premium grace explainer */}
        <section className="pb-8">
          <Container size="md">
            <div className="mx-auto max-w-3xl rounded-3xl border-2 border-[var(--primary)]/30 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 p-6 md:p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Cómo funciona el período Profesional incluido
              </div>
              <p className="text-base text-foreground md:text-lg">
                Todos los planes (incluido el gratuito) <strong>arrancan con la experiencia
                Profesional completa</strong>. Es nuestra forma de que conozcas todo lo que ofrecemos
                antes de decidir qué necesitás a largo plazo.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>· <strong className="text-foreground">Prueba</strong>: 3 meses Profesional · después seguís online con marca ParaguAI</li>
                <li>· <strong className="text-foreground">Presencia</strong>: 7 meses Profesional · después tu plan Presencia</li>
                <li>· <strong className="text-foreground">Crecimiento</strong>: 8 meses Profesional · después tu plan Crecimiento</li>
                <li>· <strong className="text-foreground">Profesional</strong>: siempre completo, sin downgrades</li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Durante el período Profesional tenés WhatsApp dedicado y check-in mensual con nosotros para entender qué features usás más y necesitás conservar.
              </p>
            </div>
          </Container>
        </section>

        {/* Plans grid */}
        <section className="py-12">
          <Container>
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex h-full flex-col rounded-3xl border-2 p-7 transition-all hover:-translate-y-1 hover:shadow-2xl ${
                    plan.popular
                      ? 'border-[var(--primary)] bg-gradient-to-b from-[var(--primary)]/5 to-transparent'
                      : 'border-border bg-surface'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-2 text-sm font-bold text-[var(--primary-foreground)] shadow-lg whitespace-nowrap">
                        Recomendado
                      </span>
                    </div>
                  )}
                  <div className="mb-6 text-center">
                    <h3 className="mb-2 text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
                    <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface-light py-4 px-3">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Setup único
                      </span>
                      <span className="text-2xl font-extrabold text-foreground">{plan.setup}</span>
                      <span className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                        Después
                      </span>
                      <span className="text-lg font-bold text-primary">{plan.monthly}</span>
                      <span className="text-xs text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            feat.included
                              ? 'bg-success/10 text-[var(--success)]'
                              : 'bg-border text-muted-foreground'
                          }`}
                        >
                          {feat.included ? <Check size={12} /> : <X size={12} />}
                        </div>
                        <span className={feat.included ? 'text-foreground' : 'text-muted-foreground'}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={waLink(plan.waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto block w-full rounded-2xl py-3.5 text-center text-sm font-bold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] hover:opacity-90 hover:shadow-lg'
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

        {/* ROI calculator */}
        <section className="border-t border-border bg-surface-light py-20">
          <Container>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="mb-3 text-3xl font-bold text-foreground">
                Calculá cuándo se paga sola
              </h2>
              <p className="text-muted-foreground">
                Mové los números a los tuyos. Si el resultado no cierra, dejanos saber — capaz que
                este no es el momento.
              </p>
            </div>
            <ROICalculator />
          </Container>
        </section>

        {/* Comparison table */}
        <section className="py-20">
          <Container>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="mb-3 text-3xl font-bold text-foreground">Comparación detallada</h2>
              <p className="text-muted-foreground">
                Todo lo que cambia entre planes, sin letra chica.
              </p>
            </div>
            <div className="mx-auto max-w-5xl overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left">
                <thead className="bg-surface-light">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-foreground">Característica</th>
                    {PLANS.map((p) => (
                      <th
                        key={p.id}
                        className={`p-4 text-center text-sm font-semibold ${
                          p.popular ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-surface">
                  {FEATURE_MATRIX.map((row) => (
                    <tr key={row.row}>
                      <td className="p-4 text-sm font-medium text-foreground">{row.row}</td>
                      <td className="p-4 text-center">
                        <Cell value={row.prueba} />
                      </td>
                      <td className="p-4 text-center">
                        <Cell value={row.presencia} />
                      </td>
                      <td className="p-4 text-center">
                        <Cell value={row.crecimiento} />
                      </td>
                      <td className="p-4 text-center">
                        <Cell value={row.profesional} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-16">
          <Container size="md">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-2xl font-bold text-foreground">¿Aún tenés dudas?</h2>
              <p className="mb-6 text-muted-foreground">
                Mandanos un WhatsApp con tu rubro y te decimos qué plan se ajusta mejor — sin
                vender humo.
              </p>
              <a
                href={waLink('Hola, quiero ayuda para elegir el plan correcto para mi negocio.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1"
              >
                <MessageCircle size={18} />
                Hablar con ventas
              </a>
              <div className="mt-8">
                <Link
                  href="/comparacion"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
                >
                  Ver cómo nos comparamos con Wix y agencias
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
