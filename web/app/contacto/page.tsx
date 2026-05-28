import type { Metadata } from 'next'
import { MessageCircle, Clock, MapPin, Mail } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Contacto · ParaguAI',
  description: 'Contactá a ParaguAI. Respondemos en menos de 5 minutos por WhatsApp. Lunes a sábado 9:00–19:00.',
  alternates: { canonical: '/contacto' },
}

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+595 981 324 569',
    desc: 'Respondemos al instante',
    href: waLink('Hola, quiero saber más sobre ParaguAI.'),
    highlight: true,
  },
  {
    icon: Clock,
    label: 'Horarios',
    value: 'Lun–Sáb 9:00–19:00',
    desc: 'Hora de Asunción (GMT-3)',
    href: null,
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Asunción, Paraguay',
    desc: 'Trabajamos remoto con todo el país',
    href: null,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hola@paragu-ai.com',
    desc: 'Para temas no urgentes',
    href: 'mailto:hola@paragu-ai.com',
  },
]

const FAQ = [
  {
    q: '¿Cuánto tardan en responder?',
    a: 'Por WhatsApp respondemos en menos de 5 minutos. Por email, hasta 24 horas.',
  },
  {
    q: '¿Puedo hablar en guaraní?',
    a: 'Sí. Si te express mejor en guaraní, usamos el que prefieras.',
  },
  {
    q: '¿Hacen reuniones por Zoom o Google Meet?',
    a: 'Sí, si lo necesitás. Pero la mayoría de los clientes prefiere WhatsApp — más rápido y sin agendar.',
  },
]

export default function ContactoPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-32 pb-20">
        <Container>
          {/* ── Header ───────────────────────────────────────── */}
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
              Contacto
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Respondemos en menos de 5 minutos por WhatsApp
            </p>
          </div>

          {/* ── Métodos de contacto ──────────────────────────── */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_METHODS.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.label}
                  className={`rounded-2xl border p-6 ${
                    m.highlight
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                      m.highlight ? 'bg-blue-600' : 'bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${m.highlight ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{m.label}</p>
                  {m.href ? (
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-lg font-bold text-gray-900 hover:text-blue-600"
                    >
                      {m.value}
                      <span className="ml-2 text-sm font-normal text-blue-600">Escribir →</span>
                    </a>
                  ) : (
                    <p className="text-lg font-bold text-gray-900">{m.value}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">{m.desc}</p>
                </div>
              )
            })}
          </div>

          {/* ── FAQ rápido ──────────────────────────────────── */}
          <div className="mx-auto mt-16 max-w-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="font-semibold text-gray-900">{f.q}</h3>
                  <p className="mt-2 text-gray-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA ─────────────────────────────────────────── */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 p-10 text-center text-white">
            <h2 className="text-2xl font-bold">¿Empezamos hoy?</h2>
            <p className="mt-2 text-white/80">
              Mandanos tu negocio por WhatsApp y te armamos la demo en 48 horas.
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