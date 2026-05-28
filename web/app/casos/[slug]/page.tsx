import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const CASOS = [
  {
    slug: 'nexa-paraguay',
    name: 'Nexa Paraguay',
    tagline: 'Reubicación Europa → Paraguay',
    color: '#1e3a5f',
    vertical: 'Relocation · 4 idiomas',
    summary: 'Sitio multi-idioma (ES/EN/DE/NL) para clientes europeos que evalúan mudarse a Paraguay.',
    quote: 'Necesitábamos un sitio serio en 4 idiomas para clientes europeos. ParaguAI lo entregó sin que toquemos código y lo replicó para Uruguay en días.',
    clientName: 'Marcelo — Fundador',
    href: 'https://nexa.paragu-ai.com',
  },
  {
    slug: 'dayah-litworks',
    name: 'Dayah Litworks',
    tagline: 'Diseño de tapas de libros',
    color: '#c44569',
    vertical: 'Portfolio · pago en USD',
    summary: 'Portfolio de diseñadora gráfica con pricing en USD y proceso de encargo claro.',
    quote: 'Armó mi portfolio completo con tienda de libros en 48hs. Los pagos llegan directo a mi cuenta Payoneer.',
    clientName: 'Dayah — Diseñadora',
    href: 'https://dayah.paragu-ai.com',
  },
  {
    slug: 'mantra-spa',
    name: 'Mantra Spa',
    tagline: 'Masajes y tratamientos faciales',
    color: '#7c9885',
    vertical: 'Spa & Wellness · Asunción',
    summary: 'Sitio para spa con galería de tratamientos, horarios y botón de reservas por WhatsApp.',
    quote: 'Las clientas reservan solas ahora. Bajé un 40% las consultas por mensaje.',
    clientName: 'Leticia — Dueña',
    href: 'https://mantraspa.paragu-ai.com',
  },
  {
    slug: 'trentina',
    name: 'Trentina',
    tagline: 'Cerveza artesanal paraguaya',
    color: '#d97706',
    vertical: 'Cervecería · Santa Rita',
    summary: 'Sitio para cervecería artesanal con catálogo de cervezas y pedidos por WhatsApp.',
    quote: 'Mandé los datos por WhatsApp y el lunes el sitio estaba online. Los pedidos llegan solos.',
    clientName: 'Gastón — Cervecero',
    href: 'https://trentina.paragu-ai.com',
  },
]

export async function generateStaticParams() {
  return CASOS.map((c) => ({ slug: c.slug }))
}

export default function CasoPage({ params }: { params: { slug: string } }) {
  const caso = CASOS.find((c) => c.slug === params.slug)
  if (!caso) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Back */}
      <div className="border-b p-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/casos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Volver a casos
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b py-20" style={{ backgroundColor: caso.color + '10' }}>
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: caso.color + '20', color: caso.color }}>
            {caso.vertical}
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{caso.name}</h1>
          <p className="mt-2 text-xl text-gray-600">{caso.tagline}</p>
        </div>
      </div>

      {/* Quote */}
      <div className="py-16">
        <div className="mx-auto max-w-3xl px-6">
          <blockquote className="border-l-4 pl-6 text-lg italic text-gray-700" style={{ borderColor: caso.color }}>
            "{caso.quote}"
          </blockquote>
          <p className="mt-4 font-medium text-gray-900">— {caso.clientName}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="py-8 border-t border-b">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-gray-600">{caso.summary}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="py-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <a
            href={caso.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg px-8 py-4 font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: caso.color }}
          >
            Ver sitio en vivo →
          </a>
        </div>
      </div>
    </div>
  )
}
