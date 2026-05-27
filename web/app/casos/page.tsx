'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { waLink } from '@/lib/landing/marketing-data'

const CASOS = [
  {
    slug: 'nexa-paraguay',
    name: 'Nexa Paraguay',
    tagline: 'Reubicación Europa → Paraguay',
    color: '#1e3a5f',
    vertical: 'Relocation · 4 idiomas',
    summary: 'Sitio multi-idioma (ES/EN/DE/NL) para clientes europeos que evalúan mudarse a Paraguay.',
    href: 'https://nexa.paragu-ai.com',
  },
  {
    slug: 'dayah-litworks',
    name: 'Dayah Litworks',
    tagline: 'Diseño de tapas de libros',
    color: '#c44569',
    vertical: 'Portfolio · pago en USD',
    summary: 'Portfolio de diseñadora gráfica con pricing en USD y proceso de encargo claro.',
    href: 'https://dayah.paragu-ai.com',
  },
  {
    slug: 'mantra-spa',
    name: 'Mantra Spa',
    tagline: 'Masajes y tratamientos faciales',
    color: '#7c9885',
    vertical: 'Spa & Wellness · Asunción',
    summary: 'Sitio para spa con galería de tratamientos, horarios y botón de reservas por WhatsApp.',
    href: 'https://mantraspa.paragu-ai.com',
  },
  {
    slug: 'trentina',
    name: 'Trentina',
    tagline: 'Cerveza artesanal paraguaya',
    color: '#d97706',
    vertical: 'Cervecería · Santa Rita',
    summary: 'Sitio para cervecería artesanal con catálogo de cervezas y pedidos por WhatsApp.',
    href: 'https://trentina.paragu-ai.com',
  },
  {
    slug: 'el-gato-siames',
    name: 'El Gato Siamés',
    tagline: 'Stand up paraguayo',
    color: '#6366f1',
    vertical: 'Entretenimiento · Asunción',
    summary: 'Sitio para comediante con calendario de shows y venta de entradas.',
    href: 'https://elgatosiames.paragu-ai.com',
  },
]

export default function CasosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white py-16">
        <Container>
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Casos de éxito</p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">Negocios que ya venden online</h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Cada sitio fue creado en 48 horas con IA. Sin templates, sin complicaciones. Así quedó el trabajo.
            </p>
          </FadeIn>
        </Container>
      </div>

      {/* Grid */}
      <Container>
        <div className="py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CASOS.map((caso, idx) => (
              <FadeIn key={caso.slug} delay={idx * 80}>
                <Link
                  href={`/casos/${caso.slug}`}
                  className="group block rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="mb-6 h-2 w-12 rounded-full"
                    style={{ backgroundColor: caso.color }}
                  />
                  <div className="mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium text-gray-500" style={{ backgroundColor: caso.color + '15' }}>
                    {caso.vertical}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                    {caso.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{caso.tagline}</p>
                  <p className="mt-4 text-sm text-gray-600">{caso.summary}</p>
                  <div className="mt-6 flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                    Ver caso <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* CTA */}
          <FadeIn delay={300}>
            <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900">¿Tu negocio puede ser el próximo?</h3>
              <p className="mt-3 text-gray-600">Te mostramos cómo quedaría tu sitio antes de que pagués un peso.</p>
              <a
                href={waLink('Hola, quiero ver cómo quedaría mi sitio. ¿Podemos hacer una demo?')}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700"
              >
                Solicitar demo gratis
              </a>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  )
}