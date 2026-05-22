'use client'

import { useState } from 'react'
import { UtensilsCrossed, MessageCircle, ArrowRight, Check, Star, MapPin,
         Clock, ChefHat, TrendingUp, Instagram, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

function waLink(msg: string) {
  return `https://wa.me/595981324569?text=${encodeURIComponent(msg)}`
}

const STATS = [
  { value: '250+', label: 'Restaurantes en Paraguay' },
  { value: '48h', label: 'Tiempo de entrega' },
  { value: '4.9★', label: 'Valoración promedio' },
]

const CLIENT_CASES = [
  { name: 'El Viajero', tag: 'Restaurante', result: '+80% reservas online', locale: 'Asunción' },
  { name: 'De Abasto a Casa', tag: 'Delivery', result: '3x más pedidos', locale: 'San Lorenzo' },
  { name: 'Mai Yu', tag: 'Asiático', result: '1ra página Google', locale: 'Asunción' },
]

const FEATURES = [
  { icon: TrendingUp, title: 'Aparece cuando tienen hambre', desc: '"Restaurante cerca" o "comida a domicilio Asunción" → tu negocio aparece en Google Maps.' },
  { icon: Instagram, title: 'Tu menú online', desc: 'Los clientes ven platos, precios y fotos desde el celular. Sin descargar apps, sin llamar.' },
  { icon: MessageCircle, title: 'Reservas por WhatsApp', desc: 'Botón directo en tu sitio. Clic → se abre WhatsApp con fecha, hora y cantidad. Listo.' },
  { icon: Clock, title: 'Horario actualizado', desc: 'Tu sitio muestra horarios reales, días cerrados, días festivos. Nada de quejaras de horarios incorrectos.' },
]

const FAQS = [
  { q: '¿Puedo mostrar el menú con precios?', a: 'Sí. Armamos una sección de menú interactiva con categorías, platos, precios y fotos. Se ve perfecto en celular.' },
  { q: '¿Funciona para delivery?', a: 'Sí. Podemos integrar WhatsApp para pedidos, mostrar zonas de delivery y tiempos de espera estimados.' },
  { q: '¿Puedo actualizar el menú?', a: 'Sí. Te damos acceso al panel de contenido donde podés cambiar platos, precios y disponibilidad en minutos.' },
  { q: '¿Puedo mostrar reseñas de Google?', a: 'Sí. Integramos tu ficha de Google Business con reseñas reales. Esto mejora el SEO y la confianza.' },
]

export default function GastronomiaPage() {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <BrandMark width={20} height={20} />
              </div>
              <span className="text-lg font-bold text-gray-900">Paragu<span className="text-orange-500">AI</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[{ href: '/casos', label: 'Casos' }, { href: '/belleza', label: 'Belleza' }, { href: '/gastronomia', label: 'Gastronomía' }, { href: '/precios', label: 'Precios' }].map(l => (
                <a key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900">{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href={waLink('Hola, tengo un restaurante y quiero una demo gratis de ParaguAI.')} className="hidden md:inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white">
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
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50" />
            <FloatingShape className="top-20 right-10 h-[450px] w-[450px] rounded-full bg-orange-200/40" delay={0} />
            <FloatingShape className="bottom-20 left-5 h-[350px] w-[350px] rounded-full bg-amber-200/30" delay={1} />
          </div>
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-600">+250 restaurantes en Paraguay usan ParaguAI</span>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Cuando tengan hambre,{' '}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    tu restaurante aparece
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                  Sistema de captación para restaurantes, bares, cafeterías y servicios de delivery.
                  Aparecé en Google,mostrá tu menú, recibí reservas por WhatsApp.
                  Todo por <strong>Gs 500.000 al mes</strong>.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href={waLink('Hola, tengo un restaurante y quiero una demo gratis de ParaguAI.')} className="group inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl transition-all">
                    <MessageCircle size={20} />
                    Pedir demo gratis
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#casos" className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-all">
                    Ver casos reales
                  </a>
                </div>
              </FadeIn>
              <FadeIn delay={450}>
                <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-6 rounded-2xl border border-orange-100 bg-white/80 p-8">
                  {STATS.map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-3xl font-bold text-orange-500 md:text-4xl">{s.value}</p>
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">¿Te suena familiar?</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '😓', title: 'No aparecés en Google', desc: 'El 80% busca "restaurante cerca" antes de elegir. Si no estás en Maps, no existís.' },
                { icon: '📱', title: 'Llaman solo para preguntar el menú', desc: 'Cada llamada es para preguntar qué hay, precios, horarios. Eso es trabajo gratis que podés automatizar.' },
                { icon: '📊', title: 'Sin saber quién te busca', desc: '¿Cuántas personas vieron tu local en Google esta semana? ¿De dónde vienen? No lo sabés.' },
                { icon: '🍽️', title: 'El delivery te come la ganancia', desc: 'Apps de delivery cobran 30%+. Necesitás un canal propio que no te robe el margen.' },
                { icon: '📸', title: 'No tenés fotos profesionales', desc: 'Las fotos del celular no venden. Necesitás imágenes que den hambre, no que la quiten.' },
                { icon: '💬', title: 'Grupos de WhatsApp son un caos', desc: 'Pedidos mezclados con conversaciones personales. Hay que separar el negocio del WhatsApp personal.' },
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

        {/* Features */}
        <section className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Así funciona ParaguAI para tu restaurante</h2>
              </div>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', title: 'Aparece en Google Maps', desc: 'Tu restaurante en Maps con fotos, horarios, reseñas y cómo llegar. Clientela nueva que no te conocía.' },
                { num: '02', title: 'Menú online interactivo', desc: 'Platos con fotos, precios y descripciones. Los clientes exploran desde el celular sin llamar.' },
                { num: '03', title: 'Reservas por WhatsApp', desc: 'Botón directo. Clic → se abre WhatsApp con mensaje pre-armado: fecha, hora, cantidad.' },
                { num: '04', title: 'Canal de delivery propio', desc: 'Sin apps externas. Pedidos por WhatsApp directo. Tu margen se queda en tu bolsillo.' },
              ].map((s, i) => (
                <FadeIn key={s.num} delay={i * 120}>
                  <div className="relative rounded-2xl border border-gray-200 bg-white p-8">
                    <span className="absolute -top-4 left-8 rounded-full bg-orange-500 px-4 py-1 text-sm font-bold text-white">{s.num}</span>
                    <h3 className="mb-3 mt-2 text-xl font-bold text-gray-900">{s.title}</h3>
                    <p className="text-gray-600">{s.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Features grid */}
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Todo incluido en Gs 500.000/mes</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2">
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 100}>
                  <div className="flex items-start gap-5 rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Restaurantes que ya crecen</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {CLIENT_CASES.map((c, i) => (
                <FadeIn key={c.name} delay={i * 100}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <UtensilsCrossed size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                    <p className="mt-1 text-sm text-orange-500 font-medium">{c.tag} · {c.locale}</p>
                    <div className="mt-4 rounded-xl bg-orange-50 p-4">
                      <p className="text-sm text-gray-600">Resultado:</p>
                      <p className="text-lg font-bold text-orange-600">{c.result}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Lo que dicen los dueños</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Roberto González', biz: 'El Viajero, Asunción', quote: 'Pasamos de depender de reservas telefónicas a que la gente reserve directo por WhatsApp desde el sitio.' },
                { name: 'Ana Martínez', biz: 'De Abasto a Casa, San Lorenzo', quote: 'El menú online fue un cambio enorme. La gente explora, ve fotos y ya llega con el pedido hecho.' },
                { name: 'Pedro López', biz: 'Mai Yu, Asunción', quote: 'Aparecimos en Google Maps y de repente llegaba gente nueva que no nos conocía. Eso no tenía precio.' },
              ].map((t, i) => (
                <FadeIn key={t.name} delay={i * 150}>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex gap-1">{[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />)}</div>
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Planes para tu restaurante</h2>
                <p className="mt-4 text-lg text-gray-600">Empezá gratis con diagnóstico. Escalá cuando crezca tu clientela.</p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                { name: 'Diagnóstico', setup: 'Gratis', monthly: null, popular: false, features: ['Análisis de tu restaurante', 'Demo de cómo se vería en Google', 'Recomendación según tus metas', 'Sin compromiso'], cta: 'Pedir diagnóstico', msg: 'Hola, tengo un restaurante y quiero el diagnóstico gratis.' },
                { name: 'Launch', setup: 'Gs 3.000.000', monthly: 'Gs 500.000', popular: true, features: ['Sitio con menú online', 'Aparecé en Google Maps', 'Reservas por WhatsApp', 'Dominio .com.py + SSL', '2 actualizaciones/mes', 'Reporte mensual'], cta: 'Elegir Launch', msg: 'Hola, me interesa el plan Launch para mi restaurante.' },
                { name: 'Growth', setup: 'Gs 6.000.000', monthly: 'Gs 1.000.000', popular: false, features: ['Todo lo del Launch', 'Blog + fotos optimizadas', '1 campaña/mes', '6 actualizaciones/mes', 'Soporte prioritario'], cta: 'Elegir Growth', msg: 'Hola, me interesa el plan Growth para mi restaurante.' },
              ].map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100}>
                  <div className={`relative rounded-2xl border bg-white p-8 ${plan.popular ? 'border-orange-500 shadow-xl ring-2 ring-orange-500' : 'border-gray-200'}`}>
                    {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold text-white">Más elegido</span>}
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
                    <a href={waLink(plan.msg)} className={`mt-8 block w-full rounded-xl py-3 text-center font-semibold ${plan.popular ? 'bg-orange-500 text-white hover:bg-orange-600' : 'border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600'}`}>
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
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">¿Listo para que te encuentren?</h2>
                <p className="mt-4 text-lg text-gray-600">Empezá con diagnóstico gratis. Sin compromiso.</p>
                <a href={waLink('Hola, tengo un restaurante y quiero pedir el diagnóstico gratis de ParaguAI.')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 text-xl font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-orange-600 transition-all">
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