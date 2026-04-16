import { loadAllBusinesses } from '@/lib/engine/data-loader'
import { BUSINESS_TYPES } from '@/lib/types'
import Link from 'next/link'
import {
  Wand2,
  Building2,
  Layers,
  Globe,
  Plus,
  FileBarChart,
  TrendingUp,
  Search as SearchIcon,
} from 'lucide-react'
import AdminFilters from './components/admin-filters'

const TYPE_LABELS: Record<string, string> = {
  peluqueria: 'Peluqueria',
  salon_belleza: 'Salon de Belleza',
  gimnasio: 'Gimnasio',
  spa: 'Spa',
  unas: 'Unas',
  tatuajes: 'Tatuajes',
  barberia: 'Barberia',
  estetica: 'Estetica',
  maquillaje: 'Maquillaje',
  depilacion: 'Depilacion',
  pestanas: 'Pestanas y Cejas',
}

export default async function AdminDashboard() {
  const businesses = await loadAllBusinesses()

  /* Unique types that actually have businesses */
  const activeTypeCount = new Set(businesses.map((b) => b.type)).size

  return (
    <main className="min-h-screen bg-surface-light">
      {/* ── Navigation Bar ───────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">
              ParaguAI
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <span className="rounded-md bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              Admin
            </span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ── Page Title + CTA ─────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Panel de Administracion
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona todos los negocios y sitios generados.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-button transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Crear Nuevo Negocio
          </Link>
        </div>

        {/* ── Stats Cards ──────────────────────────────────────── */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Negocios
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {businesses.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[var(--accent)]/10 p-2.5">
                <Layers className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tipos Soportados
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {BUSINESS_TYPES.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeTypeCount} con negocios activos
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[var(--success)]/10 p-2.5">
                <Globe className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sitios Generados
                </p>
                <p className="text-3xl font-bold text-success">
                  {businesses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Access Links ───────────────────────────────── */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-card transition-colors hover:bg-muted"
          >
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
            Leads Import
          </Link>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-card transition-colors hover:bg-muted"
          >
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Analytics
          </Link>
          <Link
            href="/admin/seo"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-card transition-colors hover:bg-muted"
          >
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            SEO Reports
          </Link>
        </div>

        {/* ── Filterable Business List (Client Component) ──────── */}
        <AdminFilters
          businesses={businesses.map((biz) => ({
            name: biz.name,
            slug: biz.slug,
            type: biz.type,
            city: biz.city,
            neighborhood: biz.neighborhood,
            services: biz.services,
          }))}
          typeLabels={TYPE_LABELS}
          allTypes={BUSINESS_TYPES}
        />
      </div>
    </main>
  )
}
