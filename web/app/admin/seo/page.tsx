import { Container } from '@/components/ui/container'
import {
  Wand2,
  BarChart3,
  LayoutDashboard,
  Search,
  Database,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  Smartphone,
  Image,
  FileCode,
  Zap,
  Lightbulb,
  Tag,
} from 'lucide-react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Demo data — replace with real SEO audits once backend is connected */
/* ------------------------------------------------------------------ */

const seoScore = 87

const businessChecks = [
  {
    name: 'Estilo & Brillo Peluqueria',
    score: 92,
    checks: [
      { label: 'Meta Title', status: 'pass' as const },
      { label: 'Meta Description', status: 'pass' as const },
      { label: 'Schema.org', status: 'pass' as const },
      { label: 'Mobile Friendly', status: 'pass' as const },
      { label: 'SSL', status: 'pass' as const },
      { label: 'Page Speed', status: 'warn' as const },
      { label: 'Images Alt Text', status: 'pass' as const },
    ],
  },
  {
    name: 'Bella Dona Salon',
    score: 88,
    checks: [
      { label: 'Meta Title', status: 'pass' as const },
      { label: 'Meta Description', status: 'pass' as const },
      { label: 'Schema.org', status: 'pass' as const },
      { label: 'Mobile Friendly', status: 'pass' as const },
      { label: 'SSL', status: 'pass' as const },
      { label: 'Page Speed', status: 'pass' as const },
      { label: 'Images Alt Text', status: 'warn' as const },
    ],
  },
  {
    name: 'Power Gym Asuncion',
    score: 84,
    checks: [
      { label: 'Meta Title', status: 'pass' as const },
      { label: 'Meta Description', status: 'warn' as const },
      { label: 'Schema.org', status: 'pass' as const },
      { label: 'Mobile Friendly', status: 'pass' as const },
      { label: 'SSL', status: 'pass' as const },
      { label: 'Page Speed', status: 'warn' as const },
      { label: 'Images Alt Text', status: 'pass' as const },
    ],
  },
  {
    name: 'Zen Spa Paraguay',
    score: 90,
    checks: [
      { label: 'Meta Title', status: 'pass' as const },
      { label: 'Meta Description', status: 'pass' as const },
      { label: 'Schema.org', status: 'pass' as const },
      { label: 'Mobile Friendly', status: 'pass' as const },
      { label: 'SSL', status: 'pass' as const },
      { label: 'Page Speed', status: 'pass' as const },
      { label: 'Images Alt Text', status: 'warn' as const },
    ],
  },
]

const keywords = [
  {
    type: 'Peluqueria',
    words: [
      'peluqueria en asuncion',
      'corte de cabello paraguay',
      'salon de belleza cerca',
      'tintura de pelo asuncion',
      'alisado brasileno',
    ],
  },
  {
    type: 'Gimnasio',
    words: [
      'gimnasio asuncion',
      'fitness paraguay',
      'entrenamiento personal',
      'crossfit asuncion',
      'gym cerca de mi',
    ],
  },
  {
    type: 'Spa',
    words: [
      'spa en asuncion',
      'masajes relajantes paraguay',
      'tratamiento facial',
      'spa de dia asuncion',
      'aromaterapia',
    ],
  },
]

const recommendations = [
  {
    icon: Zap,
    title: 'Optimizar velocidad de carga',
    description:
      'Comprimir imagenes y habilitar lazy loading para mejorar el tiempo de carga en un 30-40%.',
    priority: 'Alta',
  },
  {
    icon: FileCode,
    title: 'Agregar datos estructurados LocalBusiness',
    description:
      'Incluir Schema.org LocalBusiness en cada sitio para mejorar la visibilidad en busquedas locales.',
    priority: 'Alta',
  },
  {
    icon: Image,
    title: 'Completar texto alternativo en imagenes',
    description:
      'Algunos sitios tienen imagenes sin atributo alt. Agregar descripciones para accesibilidad y SEO.',
    priority: 'Media',
  },
  {
    icon: Smartphone,
    title: 'Verificar experiencia movil',
    description:
      'Realizar pruebas de usabilidad movil con PageSpeed Insights para cada sitio generado.',
    priority: 'Media',
  },
  {
    icon: Shield,
    title: 'Implementar sitemap.xml dinamico',
    description:
      'Generar sitemaps automaticamente para cada negocio y enviarlo a Google Search Console.',
    priority: 'Baja',
  },
]

const statusIcon = (status: 'pass' | 'fail' | 'warn') => {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--success)' }} />
    case 'fail':
      return <AlertCircle className="h-4 w-4" style={{ color: 'var(--error)' }} />
    case 'warn':
      return <HelpCircle className="h-4 w-4" style={{ color: 'var(--warning)' }} />
  }
}

const priorityStyle = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return { backgroundColor: 'color-mix(in srgb, var(--error) 12%, transparent)', color: 'var(--error)' }
    case 'Media':
      return { backgroundColor: 'color-mix(in srgb, var(--warning) 12%, transparent)', color: 'var(--warning)' }
    default:
      return { backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' }
  }
}

/* ------------------------------------------------------------------ */

export default function SeoPage() {
  // Calculate the circumference and stroke-dashoffset for the circular progress
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (seoScore / 100) * circumference

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
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
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
          <strong>Datos de demostracion</strong> — conectar auditorias SEO para
          datos reales.
        </div>

        {/* SEO Health Score */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div
            className="flex flex-col items-center justify-center rounded-xl border p-8"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--surface)',
            }}
          >
            <h2
              className="mb-4 text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              SEO Health Score
            </h2>
            {/* Circular progress indicator — CSS only */}
            <div className="relative flex items-center justify-center">
              <svg width="140" height="140" className="-rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span
                  className="text-4xl font-bold"
                  style={{ color: 'var(--success)' }}
                >
                  {seoScore}
                </span>
                <span
                  className="text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  / 100
                </span>
              </div>
            </div>
            <p
              className="mt-4 text-center text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Promedio de todos los sitios generados
            </p>
          </div>

          {/* Quick stats */}
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Sitios Auditados', value: '4', icon: Search },
              { label: 'Checks Pasados', value: '24/28', icon: CheckCircle2 },
              { label: 'Advertencias', value: '4', icon: AlertCircle },
              { label: 'Errores Criticos', value: '0', icon: Shield },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border p-6"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--surface)',
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {stat.label}
                    </span>
                    <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: 'var(--text)' }}
                  >
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Per-business SEO Checklist */}
        <div
          className="mb-8 rounded-xl border p-6"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <h2
            className="mb-6 text-lg font-semibold"
            style={{ color: 'var(--text)' }}
          >
            Checklist SEO por Negocio
          </h2>
          <div className="space-y-6">
            {businessChecks.map((biz) => (
              <div key={biz.name}>
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="font-medium"
                    style={{ color: 'var(--text)' }}
                  >
                    {biz.name}
                  </span>
                  <span
                    className="rounded-full px-3 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--success) 12%, transparent)',
                      color: 'var(--success)',
                    }}
                  >
                    {biz.score}/100
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {biz.checks.map((check) => (
                    <div
                      key={`${biz.name}-${check.label}`}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--muted)',
                        color: 'var(--text)',
                      }}
                    >
                      {statusIcon(check.status)}
                      {check.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Palabras Clave */}
        <div
          className="mb-8 rounded-xl border p-6"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <div className="mb-6 flex items-center gap-2">
            <Tag className="h-5 w-5" style={{ color: 'var(--primary)' }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Palabras Clave
            </h2>
          </div>
          <p
            className="mb-6 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Sugerencias de palabras clave por tipo de negocio para mejorar el
            posicionamiento organico.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {keywords.map((group) => (
              <div key={group.type}>
                <h3
                  className="mb-3 text-sm font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--primary)' }}
                >
                  {group.type}
                </h3>
                <ul className="space-y-2">
                  {group.words.map((word) => (
                    <li
                      key={word}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: 'var(--text-light)' }}
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: 'var(--primary)' }}
                      />
                      {word}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendaciones */}
        <div
          className="rounded-xl border p-6"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--surface)',
          }}
        >
          <div className="mb-6 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" style={{ color: 'var(--warning)' }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Recomendaciones
            </h2>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const Icon = rec.icon
              return (
                <div
                  key={rec.title}
                  className="flex gap-4 rounded-xl border p-4"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3
                        className="font-medium"
                        style={{ color: 'var(--text)' }}
                      >
                        {rec.title}
                      </h3>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={priorityStyle(rec.priority)}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {rec.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </main>
  )
}
