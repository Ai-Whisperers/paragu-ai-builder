'use client'

import { useState } from 'react'
import { MessageCircle, Check, ChevronDown, ArrowRight,
         Sparkles, Zap, Crown, Star } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

function waLink(msg: string) {
  return `https://wa.me/595981324569?text=${encodeURIComponent(msg)}`
}

const PLANS = [
  {
    name: 'Diagnóstico',
    tagline: 'Sin compromiso',
    setup: 'Gratis',
    monthly: null,
    description: 'Análisis + demo estratégica de tu sistema de captación',
    color: 'gray',
    features: [
      'Análisis de tu negocio y competencia local',
      'Demo de tu sistema en Google + WhatsApp',
      'Recomendación de plan según tus objetivos',
      'Sin tarjeta, sin contrato, sin compromiso',
    ],
    notIncluded: ['Dominio .com.py propio', 'Sitio profesional', 'Operación mensual'],
    cta: 'Pedir diagnóstico gratis',
    msg: 'Hola, quiero pedir el diagnóstico gratis para mi negocio.',
  },
  {
    name: 'Launch',
    tagline: 'Para empezar',
    setup: 'Gs 3.000.000',
    monthly: 'Gs 500.000',
    description: 'Sistema de captación completo para empezar a crecer',
    color: 'blue',
    popular: true,
    features: [
      'Sitio profesional (hasta 5 páginas)',
      'Dominio .com.py + hosting + SSL',
      'Embudo WhatsApp + formulario de contacto',
      'SEO local + ficha Google Business',
      '2 actualizaciones mensuales',
      'Reporte mensual de visitas y leads',
    ],
    notIncluded: ['Blog + contenidos SEO mensuales', 'Campañas de captación'],
    cta: 'Elegir Launch',
    msg: 'Hola, me interesa el plan Launch (Gs 3.000.000 + Gs 500.000/mes). ¿Podemos hablar?',
  },
  {
    name: 'Growth',
    tagline: 'Escalar consultas',
    setup: 'Gs 6.000.000',
    monthly: 'Gs 1.000.000',
    description: 'Para escalar consultas y reservas sin contratar más personal',
    color: 'purple',
    features: [
      'Todo lo del plan Launch',
      'Blog + contenidos SEO mensuales',
      'Panel de leads y conversiones',
      '1 campaña de captación por mes',
      '6 actualizaciones mensuales',
      'Soporte prioritario + sesión estratégica',
    ],
    notIncluded: ['Automatizaciones avanzadas', 'CRM integrado'],
    cta: 'Elegir Growth',
    msg: 'Hola, me interesa el plan Growth (Gs 6.000.000 + Gs 1.000.000/mes). ¿Cuándo podemos hablar?',
  },
  {
    name: 'Scale',
    tagline: 'Máximo crecimiento',
    setup: 'Gs 12.000.000',
    monthly: 'Gs 2.000.000',
    description: 'Sistema completo para negocios en expansión',
    color: 'amber',
    features: [
      'Todo lo del plan Growth',
      'Automatizaciones y flujos de seguimiento',
      'Integración CRM + procesos comerciales',
      'Landing pages para campañas pagas',
      'Optimización quincenal de conversión',
      'Soporte same-day + asesor dedicado',
    ],
    notIncluded: [],
    cta: 'Elegir Scale',
    msg: 'Hola, me interesa el plan Scale (Gs 12.000.000 + Gs 2.000.000/mes). ¿Podemos agendar una llamada?',
  },
]

const ADDONS = [
  { name: 'Bot de WhatsApp', price: 'Gs 600.000/mes', desc: 'Reservas, pedidos o atención automatizada 24/7' },
  { name: 'E-commerce básico', price: 'Gs 400.000/mes', desc: 'Catálogo + WhatsApp para ventas directas' },
  { name: 'SEO avanzado', price: 'Gs 300.000/mes', desc: 'Link building, contenido adicional, optimización mensual' },
  { name: 'Google Ads management', price: 'Gs 500.000/mes', desc: 'Gestión + optimización de campañas en Google' },
]

const FAQS = [
  { q: '¿Qué incluye el setup de Gs 3M?', a: 'Dominio .com.py a tu nombre, hosting, SSL, diseño profesional, configuración de Google Business, embudo de WhatsApp y todo listo para publicar en 48h.' },
  { q: '¿Qué pasa si quiero cambiar de plan?', a: 'Podés escalar en cualquier momento. El upgrade se hace efectivo el mes siguiente y solo pagás la diferencia proporcional.' },
  { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. No hay permanencia mínima. Cancelás cuando quieras desde el mes siguiente. Tu sitio y dominio quedan tuyos.' },
  { q: '¿Los precios son IVA incluido?', a: 'Los precios listed son sin IVA. Facturamos con IVA addicional según la normativa Paraguaya.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Transferencia bancaria, cheques, efectivo. Para clientes recurrentes también Mercado Pago y Nequi.' },
  { q: '¿El dominio es mío?', a: 'Sí. El dominio queda a tu nombre desde el primer día. Si algún día cancelás, podés seguir usando el dominio con otro proveedor.' },
]

const colorMap: Record<string, string> = {
  gray: { border: 'border-gray-200', badge: 'bg-gray-100 text-gray-700', btn: 'border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600', icon: 'text-gray-500' },
  blue: { border: 'border-blue-500', badge: 'bg-blue-100 text-blue-700', btn: 'bg-blue-500 text-white hover:bg-blue-600', icon: 'text-blue-500' },
  purple: { border: 'border-purple-500', badge: 'bg-purple-100 text-purple-700', btn: 'bg-purple-500 text-white hover:bg-purple-600', icon: 'text-purple-500' },
  amber: { border: 'border-amber-500', badge: 'bg-amber-100 text-amber-700', btn: 'bg-amber-500 text-white hover:bg-amber-600', icon: 'text-amber-500' },
}

const iconMap: Record<string, React.ComponentType<{size: number, className?: string}>> = {
  gray: Sparkles,
  blue: Zap,
  purple: Star,
  amber: Crown,
}

export default function PreciosPage() {
  const [billingAnnual, setBillingAnnual] = useState(false)

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                <BrandMark width={20} height={20} />
              </div>
              <span className="text-lg font-bold text-gray-900">Paragu<span className="text-blue-600">AI</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[{ href: '/belleza', label: 'Belleza' }, { href: '/gastronomia', label: 'Gastronomía' }, { href: '/profesionales', label: 'Profesionales' }, { href: '/precios', label: 'Precios' }].map(l => (
                <a key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900">{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href={waLink('Hola, quiero saber más sobre los planes de ParaguAI.')} className="hidden md:inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                <MessageCircle size={16} />
                Hablar con asesor
              </a>
            </div>
          </div>
        </Container>
      </nav>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-gray-50" />
            <FloatingShape className="top-10 right-10 h-[400px] w-[400px] rounded-full bg-blue-100/40" delay={0} />
            <FloatingShape className="bottom-10 left-5 h-[300px] w-[300px] rounded-full bg-teal-100/30" delay={1} />
          </div>
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn>
                <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  Precios simples y transparentes
                </h1>
              </FadeIn>
              <FadeIn delay={100}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
                  Sin sorpresas, sin permanence. Pagás setup + mensualidad.
                  Todo incluye hosting, SSL, dominio y soporte.
                </p>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white p-1.5">
                  <button
                    onClick={() => setBillingAnnual(false)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${!billingAnnual ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Mensual
                  </button>
                  <button
                    onClick={() => setBillingAnnual(true)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${billingAnnual ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Anual
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 font-semibold">-15%</span>
                  </button>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Plans */}
        <section className="pb-20">
          <Container>
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-4">
              {PLANS.map((plan, i) => {
                const c = colorMap[plan.color]
                const Icon = iconMap[plan.color]
                const monthlyNum = plan.monthly ? parseInt(plan.monthly.replace(/\D/g, '')) : 0
                const finalMonthly = billingAnnual && plan.monthly
                  ? Math.round(monthlyNum * 0.85).toLocaleString('es-PY')
                  : plan.monthly

                return (
                  <FadeIn key={plan.name} delay={i * 100}>
                    <div className={`relative rounded-3xl border-2 bg-white p-8 flex flex-col ${plan.popular ? `${c.border} shadow-2xl` : 'border-gray-100 shadow-sm'}`}>
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="rounded-full bg-blue-500 px-5 py-1.5 text-sm font-bold text-white shadow-lg">
                            Más elegido
                          </span>
                        </div>
                      )}

                      <div className="mb-6">
                        <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.badge}`}>
                          <Icon size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-500">{plan.tagline}</p>
                      </div>

                      <div className="mb-6">
                        <span className="text-4xl font-extrabold text-gray-900">{plan.setup}</span>
                        <div className="mt-1 text-gray-500">
                          {plan.monthly ? (
                            billingAnnual ? (
                              <>
                                setup + <span className="font-bold text-gray-900">Gs {finalMonthly}</span>/mes (anual)
                              </>
                            ) : (
                              <>
                                setup + {plan.monthly}/mes
                              </>
                            )
                          ) : (
                            <span className="text-green-600 font-medium">Gratis — sin compromiso</span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{plan.description}</p>
                      </div>

                      <div className="mb-8 flex-1">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Incluye:</p>
                        <ul className="space-y-3">
                          {plan.features.map(f => (
                            <li key={f} className="flex items-start gap-3">
                              <Check size={18} className="mt-0.5 flex-shrink-0 text-green-500" />
                              <span className="text-sm text-gray-700">{f}</span>
                            </li>
                          ))}
                          {plan.notIncluded.map(f => (
                            <li key={f} className="flex items-start gap-3 opacity-40">
                              <Check size={18} className="mt-0.5 flex-shrink-0 text-gray-400" />
                              <span className="text-sm text-gray-400 line-through">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <a href={waLink(plan.msg)} className={`block w-full rounded-2xl py-3.5 text-center font-bold transition-all ${plan.popular ? `${c.btn} text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5` : `border-2 ${c.btn} hover:-translate-y-0.5`}`}>
                        {plan.cta}
                      </a>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </Container>
        </section>

        {/* Add-ons */}
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Extras</h2>
                <p className="mt-4 text-lg text-gray-600">Potenciá tu sistema con herramientas adicionales</p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {ADDONS.map((addon, i) => (
                <FadeIn key={addon.name} delay={i * 80}>
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6">
                    <div>
                      <h3 className="font-bold text-gray-900">{addon.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">{addon.desc}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-bold text-gray-900">{addon.price}</p>
                      <a href={waLink(`Hola, me interesa el addon de ${addon.name}. ¿Cómo funciona?`)} className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
                        Consultar →
                      </a>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Preguntas frecuentes</h2>
              </div>
            </FadeIn>
            <div className="mx-auto max-w-3xl space-y-4">
              {FAQS.map((faq, i) => (
                <details key={i} className="group rounded-xl border border-gray-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-gray-900">
                    {faq.q}
                    <ChevronDown size={20} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-gray-100 px-6 pb-6 pt-4 text-gray-600 leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-500 text-white">
          <Container>
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold md:text-4xl">¿No sabés qué plan elegir?</h2>
                <p className="mt-4 text-lg text-white/80">
                  Agendá una llamada de 15 minutos y te asesoramos gratis.
                </p>
                <a href={waLink('Hola, quiero hablar con un asesor para elegir el plan correcto para mi negocio.')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-xl font-bold text-blue-600 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
                  <MessageCircle size={22} />
                  Agendar asesoría gratis
                  <ArrowRight size={22} />
                </a>
              </div>
            </FadeIn>
          </Container>
        </section>
      </main>
    </>
  )
}