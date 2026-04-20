import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle, Minus, X } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SiteNav } from '@/components/landing/site-nav'
import { SiteFooter } from '@/components/landing/site-footer'
import { waLink } from '@/lib/landing/marketing-data'

export const metadata: Metadata = {
  title: 'ParaguAI vs Wix vs Agencia local — comparación honesta',
  description:
    'Cómo se compara ParaguAI con Wix/WordPress y con una agencia web local en Paraguay: precio, tiempo, soporte, soporte WhatsApp y dominio .com.py.',
  alternates: { canonical: '/comparacion' },
}

type Cell = 'yes' | 'no' | 'partial' | string

const ROWS: { label: string; paraguai: Cell; wix: Cell; agencia: Cell }[] = [
  { label: 'Tiempo de entrega', paraguai: '48 horas', wix: 'Tu tiempo (DIY)', agencia: '2-4 meses' },
  { label: 'Setup inicial', paraguai: 'Desde Gs 0', wix: 'Gratis', agencia: 'Gs 3-5M' },
  { label: 'Mensualidad', paraguai: 'Desde Gs 100K', wix: 'Desde USD 16', agencia: 'Hosting aparte' },
  { label: 'Demo antes de pagar', paraguai: 'yes', wix: 'no', agencia: 'partial' },
  { label: 'Vos no tocás nada', paraguai: 'yes', wix: 'no', agencia: 'yes' },
  { label: 'Dominio .com.py incluido', paraguai: 'yes', wix: 'no', agencia: 'partial' },
  { label: 'Soporte por WhatsApp', paraguai: 'yes', wix: 'no', agencia: 'partial' },
  { label: 'Cambios mensuales incluidos', paraguai: '2-10 / mes', wix: 'Tu tiempo', agencia: 'Cobran aparte' },
  { label: 'SEO + Schema.org listo', paraguai: 'yes', wix: 'partial', agencia: 'partial' },
  { label: 'Sin permanencia', paraguai: 'yes', wix: 'yes', agencia: 'no' },
  { label: 'Te llevás el dominio si te vas', paraguai: 'yes', wix: 'yes', agencia: 'partial' },
  { label: 'Pago en guaraníes (Mercado Pago)', paraguai: 'yes', wix: 'no', agencia: 'yes' },
  { label: 'Garantía de 30 días', paraguai: 'yes', wix: 'partial', agencia: 'no' },
]

function Marker({ value }: { value: Cell }) {
  if (value === 'yes')
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
        <Check size={16} />
      </span>
    )
  if (value === 'no')
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--border)] text-[var(--text-muted)]">
        <X size={16} />
      </span>
    )
  if (value === 'partial')
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--warning)]/10 text-[var(--warning)]">
        <Minus size={16} />
      </span>
    )
  return <span className="text-sm font-medium text-[var(--text)]">{value}</span>
}

export default function ComparacionPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-24 pb-20">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
              Comparación honesta
            </p>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
              ParaguAI vs Wix vs Agencia local
            </h1>
            <p className="text-lg text-[var(--text-light)]">
              Las tres opciones funcionan. Pero cada una tiene un perfil diferente. Mirá la
              comparación con datos reales del mercado paraguayo y elegí la que mejor te calza.
            </p>
          </div>

          <div className="mx-auto max-w-5xl overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[var(--surface-light)]">
                <tr>
                  <th className="p-4 text-sm font-semibold text-[var(--text)]">Característica</th>
                  <th className="p-4 text-center text-sm font-bold text-[var(--primary)]">ParaguAI</th>
                  <th className="p-4 text-center text-sm font-semibold text-[var(--text)]">Wix / WordPress</th>
                  <th className="p-4 text-center text-sm font-semibold text-[var(--text)]">Agencia local</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="p-4 text-sm font-medium text-[var(--text)]">{row.label}</td>
                    <td className="p-4 text-center">
                      <Marker value={row.paraguai} />
                    </td>
                    <td className="p-4 text-center">
                      <Marker value={row.wix} />
                    </td>
                    <td className="p-4 text-center">
                      <Marker value={row.agencia} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
            <Card
              title="Elegí Wix si..."
              body="Tenés tiempo y ganas de aprender. Te gusta diseñar y experimentar. No necesitás dominio .com.py ni soporte en español rioplatense."
            />
            <Card
              title="Elegí una agencia local si..."
              body="Tenés un presupuesto de Gs 5M+ y un proyecto muy a medida. Necesitás integraciones complejas con sistemas existentes."
            />
            <Card
              title="Elegí ParaguAI si..."
              body="Querés un sitio profesional sin dolor, en 48 horas, pagando en guaraníes, con soporte por WhatsApp y la libertad de irte cuando quieras."
              highlighted
            />
          </div>

          <div className="mx-auto mt-16 max-w-2xl text-center">
            <a
              href={waLink('Hola, vi la comparación y quiero una demo de ParaguAI para mi negocio.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1"
            >
              <MessageCircle size={18} />
              Pedir demo gratis
            </a>
            <div className="mt-6">
              <Link
                href="/precios"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]"
              >
                Ver precios y planes en detalle
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}

function Card({ title, body, highlighted }: { title: string; body: string; highlighted?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlighted
          ? 'border-[var(--primary)] bg-gradient-to-b from-[var(--primary)]/5 to-transparent'
          : 'border-[var(--border)] bg-[var(--surface)]'
      }`}
    >
      <h3 className="mb-3 text-lg font-bold text-[var(--text)]">{title}</h3>
      <p className="text-sm text-[var(--text-light)]">{body}</p>
    </div>
  )
}
