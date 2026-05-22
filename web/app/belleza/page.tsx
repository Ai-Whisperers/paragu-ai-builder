'use client'

import { useState, useEffect } from 'react'
import { Scissors, Dumbbell, UtensilsCrossed, Briefcase, ShoppingBag,
         MessageCircle, ArrowRight, Check, Star, MapPin, Phone,
         ChevronDown, Globe, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

function waLink(msg: string) {
  return `https://wa.me/595981324569?text=${encodeURIComponent(msg)}`
}

const STATS = [
  { value: '250+', label: 'Negocios en Paraguay' },
  { value: '48h', label: 'Tiempo de entrega' },
  { value: '4.9★', label: 'Valoración promedio' },
]

const CLIENT_CASES = [
  { name: 'Studio Belleza María', tag: 'Peluquería', result: '+40% consultas', locale: 'Asunción' },
  { name: 'Spa Serenidad', tag: 'Spa & Wellness', result: '1ra página Google', locale: 'San Lorenzo' },
  { name: 'Nails Factory PY', tag: 'Uñas', result: '3x más reservas', locale: 'Luque' },
]

const FEATURES = [
  { icon: Search, title: 'Primera página de Google', desc: 'Cuando alguien busca "peluquería cerca" o "spa Asunción", tu negocio aparece. Sin pagar ads.' },
  { icon: MessageCircle, title: 'Reservas por WhatsApp', desc: 'Tus clientas reservan directo desde el celular. Sin llamadas, sin grupos, sin pierde.' },
  { icon: MapPin, title: 'Tu dirección en el mapa', desc: 'Google Maps ficha completa con fotos, horarios y cómo llegar. Clientas te encuentran solas.' },
  { icon: Sparkles, title: 'Fotos profesionales', desc: 'Si no tenés fotos, usamos inteligencia artificial para generar imágenes de tu negocio.' },
]

const FAQS = [
  { q: '¿Cuánto tarda en estar listo?', a: '24-48 horas desde que nos mandás la info. Primero armamos tu sitio demo, lo revisás y si te gusta, publicamos.' },
  { q: '¿Necesito saber tecnología?', a: 'Nada. Nos mandás todo por WhatsApp: nombre, servicios, precios, fotos. Nosotros hacemos el resto.' },
  { q: '¿Qué pasa si ya tengo página?', a: 'La conectamos o migramos sin costo extra. También te ayudamos si tenés Wix, WordPress u otra plataforma.' },
  { q: '¿Puedo ver algo antes de pagar?', a: 'Sí. Empezamos con diagnóstico gratis donde te mostramos cómo se vería tu negocio en Google. Sin compromiso.' },
]

export default function BellezaPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                <BrandMark width={20} height={20} />
              </div>
              <span className="text-lg font-bold text-gray-900">Paragu<span className="text-blue-600">AI</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: '/casos', label: 'Casos' },
                { href: '/belleza', label: 'Belleza' },
                { href: '/gastronomia', label: 'Gastronomía' },
                { href: '/precios', label: 'Precios' },
              ].map(l => (
                <a key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href={waLink('Hola, tengo un salón de belleza y quiero saber más sobre ParaguAI.')} className="hidden md:inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                <MessageCircle size={16} />
                Pedir demo gratis
              </a>
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-700 md:hidden">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>
          </div>
        </Container>
      </nav>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[85vh] overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50" />
            <FloatingShape className="top-20 right-10 h-[450px] w-[450px] rounded-full bg-rose-100/40" delay={0} />
            <FloatingShape className="bottom-20 left-5 h-[350px] w-[350px] rounded-full bg-pink-100/30" delay={1} />
          </div>
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-600">+250 salones de belleza en Paraguay confían en ParaguAI</span>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Tu salón aparece en Google.{' '}
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                    Tus clientas te encuentran solas.
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                  Sistema de captación para salones, peluquerías, spas y centros de estética.
                  Aparecés en Google, recibís reservas por WhatsApp, sabés cuántas clientas te visitan.
                  Todo por <strong>Gs 500.000 al mes</strong>.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href={waLink('Hola, tengo un salón de belleza y quiero una demo gratis de ParaguAI.')} className="group inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-rose-600 hover:shadow-xl transition-all">
                    <MessageCircle size={20} />
                    Pedir demo gratis
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#casos" className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-rose-300 hover:text-rose-600 transition-all">
                    Ver casos reales
                  </a>
                </div>
              </FadeIn>
              <FadeIn delay={450}>
                <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-6 rounded-2xl border border-rose-100 bg-white/80 p-8 backdrop-blur-sm">
                  {STATS.map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-3xl font-bold text-rose-500 md:text-4xl">{s.value}</p>
                      <p className="mt-1 text-sm text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Problema */}
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  ¿Te suena familiar?
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '😓', title: 'Perdés clientas sin saberlo', desc: 'El 80% busca salón en Google antes de elegir. Si no aparecés, no existen para ellas.' },
                { icon: '💬', title: 'Grupos de WhatsApp son un caos', desc: 'Pedidos mezclados, horarios revueltos, clientas que no confirman. Un desastre.' },
                { icon: '📱', title: 'Tu Instagram no convierte', desc: 'Tenés 2.000 seguidores pero nadie reserva por DM. Falta el puente alaction.' },
                { icon: '📋', title: 'Sin saber cuántas te visitan', desc: '¿Cuántas personas vieron tu Instagram esta semana? ¿Y tu Google? No tenés idea.' },
                { icon: '💸', title: 'Pagas ads que no funcionan', desc: 'Meta ads son caros y complicate. Necesitás algo más inteligente y más barato.' },
                { icon: '🕐', title: 'Perdés tiempo en llamadas', desc: 'Responder consultas de horarios toma 2h al día. Tiempo que podrías usar en trabajar.' },
              ].map((item, i) => (
                <FadeIn key={item.title} delay={i * 80}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 text-4xl">{item.icon}</div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Solución */}
        <section className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Así funciona ParaguAI para tu salón
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  No es solo una página. Es un sistema que trae clientas.
                </p>
              </div>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', title: 'Te aparecés en Google', desc: 'Cuando alguien busca "peluquería Asunción" o "spa cerca de mí", tu salón aparece. Sin ads.' },
                { num: '02', title: 'Tus clientas reservan por WhatsApp', desc: 'Botón en tu sitio. Clic → se abre WhatsApp con mensaje pre-armado. Súper fácil.' },
                { num: '03', title: 'Tenés dashboard de visitas', desc: 'Sabés cuántas personas vieron tu sitio esta semana. Datos reales para decidir.' },
                { num: '04', title: 'Todo funcionando 24/7', desc: 'El sitio responde consultas a las 3am. Vos solo te ocupás cuando llega la reserva.' },
              ].map((s, i) => (
                <FadeIn key={s.num} delay={i * 120}>
                  <div className="relative rounded-2xl border border-gray-200 bg-white p-8">
                    <span className="absolute -top-4 left-8 rounded-full bg-rose-500 px-4 py-1 text-sm font-bold text-white">{s.num}</span>
                    <h3 className="mb-3 mt-2 text-xl font-bold text-gray-900">{s.title}</h3>
                    <p className="text-gray-600">{s.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Todo incluido en Gs 500.000/mes
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2">
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 100}>
                  <div className="flex items-start gap-5 rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                      <f.icon size={24} />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900">{f.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Casos */}
        <section id="casos" className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Salones que ya crecieron con ParaguAI
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {CLIENT_CASES.map((c, i) => (
                <FadeIn key={c.name} delay={i * 100}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                      <Scissors size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                    <p className="mt-1 text-sm text-rose-500 font-medium">{c.tag} · {c.locale}</p>
                    <div className="mt-4 rounded-xl bg-rose-50 p-4">
                      <p className="text-sm text-gray-600">Resultado:</p>
                      <p className="text-lg font-bold text-rose-600">{c.result}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-rose-500 to-pink-500 text-white">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Lo que dicen las dueñas</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Lucía Mendez', biz: 'Peluquería María, Asunción', quote: 'Pasé de perder consultas en grupos de WhatsApp a que me lleguen reservas por el sitio. Mis clientas ahora me encuentran en Google.' },
                { name: 'Ana Ferreira', biz: 'Spa Serenidad, San Lorenzo', quote: 'Mi spa aparecía en la quinta página. Ahora estoy en la primera cuando alguien busca "spa Asunción". Esto cambió todo.' },
                { name: 'Rosa Giménez', biz: 'Nails Factory, Luque', quote: 'Las chicas reservan directo por WhatsApp. Dejé de perder tiempo respondiendo "qué horarios tenés" 20 veces por día.' },
              ].map((t, i) => (
                <FadeIn key={t.name} delay={i * 150}>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="mb-6 leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">{t.name[0]}</div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-white/70">{t.biz}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Pricing */}
        <section id="precios" className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Planes para tu salón
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Empezá gratis con un diagnóstico. Escalá cuando crezca tu negocio.
                </p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                { name: 'Diagnóstico', setup: 'Gratis', monthly: null, popular: false, features: [
                    'Análisis de tu negocio y competencia',
                    'Demo de cómo se vería tu salón en Google',
                    'Recomendación de plan según tus objetivos',
                    'Sin compromiso ni tarjeta',
                  ], cta: 'Pedir diagnóstico', msg: 'Hola, tengo un salón de belleza y quiero el diagnóstico gratis.' },
                { name: 'Launch', setup: 'Gs 3.000.000', monthly: 'Gs 500.000', popular: true, features: [
                    'Sitio profesional para tu salón',
                    'Aparecé en Google cuando busquen tu rubro',
                    'Reservas por WhatsApp desde tu sitio',
                    'Dominio .com.py + SSL + hosting',
                    '2 actualizaciones mensuales',
                    'Reporte mensual de visitas',
                  ], cta: 'Elegir Launch', msg: 'Hola, me interesa el plan Launch para mi salón de belleza.' },
                { name: 'Growth', setup: 'Gs 6.000.000', monthly: 'Gs 1.000.000', popular: false, features: [
                    'Todo lo del plan Launch',
                    'Blog + fotos optimizadas para SEO',
                    '1 campaña de captación por mes',
                    '6 actualizaciones mensuales',
                    'Soporte prioritario + sesión estratégica',
                  ], cta: 'Elegir Growth', msg: 'Hola, me interesa el plan Growth para mi salón.' },
              ].map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100}>
                  <div className={`relative rounded-2xl border bg-white p-8 ${plan.popular ? 'border-rose-500 shadow-xl ring-2 ring-rose-500' : 'border-gray-200'}`}>
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rose-500 px-4 py-1 text-sm font-semibold text-white">
                        Más elegido
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.setup}</span>
                      {plan.monthly && <div className="mt-1 text-sm text-gray-600">+ {plan.monthly}/mes</div>}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-3">
                          <Check size={18} className="mt-0.5 flex-shrink-0 text-green-500" />
                          <span className="text-gray-700 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={waLink(plan.msg)} className={`mt-8 block w-full rounded-xl py-3 text-center font-semibold transition-all ${plan.popular ? 'bg-rose-500 text-white hover:bg-rose-600' : 'border-2 border-gray-200 text-gray-700 hover:border-rose-300 hover:text-rose-600'}`}>
                      {plan.cta}
                    </a>
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Preguntas frecuentes
                </h2>
              </div>
            </FadeIn>
            <div className="mx-auto max-w-3xl space-y-4">
              {FAQS.map((faq, i) => (
                <details key={i} className="group rounded-xl border border-gray-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-gray-900">
                    {faq.q}
                    <ChevronDown size={20} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-gray-100 px-6 pb-6 pt-4 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA final */}
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  ¿Listo para que tu salón aparezca en Google?
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Empezá con un diagnóstico gratis. Sin compromiso.
                </p>
                <a href={waLink('Hola, tengo un salón de belleza/peluquería/spa y quiero pedir el diagnóstico gratis de ParaguAI.')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-8 py-4 text-xl font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-rose-600 hover:shadow-xl transition-all">
                  <MessageCircle size={22} />
                  Pedir diagnóstico gratis
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