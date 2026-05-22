'use client'

import { useState } from 'react'
import { Briefcase, MessageCircle, ArrowRight, Check, Star, ChevronDown,
         TrendingUp, Users, BarChart3, Globe, FileText } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

function waLink(msg: string) {
  return `https://wa.me/595981324569?text=${encodeURIComponent(msg)}`
}

const STATS = [
  { value: '250+', label: 'Profesionales en Paraguay' },
  { value: '48h', label: 'Tiempo de entrega' },
  { value: '4.9★', label: 'Valoración promedio' },
]

const CLIENT_CASES = [
  { name: 'Luis León Contador', tag: 'Contabilidad', result: '10x más consultas', locale: 'Asunción' },
  { name: 'Escribanía 2030', tag: 'Escribanía', result: 'Casos desde Google', locale: 'San Lorenzo' },
  { name: 'Jotai Ink', tag: 'Estudio jurídico', result: 'Primera página Google', locale: 'Asunción' },
]

const FEATURES = [
  { icon: Globe, title: 'Tu prestigio online', desc: 'Abogados, contadores, médicos, arquitectos — tus clientes te buscan en Google antes de llamar. Asegurate de aparecer.' },
  { icon: FileText, title: 'Casos de éxito y CV online', desc: 'Tu historia, logros, clientes representados. La confianza se construye antes del primer contacto.' },
  { icon: MessageCircle, title: 'Consultas por WhatsApp', desc: 'Tu prospecto lee tu perfil, tiene preguntas, te escribe directo. Sin intermediarios, sin perder leads.' },
  { icon: BarChart3, title: 'Sabés cuántos te contactan', desc: 'Dashboard de visitas y consultas. Cada mes sabés qué está funcionando y qué no.' },
]

const FAQS = [
  { q: '¿Puedo mostrar mis casos de éxito?', a: 'Sí. Armamos una sección de casos de éxito, publicaciones, logros y testimonios. Construís autoridad antes del contacto.' },
  { q: '¿Sirve para médicos?', a: 'Sí. Especialmente para médicos particulares que quieren atraer pacientes sin depender de clínicas.' },
  { q: '¿Puedo mostrar mis publicaciones?', a: 'Sí. Integridad con LinkedIn, blog o publicaciones académicas. Tu expertise se muestra automáticamente.' },
  { q: '¿Puedo agendar citas?', a: 'Sí. Podemos integrar calendario de reservas o dejar que los pacientes te escriban por WhatsApp directamente.' },
]

export default function ProfesionalesPage() {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 text-white">
                <BrandMark width={20} height={20} />
              </div>
              <span className="text-lg font-bold text-gray-900">Paragu<span className="text-indigo-600">AI</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {[{ href: '/casos', label: 'Casos' }, { href: '/belleza', label: 'Belleza' }, { href: '/gastronomia', label: 'Gastronomía' }, { href: '/precios', label: 'Precios' }].map(l => (
                <a key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900">{l.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href={waLink('Hola, soy profesional y quiero una demo gratis de ParaguAI.')} className="hidden md:inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">
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
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
            <FloatingShape className="top-20 right-10 h-[450px] w-[450px] rounded-full bg-indigo-200/40" delay={0} />
            <FloatingShape className="bottom-20 left-5 h-[350px] w-[350px] rounded-full bg-purple-200/30" delay={1} />
          </div>
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-600">+250 profesionales en Paraguay usan ParaguAI</span>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Tu nombre aparece en Google{' '}
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    antes de la competencia
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                  Sistema de presencia profesional: sitio que muestra tu expertise,
                  te posiciona en Google y recibe consultas por WhatsApp.
                  Todo por <strong>Gs 500.000 al mes</strong>.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href={waLink('Hola, soy profesional y quiero una demo gratis de ParaguAI.')} className="group inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-xl transition-all">
                    <MessageCircle size={20} />
                    Pedir demo gratis
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#casos" className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                    Ver casos reales
                  </a>
                </div>
              </FadeIn>
              <FadeIn delay={450}>
                <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-6 rounded-2xl border border-indigo-100 bg-white/80 p-8">
                  {STATS.map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-3xl font-bold text-indigo-500 md:text-4xl">{s.value}</p>
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
                { icon: '🔍', title: 'No aparecés en Google', desc: 'Cuando alguien busca "abogado divorcio Asunción" o "contador PY", no figurás. Tu competencia sí.' },
                { icon: '💼', title: 'Tu CV está en LinkedIn', desc: 'Pero nadie revisa 500 solicitudes. Necesitás un sitio propio donde te encuentren clientes directo.' },
                { icon: '📱', title: 'Te contactan solo por precio', desc: 'Porque no tienen forma de conocer tu expertise. Un sitio profesional separa el wheat from the chaff.' },
                { icon: '🤝', title: 'Dependés de referidos', desc: 'Si no viene una recomendación, no hay consulta. Necesitás canales nuevos para atraer clientes.' },
                { icon: '📊', title: 'Sin saber qué buscan', desc: '¿Cuántas personas-google tu especialidad al mes? No lo sabés. Necesitás data.' },
                { icon: '💬', title: 'WhatsApp personal = caos', desc: 'Mezclás clientes con familia y amigos. Necesitás un canal profesional para consultas.' },
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Así funciona ParaguAI para profesionales</h2>
              </div>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', title: 'Posiciónate en tu especialidad', desc: 'Cuando busquen "abogado laboralista Asunción" o "médico deportivo PY", aparecés vos.' },
                { num: '02', title: 'Tu CV digital profesional', desc: 'Casos, logros, publicaciones, testimonios. Construís autoridad antes del primer contacto.' },
                { num: '03', title: 'Consultas por WhatsApp', desc: 'Tu prospecto te lee, tiene preguntas, te escribe directo. Lead qualification antes de la llamada.' },
                { num: '04', title: 'Dashboard de consultas', desc: 'Sabés cuántas personas te buscaron y contactaron. Cada mes, datos reales para decidir.' },
              ].map((s, i) => (
                <FadeIn key={s.num} delay={i * 120}>
                  <div className="relative rounded-2xl border border-gray-200 bg-white p-8">
                    <span className="absolute -top-4 left-8 rounded-full bg-indigo-500 px-4 py-1 text-sm font-bold text-white">{s.num}</span>
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
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Profesionales que ya fueron encontrados</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {CLIENT_CASES.map((c, i) => (
                <FadeIn key={c.name} delay={i * 100}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Briefcase size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                    <p className="mt-1 text-sm text-indigo-500 font-medium">{c.tag} · {c.locale}</p>
                    <div className="mt-4 rounded-xl bg-indigo-50 p-4">
                      <p className="text-sm text-gray-600">Resultado:</p>
                      <p className="text-lg font-bold text-indigo-600">{c.result}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-500 text-white">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Lo que dicen los profesionales</h2>
              </div>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Luis León', biz: 'Contador, Asunción', quote: 'Pasé de depender de recomendaciones de clientes a que me contacten desde Google. El sitio trajo consultas que nunca habrían llegado.' },
                { name: 'María Rojas', biz: 'Escribanía 2030, San Lorenzo', quote: 'Mi escribanía aparecía en la tercera página. Ahora estoy en la primera para "escribano Asunción". Eso cambió todo.' },
                { name: 'Carlos Jara', biz: 'Jotai Ink, Asunción', quote: 'El sitio profesionalizó mi estudio. Los clientes que llegan ya saben quién soy y qué hago. La calidad de las consultas mejoró mucho.' },
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Planes para profesionales</h2>
                <p className="mt-4 text-lg text-gray-600">Empezá gratis con diagnóstico. Escalá cuando crezca tu clientela.</p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                { name: 'Diagnóstico', setup: 'Gratis', monthly: null, popular: false, features: ['Análisis de tu presencia online', 'Demo de cómo te verías en Google', 'Recomendación según tu especialidad', 'Sin compromiso'], cta: 'Pedir diagnóstico', msg: 'Hola, soy profesional y quiero el diagnóstico gratis.' },
                { name: 'Launch', setup: 'Gs 3.000.000', monthly: 'Gs 500.000', popular: true, features: ['Sitio profesional con CV', 'Aparecé en Google', 'Consultas por WhatsApp', 'Dominio .com.py + SSL', '2 actualizaciones/mes', 'Reporte mensual'], cta: 'Elegir Launch', msg: 'Hola, me interesa el plan Launch para mi actividad profesional.' },
                { name: 'Growth', setup: 'Gs 6.000.000', monthly: 'Gs 1.000.000', popular: false, features: ['Todo lo del Launch', 'Blog + casos de éxito', '1 campaña/mes', '6 actualizaciones/mes', 'Soporte prioritario'], cta: 'Elegir Growth', msg: 'Hola, me interesa el plan Growth para mi actividad profesional.' },
              ].map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100}>
                  <div className={`relative rounded-2xl border bg-white p-8 ${plan.popular ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500' : 'border-gray-200'}`}>
                    {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">Más elegido</span>}
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
                    <a href={waLink(plan.msg)} className={`mt-8 block w-full rounded-xl py-3 text-center font-semibold ${plan.popular ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-indigo-600'}`}>
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
                <a href={waLink('Hola, soy profesional y quiero pedir el diagnóstico gratis de ParaguAI.')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-8 py-4 text-xl font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-indigo-600 transition-all">
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