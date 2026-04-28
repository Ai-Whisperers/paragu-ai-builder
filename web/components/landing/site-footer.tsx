import Link from 'next/link'
import { Wand2 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

const FOOTER_GROUPS = [
  {
    title: 'Producto',
    links: [
      { href: '/p', label: 'Plantillas' },
      { href: '/precios', label: 'Precios' },
      { href: '/comparacion', label: 'Comparación' },
      { href: '/demo', label: 'Pedir demo' },
    ],
  },
  {
    title: 'Casos reales',
    links: [
      { href: '/casos', label: 'Todos los casos' },
      { href: '/casos/nexa-paraguay', label: 'Nexa Paraguay' },
      { href: '/casos/dayah-litworks', label: 'Dayah Litworks' },
      { href: '/casos/de-abasto-a-casa', label: 'De Abasto a Casa' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/c', label: 'Por ciudad' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/seguridad', label: 'Privacidad y datos' },
      { href: '/#faq', label: 'FAQ' },
      { href: '/admin', label: 'Acceso clientes' },
    ],
  },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <Container>
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)]">
                <Wand2 size={20} />
              </div>
              <span className="text-xl font-bold">
                <span className="text-foreground">Paragu</span>
                <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              Sitios web profesionales para negocios paraguayos. Todo incluido, en 48 horas.
            </p>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <Heading level={3} className="mb-4 font-bold text-foreground">{group.title}</Heading>
              <ul className="space-y-2 text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ParaguAI Builder. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  )
}
