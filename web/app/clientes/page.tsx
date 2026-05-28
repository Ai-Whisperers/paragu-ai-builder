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
  { name: 'Nexa Paraguay', url: 'https://nexapyr.com', rubro: 'Reubicación', desc: 'Programa de reubicación para europeos (4 idiomas)', slug: 'nexa' },
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
