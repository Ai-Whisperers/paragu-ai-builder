import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Sparkles, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'

export const metadata: Metadata = {
  title: 'Previews — sitios demo por rubro | ParaguAI',
  description:
    'Explorá 32 sitios demo de distintos rubros: peluquería, restaurante, clínica, taller, inmobiliaria y más. Cada preview es personalizable para tu negocio.',
  alternates: { canonical: '/previews' },
}

const CLUSTER_ICONS: Record<string, string> = {
  Belleza: '💇',
  Bienestar: '🧖',
  Gastronomía: '🍽️',
  Salud: '🏥',
  Automotor: '🔧',
  Comercio: '🏪',
  Oficios: '🔨',
  'Bienes Raíces': '🏠',
  Profesionales: '💼',
  Mascotas: '🐾',
}

const CLUSTER_ORDER = [
  'Belleza', 'Bienestar', 'Gastronomía', 'Salud',
  'Automotor', 'Comercio', 'Oficios', 'Bienes Raíces',
  'Profesionales', 'Mascotas',
]

const DEMOS = [
  { slug: 'demo-peluqueria', rubro: 'peluqueria', nameEs: 'Peluquería', city: 'Asunción', cluster: 'Belleza' },
  { slug: 'demo-salon-belleza', rubro: 'salon_belleza', nameEs: 'Salón de Belleza', city: 'Asunción', cluster: 'Belleza' },
  { slug: 'demo-spa', rubro: 'spa', nameEs: 'Spa', city: 'Asunción', cluster: 'Bienestar' },
  { slug: 'demo-barberia', rubro: 'barberia', nameEs: 'Barbería', city: 'Asunción', cluster: 'Belleza' },
  { slug: 'demo-unas', rubro: 'unas', nameEs: 'Uñas', city: 'Asunción', cluster: 'Belleza' },
  { slug: 'demo-restaurant', rubro: 'restaurant', nameEs: 'Restaurante', city: 'Asunción', cluster: 'Gastronomía' },
  { slug: 'demo-clinica-integral', rubro: 'clinica_integral', nameEs: 'Clínica Integral', city: 'Asunción', cluster: 'Salud' },
  { slug: 'demo-odontologia', rubro: 'consultorio_odontologico', nameEs: 'Odontología', city: 'Asunción', cluster: 'Salud' },
  { slug: 'demo-psicologia', rubro: 'psicologia', nameEs: 'Psicología', city: 'Asunción', cluster: 'Salud' },
  { slug: 'demo-panaderia', rubro: 'panaderia', nameEs: 'Panadería Artesanal', city: 'Asunción', cluster: 'Gastronomía' },
  { slug: 'demo-taller-mecanico', rubro: 'taller_mecanico', nameEs: 'Taller Mecánico', city: 'San Lorenzo', cluster: 'Automotor' },
  { slug: 'demo-ferreteria', rubro: 'ferreteria', nameEs: 'Ferretería', city: 'Asunción', cluster: 'Comercio' },
  { slug: 'demo-farmacia', rubro: 'farmacia', nameEs: 'Farmacia', city: 'Asunción', cluster: 'Salud' },
  { slug: 'demo-electricista', rubro: 'electricista', nameEs: 'Electricista', city: 'Asunción', cluster: 'Oficios' },
  { slug: 'demo-plomero', rubro: 'plomero', nameEs: 'Plomero', city: 'Asunción', cluster: 'Oficios' },
  { slug: 'demo-inmobiliaria', rubro: 'inmobiliaria', nameEs: 'Inmobiliaria', city: 'Asunción', cluster: 'Bienes Raíces' },
  { slug: 'demo-contador', rubro: 'contador', nameEs: 'Contador', city: 'Asunción', cluster: 'Profesionales' },
  { slug: 'demo-carniceria', rubro: 'carniceria', nameEs: 'Carnicería', city: 'Luque', cluster: 'Comercio' },
  { slug: 'demo-gomeria', rubro: 'gomeria', nameEs: 'Gomería', city: 'Asunción', cluster: 'Automotor' },
  { slug: 'demo-lavadero', rubro: 'lavadero_autos', nameEs: 'Lavadero de Autos', city: 'Asunción', cluster: 'Automotor' },
  { slug: 'demo-parrilla', rubro: 'parrilla_asador', nameEs: 'Parrilla', city: 'Asunción', cluster: 'Gastronomía' },
  { slug: 'demo-cafeteria', rubro: 'cafeteria', nameEs: 'Cafetería', city: 'Asunción', cluster: 'Gastronomía' },
  { slug: 'demo-bodega', rubro: 'bodega_corner_store', nameEs: 'Bodega', city: 'Fernando de la Mora', cluster: 'Comercio' },
  { slug: 'demo-cerrajero', rubro: 'cerrajero', nameEs: 'Cerrajero', city: 'Asunción', cluster: 'Oficios' },
  { slug: 'demo-veterinaria', rubro: 'veterinaria', nameEs: 'Veterinaria', city: 'Asunción', cluster: 'Mascotas' },
  { slug: 'demo-herreria', rubro: 'herreria', nameEs: 'Herrería', city: 'Lambaré', cluster: 'Oficios' },
  { slug: 'demo-depilacion', rubro: 'depilacion', nameEs: 'Depilación Láser', city: 'Asunción', cluster: 'Belleza' },
  { slug: 'demo-maquillaje', rubro: 'maquillaje', nameEs: 'Maquillaje Profesional', city: 'Asunción', cluster: 'Belleza' },
]

const grouped = DEMOS.reduce<Record<string, typeof DEMOS>>((acc, d) => {
  if (!acc[d.cluster]) acc[d.cluster] = []
  acc[d.cluster].push(d)
  return acc
}, {})

export default function PreviewsPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              {DEMOS.length} sitios demo
            </p>
            <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
              Sitios que podés tener
            </h1>
            <p className="text-lg text-muted-foreground">
              Elegí tu rubro y mirá cómo se ve tu sitio antes de pedirlo. 32 demos de distintos negocios en Paraguay.
            </p>
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {CLUSTER_ORDER.filter((c) => grouped[c]).map((cluster) => (
              <a
                key={cluster}
                href={`#${cluster}`}
                className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {CLUSTER_ICONS[cluster] || '📋'} {cluster}
                <span className="ml-1.5 text-xs opacity-60">({grouped[cluster].length})</span>
              </a>
            ))}
          </div>

          {/* Real client showcase */}
          <section className="mb-16 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Casos reales</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Estos son clientes que ya están publicados con ParaguAI. Cada demo se ve igual que estos.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { slug: 'nexa-paraguay', locale: 'nl', name: 'Nexa Paraguay', desc: 'Relocation · 4 idiomas' },
                { slug: 'dayah-litworks', locale: 'es', name: 'Dayah Litworks', desc: 'Portfolio · Diseño' },
                { slug: 'superspuma', locale: 'es', name: 'Superspuma', desc: 'Belleza · CDE' },
              ].map((c) => (
                <a
                  key={c.slug}
                  href={`/s/${c.locale}/${c.slug}`}
                  target="_blank"
                  className="group rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="font-semibold text-foreground group-hover:text-primary">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver sitio <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {CLUSTER_ORDER.filter((c) => grouped[c]).map((cluster) => (
            <section key={cluster} id={cluster} className="mb-12 scroll-mt-24">
              <h2 className="mb-2 text-xl font-bold text-foreground">
                {CLUSTER_ICONS[cluster] || '📋'} {cluster}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {grouped[cluster].length} demo{grouped[cluster].length > 1 ? 's' : ''} disponibles
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {grouped[cluster].map((demo) => (
                  <Link
                    key={demo.slug}
                    href={`/s/es/${demo.slug}`}
                    target="_blank"
                    className="group flex items-center justify-between rounded-xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                        {demo.nameEs}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{demo.city}</p>
                    </div>
                    <ExternalLink size={14} className="ml-2 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* Bottom CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              ¿Viste algo que te gustó?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Pedí tu demo personalizada para tu negocio. Te mandamos el link por WhatsApp en 48 horas.
            </p>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              Pedir mi demo gratis <ArrowRight size={16} />
            </a>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
