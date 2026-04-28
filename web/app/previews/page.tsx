import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Previews — sitios demo de ParaguAI',
  description:
    'Explorá todos los sitios demo que armamos con ParaguAI. Cada preview es personalizable para tu negocio.',
  alternates: { canonical: '/previews' },
}

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  peluqueria: 'Peluquería',
  salon_belleza: 'Salón de Belleza',
  gimnasio: 'Gimnasio / Fitness',
  spa: 'Spa & Wellness',
  unas: 'Uñas',
  tatuajes: 'Tatuajes',
  barberia: 'Barbería',
  estetica: 'Estética',
  maquillaje: 'Maquillaje',
  depilacion: 'Depilación',
  pestanas: 'Pestañas',
  diseno_grafico: 'Diseño Gráfico',
}

export default async function PreviewsPage() {
  const supabase = await createClient('service_role')
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, name, type, city')
    .ilike('slug', 'preview-%')
    .order('name')

  if (!businesses || businesses.length === 0) {
    return (
      <>
        <SiteNav />
        <main className="pt-24 pb-20">
          <Container>
            <p className="text-center text-muted-foreground">No se pudieron cargar los previews.</p>
          </Container>
        </main>
        <SiteFooter />
      </>
    )
  }

  // Group by type
  const grouped: Record<string, typeof businesses> = {}
  for (const biz of businesses) {
    const t = biz.type || 'otro'
    if (!grouped[t]) grouped[t] = []
    grouped[t].push(biz)
  }

  const typeOrder = [
    'peluqueria', 'salon_belleza', 'barberia', 'unas', 'estetica',
    'maquillaje', 'depilacion', 'pestanas', 'tatuajes', 'gimnasio',
    'spa', 'diseno_grafico',
  ]

  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
              {businesses.length} sitios demo
            </p>
            <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
              Sitios que podés tener
            </h1>
            <p className="text-lg text-muted-foreground">
              Cada preview se ve igual que un sitio real. Hacé click para verlo, y si te gusta
              pedinos el tuyo por WhatsApp.
            </p>
          </div>

          {/* Group filter pills */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {typeOrder
              .filter((t) => grouped[t])
              .map((t) => (
                <a
                  key={t}
                  href={`#${t}`}
                  className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-[var(--primary)] hover:text-primary"
                >
                  {TYPE_LABELS[t] || t}
                  <span className="ml-1.5 text-xs opacity-60">({grouped[t].length})</span>
                </a>
              ))}
          </div>

          {/* Groups */}
          {typeOrder.map((type) => {
            const items = grouped[type]
            if (!items) return null
            return (
              <section key={type} id={type} className="mb-12 scroll-mt-24">
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  {TYPE_LABELS[type] || type}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {items.length} sitios
                  </span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((biz) => {
                    const name = biz.name?.trim() || biz.slug.replace(/^preview-/, '').replace(/-/g, ' ').replace(/\d+$/, '')
                    return (
                      <Link
                        key={biz.slug}
                        href={`/s/es/${biz.slug}`}
                        target="_blank"
                        className="group flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-md"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {name}
                          </p>
                          {biz.city && (
                            <p className="text-xs text-muted-foreground">{biz.city}</p>
                          )}
                        </div>
                        <ExternalLink
                          size={14}
                          className="ml-2 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                        />
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
