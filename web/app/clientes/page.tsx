import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Sitios Reales · ParaguAI',
  description: 'Conocé negocios paraguayos reales que ya tienen su sitio web con ParaguAI. Spas, gimnasios, e-commerce y más.',
  alternates: { canonical: '/clientes' },
}

const CLIENTS = [
  {
    name: 'Nexa Paraguay',
    url: 'https://nexa.paragu-ai.com',
    rubro: 'Reubicación',
    desc: 'Sitio multi-idioma (ES/EN/DE/NL) para clientes europeos que evalúan mudarse a Paraguay.',
    slug: 'nexa',
    color: '#1e3a5f',
  },
  {
    name: 'Mantra Spa',
    url: 'https://mantraspa.paragu-ai.com',
    rubro: 'Spa & Wellness',
    desc: 'Masajes y tratamientos faciales. Reservas por WhatsApp, galería de servicios y horarios.',
    slug: 'mantra',
    color: '#7c9885',
  },
  {
    name: 'Bichos Gym',
    url: 'https://bichosgym.paragu-ai.com',
    rubro: 'Gimnasio',
    desc: 'Entrenamiento funcional en Asunción. Planes, horarios y botón de WhatsApp para consultas.',
    slug: 'bichos',
    color: '#2d6a4f',
  },
  {
    name: 'DepiFlash',
    url: 'https://depiflash.paragu-ai.com',
    rubro: 'Depilación',
    desc: 'Depilación láser a domicilio en Paraguay. Formulario de contacto y pricing claro.',
    slug: 'depi',
    color: '#e17055',
  },
  {
    name: 'Superspuma',
    url: 'https://superspuma.com.py',
    rubro: 'B2B Industrial',
    desc: 'Catálogo B2B de accesorios de limpieza industriales con precios y botón de contacto.',
    slug: 'super',
    color: '#0ea5e9',
  },
]

export default function ClientesPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-32 pb-20">
        <Container>
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Sitios Reales</h1>
            <p className="mt-4 text-lg text-gray-600">
              No son plantillas vacías. Estos son negocios paraguayos que ya venden online con ParaguAI.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CLIENTS.map((c) => (
              <a
                key={c.slug}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="aspect-video flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${c.color}22, ${c.color}44)` }}
                >
                  <div className="text-center px-4">
                    <div
                      className="inline-block w-12 h-12 rounded-xl mb-2 flex items-center justify-center"
                      style={{ backgroundColor: c.color }}
                    >
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium" style={{ color: c.color }}>
                      {c.name}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: c.color + '22', color: c.color }}
                    >
                      {c.rubro}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
                    Ver sitio <ExternalLink size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">El próximo sitio puede ser el tuyo</h2>
            <p className="mt-2 text-white/80">
              Demo gratis. Sin tarjeta, sin compromiso. Te mostramos cómo quedaría antes de pagar.
            </p>
            <a
              href={waLink('Hola, quiero una demo gratis como los sitios que vi en paragu-ai.com/clientes.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition-all hover:bg-white/90"
            >
              Quiero mi demo gratis
              <ArrowRight size={18} />
            </a>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
