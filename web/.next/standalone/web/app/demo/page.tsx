import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { DemoQualifier } from '@/components/landing/demo-qualifier'

export const metadata: Metadata = {
  title: 'Pedir demo gratis — sitio web profesional en 48 horas',
  description:
    'Decinos tu rubro y tu situación actual. Te mandamos una demo personalizada por WhatsApp en 24-48 horas. Sin compromiso.',
  alternates: { canonical: '/demo' },
}

export default function DemoPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-24 pb-20">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
              Demo gratis
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
              Tres preguntas y armamos tu demo
            </h1>
            <p className="text-lg text-[var(--text-light)]">
              Cuanto más sepamos, mejor te llega la primera versión. Igual podés saltarte esto y
              escribirnos por WhatsApp directamente — pero esto nos ahorra ida y vuelta.
            </p>
          </div>
          <DemoQualifier />
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
