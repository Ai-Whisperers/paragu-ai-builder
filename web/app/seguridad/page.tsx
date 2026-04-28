import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock, Shield, Server, FileText, Mail } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'

export const metadata: Metadata = {
  title: 'Privacidad y manejo de datos — ParaguAI',
  description:
    'Cómo guardamos los datos de tu negocio, dónde se aloja tu sitio, qué hacemos si te vas y cómo cumplimos con la Ley 6534 de Paraguay.',
  alternates: { canonical: '/seguridad' },
}

const POINTS = [
  {
    icon: Server,
    title: 'Dónde vive tu sitio',
    body:
      'Hosting en Cloudflare (CDN global) + Supabase (datos). Backups automáticos diarios. Si nuestro proveedor cae, tu sitio sigue sirviendo desde la caché.',
  },
  {
    icon: Lock,
    title: 'Quién accede a tu información',
    body:
      'Solo el equipo de ParaguAI involucrado en tu proyecto. No vendemos ni compartimos los datos de tu negocio con terceros para publicidad.',
  },
  {
    icon: Shield,
    title: 'Datos de tus visitantes',
    body:
      'Si activás analytics, registramos tráfico anónimo (visitas, fuentes, clicks). Si activás formularios, guardamos los envíos para que vos los veas. Nunca trackeamos a tus visitantes para revenderlos.',
  },
  {
    icon: FileText,
    title: 'Si decidís irte',
    body:
      'Te llevás tu dominio. Te exportamos tu contenido (textos y fotos) en formato estándar. Borramos tus datos de nuestros sistemas en 30 días.',
  },
] as const

export default function SeguridadPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-24 pb-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                Privacidad y datos
              </p>
              <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
                Lo que hacemos con tu información
              </h1>
              <p className="text-lg text-muted-foreground">
                Sin letra chica. Lo que necesitás saber para confiar en dejarnos los datos de tu
                negocio.
              </p>
            </div>

            <div className="space-y-5">
              {POINTS.map((p) => {
                const Icon = p.icon
                return (
                  <div
                    key={p.title}
                    className="flex gap-5 rounded-2xl border border-border bg-surface p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h2 className="mb-2 text-lg font-bold text-foreground">{p.title}</h2>
                      <p className="text-muted-foreground">{p.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-surface-light p-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">Marco legal</h2>
              <p className="mb-4 text-muted-foreground">
                Operamos bajo la <strong>Ley N° 6534/2020 de Protección de Datos Personales</strong> de
                Paraguay. Para usuarios europeos relacionados con clientes nuestros (ej. Nexa Paraguay
                en sus mercados europeos), aplicamos los principios de minimización de datos del GDPR.
              </p>
              <p className="text-muted-foreground">
                Si querés ejercer tu derecho de acceso, rectificación o eliminación, escribinos por
                WhatsApp o al correo del equipo.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
              >
                ← Volver al inicio
              </Link>
              <span className="text-muted-foreground">·</span>
              <a
                href="mailto:contacto@paragu-ai.com"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
              >
                <Mail size={14} />
                contacto@paragu-ai.com
              </a>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
