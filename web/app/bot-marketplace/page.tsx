'use client'

import { useState } from 'react'
import { Bot, MessageCircle, ArrowRight, Check, Star, ChevronDown,
         ShoppingCart, Users, CalendarCheck, TrendingUp, BarChart3,
         Zap, Settings, Package, Headphones } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

function waLink(msg: string) {
  return `https://wa.me/595981324569?text=${encodeURIComponent(msg)}`
}

const BOT_TEMPLATES = [
  {
    name: 'Asistente de Reservas',
    icon: CalendarCheck,
    color: 'blue',
    price: 'Gs 800.000',
    setup: 'Gs 2.400.000',
    description: 'Para restaurantes, clínicas, spas y cualquier negocio que tome turnos.',
    features: [
      'Reservas 24/7 por WhatsApp',
      'Confirmación automática',
      'Recordatorios de turno',
      'Reagendar / cancelar',
      'Integración con tu agenda',
    ],
    popular: true,
  },
  {
    name: 'Asistente de Pedidos',
    icon: ShoppingCart,
    color: 'green',
    price: 'Gs 1.000.000',
    setup: 'Gs 3.000.000',
    description: 'Para tiendas, bazares, farmacias y comercio minorista.',
    features: [
      'Catálogo de productos por WhatsApp',
      'Carrito de compras',
      'Confirmación de pedido',
      'Seguimiento de entrega',
      'Notificaciones de stock',
    ],
    popular: false,
  },
  {
    name: 'Asistente de Ventas',
    icon: TrendingUp,
    color: 'purple',
    price: 'Gs 1.200.000',
    setup: 'Gs 3.600.000',
    description: 'Para empresas B2B, agencia, estudios profesionales.',
    features: [
      'Calificación de leads',
      'FAQ automatizado',
      'Agenda de reuniones',
      'Envío de propuestas',
      'Integración CRM',
    ],
    popular: false,
  },
  {
    name: 'Asistente de Atención',
    icon: Headphones,
    color: 'orange',
    price: 'Gs 600.000',
    setup: 'Gs 1.800.000',
    description: 'Para soporte post-venta, hotels,hostels y gastronomía.',
    features: [
      'Respuestas instantáneas 24/7',
      'Derivación a humano',
      'Encuestas de satisfacción',
      'Gestión de quejas',
      'Historial de conversación',
    ],
    popular: false,
  },
]

const PROCESS_STEPS = [
  { num: '01', title: 'Elegís el bot', desc: 'Seleccionás la plantilla que mejor se adapta a tu negocio o te asesoramos.' },
  { num: '02', title: 'Lo personalizamos', desc: 'Configuramos respuestas, flujos, horarios y tu identidad de marca.' },
  { num: '03', title: 'Lo conectamos', desc: 'Lo linkeamos a tu WhatsApp Business y lo pusheamos a producción.' },
  { num: '04', title: 'Mide y optimiza', desc: 'Dashboard de conversaciones, leads captados y mejora continua.' },
]

const FAQS = [
  { q: '¿Necesito WhatsApp Business?', a: 'Sí. El bot funciona con WhatsApp Business. Si no lo tenés, te ayudamos a crearlo.' },
  { q: '¿Funciona con mi número existente?', a: 'Sí. No necesitás un número nuevo. El bot se conecta a tu WhatsApp Business actual.' },
  { q: '¿Puedo cambiar las respuestas?', a: 'Sí. Tenés acceso al panel de configuración para actualizar respuestas, precios y flujos.' },
  { q: '¿Qué pasa si el bot no sabe responder?', a: 'Se deriva a vos o a tu equipo con el contexto completo de la conversación.' },
  { q: '¿Cuánto tarda en estar listo?', a: '3-5 días hábiles desde que nos das la info de tu negocio.' },
]

export default function BotMarketplacePage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof BOT_TEMPLATES[0] | null>(null)

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <BrandMark width={20} height={20} />
              </div>
              <span className="text-lg font-bold text-gray-900">Paragu<span className="text-green-500">AI</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[{ href: '/belleza', label: 'Belleza' }, { href: '/gastronomia', label: 'Gastronomía' }, { href: '/paraguaybiz', label: 'Empresas' }, { href: '/precios', label: 'Precios' }].map(l => (
                <a key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900">{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href={waLink('Hola, quiero saber más sobre los bots de WhatsApp de ParaguAI.')} className="hidden md:inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white">
                <MessageCircle size={16} />
                Pedir demo
              </a>
            </div>
          </div>
        </Container>
      </nav>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[85vh] overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
            <FloatingShape className="top-20 right-10 h-[500px] w-[500px] rounded-full bg-green-200/40" delay={0} />
            <FloatingShape className="bottom-20 left-5 h-[400px] w-[400px] rounded-full bg-emerald-200/30" delay={1} />
          </div>
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2">
                  <Bot size={14} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-600">WhatsApp Bot Marketplace</span>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Tu WhatsApp responde solo.{' '}
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    24 horas, 7 días.
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                  Bots de WhatsApp Business que reservan turnos, toman pedidos y responden
                  consultas mientras dormís. Desde <strong>Gs 600.000/mes</strong>.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href={waLink('Hola, quiero un bot de WhatsApp para mi negocio. ¿Cuál me recomiendan?')} className="group inline-flex items-center gap-2 rounded-2xl bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl transition-all">
                    <Bot size={20} />
                    Explorar bots
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#plantillas" className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-green-300 hover:text-green-600 transition-all">
                    Ver plantillas
                  </a>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* How it works */}
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Así funciona</h2>
                <p className="mt-4 text-lg text-gray-600">En 4 pasos tu bot está funcionando</p>
              </div>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-4">
              {PROCESS_STEPS.map((s, i) => (
                <FadeIn key={s.num} delay={i * 120}>
                  <div className="relative rounded-2xl border border-gray-200 bg-white p-8 text-center">
                    <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">{s.num}</span>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Bot templates */}
        <section id="plantillas" className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Plantillas de bots готовые
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Elegí la plantilla que se adapte a tu negocio. Cada una configurable a tu marca.
                </p>
              </div>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {BOT_TEMPLATES.map((bot, i) => (
                <FadeIn key={bot.name} delay={i * 100}>
                  <div className={`relative rounded-2xl border bg-white p-8 ${bot.popular ? 'border-green-500 shadow-xl ring-2 ring-green-500' : 'border-gray-200'}`}>
                    {bot.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">Más elegido</span>}
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      bot.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      bot.color === 'green' ? 'bg-green-100 text-green-600' :
                      bot.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <bot.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{bot.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">{bot.description}</p>
                    <div className="mt-4">
                      <span className="text-2xl font-bold text-gray-900">{bot.setup}</span>
                      <div className="text-xs text-gray-600">setup + {bot.price}/mes</div>
                    </div>
                    <ul className="mt-6 space-y-2">
                      {bot.features.map(f => (
                        <li key={f} className="flex items-start gap-2">
                          <Check size={15} className="mt-0.5 flex-shrink-0 text-green-500" />
                          <span className="text-xs text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={waLink(`Hola, me interesa el bot de WhatsApp "${bot.name}". ¿Podemos hablar?`)} className={`mt-6 block w-full rounded-xl py-2.5 text-center text-sm font-semibold ${bot.popular ? 'bg-green-500 text-white hover:bg-green-600' : 'border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:text-green-600'}`}>
                      Elegir {bot.name}
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Bot features */}
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Todo incluido en cada bot</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Settings, title: 'Panel de configuración', desc: 'Cambiá respuestas, precios, horarios y flujos sin tocar código.' },
                { icon: BarChart3, title: 'Dashboard de conversaciones', desc: 'Cuántas conversaciones, leads captados, horarios pico.' },
                { icon: MessageCircle, title: 'Integración con tu WhatsApp', desc: 'Funciona con tu número existente de WhatsApp Business.' },
                { icon: Zap, title: 'Respuestas instantáneas', desc: 'El bot responde en menos de 2 segundos. Sin esperar.' },
                { icon: Users, title: 'Derivación a humano', desc: 'Si el bot no sabe, transfiere la conversación con contexto.' },
                { icon: TrendingUp, title: 'Mejora continua', desc: 'Analizamos conversaciones y optimizamos flujos mensualmente.' },
              ].map((f, i) => (
                <FadeIn key={f.title} delay={i * 80}>
                  <div className="flex items-start gap-5 rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-500">
                      <f.icon size={24} />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900">{f.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
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
        <section className="py-20 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <Container>
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold md:text-4xl">
                  ¿Qué bot necesitás para tu negocio?
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  Escribinos y te asesoramos gratis para elegir la plantilla correcta.
                </p>
                <a href={waLink('Hola, quiero un bot de WhatsApp para mi negocio. ¿Cuál me recomiendan?')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-xl font-bold text-green-600 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
                  <MessageCircle size={22} />
                  Escribir por WhatsApp
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