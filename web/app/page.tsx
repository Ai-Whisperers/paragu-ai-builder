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
  Users,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { loadAllBusinesses } from '@/lib/engine/data-loader'
import { HomeAnimations } from '@/components/home/home-animations'

/* ── Registry data (static, no DB needed) ─────────────────────────── */

const TEMPLATES = [
  { id: 'peluqueria', name: 'Peluqueria', icon: Scissors, leads: 2393, pct: 81, color: '#b76e79', demoSlug: 'salon-maria' },
  { id: 'salon_belleza', name: 'Salon de Belleza', icon: Sparkles, leads: 1210, pct: 75, color: '#d4a574', demoSlug: 'studio-belleza' },
  { id: 'gimnasio', name: 'Gimnasio / Fitness', icon: Dumbbell, leads: 1087, pct: 72, color: '#2d6a4f', demoSlug: 'gymfit-py' },
  { id: 'spa', name: 'Spa & Wellness', icon: Flower2, leads: 927, pct: 76, color: '#7c9885', demoSlug: 'spa-serenidad' },
  { id: 'barberia', name: 'Barberia', icon: User, leads: 778, pct: 77, color: '#8b6914', demoSlug: 'barberia-clasica' },
  { id: 'unas', name: 'Unas', icon: Hand, leads: 488, pct: 75, color: '#c77dba', demoSlug: 'unas-y-mas' },
  { id: 'tatuajes', name: 'Tatuajes & Piercing', icon: PenTool, leads: 272, pct: 70, color: '#1a1a2e', demoSlug: 'tinta-viva' },
  { id: 'estetica', name: 'Estetica / Facial', icon: Sparkles, leads: 137, pct: 77, color: '#9b7cb8', demoSlug: 'belleza-integral' },
  { id: 'maquillaje', name: 'Maquillaje', icon: Palette, leads: 130, pct: 72, color: '#c44569', demoSlug: 'maquillaje-arte' },
  { id: 'pestanas', name: 'Pestanas y Cejas', icon: Eye, leads: 49, pct: 76, color: '#6c5ce7', demoSlug: 'pestanas-flore' },
  { id: 'depilacion', name: 'Depilacion', icon: Zap, leads: 20, pct: 78, color: '#e17055', demoSlug: 'depilacion-perfecta' },
] as const

const TENANTS = [
  {
    slug: 'nexa-paraguay',
    name: 'Nexa Paraguay',
    tagline: 'Tu mudanza de Europa a Paraguay, sin fricciones',
    vertical: 'Relocacion',
    flag: 'PY',
    locales: ['nl', 'en', 'de', 'es'],
    defaultLocale: 'nl',
    href: '/s/nl/nexa-paraguay',
    domain: 'nexaparaguay.com',
    accent: '#1b5e3a',
  },
  {
    slug: 'nexa-uruguay',
    name: 'Nexa Uruguay',
    tagline: 'Relocation services for Europeans moving to Uruguay',
    vertical: 'Relocacion',
    flag: 'UY',
    locales: ['en', 'es'],
    defaultLocale: 'en',
    href: '/s/en/nexa-uruguay',
    domain: 'nexauruguay.com',
    accent: '#2563eb',
  },
] as const

const TOTAL_LEADS = 7463

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
    desc: 'Plantillas iniciales para belleza y bienestar, con motor IA adaptable a cualquier rubro.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Selecciona tu tipo de negocio',
    desc: 'Elegi entre nuestras plantillas iniciales o pedi una generacion IA adaptada a tu rubro.',
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

  const oneBusinessPerType = Array.from(
    new Map(businesses.map((b) => [b.type, b])).values(),
  )

  return (
    <>
      <HomeAnimations />

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Wand2 size={20} />
              </div>
              <span className="text-lg font-bold text-[var(--text)]">
                Paragu<span className="text-[var(--primary)]">AI</span>
              </span>
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#plantillas" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Plantillas
              </a>
              <a href="#proyectos" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Ejemplos
              </a>
              <a href="#tenants" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Tenants
              </a>
              <a href="#como-funciona" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Como Funciona
              </a>
              <a href="#funcionalidades" className="text-sm font-medium text-[var(--text-light)] transition-colors hover:text-[var(--text)]">
                Funcionalidades
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-all hover:bg-[var(--surface-light)]"
              >
                Panel Admin
              </Link>
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
                Sitios web profesionales para tu{' '}
                <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                  negocio en Paraguay
                </span>
              </h1>

              <p className="hero-animate-delay-2 mx-auto mb-10 max-w-2xl text-lg text-[var(--text-light)] md:text-xl">
                Motor de generacion con IA que crea sitios web profesionales, rapidos y
                optimizados para cualquier tipo de negocio. Empezamos con 11 plantillas
                especializadas para belleza y bienestar, y seguimos expandiendo a mas
                rubros.
              </p>

              <div className="hero-animate-delay-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="#plantillas"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3.5 text-base font-semibold text-[var(--primary-foreground)] shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  Ver Plantillas
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#proyectos"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--border)] px-8 py-3.5 text-base font-semibold text-[var(--text)] transition-all duration-normal hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Ver Ejemplos
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
                Cada una de nuestras 11 plantillas iniciales esta pensada para un rubro
                especifico de belleza y bienestar. Pronto sumaremos mas categorias y el
                motor IA puede generar sitios adaptados a cualquier negocio.
              </p>
            </div>

            <div className="section-fade grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {TEMPLATES.map((t) => {
                const Icon = t.icon
                return (
                  <Link
                    key={t.id}
                    href={`/${t.demoSlug}`}
                    className="group relative block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover"
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
                  </Link>
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
                Ejemplos
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Ejemplos de Sitios
              </h2>
              <p className="text-[var(--text-light)]">
                Estos son ejemplos demo generados con nuestra plataforma. Te muestran
                como luce un sitio real para cada tipo de negocio.
              </p>
            </div>

            <div className="section-fade grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {oneBusinessPerType.map((biz) => {
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                          Demo
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
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
              >
                Ver mas ejemplos en el panel admin <ArrowRight size={14} />
              </Link>
            </div>
          </Container>
        </section>

        {/* ── Tenants en produccion ──────────────────────────────── */}
        <section id="tenants" className="scroll-mt-20 bg-[var(--surface-light)] py-20 md:py-28">
          <Container>
            <div className="section-fade mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
                Tenants en produccion
              </p>
              <h2 className="mb-4 text-3xl font-bold text-[var(--text)] sm:text-4xl">
                Sitios reales desplegados
              </h2>
              <p className="text-[var(--text-light)]">
                Tenants en vivo con nuestro motor multi-idioma y multi-pais.
                Arquitectura basada en verticales: una misma base sirve a cada tenant
                con su dominio, idiomas y contenido propios.
              </p>
            </div>

            <div className="section-fade grid gap-6 md:grid-cols-2">
              {TENANTS.map((t) => (
                <div
                  key={t.slug}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-normal hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div
                    className="relative flex h-40 items-end p-6"
                    style={{
                      background: `linear-gradient(135deg, ${t.accent}dd, ${t.accent}88)`,
                    }}
                  >
                    <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white backdrop-blur-sm">
                      {t.flag}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{t.name}</h3>
                      <p className="mt-1 text-sm text-white/80">{t.tagline}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: `${t.accent}15`, color: t.accent }}
                      >
                        <Globe size={12} />
                        {t.vertical}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        En vivo
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-[var(--text-muted)]">
                      <div className="flex items-center gap-2">
                        <Globe size={14} />
                        <span>{t.domain}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[var(--text-muted)]">Idiomas:</span>
                        {t.locales.map((locale) => (
                          <a
                            key={locale}
                            href={`/s/${locale}/${t.slug}`}
                            className={`rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                              locale === t.defaultLocale
                                ? 'border-[var(--primary)] text-[var(--primary)]'
                                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                            }`}
                          >
                            {locale}
                          </a>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={t.href}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-all group-hover:gap-3"
                    >
                      Visitar sitio ({t.defaultLocale.toUpperCase()}) <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
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
                Nuestro analisis de mercado en el sector belleza y bienestar en Paraguay
                revela una oportunidad masiva: la mayoria aun no tiene presencia web.
                El patron se repite en otros rubros.
              </p>
            </div>

            <div className="section-fade grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BarChart3, value: '+7,400', label: 'Negocios Identificados', sub: 'En todo Paraguay' },
                { icon: TrendingUp, value: '75%', label: 'Sin Sitio Web', sub: '+5,600 negocios' },
                { icon: Star, value: '+3,900', label: 'Leads Prioritarios', sub: 'Priority A (con telefono, sin web)' },
                { icon: MapPin, value: '209', label: 'Ciudades Cubiertas', sub: 'Con oportunidades identificadas' },
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

            <p className="section-fade mt-8 text-center text-xs text-[var(--text-muted)]">
              Datos de nuestro analisis de mercado (abril 2026, Google Maps Places API,
              sector belleza y bienestar).
            </p>
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
                Unite a los negocios paraguayos que estan listos para crecer con una
                presencia web profesional, rapida y pensada para convertir.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[var(--primary)] shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  Comenzar Ahora
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#plantillas"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all duration-normal hover:border-white/60"
                >
                  Explorar Plantillas
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
                Motor de generacion de sitios web con inteligencia artificial para
                negocios en Paraguay. Empezamos con belleza y bienestar, expandiendonos
                a todos los rubros.
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
                  <a href="#proyectos" className="transition-colors hover:text-[var(--primary)]">
                    Ejemplos
                  </a>
                </li>
                <li>
                  <a href="#tenants" className="transition-colors hover:text-[var(--primary)]">
                    Tenants
                  </a>
                </li>
                <li>
                  <a href="#funcionalidades" className="transition-colors hover:text-[var(--primary)]">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <Link href="/admin" className="transition-colors hover:text-[var(--primary)]">
                    Panel Admin
                  </Link>
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
                    +7 categorias mas
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
