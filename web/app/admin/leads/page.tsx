import { Container } from '@/components/ui/container'
import {
  Wand2,
  BarChart3,
  LayoutDashboard,
  Search,
  Database,
  Users,
  Star,
  MapPin,
  Upload,
  Eye,
  FileSpreadsheet,
  ArrowUpRight,
  Phone,
  Building2,
} from 'lucide-react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Demo data — replace with real leads once backend is connected      */
/* ------------------------------------------------------------------ */

const summaryCards = [
  { label: 'Total Leads', value: '7,491', icon: Users, color: 'var(--primary)' },
  { label: 'Prioridad A', value: '5,215', icon: Star, color: 'var(--warning)' },
  { label: 'Sin Web', value: '75%', icon: Building2, color: 'var(--error)' },
  { label: 'Ciudades', value: '209', icon: MapPin, color: 'var(--success)' },
]

const sampleLeads = [
  {
    name: 'Salon Bellisima',
    type: 'Peluqueria',
    city: 'Asuncion',
    phone: '+595 21 555 0101',
    rating: 4.5,
    status: 'Sin web',
  },
  {
    name: 'Power Fitness CDE',
    type: 'Gimnasio',
    city: 'Ciudad del Este',
    phone: '+595 61 555 0202',
    rating: 4.2,
    status: 'Sin web',
  },
  {
    name: 'Nails Paradise',
    type: 'Unas',
    city: 'Luque',
    phone: '+595 21 555 0303',
    rating: 4.8,
    status: 'Sin web',
  },
  {
    name: 'Zen Relax Spa',
    type: 'Spa',
    city: 'San Lorenzo',
    phone: '+595 21 555 0404',
    rating: 4.6,
    status: 'Web basica',
  },
  {
    name: 'Barberos del Este',
    type: 'Barberia',
    city: 'Encarnacion',
    phone: '+595 71 555 0505',
    rating: 4.3,
    status: 'Sin web',
  },
  {
    name: 'Ink Studio PY',
    type: 'Tatuajes',
    city: 'Asuncion',
    phone: '+595 21 555 0606',
    rating: 4.9,
    status: 'Sin web',
  },
  {
    name: 'Estetica Avanzada',
    type: 'Estetica',
    city: 'Fernando de la Mora',
    phone: '+595 21 555 0707',
    rating: 4.1,
    status: 'Web basica',
  },
  {
    name: 'Glamour MakeUp',
    type: 'Maquillaje',
    city: 'Lambare',
    phone: '+595 21 555 0808',
    rating: 4.7,
    status: 'Sin web',
  },
]

const statusStyle = (status: string) => {
  if (status === 'Sin web') {
    return {
      backgroundColor: 'color-mix(in srgb, var(--error) 12%, transparent)',
      color: 'var(--error)',
    }
  }
  return {
    backgroundColor: 'color-mix(in srgb, var(--warning) 12%, transparent)',
    color: 'var(--warning)',
  }
}

/* ------------------------------------------------------------------ */

export default function LeadsPage() {
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
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                style={{ color: 'var(--text-light)' }}
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
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
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
          <strong>Datos de demostracion</strong> — conectar base de datos de
          leads para datos reales.
        </div>

        {/* Summary Stats */}
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
                  <Icon className="h-5 w-5" style={{ color: card.color }} />
                </div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: 'var(--text)' }}
                >
                  {card.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Import Section */}
        <div
          className="mb-8 rounded-xl border p-6"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Importar Leads
            </h2>
          </div>
          <p
            className="mb-4 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Importa tu base de datos de negocios desde un archivo CSV. El
            archivo debe incluir las columnas: <strong>nombre</strong>,{' '}
            <strong>tipo</strong>, <strong>ciudad</strong>,{' '}
            <strong>telefono</strong>, <strong>rating</strong> y{' '}
            <strong>tiene_web</strong>.
          </p>

          <div
            className="mb-6 rounded-xl border-2 border-dashed p-8 text-center"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
            }}
          >
            <FileSpreadsheet
              className="mx-auto mb-3 h-10 w-10"
              style={{ color: 'var(--text-muted)' }}
            />
            <p
              className="mb-1 text-sm font-medium"
              style={{ color: 'var(--text)' }}
            >
              Arrastra tu archivo CSV aqui
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              o haz clic para seleccionar un archivo
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                boxShadow: 'var(--shadow-button)',
              }}
            >
              <Upload className="h-4 w-4" />
              Importar CSV
            </Link>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--muted)]"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            >
              <Eye className="h-4 w-4" />
              Generar Vista Previa
            </Link>
          </div>
        </div>

        {/* Leads Table */}
        <div
          className="rounded-xl border p-6"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Leads Recientes
            </h2>
            <span
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Mostrando 8 de 7,491
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <th
                    className="pb-3 pr-4 font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Nombre
                  </th>
                  <th
                    className="pb-3 pr-4 font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Tipo
                  </th>
                  <th
                    className="pb-3 pr-4 font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Ciudad
                  </th>
                  <th
                    className="pb-3 pr-4 font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Telefono
                  </th>
                  <th
                    className="pb-3 pr-4 font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Rating
                  </th>
                  <th
                    className="pb-3 font-semibold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {sampleLeads.map((lead) => (
                  <tr
                    key={lead.name}
                    className="border-b transition-colors hover:bg-[var(--muted)]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Building2
                          className="h-4 w-4 shrink-0"
                          style={{ color: 'var(--primary)' }}
                        />
                        <span
                          className="font-medium"
                          style={{ color: 'var(--text)' }}
                        >
                          {lead.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-3 pr-4"
                      style={{ color: 'var(--text-light)' }}
                    >
                      {lead.type}
                    </td>
                    <td className="py-3 pr-4">
                      <div
                        className="flex items-center gap-1"
                        style={{ color: 'var(--text-light)' }}
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {lead.city}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div
                        className="flex items-center gap-1"
                        style={{ color: 'var(--text-light)' }}
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <Star
                          className="h-3.5 w-3.5"
                          style={{ color: 'var(--warning)', fill: 'var(--warning)' }}
                        />
                        <span style={{ color: 'var(--text)' }}>
                          {lead.rating}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={statusStyle(lead.status)}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination hint */}
          <div
            className="mt-4 flex items-center justify-between text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>Pagina 1 de 937</span>
            <div className="flex gap-2">
              <span
                className="cursor-not-allowed rounded-lg border px-3 py-1.5 opacity-50"
                style={{ borderColor: 'var(--border)' }}
              >
                Anterior
              </span>
              <span
                className="cursor-pointer rounded-lg border px-3 py-1.5 transition-colors hover:bg-[var(--muted)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Siguiente
              </span>
            </div>
          </div>
        </div>

        {/* Bottom action hint */}
        <div
          className="mt-8 flex items-center gap-3 rounded-xl border p-4 text-sm"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-muted)',
          }}
        >
          <ArrowUpRight className="h-5 w-5 shrink-0" style={{ color: 'var(--primary)' }} />
          <p>
            <strong style={{ color: 'var(--text)' }}>Proximo paso:</strong>{' '}
            Importa tu CSV de leads y usa &ldquo;Generar Vista Previa&rdquo;
            para crear sitios de muestra automaticamente para los negocios con
            mayor potencial.
          </p>
        </div>
      </Container>
    </main>
  )
}
