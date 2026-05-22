'use client'

import { useState } from 'react'
import { Dumbbell, MessageCircle, ArrowRight, Check, Star, MapPin,
         TrendingUp, Users, Clock, CalendarCheck, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

function waLink(msg: string) {
  return `https://wa.me/595981324569?text=${encodeURIComponent(msg)}`
}

const STATS = [
  { value: '250+', label: 'Gimnasios en Paraguay' },
  { value: '48h', label: 'Tiempo de entrega' },
  { value: '4.9★', label: 'Valoración promedio' },
]

const CLIENT_CASES = [
  { name: 'Bichos Gym', tag: 'Gimnasio', result: '+60% consultas en 3 meses', locale: 'Asunción' },
  { name: 'Cocodrilo Fitness', tag: 'Gimnasio', result: 'Llenó horarios de 7am', locale: 'San Lorenzo' },
  { name: 'FitLife PY', tag: 'CrossFit', result: '3x más membresías', locale: 'Luque' },
]

const FEATURES = [
  { icon: TrendingUp, title: 'Aparece cuando buscan "gimnasio cerca"', desc: 'El 75% de los que quieren entrenar buscan en Google primero. Si no aparecés, tus competidores se llevan esos clientes.' },
  { icon: MessageCircle, title: 'Inscripciones por WhatsApp', desc: 'Desde el sitio se pueden enviar mensaje directo con plan y precio. Sin intermediarios, sin perderse en Instagram.' },
  { icon: CalendarCheck, title: 'Agenda de clases online', desc: 'Los socios ven horarios y se inscriben desde el celular. Menos llamadas, más eficiencia.' },
  { icon: Users, title: 'Dashboard de socios', desc: 'Sabés cuántos te visitaron, de dónde vienen, qué horarios buscan más. Decisiones basadas en datos.' },
]

const FAQS = [
  { q: '¿Puedo mostrar mis planes de membresía?', a: 'Sí. Armamos una sección con planes, precios y beneficios. Tus prospectos ven todo y te escriben directo por WhatsApp para inscribirse.' },
  { q: '¿Puedo mostrar el horario de clases?', a: 'Sí. Creamos un calendario interactivo donde los socios ven clases, instructor y disponibilidad. Se pueden reservar desde el celular.' },
  { q: '¿Qué pasa si ya tengo Instagram?', a: 'Perfecto. Tu sitio ParaguAI complementa tu Instagram. El Instagram atrae, el sitio convierte — ahí te escriben para inscribirse.' },
  { q: '¿Necesito fotos profesionales?', a: 'No. Si no tenés fotos usamos inteligencia artificial para generar imágenes de gimnasio. También podemos usar fotos de archivos.' },
]

export default function FitnessPage() {
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
              {[{ href: '/casos', label: 'Casos' }, { href: '/belleza', label: 'Belleza' }, { href: '/gastronomia', label: 'Gastronomía' }, { href: '/precios', label: 'Precios' }].map(l => (
                <a key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900">{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href={waLink('Hola, tengo un gimnasio y quiero una demo gratis de ParaguAI.')} className="hidden md:inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
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
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50" />
            <FloatingShape className="top-20 right-10 h-[450px] w-[450px] rounded-full bg-emerald-200/40" delay={0} />
            <FloatingShape className="bottom-20 left-5 h-[350px] w-[350px] rounded-full bg-cyan-200/30" delay={1} />
          </div>
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-600">+250 gimnasios en Paraguay usan ParaguAI</span>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Tu gimnasio en la primera página{' '}
                  <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                    de Google
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                  Sistema de captación para gimnasios, boxes de CrossFit y estudios de fitness.
                  Aparecé en Google, recibí inscripciones por WhatsApp,
                  llená tus horarios. Todo por <strong>Gs 500.000 al mes</strong>.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href={waLink('Hola, tengo un gimnasio y quiero una demo gratis de ParaguAI.')} className="group inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-xl transition-all">
                    <MessageCircle size={20} />
                    Pedir demo gratis
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#casos" className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-emerald-300 hover:text-emerald-600 transition-all">
                    Ver casos reales
                  </a>
                </div>
              </FadeIn>
              <FadeIn delay={450}>
                <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-6 rounded-2xl border border-emerald-100 bg-white/80 p-8">
                  {STATS.map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-3xl font-bold text-emerald-600 md:text-4xl">{s.value}</p>
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
                { icon: '😓', title: 'El Instagram no convierte', desc: 'Tenés 3.000 seguidores pero nadie se anima a inscripción. Necesitás algo más directo.' },
                { icon: '📱', title: 'Perdés tiempo en WhatsApp', desc: 'Respondés "cuánto sale", "qué incluye", " horarios" 30 veces por día. Un caos.' },
                { icon: '📊', title: 'Sin saber quién te busca', desc: '¿Cuántas personas-google "gimnasio Asunción" cada día? No lo sabés. Trabalhás a ciegas.' },
                { icon: '🏋️', title: 'Horarios medio vacíos', desc: '7am y 18pm explotan, pero 10am y 14pm casi nadie. Necesitás llenar esos espacios.' },
                { icon: '💸', title: 'Dependés de boca a boca', desc: 'Si no viene alguien recomendado, no hay new. Necesitás canales nuevos para traer socios.' },
                { icon: '📋', title: 'Inscripción es un proceso largo', desc: 'Llamar, preguntar, ir al gym, firmar. Muchos se pierden en el camino. Hay que simplificar.' },
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Así funciona ParaguAI para tu gimnasio
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', title: 'Primera página de Google', desc: 'Cuando alguien busca "gimnasio Asunción" o "box CrossFit cerca", tu gym aparece.' },
                { num: '02', title: 'Inscripción por WhatsApp', desc: 'Tu prospecto ve el plan, el precio, los horarios. Clic → te escribe por WhatsApp para inscribirse.' },
                { num: '03', title: 'Llená horarios vacíos', desc: 'Estrategia de contenido + SEO para atraer a quienes buscan clases a horas específicas.' },
                { num: '04', title: 'Dashboard de socios', desc: 'Sabés quién te visita, de dónde viene, qué busca. Decisiones con datos, no con intuición.' },
              ].map((s, i) => (
                <FadeIn key={s.num} delay={i * 120}>
                  <div className="relative rounded-2xl border border-gray-200 bg-white p-8">
                    <span className="absolute -top-4 left-8 rounded-full bg-emerald-500 px-4 py-1 text-sm font-bold text-white">{s.num}</span>
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Todo incluido en Gs 500.000/mes
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2">
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 100}>
                  <div className="flex items-start gap-5 rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
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
                  Gimnasios que ya crecen con ParaguAI
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {CLIENT_CASES.map((c, i) => (
                <FadeIn key={c.name} delay={i * 100}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Dumbbell size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                    <p className="mt-1 text-sm text-emerald-500 font-medium">{c.tag} · {c.locale}</p>
                    <div className="mt-4 rounded-xl bg-emerald-50 p-4">
                      <p className="text-sm text-gray-600">Resultado:</p>
                      <p className="text-lg font-bold text-emerald-600">{c.result}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Lo que dicen los dueños</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Carlos Rodríguez', biz: 'Bichos Gym, Asunción', quote: 'Pasamos de depender de referencias a que la gente nos encuentre en Google. Llenamos horarios que antes estaban vacíos.' },
                { name: 'María Fernández', biz: 'FitLife PY, San Lorenzo', quote: 'El sitio convierte mejor que cualquier post. La gente ve precios y horarios y te escribe directo. Así de simple.' },
                { name: 'Jorge Benítez', biz: 'Cocodrilo Fitness, Luque', quote: 'Antes perdía 2h al día respondiendo WhatsApp. Ahora el sitio responde y yo me enfoco en entrenar.' },
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Planes para tu gimnasio</h2>
                <p className="mt-4 text-lg text-gray-600">Empezá gratis con diagnóstico. Escalá cuando crezca tu clientela.</p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                { name: 'Diagnóstico', setup: 'Gratis', monthly: null, popular: false, features: ['Análisis de tu negocio', 'Demo de cómo se vería en Google', 'Recomendación según tus metas', 'Sin compromiso'], cta: 'Pedir diagnóstico', msg: 'Hola, tengo un gimnasio y quiero el diagnóstico gratis.' },
                { name: 'Launch', setup: 'Gs 3.000.000', monthly: 'Gs 500.000', popular: true, features: ['Sitio profesional con planes', 'Aparecé en Google', 'Inscripción por WhatsApp', 'Dominio .com.py + SSL', '2 actualizaciones/mes', 'Reporte mensual'], cta: 'Elegir Launch', msg: 'Hola, me interesa el plan Launch para mi gimnasio.' },
                { name: 'Growth', setup: 'Gs 6.000.000', monthly: 'Gs 1.000.000', popular: false, features: ['Todo lo del Launch', 'Blog + fotos optimizadas', '1 campaña/mes', '6 actualizaciones/mes', 'Soporte prioritario'], cta: 'Elegir Growth', msg: 'Hola, me interesa el plan Growth para mi gimnasio.' },
              ].map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100}>
                  <div className={`relative rounded-2xl border bg-white p-8 ${plan.popular ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500' : 'border-gray-200'}`}>
                    {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-sm font-semibold text-white">Más elegido</span>}
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
                    <a href={waLink(plan.msg)} className={`mt-8 block w-full rounded-xl py-3 text-center font-semibold ${plan.popular ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'border-2 border-gray-200 text-gray-700 hover:border-emerald-300 hover:text-emerald-600'}`}>
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  ¿Listo para llenar tu gimnasio?
                </h2>
                <p className="mt-4 text-lg text-gray-600">Empezá con diagnóstico gratis. Sin compromiso.</p>
                <a href={waLink('Hola, tengo un gimnasio y quiero pedir el diagnóstico gratis de ParaguAI.')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 text-xl font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-emerald-600 transition-all">
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