import {
  Scissors,
  Dumbbell,
  Flower2,
  Hand,
  PenTool,
  User,
  Sparkles,
  Palette,
  Zap,
  Eye,
  Star,
  Globe,
  Smartphone,
  Search,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Layers,
  Wand2,
  ExternalLink,
  MapPin,
  Clock,
  Users,
  TrendingUp,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { loadAllBusinesses } from '@/lib/engine/data-loader'
import { HomeAnimations } from '@/components/home/home-animations'

/* ── Registry data (static, no DB needed) ─────────────────────────── */

const TEMPLATES = [
  { id: 'peluqueria', name: 'Peluqueria', icon: Scissors, leads: 2393, pct: 81, color: '#b76e79' },
  { id: 'salon_belleza', name: 'Salon de Belleza', icon: Sparkles, leads: 1210, pct: 75, color: '#d4a574' },
  { id: 'gimnasio', name: 'Gimnasio / Fitness', icon: Dumbbell, leads: 1087, pct: 72, color: '#2d6a4f' },
  { id: 'spa', name: 'Spa & Wellness', icon: Flower2, leads: 927, pct: 76, color: '#7c9885' },
  { id: 'barberia', name: 'Barberia', icon: User, leads: 778, pct: 77, color: '#8b6914' },
  { id: 'unas', name: 'Unas', icon: Hand, leads: 488, pct: 75, color: '#c77dba' },
  { id: 'tatuajes', name: 'Tatuajes & Piercing', icon: PenTool, leads: 272, pct: 70, color: '#1a1a2e' },
  { id: 'estetica', name: 'Estetica / Facial', icon: Sparkles, leads: 137, pct: 77, color: '#9b7cb8' },
  { id: 'maquillaje', name: 'Maquillaje', icon: Palette, leads: 130, pct: 72, color: '#c44569' },
  { id: 'pestanas', name: 'Pestanas y Cejas', icon: Eye, leads: 49, pct: 76, color: '#6c5ce7' },
  { id: 'depilacion', name: 'Depilacion', icon: Zap, leads: 20, pct: 78, color: '#e17055' },
] as const

const TOTAL_LEADS = 7491
const TOTAL_PRIORITY_A = 5215

const FEATURES = [
  {
    icon: Wand2,
    title: 'Generacion con IA',
    desc: 'Contenido, diseno y SEO generados automaticamente para cada tipo de negocio.',
  },
  {
    icon: Smartphone,
    title: '100% Responsive',
    desc: 'Sitios optimizados para movil, tablet y desktop desde el primer momento.',
  },
  {
    icon: Search,
    title: 'SEO Integrado',
    desc: 'Meta tags, Schema.org y contenido optimizado para posicionar en Google.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Directo',
    desc: 'Boton flotante de WhatsApp para que tus clientes te contacten al instante.',
  },
  {
    icon: Globe,
    title: 'Dominio Propio',
    desc: 'Cada negocio con su propia URL profesional y certificado SSL.',
  },
  {
    icon: Layers,
    title: '11 Plantillas',
    desc: 'Disenos especializados para cada tipo de negocio de belleza y bienestar.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Selecciona tu tipo de negocio',
    desc: 'Elegí entre 11 categorias de belleza y bienestar con plantillas especializadas.',
  },
  {
    num: '02',
    title: 'Completa tus datos',
    desc: 'Nombre, servicios, precios, horarios, equipo — todo lo que tu negocio necesita.',
  },
  {
    num: '03',
    title: 'Tu sitio esta listo',
    desc: 'En minutos tenes un sitio web profesional, optimizado y listo para recibir clientes.',
  },
]

/* ── Page ──────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const businesses = await loadAllBusinesses()

  return (
    <>
      <HomeAnimations />

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Wand2 size={20} />
              </div>
              <span className="text-lg font-bold text-[var(--text)]">
                Paragu<span className="text-[var(--primary)]">AI</span>
              </span>
            </a>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#plantillas" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Plantillas
              </a>
              <a href="#proyectos" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Proyectos
              </a>
              <a href="/pricing" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Precios
              </a>
              <a href="#funcionalidades" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Funcionalidades
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-light)] transition-all hover:text-[var(--text)]"
              >
                Iniciar Sesion
              </a>
              <a
                href="/onboarding"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] shadow-button transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                Crear Mi Sitio
              </a>
            </div>
          </div>
        </Container>
      </nav>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5" />
            <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--primary)]/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/2 -translate-x-1/4 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <div className="hero-animate mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm text-[var(--text-light)]">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)]" />
                {TOTAL_LEADS.toLocaleString()} negocios identificados en Paraguay
              </div>

              <h1 className="hero-animate-delay-1 mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--text)] sm:text-5xl md:text-6xl lg:text-7xl">
                Sitios web para{' '}
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                  belleza y bienestar
                </span>{' '}
                en Paraguay
              </h1>

              <p className="hero-animate-delay-2 mx-auto mb-10 max-w-2xl text-lg text-[var(--text-light)] md:text-xl">
                Motor de generacion con IA que crea sitios web profesionales para peluquerias,
                spas, gimnasios y mas. Diseñados para el mercado paraguayo, optimizados para
                convertir visitantes en clientes.
              </p>

              <div className="hero-animate-delay-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/onboarding"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-[var(--primary-foreground)] shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  Crear Mi Sitio Gratis
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#plantillas"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border)] px-8 py-3.5 text-base font-semibold text-[var(--text)] transition-all duration-normal hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Ver Plantillas
                  <ChevronRight size={18} />
                </a>
              </div>
            </div>

            {/* Stats bar */}
            <div className="hero-animate-delay-2 mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { value: '11', label: 'Plantillas' },
                { value: '7.4K+', label: 'Negocios' },
                { value: '75%', label: 'Sin Web' },
                { value: '209', label: 'Ciudades' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-[var(--primary)]">{stat.value}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Templates Showcase ──────────────────────────────────── */}
        <section id="plantillas" className="scroll-mt-20 bg-[var(--surface-light)] py-20 md:py-28">
          <Container>
            <div className="section-fade mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                Plantillas
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                11 Diseños Especializados
              </h2>
              <p className="text-[var(--text-light)]">
                Cada categoria de negocio tiene su propia plantilla con secciones, contenido
                y diseño pensados especificamente para ese rubro.
              </p>
            </div>

            <div className="section-fade grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {TEMPLATES.map((t) => {
                const Icon = t.icon
                return (
                  <div
                    key={t.id}
                    className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-normal group-hover:scale-110"
                      style={{ backgroundColor: `${t.color}15`, color: t.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-[var(--text)]">
                      {t.name}
                    </h3>
                    <p className="mb-4 text-sm text-[var(--text-muted)]">
                      {t.leads.toLocaleString()} negocios &middot; {t.pct}% sin web
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] opacity-0 transition-opacity duration-normal group-hover:opacity-100">
                      Ver plantilla <ArrowRight size={14} />
                    </div>
                    {/* Progress bar showing market opportunity */}
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--border)]">
                      <div
                        className="h-full rounded-full transition-all duration-slow"
                        style={{ width: `${t.pct}%`, backgroundColor: t.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ── Live Projects ──────────────────────────────────────── */}
        <section id="proyectos" className="scroll-mt-20 py-20 md:py-28">
          <Container>
            <div className="section-fade mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                Proyectos
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Sitios Generados
              </h2>
              <p className="text-[var(--text-light)]">
                Explora sitios web reales generados por nuestra plataforma para diferentes
                tipos de negocios.
              </p>
            </div>

            <div className="section-fade grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {businesses.map((biz) => {
                const template = TEMPLATES.find((t) => t.id === biz.type)
                const Icon = template?.icon || Star
                const color = template?.color || '#2563eb'

                return (
                  <a
                    key={biz.slug}
                    href={`/${biz.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    {/* Colored header bar */}
                    <div
                      className="relative flex h-40 items-end p-6"
                      style={{
                        background: `linear-gradient(135deg, ${color}dd, ${color}88)`,
                      }}
                    >
                      <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{biz.name}</h3>
                        {biz.tagline && (
                          <p className="mt-1 text-sm text-white/80">{biz.tagline}</p>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                          style={{ backgroundColor: `${color}15`, color }}
                        >
                          <Icon size={12} />
                          {template?.name || biz.type}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Activo
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-[var(--text-muted)]">
                        {biz.city && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{biz.city}{biz.neighborhood ? `, ${biz.neighborhood}` : ''}</span>
                          </div>
                        )}
                        {biz.services && (
                          <div className="flex items-center gap-2">
                            <Layers size={14} />
                            <span>{biz.services.length} servicios</span>
                          </div>
                        )}
                        {biz.team && (
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>{biz.team.length} profesionales</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-all group-hover:gap-3">
                        Ver sitio completo <ExternalLink size={14} />
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>

            <div className="section-fade mt-10 text-center">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
              >
                Ver todos en el panel admin <ArrowRight size={14} />
              </a>
            </div>
          </Container>
        </section>

        {/* ── How It Works ───────────────────────────────────────── */}
        <section id="como-funciona" className="scroll-mt-20 bg-[var(--surface-light)] py-20 md:py-28">
          <Container size="md">
            <div className="section-fade mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                Como Funciona
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Tu sitio web en 3 pasos
              </h2>
            </div>

            <div className="section-fade grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.num} className="relative text-center">
                  <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-2xl font-bold text-[var(--primary)]">
                    {step.num}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Features ───────────────────────────────────────────── */}
        <section id="funcionalidades" className="scroll-mt-20 py-20 md:py-28">
          <Container>
            <div className="section-fade mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                Funcionalidades
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Todo lo que tu negocio necesita
              </h2>
              <p className="text-[var(--text-light)]">
                Cada sitio incluye funcionalidades profesionales pensadas para maximizar
                la visibilidad y conversion de tu negocio.
              </p>
            </div>

            <div className="section-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => {
                const Icon = f.icon
                return (
                  <div
                    key={f.title}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon size={22} />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-[var(--text)]">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                      {f.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ── Market Opportunity ──────────────────────────────────── */}
        <section className="bg-[var(--surface-light)] py-20 md:py-28">
          <Container size="md">
            <div className="section-fade mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                Oportunidad de Mercado
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Paraguay necesita presencia digital
              </h2>
              <p className="mb-12 text-[var(--text-light)]">
                Nuestro analisis de mercado revela una oportunidad masiva: la mayoria de
                negocios de belleza y bienestar aun no tienen presencia web.
              </p>
            </div>

            <div className="section-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BarChart3, value: '7,491', label: 'Negocios Identificados', sub: 'En todo Paraguay' },
                { icon: TrendingUp, value: '75%', label: 'Sin Sitio Web', sub: 'Oportunidad directa' },
                { icon: Star, value: '5,215', label: 'Leads Prioritarios', sub: 'Listos para contactar' },
                { icon: MapPin, value: '209', label: 'Ciudades Cubiertas', sub: 'Cobertura nacional' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon size={22} />
                    </div>
                    <p className="text-3xl font-bold text-[var(--text)]">{stat.value}</p>
                    <p className="mt-1 text-sm font-medium text-[var(--text)]">{stat.label}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">{stat.sub}</p>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]" />
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />
            <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-white blur-3xl" />
          </div>

          <Container size="md">
            <div className="section-fade mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-[var(--primary-foreground)] sm:text-4xl">
                Lleva tu negocio al mundo digital
              </h2>
              <p className="mb-8 text-lg text-[var(--primary-foreground)]/80">
                Unite a los miles de negocios de belleza y bienestar en Paraguay que
                estan listos para crecer con presencia web profesional.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/onboarding"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[var(--primary)] shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  Comenzar Ahora
                  <ArrowRight size={18} />
                </a>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all duration-normal hover:border-white/60"
                >
                  Ver Precios
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
                  <Wand2 size={16} />
                </div>
                <span className="text-lg font-bold text-[var(--text)]">
                  Paragu<span className="text-[var(--primary)]">AI</span> Builder
                </span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
                Motor de generacion de sitios web con inteligencia artificial para negocios
                de belleza y bienestar en Paraguay.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-[var(--text)]">Plataforma</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>
                  <a href="#plantillas" className="transition-colors hover:text-[var(--primary)]">
                    Plantillas
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="transition-colors hover:text-[var(--primary)]">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="/onboarding" className="transition-colors hover:text-[var(--primary)]">
                    Crear Mi Sitio
                  </a>
                </li>
                <li>
                  <a href="/login" className="transition-colors hover:text-[var(--primary)]">
                    Iniciar Sesion
                  </a>
                </li>
                <li>
                  <a href="/admin" className="transition-colors hover:text-[var(--primary)]">
                    Panel Admin
                  </a>
                </li>
              </ul>
            </div>

            {/* Business Types */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-[var(--text)]">Categorias</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>Peluquerias</li>
                <li>Gimnasios & Fitness</li>
                <li>Spas & Wellness</li>
                <li>Barberias</li>
                <li>
                  <a href="#plantillas" className="text-[var(--primary)]">
                    +6 categorias mas
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} ParaguAI Builder. Todos los derechos reservados.
          </div>
        </Container>
      </footer>
    </>
  )
}
