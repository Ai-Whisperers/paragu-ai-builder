'use client'

import { useState } from 'react'
import { Briefcase, TrendingUp, Users, MessageCircle, Search,
         ArrowRight, Check, Star, ChevronDown, Zap, Globe, BarChart3,
         Building2, MapPin, Phone, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

function waLink(msg: string) {
  return `https://wa.me/595981324569?text=${encodeURIComponent(msg)}`
}

// Mock dashboard data
const DASHBOARD_PREVIEW = {
  total_leads: 847,
  leads_growth: '+23%',
  google_leads: 412,
  whatsapp_leads: 435,
  top_queries: [
    { query: 'abogado Asunción', position: 3, change: '+2' },
    { query: 'contador empresas Paraguay', position: 5, change: '+1' },
    { query: 'notaria Ciudad del Este', position: 1, change: '0' },
    { query: 'asesor laboral San Lorenzo', position: 4, change: '+3' },
    { query: 'gestoria impositiva Asunción', position: 2, change: '-1' },
  ],
  monthly_trend: [
    { month: 'Ene', leads: 62 },
    { month: 'Feb', leads: 78 },
    { month: 'Mar', leads: 91 },
    { month: 'Abr', leads: 85 },
    { month: 'May', leads: 112 },
    { month: 'Jun', leads: 134 },
  ],
}

const FEATURES = [
  { icon: Search, title: 'Posicionamiento en Google', desc: 'Tu empresa aparece cuando buscan en tu rubro en Paraguay. Sin pagar ads.' },
  { icon: MessageCircle, title: 'Leads por WhatsApp', desc: 'Cada consulta llega directo a tu WhatsApp. Lead qualification automático.' },
  { icon: BarChart3, title: 'Dashboard de métricas', desc: 'Visitas, consultas, conversiones — datos reales cada semana.' },
  { icon: Building2, title: 'Perfil de empresa completo', desc: 'Tu historia, servicios, testimonios, clientes. Todo en un solo lugar.' },
]

const PLANS = [
  { name: 'Básico', price: 'Gs 500.000', setup: 'Gs 3.000.000', features: ['Perfil empresa en ParaguAI', 'Aparecé en Google', 'Leads por WhatsApp', '2 actualizaciones/mes'], cta: 'Elegir Básico', msg: 'Hola, me interesa ParaguayBiz básico para mi empresa.' },
  { name: 'Profesional', price: 'Gs 1.000.000', setup: 'Gs 6.000.000', popular: true, features: ['Todo lo del Básico', 'Dashboard de métricas', 'Blog + SEO continuo', '6 actualizaciones/mes', 'Soporte prioritario'], cta: 'Elegir Profesional', msg: 'Hola, me interesa ParaguayBiz profesional para mi empresa.' },
  { name: 'Corporativo', price: 'Gs 2.000.000', setup: 'Gs 12.000.000', features: ['Todo lo de Profesional', 'Múltiples ubicaciones', 'CRM integrado', 'Campañas mensuales', 'Asesor dedicado'], cta: 'Elegir Corporativo', msg: 'Hola, me interesa ParaguayBiz corporativo para mi empresa.' },
]

export default function ParaguaybizPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const maxLeads = Math.max(...DASHBOARD_PREVIEW.monthly_trend.map(m => m.leads))

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
              <a href={waLink('Hola, quiero saber más sobre ParaguayBiz para mi empresa.')} className="hidden md:inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
            <FloatingShape className="top-20 right-10 h-[500px] w-[500px] rounded-full bg-blue-100/40" delay={0} />
            <FloatingShape className="bottom-20 left-5 h-[400px] w-[400px] rounded-full bg-teal-100/30" delay={1} />
          </div>
          <Container>
            <div className="mx-auto max-w-5xl">
              <FadeIn>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2">
                  <Zap size={14} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Nuevo — ParaguayBiz SaaS</span>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  La plataforma B2B que{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    hace crecer empresas
                  </span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                  ParaguayBiz es el directorio premium de empresas paraguayas con presencia en Google,
                  leads calificados por WhatsApp y dashboard de métricas.
                  Para empresas que quieren captar clientes todos los días.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href={waLink('Hola, quiero una demo de ParaguayBiz para mi empresa.')} className="group inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl transition-all">
                    <Briefcase size={20} />
                    Reservar demo
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="#planes" className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all">
                    Ver planes
                  </a>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Dashboard Preview */}
        <section className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Dashboard de métricas en tiempo real
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Cada empresa en ParaguayBiz tiene su propio panel de control
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                {/* Dashboard header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe size={14} />
                    <span>paragu-ai.com/paraguaybiz/demo</span>
                  </div>
                </div>
                {/* Dashboard content */}
                <div className="grid md:grid-cols-3 gap-6 p-8">
                  {/* KPI cards */}
                  <div className="col-span-3 grid grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-blue-50 p-6 text-center">
                      <p className="text-4xl font-bold text-blue-600">{DASHBOARD_PREVIEW.total_leads}</p>
                      <p className="mt-1 text-sm text-gray-600">Leads totales</p>
                      <p className="mt-1 text-xs font-semibold text-green-600">{DASHBOARD_PREVIEW.leads_growth} vs mes anterior</p>
                    </div>
                    <div className="rounded-2xl bg-green-50 p-6 text-center">
                      <p className="text-4xl font-bold text-green-600">{DASHBOARD_PREVIEW.google_leads}</p>
                      <p className="mt-1 text-sm text-gray-600">Desde Google</p>
                      <p className="mt-1 text-xs text-gray-500">búsquedas orgánicas</p>
                    </div>
                    <div className="rounded-2xl bg-teal-50 p-6 text-center">
                      <p className="text-4xl font-bold text-teal-600">{DASHBOARD_PREVIEW.whatsapp_leads}</p>
                      <p className="mt-1 text-sm text-gray-600">Por WhatsApp</p>
                      <p className="mt-1 text-xs text-gray-500">consultas directas</p>
                    </div>
                  </div>
                  {/* Chart */}
                  <div className="col-span-2 rounded-2xl border border-gray-100 p-6">
                    <h4 className="mb-4 text-sm font-semibold text-gray-700">Leads por mes</h4>
                    <div className="flex items-end gap-3 h-32">
                      {DASHBOARD_PREVIEW.monthly_trend.map(m => (
                        <div key={m.month} className="flex flex-col items-center gap-2 flex-1">
                          <div className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-teal-400 transition-all hover:opacity-80" style={{ height: `${(m.leads / maxLeads) * 100}%`, minHeight: '8px' }} />
                          <span className="text-xs text-gray-500">{m.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Top queries */}
                  <div className="col-span-1 rounded-2xl border border-gray-100 p-6">
                    <h4 className="mb-4 text-sm font-semibold text-gray-700">Top búsquedas</h4>
                    <div className="space-y-3">
                      {DASHBOARD_PREVIEW.top_queries.map(q => (
                        <div key={q.query} className="flex items-center justify-between">
                          <span className="truncate text-sm text-gray-700">{q.query}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-500">#{q.position}</span>
                            {q.change !== '0' && <span className={`text-xs font-bold ${q.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{q.change}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* Features */}
        <section className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Todo lo que necesitás para captar clientes B2B
                </h2>
              </div>
            </FadeIn>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', title: 'Presencia en Google', desc: 'Tu empresa aparece cuando buscan en tu rubro. Sin ads, sin gastar en marketing.' },
                { num: '02', title: 'Leads por WhatsApp', desc: 'Cada consulta llega directo a tu WhatsApp con el nombre del servicio buscado.' },
                { num: '03', title: 'Dashboard completo', desc: 'Visitas, consultas, conversiones — datos reales cada semana para decidir.' },
                { num: '04', title: 'Perfil premium', desc: 'Tu historia, servicios, testimonios, clientes. Todo en un lugar profesional.' },
              ].map((s, i) => (
                <FadeIn key={s.num} delay={i * 120}>
                  <div className="relative rounded-2xl border border-gray-200 bg-white p-8">
                    <span className="absolute -top-4 left-8 rounded-full bg-blue-600 px-4 py-1 text-sm font-bold text-white">{s.num}</span>
                    <h3 className="mb-3 mt-2 text-xl font-bold text-gray-900">{s.title}</h3>
                    <p className="text-gray-600">{s.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* Features detail */}
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="grid gap-8 md:grid-cols-2">
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 100}>
                  <div className="flex items-start gap-5 rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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

        {/* Pricing */}
        <section id="planes" className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Planes ParaguayBiz</h2>
                <p className="mt-4 text-lg text-gray-600">Desde empresas nuevas hasta corporaciones con múltiples ubicaciones</p>
              </div>
            </FadeIn>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {PLANS.map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100}>
                  <div className={`relative rounded-2xl border bg-white p-8 ${plan.popular ? 'border-blue-500 shadow-xl ring-2 ring-blue-500' : 'border-gray-200'}`}>
                    {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">Más elegido</span>}
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.setup}</span>
                      <div className="mt-1 text-sm text-gray-600">setup + {plan.price}/mes</div>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-3">
                          <Check size={18} className="mt-0.5 flex-shrink-0 text-green-500" />
                          <span className="text-gray-700 text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={waLink(plan.msg)} className={`mt-8 block w-full rounded-xl py-3 text-center font-semibold ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600'}`}>
                      {plan.cta}
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-500 text-white">
          <Container>
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold md:text-4xl">
                  ¿Tu empresa aparece cuando buscan en tu rubro?
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  Reservá una demo y te mostramos cómo ParaguayBiz puede atraer más clientes.
                </p>
                <a href={waLink('Hola, quiero una demo de ParaguayBiz para mi empresa. ¿Podemos hablar?')} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-xl font-bold text-blue-600 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
                  <Calendar size={22} />
                  Agendar demo gratis
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