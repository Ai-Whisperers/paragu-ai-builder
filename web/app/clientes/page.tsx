import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Sitios Reales · ParaguAI',
  description: 'Conocé negocios paraguayos reales que ya tienen su sitio web con ParaguAI. Peluquerías, gimnasios, spas, tatuajes y más.',
  alternates: { canonical: '/clientes' },
}

const CLIENTS = [
  { name: 'Magnolia Peluquería', url: 'https://magnolia-peluqueria.paragu-ai.com', rubro: 'Peluquería', desc: 'Cortes, coloración y tratamientos capilares en Asunción', slug: 'magnolia-peluqueria' },
  { name: 'Mantra Spa', url: 'https://mantraspa.paragu-ai.com', rubro: 'Spa & Wellness', desc: 'Masajes, tratamientos faciales y bienestar', slug: 'mantraspa' },
  { name: 'Bichos Gym', url: 'https://bichosgym.paragu-ai.com', rubro: 'Gimnasio / Fitness', desc: 'Entrenamiento funcional y crossfit', slug: 'bichosgym' },
  { name: 'Cocodrilo Fitness', url: 'https://cocodrilofitness.paragu-ai.com', rubro: 'Gimnasio / Fitness', desc: 'Gimnasio con equipamiento de primera', slug: 'cocodrilofitness' },
  { name: 'Jota Ink Tattoo', url: 'https://jotaink.paragu-ai.com', rubro: 'Tatuajes & Piercing', desc: 'Tatuajes personalizados y piercing', slug: 'jotaink' },
  { name: 'DepiFlash', url: 'https://depiflash.paragu-ai.com', rubro: 'Depilación', desc: 'Depilación láser IPL a domicilio', slug: 'depiflash' },
  { name: 'Dayah Litworks', url: 'https://dayah.paragu-ai.com', rubro: 'Diseño Gráfico', desc: 'Diseño de tapas de libros y portafolio', slug: 'dayah' },
  { name: 'Nexa Paraguay', url: 'https://nexa.paragu-ai.com', rubro: 'Reubicación', desc: 'Programa de reubicación para europeos (4 idiomas)', slug: 'nexa' },
  { name: 'El Viajero', url: 'https://tiendaelviajero.com.py', rubro: 'Retail', desc: 'Tienda de regalos y souvenirs en Ciudad del Este', slug: 'elviajero' },
  { name: 'Trentina', url: 'https://trentina.paragu-ai.com', rubro: 'Cervecería', desc: 'Cerveza artesanal paraguaya en Santa Rita, Alto Paraná', slug: 'trentina' },
  { name: 'Reina de Copas', url: 'https://reina-de-copas.paragu-ai.com', rubro: 'Salud', desc: 'Copas y discos menstruales ecológicos. Envíos a todo Paraguay', slug: 'reina-de-copas' },
  { name: 'El Gato Siamés', url: 'https://elgatosiames.paragu-ai.com', rubro: 'Entretenimiento', desc: 'Stand up paraguayo · Humor negro · One-liners', slug: 'elgatosiames' },
  { name: 'Luis de León Concept', url: 'https://luis-de-leon-concept.paragu-ai.com', rubro: 'Estética', desc: 'Centro de estética y bienestar', slug: 'luis-de-leon' },
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
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={`/images/screenshots/${c.slug}.svg`}
                    alt={`${c.name} sitio web`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      {c.rubro}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
                    Ver sitio
                    <ExternalLink size={14} />
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
