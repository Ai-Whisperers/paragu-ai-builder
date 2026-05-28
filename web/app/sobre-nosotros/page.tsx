import type { Metadata } from 'next'
import { Globe, Clock, MapPin, Heart, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Sobre Nosotros · ParaguAI',
  description: 'Equipo ParaguAI — construimos sitios web profesionales para negocios paraguayos. Todo incluido, listo en 48 horas.',
  alternates: { canonical: '/sobre-nosotros' },
}

const VALUES = [
  {
    icon: Heart,
    title: 'Resultado antes que proceso',
    desc: 'No te interesa cómo lo hacemos. Lo que te importa es que funcione. Nosotros也是这样.',
  },
  {
    icon: Zap,
    title: 'Velocidad sobre perfección',
    desc: 'Un sitio online hoy vale más que un sitio perfecto en 3 meses. Empezamos rápido, refinamos después.',
  },
  {
    icon: Users,
    title: 'Tu negocio, tu idioma',
    desc: 'Hablamos guaraní, español y el idioma de tu rubro. No usamos jerga técnica innecesaria.',
  },
]

const TEAM = [
  {
    name: 'Equipo ParaguAI',
    role: 'Desarrollo + Diseño',
    desc: 'Construimos sitios web para negocios paraguayos. Automatización, templates por rubro y atención humana cuando la necesitás.',
  },
]

const TIMELINE = [
  { year: '2024', event: 'Primer sitio publicado para un negocio paraguayo' },
  { year: '2024', event: 'Lanzamos el modelo de demo gratuita + IA entrenable' },
  { year: '2025', event: '+50 sitios activos en Paraguay' },
  { year: '2025', event: 'Agregamos WhatsApp Business y reservas automáticas' },
  { year: '2026', event: '+250 sitios publicados, modelo de domain .com.py propio' },
]

export default function SobreNosotrosPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-32 pb-20">
        <Container>
          {/* ── Hero ──────────────────────────────────────────── */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
              Construimos sitios que venden
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              ParaguAI es un equipo que hace una cosa: pone negocios paraguayos online. Diseño, dominio, SEO y WhatsApp — todo incluido. Sin contratos, sin letra chica.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={waLink('Hola, quiero saber más sobre ParaguAI y cómo funciona.')}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Hablar por WhatsApp
              </Link>
              <Link
                href="/clientes"
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Ver sitios reales
              </Link>
            </div>
          </div>

          {/* ── Stats ────────────────────────────────────────── */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            {[
              { value: '+250', label: 'Sitios publicados' },
              { value: '48h', label: 'Tiempo promedio' },
              { value: '99.9%', label: 'Uptime' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-5xl font-bold text-blue-600">{s.value}</p>
                <p className="mt-2 text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Valores ──────────────────────────────────────── */}
          <div className="mt-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
              Cómo trabajamos
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {VALUES.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="rounded-2xl border border-gray-200 bg-white p-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{v.title}</h3>
                    <p className="mt-2 text-gray-600">{v.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Timeline ─────────────────────────────────────── */}
          <div className="mt-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
              Así llegamos hasta acá
            </h2>
            <div className="mx-auto max-w-2xl space-y-6">
              {TIMELINE.map((t) => (
                <div key={t.year + t.event} className="flex gap-4">
                  <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-600">
                    {t.year}
                  </span>
                  <p className="text-gray-600">{t.event}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Equipo ──────────────────────────────────────── */}
          <div className="mt-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
              ¿Quiénes somos?
            </h2>
            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8">
              {TEAM.map((m) => (
                <div key={m.name}>
                  <h3 className="text-xl font-bold text-gray-900">{m.name}</h3>
                  <p className="text-sm font-medium text-blue-600">{m.role}</p>
                  <p className="mt-3 text-gray-600">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ──────────────────────────────────────────── */}
          <div className="mt-20 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 p-10 text-center text-white">
            <h2 className="text-2xl font-bold">¿Listo para poner tu negocio online?</h2>
            <p className="mt-2 text-white/80">
              Escribinos por WhatsApp. Te respondemos en menos de 5 minutos.
            </p>
            <a
              href={waLink('Hola, quiero mi sitio web con ParaguAI. ¿Cómo arrancamos?')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-white/90"
            >
              Empezar gratis
            </a>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}