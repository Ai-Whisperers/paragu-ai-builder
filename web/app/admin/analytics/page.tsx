import { Container } from '@/components/ui/container'
import {
  Wand2,
  BarChart3,
  MousePointerClick,
  TrendingUp,
  Eye,
  LayoutDashboard,
  Users,
  Search,
  FileText,
  Database,
} from 'lucide-react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Demo data — replace with real analytics once backend is connected  */
/* ------------------------------------------------------------------ */

const summaryCards = [
  { label: 'Total Visitas', value: '2,847', icon: Eye, delta: '+12%' },
  { label: 'Clics WhatsApp', value: '312', icon: MousePointerClick, delta: '+8%' },
  { label: 'Tasa de Conversion', value: '10.9%', icon: TrendingUp, delta: '+1.2%' },
  { label: 'Paginas Vistas', value: '8,541', icon: BarChart3, delta: '+15%' },
]

const visitsBySite = [
  { name: 'Estilo & Brillo Peluqueria', visits: 620, pct: 100 },
  { name: 'Bella Dona Salon', visits: 510, pct: 82 },
  { name: 'Power Gym Asuncion', visits: 445, pct: 72 },
  { name: 'Zen Spa Paraguay', visits: 390, pct: 63 },
  { name: 'Nails Art Studio', visits: 330, pct: 53 },
  { name: 'Ink Masters Tattoo', visits: 280, pct: 45 },
  { name: 'BarberKing CDE', visits: 272, pct: 44 },
]

const trafficSources = [
  { name: 'Directo', pct: 45 },
  { name: 'Google', pct: 32 },
  { name: 'Redes Sociales', pct: 18 },
  { name: 'Otros', pct: 5 },
]

const last7Days = [
  { day: 'Lun', visits: 380 },
  { day: 'Mar', visits: 420 },
  { day: 'Mie', visits: 350 },
  { day: 'Jue', visits: 490 },
  { day: 'Vie', visits: 520 },
  { day: 'Sab', visits: 610 },
  { day: 'Dom', visits: 440 },
]

const maxDayVisits = Math.max(...last7Days.map((d) => d.visits))

/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
    >
      {/* Admin Nav */}
      <header
        className="border-b"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--surface)',
          boxShadow: 'var(--shadow-nav)',
        }}
      >
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Wand2
                className="h-6 w-6"
                style={{ color: 'var(--primary)' }}
              />
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                  ParaguAI Builder
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Panel de Administracion
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                style={{ color: 'var(--text-light)' }}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                <BarChart3 className="h-4 w-4" />
                Analiticas
              </Link>
              <Link
                href="/admin/seo"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                style={{ color: 'var(--text-light)' }}
              >
                <Search className="h-4 w-4" />
                SEO
              </Link>
              <Link
                href="/admin/leads"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                style={{ color: 'var(--text-light)' }}
              >
                <Database className="h-4 w-4" />
                Leads
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      <Container className="py-8">
        {/* Demo banner */}
        <div
          className="mb-8 rounded-xl border p-4 text-sm"
          style={{
            borderColor: 'var(--warning)',
            backgroundColor: 'color-mix(in srgb, var(--warning) 8%, transparent)',
            color: 'var(--text)',
          }}
        >
          <strong>Datos de demostracion</strong> — conectar analiticas para datos
          reales.
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {card.label}
                  </span>
                  <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                </div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: 'var(--text)' }}
                >
                  {card.value}
                </p>
                <span
                  className="mt-1 inline-block text-xs font-medium"
                  style={{ color: 'var(--success)' }}
                >
                  {card.delta} vs semana anterior
                </span>
              </div>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Visitas por Sitio */}
          <div
            className="rounded-xl border p-6"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
            }}
          >
            <h2
              className="mb-6 text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Visitas por Sitio
            </h2>
            <div className="space-y-4">
              {visitsBySite.map((site) => (
                <div key={site.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span
                      className="truncate font-medium"
                      style={{ color: 'var(--text)' }}
                    >
                      {site.name}
                    </span>
                    <span
                      className="ml-2 shrink-0"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {site.visits}
                    </span>
                  </div>
                  <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${site.pct}%`,
                        backgroundColor: 'var(--primary)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fuentes de Trafico */}
          <div
            className="rounded-xl border p-6"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
            }}
          >
            <h2
              className="mb-6 text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Fuentes de Trafico
            </h2>
            <div className="space-y-5">
              {trafficSources.map((source) => (
                <div key={source.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span
                      className="font-medium"
                      style={{ color: 'var(--text)' }}
                    >
                      {source.name}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: 'var(--primary)' }}
                    >
                      {source.pct}%
                    </span>
                  </div>
                  <div
                    className="h-3 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${source.pct}%`,
                        backgroundColor: 'var(--primary)',
                        opacity: 0.6 + source.pct / 100,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ultimos 7 Dias */}
        <div
          className="mt-8 rounded-xl border p-6"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <h2
            className="mb-6 text-lg font-semibold"
            style={{ color: 'var(--text)' }}
          >
            Ultimos 7 Dias
          </h2>
          <div className="flex items-end justify-between gap-2" style={{ height: 180 }}>
            {last7Days.map((day) => {
              const heightPct = (day.visits / maxDayVisits) * 100
              return (
                <div
                  key={day.day}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {day.visits}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: 'var(--primary)',
                      minHeight: 8,
                    }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: 'var(--text-light)' }}
                  >
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </main>
  )
}
