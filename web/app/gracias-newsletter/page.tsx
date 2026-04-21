import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'Gracias por suscribirte',
  description: 'Confirmá tu email para empezar a recibir novedades de ParaguAI.',
  alternates: { canonical: '/gracias-newsletter' },
  // No-index: this is a transactional page, not SEO content.
  robots: { index: false, follow: false },
}

/**
 * Newsletter confirmation landing. Configure Mailchimp's double-opt-in
 * confirmation redirect to point here so the visitor stays on our brand
 * instead of bouncing to mailchimp.com.
 *
 * Mailchimp setup:
 *   List → Settings → List name and defaults → Form responses → Edit response
 *     for "Subscribe thank you page" → URL: https://paragu-ai.com/gracias-newsletter
 */
export default function NewsletterThankYouPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-24 pb-20">
        <Container size="md">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
              <Check size={32} />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
              ¡Gracias! Revisá tu email
            </h1>
            <p className="mb-8 text-lg text-[var(--text-light)]">
              Te enviamos un correo para confirmar la suscripción. Click al link y empezás a
              recibir novedades sobre nuevas plantillas, tips para tu sitio y casos de estudio.
            </p>
            <div className="mb-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-light)] p-6 text-left">
              <p className="mb-2 text-sm font-semibold text-[var(--text)]">
                ¿No te llegó el email?
              </p>
              <ul className="space-y-1 text-sm text-[var(--text-light)]">
                <li>· Revisá la carpeta de spam o promociones (suele caer ahí la primera vez).</li>
                <li>· Esperá un par de minutos — a veces tarda.</li>
                <li>
                  · Escribinos por WhatsApp si seguís sin recibirlo y lo arreglamos.
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={waLink('Hola, no me llegó el email de confirmación de la newsletter de ParaguAI.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-bold text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <MessageCircle size={18} />
                Escribir por WhatsApp
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:opacity-90"
              >
                Volver al inicio
              </Link>
            </div>

            <div className="mt-16">
              <p className="mb-3 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Mientras tanto, mirá esto
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/casos"
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Casos reales
                </Link>
                <Link
                  href="/p"
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Plantillas
                </Link>
                <Link
                  href="/blog"
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
