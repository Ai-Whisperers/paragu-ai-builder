'use client'

import { useState } from 'react'
import { ShoppingBag, MessageCircle, ArrowRight, Check, Star, ChevronDown,
         TrendingUp, Package, BarChart3, Store, Megaphone } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

function waLink(msg: string) {
  return `https://wa.me/595981324569?text=${encodeURIComponent(msg)}`
}

const STATS = [
  { value: '250+', label: 'Tiendas en Paraguay' },
  { value: '48h', label: 'Tiempo de entrega' },
  { value: '4.9★', label: 'Valoración promedio' },
]

const CLIENT_CASES = [
  { name: 'Brahm Indumentaria', tag: 'Ropa y accesorios', result: '+120% visitas', locale: 'Asunción' },
  { name: 'Tienda El Viajero', tag: 'Regalos y souvenirs', result: 'E-commerce propio', locale: 'Ciudad del Este' },
  { name: 'Goldenvisa', tag: 'Agencia de viajes', result: 'Primera página Google', locale: 'Asunción' },
]

const FEATURES = [
  { icon: Store, title: 'Tu tienda en Google', desc: 'Cuando busquen "tienda ropa Asunción" o "regalos cerca", tu negocio aparece. Sin pagar ads.' },
  { icon: Package, title: 'Catálogo online', desc: 'Tus productos con fotos, precios y descripciones. Los clientes exploran desde el celular sin visitar tu local.' },
  { icon: MessageCircle, title: 'Consultas por WhatsApp', desc: 'Tu cliente ve algo que le gusta, te escribe directo. Sin intermediarios, sin perderse en Instagram.' },
  { icon: BarChart3, title: 'Sabés qué vende más', desc: 'Dashboard de productos más vistos, consultas y pedidos. Decidís qué stockear basándote en data real.' },
]

const FAQS = [
  { q: '¿Puedo vender online?', a: 'Sí. Armamos tu catálogo online con precios y WhatsApp de pedido. Para pagos online integrános con Nequi, Bancard o Mercado Pago.' },
  { q: '¿Puedo mostrar mi inventario?', a: 'Sí. Los productos se muestran con disponibilidad en tiempo real. Un cliente sabe si hay stock antes de ir.' },
  { q: '¿Puedo hacer entregas?', a: 'Sí. Mostramos zona de delivery, costos de envío y tiempo estimado. El pedido llega directo a tu WhatsApp.' },
  { q: '¿Qué pasa con mi Instagram?', a: 'Tu sitio ParaguAI complementa tu Instagram. El Instagram atrae, el sitio convierte — ahí se hacen los pedidos.' },
]

export default function RetailPage() {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                <BrandMark width={20} height={20} />
              </div>
              <span className="text-lg font-bold text-gray-900">Paragu<span className="text-pink-500">AI</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[{ href: '/casos', label: 'Casos' }, { href: '/belleza', label: 'Belleza' }, { href: '/gastronomia', label: 'Gastronomía' }, { href: '/precios', label: 'Precios' }].map(l => (
                <a key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900">{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href={waLink('Hola, tengo una tienda y quiero una demo gratis de ParaguAI.')} className="hidden md:inline-flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white">
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
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50" />
            <FloatingShape className="top-20 right-10 h-[450px] w-[450px] rounded-full bg-pink-200/40" delay={0} />
            <FloatingShape className="bottom-20 left-5 h-[350px] w-[350px] rounded-full bg-rose-200/30" delay={1} />
          </div>
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-600">+250 tiendas en Paraguay usan ParaguAI</span>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Tu tienda tiene más visitas que clientes.{' '}
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    Eso se resuelve.
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                  Sistema de captación para tiendas, boutiques, bazares y comercio minorista.
                  Aparecé en Google,mostrá tu catálogo, recibí pedidos por WhatsApp.
                  Todo por <strong>Gs 500.000 al mes</strong>.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href={waLink('Hola, tengo una tienda y quiero una demo gratis de ParaguAI.')} className="group inline-flex items-center gap-2 rounded-2xl bg-pink-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-pink-600 hover:shadow-xl transition-all">
                    <MessageCircle size={20} />
                    Pedir demo gratis
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#casos" className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-all">
                    Ver casos reales
                  </a>
                </div>
              </FadeIn>
              <FadeIn delay={450}>
                <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-6 rounded-2xl border border-pink-100 bg-white/80 p-8">
                  {STATS.map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-3xl font-bold text-pink-500 md:text-4xl">{s.value}</p>
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">¿Te suena conocido?</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '📱', title: 'Instagram no convierte', desc: 'Tenés 5.000 seguidores pero las ventas no crecen. Falta el puente entre ver el producto y comprarlo.' },
                { icon: '🏬', title: 'Tu local no tiene tráfico', desc: 'La gente pasa frente a tu tienda sin entrar. Necesitás aparecer cuando busquen lo que vendés.' },
                { icon: '📊', title: 'No sabés qué busca la gente', desc: '¿Qué productos les interesan más? ¿De dónde vienen tus clientes? No tenés data.' },
                { icon: '💸', title: 'Las apps se llevan tu margen', desc: 'Mercado Libre cobra 15-20%. Un canal propio mantiene tu ganancia intacta.' },
                { icon: '📦', title: 'No mostrás todo tu stock', desc: 'El local es pequeño pero tenés más productos. Un catálogo online muestra todo.' },
                { icon: '💬', title: 'WhatsApp mezclado con ventas', desc: 'Necesitás un canal profesional para pedidos sin mezclar con tu familia y amigos.' },
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Así funciona ParaguAI para tu tienda</h2>
              </div>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', title: 'Tu tienda aparece en Google', desc: 'Cuando busquen "ropa Asunción" o "regalos cerca", tu negocio aparece en Maps y en resultados.' },
                { num: '02', title: 'Catálogo online completo', desc: 'Todos tus productos con fotos, precios, talles y colores. Los clientes exploran desde el celular.' },
                { num: '03', title: 'Pedidos por WhatsApp', desc: 'Tu cliente ve algo que le gusta, toca WhatsApp, te envía el pedido. Sin intermediarios.' },
                { num: '04', title: 'Data de qué vende más', desc: 'Dashboard con productos más vistos y pedidos. Sabés qué stockear basándote en demanda real.' },
              ].map((s, i) => (
                <FadeIn key={s.num} delay={i * 120}>
                  <div className="relative rounded-2xl border border-gray-200 bg-white p-8">
                    <span className="absolute -top-4 left-8 rounded-full bg-pink-500 px-4 py-1 text-sm font-bold text-white">{s.num}</span>
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
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Tiendas que ya crecen</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {CLIENT_CASES.map((c, i) => (
                <FadeIn key={c.name} delay={i * 100}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                      <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                    <p className="mt-1 text-sm text-pink-500 font-medium">{c.tag} · {c.locale}</p>
                    <div className="mt-4 rounded-xl bg-pink-50 p-4">
                      <p className="text-sm text-gray-600">Resultado:</p>
                      <p className="text-lg font-bold text-pink-600">{c.result}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-pink-500 to-rose-500 text-white">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Lo que dicen los dueños</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Ana Rodríguez', biz: 'Brahm Indumentaria, Asunción', quote: 'Pasamos de vender solo en el local a recibir pedidos de todo Paraguay por WhatsApp. El sitio cambió todo.' },
                { name: 'Jorge Martínez', biz: 'Tienda El Viajero, CDE', quote: 'Armamos el catálogo online en tiempo récord. Ahora la gente ve los productos y pide sin venir al local.' },
                { name: 'Laura Fernández', biz: 'Goldenvisa, Asunción', quote: 'Nuestra agencia aparecía en la página 3 de Google. Ahora estamos en la primera. Las consultas se triplicaron.' },
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Planes para tu tienda</h2>
                <p className="mt-4 text-lg text-gray-600">Empezá gratis con diagnóstico. Escalá cuando cresca tu negocio.</p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                { name: 'Diagnóstico', setup: 'Gratis', monthly: null, popular: false, features: ['Análisis de tu tienda online', 'Demo de cómo se vería en Google', 'Recomendación según tu rubro', 'Sin compromiso'], cta: 'Pedir diagnóstico', msg: 'Hola, tengo una tienda y quiero el diagnóstico gratis.' },
                { name: 'Launch', setup: 'Gs 3.000.000', monthly: 'Gs 500.000', popular: true, features: ['Sitio con catálogo de productos', 'Aparecé en Google', 'Pedidos por WhatsApp', 'Dominio .com.py + SSL', '2 actualizaciones/mes', 'Reporte mensual'], cta: 'Elegir Launch', msg: 'Hola, me interesa el plan Launch para mi tienda.' },
                { name: 'Growth', setup: 'Gs 6.000.000', monthly: 'Gs 1.000.000', popular: false, features: ['Todo lo del Launch', 'Catálogo completo con stock', '1 campaña/mes', '6 actualizaciones/mes', 'Soporte prioritario'], cta: 'Elegir Growth', msg: 'Hola, me interesa el plan Growth para mi tienda.' },
              ].map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100}>
                  <div className={`relative rounded-2xl border bg-white p-8 ${plan.popular ? 'border-pink-500 shadow-xl ring-2 ring-pink-500' : 'border-gray-200'}`}>
                    {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pink-500 px-4 py-1 text-sm font-semibold text-white">Más elegido</span>}
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
                    <a href={waLink(plan.msg)} className={`mt-8 block w-full rounded-xl py-3 text-center font-semibold ${plan.popular ? 'bg-pink-500 text-white hover:bg-pink-600' : 'border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-600'}`}>
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
                <a href={waLink('Hola, tengo una tienda y quiero pedir el diagnóstico gratis de ParaguAI.')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-pink-500 px-8 py-4 text-xl font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-pink-600 transition-all">
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