'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Scissors, Dumbbell, Flower2, Hand, PenTool, User, Sparkles,
  Palette, Zap, Eye, Star, Globe, Smartphone, Search, MessageCircle,
  ArrowRight, ChevronRight, BarChart3, Layers, Wand2, ExternalLink,
  MapPin, Users, TrendingUp, ShoppingCart, Check, X, HelpCircle, Mail,
  Quote, Menu, X as XIcon, ChevronDown, ArrowUp, PlayCircle
} from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { useInView, useScrollProgress, useActiveSection, useCountUp } from '@/lib/hooks'

/* ── Data Constants ─────────────────────────────────────────────── */

const TEMPLATES = [
  { id: 'peluqueria', name: 'Peluqueria', icon: Scissors, leads: 2393, pct: 81, color: '#b76e79', demoSlug: 'salon-maria' },
  { id: 'salon_belleza', name: 'Salon de Belleza', icon: Sparkles, leads: 1210, pct: 75, color: '#d4a574', demoSlug: 'studio-belleza' },
  { id: 'gimnasio', name: 'Gimnasio / Fitness', icon: Dumbbell, leads: 1087, pct: 72, color: '#2d6a4f', demoSlug: 'gymfit-py' },
  { id: 'spa', name: 'Spa & Wellness', icon: Flower2, leads: 927, pct: 76, color: '#7c9885', demoSlug: 'spa-serenidad' },
  { id: 'barberia', name: 'Barberia', icon: User, leads: 778, pct: 77, color: '#8b6914', demoSlug: 'barberia-clasica' },
  { id: 'unas', name: 'Unas', icon: Hand, leads: 488, pct: 75, color: '#c77dba', demoSlug: 'unas-y-mas' },
  { id: 'tatuajes', name: 'Tatuajes & Piercing', icon: PenTool, leads: 272, pct: 70, color: '#1a1a2e', demoSlug: 'tinta-viva' },
  { id: 'estetica', name: 'Estetica / Facial', icon: Sparkles, leads: 137, pct: 77, color: '#9b7cb8', demoSlug: 'belleza-integral' },
  { id: 'diseno_grafico', name: 'Diseño Gráfico', icon: Palette, leads: 100, pct: 80, color: '#c44569', demoSlug: 'dayah-litworks' },
  { id: 'pestanas', name: 'Pestanas y Cejas', icon: Eye, leads: 49, pct: 76, color: '#6c5ce7', demoSlug: 'pestanas-flore' },
  { id: 'depilacion', name: 'Depilacion', icon: Zap, leads: 20, pct: 78, color: '#e17055', demoSlug: 'depilacion-perfecta' },
  { id: 'relocation', name: 'Reubicacion', icon: Globe, leads: 0, pct: 0, color: '#1e3a5f', demoSlug: 'nexaparaguay' },
  { id: 'meal_prep', name: 'Meal Prep & Compras', icon: ShoppingCart, leads: 0, pct: 0, color: '#3a6b4a', demoSlug: 'de-abasto-a-casa' },
  { id: 'maquillaje', name: 'Maquillaje', icon: Palette, leads: 130, pct: 72, color: '#e84393', demoSlug: null },
  { id: 'inmobiliaria', name: 'Inmobiliaria', icon: MapPin, leads: 0, pct: 0, color: '#2d6a4f', demoSlug: null },
  { id: 'legal', name: 'Servicios Legales', icon: Layers, leads: 0, pct: 0, color: '#1a1a1a', demoSlug: null },
  { id: 'consultoria', name: 'Consultoria', icon: BarChart3, leads: 0, pct: 0, color: '#4a90a4', demoSlug: null },
  { id: 'educacion', name: 'Educacion', icon: Users, leads: 0, pct: 0, color: '#7c3aed', demoSlug: null },
  { id: 'salud', name: 'Salud', icon: TrendingUp, leads: 0, pct: 0, color: '#059669', demoSlug: null },
  { id: 'inversiones', name: 'Inversiones', icon: TrendingUp, leads: 0, pct: 0, color: '#d97706', demoSlug: null },
] as const

const TOTAL_LEADS = 7463

const FEATURES = [
  { icon: Wand2, title: 'Generación con IA', desc: 'Contenido, diseño y SEO generados automáticamente para cada tipo de negocio.' },
  { icon: Smartphone, title: '100% Responsive', desc: 'Sitios optimizados para móvil, tablet y desktop desde el primer momento.' },
  { icon: Search, title: 'SEO Integrado', desc: 'Meta tags, Schema.org y contenido optimizado para posicionar en Google.' },
  { icon: MessageCircle, title: 'WhatsApp Directo', desc: 'Botón flotante de WhatsApp para que tus clientes te contacten al instante.' },
  { icon: Globe, title: 'Dominio Propio', desc: 'Cada negocio con su propia URL profesional y certificado SSL.' },
  { icon: Layers, title: '20 Plantillas', desc: 'Diseños especializados para múltiples tipos de negocio con más en camino.' },
]

const STEPS = [
  { num: '01', title: 'Selecciona tu tipo de negocio', desc: 'Elegí entre nuestras plantillas o pedí una generación IA adaptada a tu rubro.' },
  { num: '02', title: 'Completa tus datos', desc: 'Nombre, servicios, precios, horarios, equipo — todo lo que tu negocio necesita.' },
  { num: '03', title: 'Tu sitio está listo', desc: 'En minutos tenés un sitio web profesional, optimizado y listo para recibir clientes.' },
]

const TESTIMONIALS = [
  { name: 'María González', business: 'Peluquería María', location: 'Asunción', quote: 'En 15 minutos tenía mi sitio web listo. Mis clientes me encuentran en Google ahora.', rating: 5 },
  { name: 'Carlos Ramírez', business: 'Gimnasio FitLife', location: 'Luque', quote: 'El dominio propio me dio mucha credibilidad. Mis inscriptos aumentaron un 40%.', rating: 5 },
  { name: 'Ana López', business: 'Spa Serenidad', location: 'San Lorenzo', quote: 'Nunca pensé que tener una web sería tan fácil. El diseño quedó hermoso.', rating: 5 },
  { name: 'Roberto Martínez', business: 'Barbería El Rey', location: 'Asunción', quote: 'Mis clientes reservan por WhatsApp desde el sitio. Me ahorró mucho tiempo.', rating: 5 },
]

const PLANS = [
  {
    name: 'Básico',
    price: 'Gratis',
    period: '',
    description: 'Perfecto para probar y comenzar',
    features: [
      { text: 'Subdomain (negocio.paragu-ai.com)', included: true },
      { text: '1 página básica', included: true },
      { text: 'Botón de WhatsApp', included: true },
      { text: 'Diseño profesional', included: true },
      { text: 'Dominio propio', included: false },
      { text: 'Sin anuncios', included: false },
      { text: 'SEO avanzado', included: false },
    ],
    cta: 'Comenzar Gratis',
    popular: false,
  },
  {
    name: 'Profesional',
    price: '299.000',
    period: 'Gs/mes',
    description: 'Lo que tu negocio necesita',
    features: [
      { text: 'Dominio propio (.com.py)', included: true },
      { text: 'Páginas ilimitadas', included: true },
      { text: 'Sin anuncios de ParaguAI', included: true },
      { text: 'SEO avanzado', included: true },
      { text: 'WhatsApp Business', included: true },
      { text: 'Analytics detallado', included: true },
      { text: 'Soporte prioritario', included: true },
    ],
    cta: 'Elegir Profesional',
    popular: true,
  },
]

const FAQS = [
  { question: '¿Cuánto tiempo tarda en estar listo mi sitio?', answer: 'En tan solo 15 minutos. Nuestro motor de IA genera tu sitio automáticamente basándose en el tipo de negocio y la información que proporciones.' },
  { question: '¿Necesito conocimientos técnicos?', answer: 'No necesitas saber programar. Solo seleccionas tu tipo de negocio, completas tus datos y el resto lo hace nuestra IA.' },
  { question: '¿Puedo cambiar el diseño después?', answer: 'Sí, puedes modificar colores, textos, imágenes y estructura desde tu panel de administración en cualquier momento.' },
  { question: '¿Qué incluye el dominio propio?', answer: 'El plan Profesional incluye un dominio .com.py gratuito con certificado SSL. También puedes usar tu dominio existente.' },
  { question: '¿Cómo funciona el pago?', answer: 'Aceptamos transferencia bancaria y Mercado Pago. El plan Profesional es de 299.000 Gs/mes con facturación mensual.' },
  { question: '¿Puedo usar mi propio dominio?', answer: 'Sí, puedes conectar cualquier dominio que ya tengas. Te ayudamos con la configuración sin costo adicional.' },
]

const SECTIONS = ['plantillas', 'proyectos', 'como-funciona', 'funcionalidades', 'precios', 'faq']

/* ── Animation Components ───────────────────────────────────────── */

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInView({ threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function FloatingShape({ className, style, delay = 0 }: { className?: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 animate-pulse ${className}`}
      style={{ animationDuration: '4s', animationDelay: `${delay}s`, ...style }}
    />
  )
}

/* ── Navigation Component ───────────────────────────────────────── */

function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const activeSection = useActiveSection(SECTIONS, 150)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#plantillas', label: 'Plantillas' },
    { href: '#como-funciona', label: 'Cómo Funciona' },
    { href: '#funcionalidades', label: 'Funcionalidades' },
    { href: '#precios', label: 'Precios' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] transition-transform group-hover:scale-110">
                <Wand2 size={20} />
              </div>
              <span className="text-lg font-bold">
                <span className="text-[var(--text)]">Paragu</span>
                <span className="text-[var(--primary)]">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeSection === link.href.slice(1)
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--text-light)] hover:text-[var(--text)]'
                  }`}
                >
                  {link.label}
                  {activeSection === link.href.slice(1) && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[var(--primary)]" />
                  )}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="hidden rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:opacity-90 hover:shadow-lg md:block"
              >
                Comenzar
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-[var(--text)] md:hidden"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[var(--background)] md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)]">
                <Wand2 size={20} />
              </div>
              <span className="text-lg font-bold">
                <span className="text-[var(--text)]">Paragu</span>
                <span className="text-[var(--primary)]">AI</span>
              </span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 text-[var(--text)]">
              <XIcon size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-4 text-lg font-medium text-[var(--text)] hover:bg-[var(--surface-light)]"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-4 text-center text-lg font-semibold text-[var(--primary-foreground)]"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Scroll Progress Bar ────────────────────────────────────────── */

function ScrollProgress() {
  const progress = useScrollProgress()
  return (
    <div className="fixed left-0 top-0 z-[51] h-0.5 w-full bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/* ── Floating WhatsApp Button ───────────────────────────────────── */

function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/595981234567?text=Hola,%20me%20interesa%20saber%20más%20sobre%20ParaguAI"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
      style={{ animation: 'pulse 2s infinite' }}
    >
      <MessageCircle size={28} fill="currentColor" />
    </a>
  )
}

/* ── Back to Top Button ─────────────────────────────────────────── */

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-md transition-all hover:bg-[var(--surface-light)]"
    >
      <ArrowUp size={20} />
    </button>
  )
}

/* ── Main Page Component ────────────────────────────────────────── */

export default function HomePage() {
  const heroCount1 = useCountUp(7463, 2000, true)
  const heroCount2 = useCountUp(75, 2000, true)

  return (
    <>
      <ScrollProgress />
      <Navigation />

      <main>
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative min-h-screen overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--accent)]/5" />
            <FloatingShape className="top-20 right-20 h-[500px] w-[500px] bg-[var(--primary)]/20" delay={0} />
            <FloatingShape className="bottom-20 left-10 h-[400px] w-[400px] bg-[var(--accent)]/20" delay={1} />
            <FloatingShape className="top-1/2 left-1/2 h-[300px] w-[300px] bg-[var(--primary)]/10" delay={2} />
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNjBWMGw2MCAwaDB2NjB6IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
          </div>

          <Container>
            <div className="mx-auto max-w-5xl text-center">
              <FadeIn delay={0}>
                <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-5 py-2.5 backdrop-blur-sm">
                  <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--success)]" />
                  <span className="text-sm font-medium text-[var(--text-light)]">
                    {heroCount1.toLocaleString()} negocios identificados en Paraguay
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={150}>
                <h1 className="mb-8 text-5xl font-extrabold leading-[1.1] tracking-tight text-[var(--text)] sm:text-6xl md:text-7xl lg:text-8xl">
                  Sitios web{' '}
                  <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                    profesionales
                  </span>{' '}
                  para tu negocio
                </h1>
              </FadeIn>

              <FadeIn delay={300}>
                <p className="mx-auto mb-10 max-w-2xl text-xl text-[var(--text-light)] md:text-2xl">
                  Motor de generación con IA que crea sitios web profesionales, rápidos y optimizados. 
                  En minutos, no en semanas.
                </p>
              </FadeIn>

              <FadeIn delay={450}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="#precios"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 text-lg font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    Comenzar Ahora
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#plantillas"
                    className="group inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-8 py-4 text-lg font-bold text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <PlayCircle size={20} />
                    Ver Demo
                  </a>
                </div>
              </FadeIn>

              {/* Stats Bar */}
              <FadeIn delay={600}>
                <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-8 backdrop-blur-sm sm:grid-cols-4">
                  {[
                    { value: '20', label: 'Plantillas' },
                    { value: '7.4K+', label: 'Negocios' },
                    { value: `${heroCount2}%`, label: 'Sin Web' },
                    { value: '15min', label: 'Para crear' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-3xl font-bold text-[var(--primary)] md:text-4xl">{stat.value}</p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Scroll Indicator */}
              <FadeIn delay={800}>
                <div className="mt-16 flex flex-col items-center gap-2 text-[var(--text-muted)]">
                  <span className="text-xs uppercase tracking-wider">Descubre más</span>
                  <ChevronDown size={24} className="animate-bounce" />
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* ── Templates ───────────────────────────────────────────── */}
        <section id="plantillas" className="scroll-mt-20 bg-[var(--surface-light)] py-24 md:py-32">
          <Container>
            <FadeIn>
              <div className="mx-auto mb-16 max-w-2xl text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                  Plantillas
                </p>
                <h2 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
                  Diseños Especializados
                </h2>
                <p className="text-lg text-[var(--text-light)]">
                  Cada plantilla está pensada para un rubro específico. Genera tu sitio en minutos.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {TEMPLATES.map((t, i) => {
                const Icon = t.icon
                const isAvailable = t.demoSlug !== null
                const LinkComponent = isAvailable ? 'a' : 'div'
                const linkProps = isAvailable ? { href: `/${t.demoSlug}` } : {}

                return (
                  <FadeIn key={t.id} delay={i * 50}>
                    <LinkComponent
                      {...linkProps}
                      className={`group relative block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--primary)]/30 hover:shadow-xl ${!isAvailable ? 'cursor-not-allowed opacity-70' : ''}`}
                    >
                      {/* Hover Gradient */}
                      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      
                      {/* Icon */}
                      <div
                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ backgroundColor: `${t.color}15`, color: t.color }}
                      >
                        <Icon size={28} />
                      </div>

                      {/* Content */}
                      <h3 className="mb-2 text-lg font-bold text-[var(--text)]">{t.name}</h3>
                      {t.leads > 0 ? (
                        <p className="mb-4 text-sm text-[var(--text-muted)]">
                          {t.leads.toLocaleString()} negocios • {t.pct}% sin web
                        </p>
                      ) : (
                        <p className="mb-4 text-sm text-[var(--text-muted)]">Próximamente</p>
                      )}

                      {/* Progress Bar */}
                      {t.pct > 0 && (
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${t.pct}%`, backgroundColor: t.color }}
                          />
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--primary)] opacity-0 transition-all group-hover:opacity-100">
                        {isAvailable ? 'Ver demo' : 'Muy pronto'}
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </LinkComponent>
                  </FadeIn>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ── How It Works ────────────────────────────────────────── */}
        <section id="como-funciona" className="scroll-mt-20 py-24 md:py-32">
          <Container size="md">
            <FadeIn>
              <div className="mx-auto mb-16 max-w-2xl text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                  Cómo Funciona
                </p>
                <h2 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
                  Tu sitio en 3 pasos
                </h2>
              </div>
            </FadeIn>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-[var(--primary)] to-[var(--accent)] md:left-1/2 md:-translate-x-1/2" />

              <div className="space-y-12">
                {STEPS.map((step, i) => (
                  <FadeIn key={step.num} delay={i * 150}>
                    <div className={`relative flex items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                      {/* Number */}
                      <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-2xl font-bold text-[var(--primary-foreground)] shadow-lg">
                        {step.num}
                      </div>
                      
                      {/* Content */}
                      <div className={`flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:-translate-y-1 hover:shadow-lg md:p-8 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                        <h3 className="mb-2 text-xl font-bold text-[var(--text)]">{step.title}</h3>
                        <p className="text-[var(--text-muted)]">{step.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section id="faq" className="scroll-mt-20 bg-[var(--surface-light)] py-24 md:py-32">
          <Container size="md">
            <FadeIn>
              <div className="mx-auto mb-16 max-w-2xl text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                  FAQ
                </p>
                <h2 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
                  Preguntas Frecuentes
                </h2>
              </div>
            </FadeIn>

            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <FadeIn key={i} delay={i * 50}>
                  <FAQItem question={faq.question} answer={faq.answer} />
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Features ────────────────────────────────────────────── */}
        <section id="funcionalidades" className="scroll-mt-20 py-24 md:py-32">
          <Container>
            <FadeIn>
              <div className="mx-auto mb-16 max-w-2xl text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                  Funcionalidades
                </p>
                <h2 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
                  Todo lo que necesitas
                </h2>
                <p className="text-lg text-[var(--text-light)]">
                  Cada sitio incluye funcionalidades profesionales pensadas para maximizar conversiones.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <FadeIn key={f.title} delay={i * 100}>
                    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-xl">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 text-[var(--primary)] transition-transform group-hover:scale-110">
                        <Icon size={24} />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-[var(--text)]">{f.title}</h3>
                      <p className="text-[var(--text-muted)]">{f.desc}</p>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ── Testimonials ────────────────────────────────────────── */}
        <section className="bg-[var(--surface-light)] py-24 md:py-32">
          <Container>
            <FadeIn>
              <div className="mx-auto mb-16 max-w-2xl text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                  Testimonios
                </p>
                <h2 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
                  Lo que dicen nuestros clientes
                </h2>
              </div>
            </FadeIn>

            <TestimonialCarousel />
          </Container>
        </section>

        {/* ── Pricing ─────────────────────────────────────────────── */}
        <section id="precios" className="scroll-mt-20 py-24 md:py-32">
          <Container>
            <FadeIn>
              <div className="mx-auto mb-16 max-w-2xl text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                  Precios
                </p>
                <h2 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
                  Elige tu plan
                </h2>
                <p className="text-lg text-[var(--text-light)]">
                  Empieza gratis y escala cuando tu negocio crezca
                </p>
              </div>
            </FadeIn>

            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              {PLANS.map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 150}>
                  <div
                    className={`relative rounded-3xl border-2 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                      plan.popular
                        ? 'border-[var(--primary)] bg-gradient-to-b from-[var(--primary)]/5 to-transparent'
                        : 'border-[var(--border)] bg-[var(--surface)]'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-2 text-sm font-bold text-[var(--primary-foreground)] shadow-lg">
                          Más Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-6 text-center">
                      <h3 className="mb-2 text-2xl font-bold text-[var(--text)]">{plan.name}</h3>
                      <div className="mb-2 flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-extrabold text-[var(--text)]">{plan.price}</span>
                        {plan.period && <span className="text-[var(--text-muted)]">{plan.period}</span>}
                      </div>
                      <p className="text-[var(--text-muted)]">{plan.description}</p>
                    </div>

                    <ul className="mb-8 space-y-4">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${feature.included ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--border)] text-[var(--text-muted)]'}`}>
                            {feature.included ? <Check size={12} /> : <X size={12} />}
                          </div>
                          <span className={feature.included ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="/admin"
                      className={`block w-full rounded-2xl py-4 text-center text-lg font-bold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] hover:shadow-lg hover:opacity-90'
                          : 'border-2 border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* ── About ───────────────────────────────────────────────── */}
        <section className="bg-[var(--surface-light)] py-24 md:py-32">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <FadeIn>
                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                    Sobre ParaguAI
                  </p>
                  <h2 className="mb-6 text-4xl font-bold text-[var(--text)] sm:text-5xl">
                    Democratizando la presencia digital
                  </h2>
                  <div className="space-y-4 text-lg text-[var(--text-light)]">
                    <p>
                      ParaguAI Builder nació con una misión clara: <strong>hacer accesible la presencia digital</strong> para cada pequeño negocio en Paraguay.
                    </p>
                    <p>
                      Nuestro análisis reveló algo impactante: más del 75% de los negocios de belleza y bienestar en Paraguay no tienen presencia web.
                    </p>
                    <p>
                      Creamos un motor de IA que permite tener un sitio web profesional en minutos, no en semanas. Sin conocimientos técnicos, sin costos elevados.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '7.4K+', label: 'Negocios identificados' },
                    { value: '75%', label: 'Sin presencia web' },
                    { value: '209', label: 'Ciudades cubiertas' },
                    { value: '15min', label: 'Para crear un sitio' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                      <p className="text-3xl font-bold text-[var(--primary)] md:text-4xl">{stat.value}</p>
                      <p className="mt-2 text-sm text-[var(--text-muted)]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]" />
          <FloatingShape className="top-0 left-0 h-[400px] w-[400px] bg-white/10" delay={0} />
          <FloatingShape className="bottom-0 right-0 h-[300px] w-[300px] bg-white/10" delay={1} />

          <Container size="md">
            <FadeIn>
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="mb-6 text-4xl font-bold text-[var(--primary-foreground)] sm:text-5xl">
                  Lleva tu negocio al mundo digital
                </h2>
                <p className="mb-8 text-xl text-[var(--primary-foreground)]/80">
                  Únete a los negocios paraguayos que están creciendo con una presencia web profesional.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[var(--primary)] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    Comenzar Ahora
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* ── Lead Capture ────────────────────────────────────────── */}
        <section className="py-24 md:py-32">
          <Container size="md">
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-[var(--text)]">
                  Mantente informado
                </h2>
                <p className="mb-8 text-[var(--text-light)]">
                  Suscríbete para recibir actualizaciones sobre nuevas plantillas y funcionalidades.
                </p>
                <form className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="email"
                      placeholder="Tu email"
                      required
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-4 pl-12 pr-4 text-[var(--text)] placeholder-[var(--text-muted)] transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-[var(--primary)] px-8 py-4 font-bold text-[var(--primary-foreground)] transition-all hover:opacity-90"
                  >
                    Suscribirse
                  </button>
                </form>
              </div>
            </FadeIn>
          </Container>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)]">
                  <Wand2 size={20} />
                </div>
                <span className="text-xl font-bold">
                  <span className="text-[var(--text)]">Paragu</span>
                  <span className="text-[var(--primary)]">AI</span>
                </span>
              </div>
              <p className="max-w-sm text-[var(--text-muted)]">
                Motor de generación de sitios web con inteligencia artificial para negocios en Paraguay.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-[var(--text)]">Plataforma</h4>
              <ul className="space-y-2 text-[var(--text-muted)]">
                <li><a href="#plantillas" className="hover:text-[var(--primary)]">Plantillas</a></li>
                <li><a href="#funcionalidades" className="hover:text-[var(--primary)]">Funcionalidades</a></li>
                <li><a href="#precios" className="hover:text-[var(--primary)]">Precios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-[var(--text)]">Soporte</h4>
              <ul className="space-y-2 text-[var(--text-muted)]">
                <li><a href="#faq" className="hover:text-[var(--primary)]">FAQ</a></li>
                <li><Link href="/admin" className="hover:text-[var(--primary)]">Panel Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-[var(--border)] pt-8 text-center text-[var(--text-muted)]">
            © {new Date().getFullYear()} ParaguAI Builder. Todos los derechos reservados.
          </div>
        </Container>
      </footer>

      <FloatingWhatsApp />
      <BackToTop />
    </>
  )
}

/* ── Sub-components ────────────────────────────────────────────── */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all ${isOpen ? 'bg-[var(--surface-light)]' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <span className="font-bold text-[var(--text)]">{question}</span>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '200px' : '0', opacity: isOpen ? 1 : 0 }}
      >
        <p className="px-6 pb-6 text-[var(--text-muted)]">{answer}</p>
      </div>
    </div>
  )
}

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-12">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="transition-all duration-500"
            style={{
              display: i === current ? 'block' : 'none',
              opacity: i === current ? 1 : 0,
              transform: i === current ? 'translateX(0)' : 'translateX(20px)',
            }}
          >
            <Quote size={48} className="mb-6 text-[var(--primary)]/20" />
            <p className="mb-8 text-2xl font-medium italic text-[var(--text)] md:text-3xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-lg font-bold text-[var(--primary-foreground)]">
                {t.name[0]}
              </div>
              <div>
                <p className="font-bold text-[var(--text)]">{t.name}</p>
                <p className="text-sm text-[var(--text-muted)]">{t.business} • {t.location}</p>
              </div>
              <div className="ml-auto flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className={j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--border)]'} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-[var(--primary)]' : 'w-2 bg-[var(--border)]'}`}
          />
        ))}
      </div>
    </div>
  )
}