'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Scissors, Dumbbell, Flower2, Hand, PenTool, User, Sparkles,
  Palette, Zap, Eye, Globe, Smartphone, Search, MessageCircle,
  ArrowRight, BarChart3, Layers, Wand2,
  MapPin, Users, TrendingUp, ShoppingCart, Check, X,
  Menu, X as XIcon, ChevronDown, PlayCircle,
  UtensilsCrossed, Fish, CircleDot,
  RotateCcw, Activity, Unlock, ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { useActiveSection, useCountUp } from '@/lib/hooks'
import { FadeIn } from '@/components/landing/fade-in'
import { FAQItem } from '@/components/landing/faq-item'
import { LogoStrip } from '@/components/landing/logo-strip'
import { VideoBlock } from '@/components/landing/video-block'
import { PressStrip } from '@/components/landing/press-strip'
import { waLink } from '@/lib/landing/marketing-data'
import { useHeroVariant } from '@/lib/experiments/hero-variant'
import { FloatingShape } from '@/components/landing/chrome'

/**
 * BUG_HUNT_500 perf — landing scored 44/100 with TBT 2,250ms because every
 * floating component mounted in parallel with the hero. Defer the
 * non-critical chrome until after first paint via next/dynamic. Hero
 * render path stays synchronous; everything else hydrates lazily.
 */
const ScrollProgress = dynamic(() => import('@/components/landing/chrome').then((m) => m.ScrollProgress), { ssr: false, loading: () => null })
const FloatingWhatsApp = dynamic(() => import('@/components/landing/chrome').then((m) => m.FloatingWhatsApp), { ssr: false, loading: () => null })
const BackToTop = dynamic(() => import('@/components/landing/chrome').then((m) => m.BackToTop), { ssr: false, loading: () => null })
const StickyMobileCTA = dynamic(() => import('@/components/landing/sticky-mobile-cta').then((m) => m.StickyMobileCTA), { ssr: false, loading: () => null })
const ActivityTicker = dynamic(() => import('@/components/landing/activity-ticker').then((m) => m.ActivityTicker), { ssr: false, loading: () => null })
const TestimonialCarousel = dynamic(() => import('@/components/landing/testimonial-carousel').then((m) => m.TestimonialCarousel), { ssr: false, loading: () => null })
const NewsletterForm = dynamic(() => import('@/components/landing/newsletter-form').then((m) => m.NewsletterForm), { ssr: false, loading: () => null })
const HeroVariantChip = dynamic(() => import('@/components/landing/hero-variant-chip').then((m) => m.HeroVariantChip), { ssr: false, loading: () => null })
const ScrollDepthTracker = dynamic(() => import('@/components/landing/scroll-depth-tracker').then((m) => m.ScrollDepthTracker), { ssr: false, loading: () => null })

/* ── Data Constants ─────────────────────────────────────────────── */

const TEMPLATES = [
  { id: 'peluqueria', name: 'Peluquería', icon: Scissors, leads: 2393, pct: 81, color: '#b76e79', demoSlug: 'salon-maria' },
  { id: 'salon_belleza', name: 'Salón de Belleza', icon: Sparkles, leads: 1210, pct: 75, color: '#d4a574', demoSlug: 'studio-belleza' },
  { id: 'gimnasio', name: 'Gimnasio / Fitness', icon: Dumbbell, leads: 1087, pct: 72, color: '#2d6a4f', demoSlug: 'gymfit-py' },
  { id: 'spa', name: 'Spa & Wellness', icon: Flower2, leads: 927, pct: 76, color: '#7c9885', demoSlug: 'spa-serenidad' },
  { id: 'barberia', name: 'Barbería', icon: User, leads: 778, pct: 77, color: '#8b6914', demoSlug: 'barberia-clasica' },
  { id: 'unas', name: 'Uñas', icon: Hand, leads: 488, pct: 75, color: '#c77dba', demoSlug: 'unas-y-mas' },
  { id: 'tatuajes', name: 'Tatuajes & Piercing', icon: PenTool, leads: 272, pct: 70, color: '#1a1a2e', demoSlug: 'tinta-viva' },
  { id: 'estetica', name: 'Estética / Facial', icon: Sparkles, leads: 137, pct: 77, color: '#9b7cb8', demoSlug: 'belleza-integral' },
  { id: 'diseno_grafico', name: 'Diseño Gráfico', icon: Palette, leads: 100, pct: 80, color: '#c44569', demoSlug: 'dayah-litworks' },
  { id: 'pestanas', name: 'Pestañas y Cejas', icon: Eye, leads: 49, pct: 76, color: '#6c5ce7', demoSlug: 'pestanas-flore' },
  { id: 'depilacion', name: 'Depilación', icon: Zap, leads: 20, pct: 78, color: '#e17055', demoSlug: 'depilacion-perfecta' },
  { id: 'relocation', name: 'Reubicación', icon: Globe, leads: 0, pct: 0, color: '#1e3a5f', demoSlug: 'nexa-paraguay' },
  { id: 'meal_prep', name: 'Meal Prep & Compras', icon: ShoppingCart, leads: 0, pct: 0, color: '#3a6b4a', demoSlug: 'de-abasto-a-casa' },
  { id: 'restaurant', name: 'Restaurante', icon: UtensilsCrossed, leads: 0, pct: 0, color: '#8B4513', demoSlug: 'la-trattoria' },
  { id: 'sushi_bar', name: 'Sushi Bar', icon: Fish, leads: 0, pct: 0, color: '#1A1A1A', demoSlug: 'sakura-sushi' },
  { id: 'kaiten_zushi', name: 'Sushi Cinta', icon: CircleDot, leads: 0, pct: 0, color: '#2196F3', demoSlug: 'kaiten-express' },
  { id: 'maquillaje', name: 'Maquillaje', icon: Palette, leads: 130, pct: 72, color: '#e84393', demoSlug: null },
  { id: 'inmobiliaria', name: 'Inmobiliaria', icon: MapPin, leads: 0, pct: 0, color: '#2d6a4f', demoSlug: null },
  { id: 'legal', name: 'Servicios Legales', icon: Layers, leads: 0, pct: 0, color: '#1a1a1a', demoSlug: null },
  { id: 'consultoria', name: 'Consultoría', icon: BarChart3, leads: 0, pct: 0, color: '#4a90a4', demoSlug: null },
  { id: 'educacion', name: 'Educación', icon: Users, leads: 0, pct: 0, color: '#7c3aed', demoSlug: null },
  { id: 'salud', name: 'Salud', icon: TrendingUp, leads: 0, pct: 0, color: '#059669', demoSlug: null },
  { id: 'inversiones', name: 'Inversiones', icon: TrendingUp, leads: 0, pct: 0, color: '#d97706', demoSlug: null },
] as const

const FEATURES = [
  { icon: Check, title: 'Todo incluido', desc: 'Diseño, textos, fotos, dominio, hosting, SEO y soporte. Vos no tocás nada, nosotros publicamos.' },
  { icon: MessageCircle, title: 'WhatsApp directo', desc: 'Botón flotante que lleva a tu WhatsApp Business. Tus clientes te escriben con un clic.' },
  { icon: Globe, title: 'Dominio propio', desc: 'Tu URL profesional .com.py con SSL y emails incluidos el primer año.' },
  { icon: Search, title: 'SEO integrado', desc: 'Meta tags, Schema.org y contenido optimizado para aparecer en Google desde el día uno.' },
  { icon: Smartphone, title: '100% responsive', desc: 'Se ve perfecto en móvil, tablet y desktop. Optimizado para la forma en que miran tus clientes.' },
  { icon: Layers, title: 'Plantillas por rubro', desc: 'Diseños especializados pensados para tu tipo de negocio. Cada cliente arranca con la base correcta y ajustamos a tu marca.' },
]

const STEPS = [
  { num: '01', title: 'Contanos por WhatsApp', desc: 'Nos mandás el nombre del negocio, tus servicios, precios y fotos. Sin formularios complicados.' },
  { num: '02', title: 'Armamos tu demo', desc: 'En 24 horas te mandamos un link con tu sitio listo. Lo revisás, pedís ajustes, y recién después pagás.' },
  { num: '03', title: 'Lanzamos y mantenemos', desc: 'Publicamos en tu dominio .com.py con SSL, SEO y analytics. Cambios mensuales incluidos por WhatsApp.' },
]

const TESTIMONIALS = [
  {
    name: 'Equipo Nexa Paraguay',
    business: 'Nexa Paraguay · Reubicación Europa → PY',
    location: 'Asunción',
    quote: 'Necesitábamos un sitio serio en 4 idiomas (ES/EN/DE/NL) para clientes europeos que evalúan mudarse. ParaguAI lo entregó sin que toquemos código y lo replicó para Uruguay en días.',
    rating: 5,
  },
  {
    name: 'Dayah',
    business: 'Dayah Litworks · Diseño de tapas de libros',
    location: 'Remoto',
    quote: 'Mi portafolio antes estaba en Instagram. Ahora los autores que me contratan me ven con un sitio profesional en USD, con proceso de encargo claro. Cerré 3 comisiones en el primer mes.',
    rating: 5,
  },
  {
    name: 'Iván',
    business: 'De Abasto a Casa · Meal prep semanal',
    location: 'Asunción',
    quote: 'Mandé los datos por WhatsApp un jueves y el lunes el sitio estaba online con menú semanal, precios en Gs y botón de pedido. Los clientes reservan solos, dejé de perder pedidos en los grupos.',
    rating: 5,
  },
]

const GUARANTEES = [
  { icon: PlayCircle, title: 'Demo antes de pagar', desc: 'Ves tu sitio primero, pagás después.' },
  { icon: RotateCcw, title: '30 días de garantía', desc: 'Si no te convence, te devolvemos el setup.' },
  { icon: Activity, title: 'Uptime 99.9%', desc: 'Infraestructura Cloudflare + Supabase.' },
  { icon: Unlock, title: 'Sin permanencia', desc: 'Cancelás cuando quieras, te llevás tu dominio.' },
]

const REAL_CLIENTS = [
  {
    name: 'Nexa Paraguay',
    tagline: 'Reubicación Europa → Paraguay',
    vertical: 'Relocation · 4 idiomas',
    href: '/s/es/nexa-paraguay',
    color: '#1e3a5f',
  },
  {
    name: 'Nexa Propiedades',
    tagline: 'Inmobiliaria residencial PY',
    vertical: 'Real estate · 3 idiomas',
    href: '/s/es/nexa-propiedades',
    color: '#2d6a4f',
  },
  {
    name: 'Nexa Uruguay',
    tagline: 'Reubicación Europa → Uruguay',
    vertical: 'Relocation · replicado en días',
    href: '/s/es/nexa-uruguay',
    color: '#5b8bc9',
  },
  {
    name: 'Dayah Litworks',
    tagline: 'Diseño de tapas de libros',
    vertical: 'Portfolio · pago en USD',
    href: '/dayah-litworks',
    color: '#c44569',
  },
  {
    name: 'De Abasto a Casa',
    tagline: 'Meal prep semanal en Asunción',
    vertical: 'Food · pedidos por WhatsApp',
    href: '/de-abasto-a-casa',
    color: '#3a6b4a',
  },
]

const PLANS = [
  {
    name: 'Prueba',
    setup: 'Gratis',
    monthly: '3 meses',
    period: 'sin costo',
    description: 'Para validar antes de invertir',
    features: [
      { text: 'Subdominio (negocio.paragu-ai.com)', included: true },
      { text: '1 página lista para compartir', included: true },
      { text: 'WhatsApp + Google Maps', included: true },
      { text: 'Certificado SSL incluido', included: true },
      { text: 'Dominio propio', included: false },
      { text: 'Sin branding ParaguAI', included: false },
      { text: 'Soporte personalizado', included: false },
    ],
    cta: 'Solicitar demo',
    waMessage: 'Hola, quiero probar ParaguAI gratis para mi negocio.',
    popular: false,
  },
  {
    name: 'Presencia',
    setup: 'Gs 650.000',
    monthly: 'Gs 100.000',
    period: 'por mes',
    description: 'Tu primer sitio profesional',
    features: [
      { text: 'Hasta 5 páginas', included: true },
      { text: 'Dominio propio (.com.py) incluido 1 año', included: true },
      { text: 'Hasta 15 fotos optimizadas', included: true },
      { text: 'Formulario + WhatsApp Business', included: true },
      { text: 'SEO básico + Google Maps', included: true },
      { text: '2 cambios de contenido al mes', included: true },
      { text: 'Soporte por WhatsApp', included: true },
    ],
    cta: 'Comenzar Presencia',
    waMessage: 'Hola, me interesa el plan Presencia (Gs 650.000 + 100.000/mes).',
    popular: false,
  },
  {
    name: 'Crecimiento',
    setup: 'Gs 1.200.000',
    monthly: 'Gs 150.000',
    period: 'por mes',
    description: 'Reservas, blog y e-commerce',
    features: [
      { text: 'Todo lo de Presencia', included: true },
      { text: 'Páginas ilimitadas', included: true },
      { text: 'Sistema de reservas online', included: true },
      { text: 'Catálogo con hasta 20 productos', included: true },
      { text: 'Blog y analytics', included: true },
      { text: 'SEO avanzado + Schema.org', included: true },
      { text: '5 cambios al mes + soporte prioritario', included: true },
    ],
    cta: 'Comenzar Crecimiento',
    waMessage: 'Hola, me interesa el plan Crecimiento (Gs 1.200.000 + 150.000/mes).',
    popular: true,
  },
  {
    name: 'Profesional',
    setup: 'Gs 2.200.000',
    monthly: 'Gs 300.000',
    period: 'por mes',
    description: 'Cadenas, franquicias, multi-sucursal',
    features: [
      { text: 'Todo lo de Crecimiento', included: true },
      { text: 'Hasta 5 sucursales / locales', included: true },
      { text: 'Sitio multi-idioma (es/en/pt)', included: true },
      { text: 'Integraciones personalizadas', included: true },
      { text: 'Account manager dedicado', included: true },
      { text: 'SLA 99.9% uptime', included: true },
      { text: '10 horas de desarrollo al mes', included: true },
    ],
    cta: 'Hablar con ventas',
    waMessage: 'Hola, me interesa el plan Profesional (Gs 2.200.000 + 300.000/mes).',
    popular: false,
  },
]

const FAQS = [
  { question: '¿Cuánto tiempo tarda en estar listo mi sitio?', answer: 'Entre 24 y 48 horas desde que recibimos tus datos. Nuestro motor genera el sitio base en minutos y un editor humano lo revisa, ajusta textos y optimiza imágenes antes de publicarlo. Vos no tocás nada.' },
  { question: '¿Necesito conocimientos técnicos?', answer: 'Ninguno. Nosotros hacemos todo: diseño, textos, fotos, SEO, dominio y publicación. Vos nos mandás la info de tu negocio por WhatsApp y recibís el sitio listo.' },
  { question: '¿Puedo probar antes de pagar?', answer: 'Sí. Todos los planes incluyen una demo de tu sitio antes de pagar el setup. Además tenés 3 meses de prueba gratis en subdominio para validar que funciona.' },
  { question: '¿Cómo funciona el pago?', answer: 'Setup único al inicio (una sola vez) + cuota mensual para hosting, dominio y soporte. Aceptamos Mercado Pago y transferencia bancaria. Sin contratos de permanencia.' },
  { question: '¿Puedo cambiar el diseño después?', answer: 'Sí. Los planes Presencia y superiores incluyen cambios de contenido mensuales (2 a 10 según plan). Rediseños mayores se cotizan aparte.' },
  { question: '¿Qué incluye el dominio propio?', answer: 'Los planes pagos incluyen un dominio .com.py gratis el primer año, configuración DNS, certificado SSL automático y emails profesionales (tunombre@tu-negocio.com.py).' },
  { question: '¿Puedo usar mi dominio existente?', answer: 'Sí, conectamos cualquier dominio que ya tengas sin costo extra. También te ayudamos a migrar desde Wix, WordPress o tu web actual.' },
  { question: '¿Qué pasa si no me gusta?', answer: 'Tenés 30 días de garantía. Si el sitio no te convence, te devolvemos el setup completo. Sin preguntas incómodas.' },
]

const SECTIONS = ['clientes', 'plantillas', 'como-funciona', 'funcionalidades', 'precios', 'testimonios', 'faq']

/* ── Animation Components ───────────────────────────────────────── */

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
    { href: '/casos', label: 'Casos' },
    { href: '/p', label: 'Plantillas' },
    { href: '/precios', label: 'Precios' },
    { href: '/comparacion', label: 'Comparación' },
    { href: '/demo', label: 'Demo' },
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
                className="hidden text-sm font-medium text-[var(--text-light)] hover:text-[var(--primary)] md:block"
              >
                Acceso clientes
              </Link>
              <a
                href={waLink('Hola, quiero una demo gratis de ParaguAI para mi negocio.')}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:opacity-90 hover:shadow-lg md:inline-flex md:items-center md:gap-2"
              >
                <MessageCircle size={16} />
                Pedir demo
              </a>
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menú"
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
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú" className="rounded-lg p-2 text-[var(--text)]">
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
            <a
              href={waLink('Hola, quiero una demo gratis de ParaguAI para mi negocio.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-4 text-center text-lg font-semibold text-[var(--primary-foreground)]"
            >
              <MessageCircle size={18} />
              Pedir demo por WhatsApp
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl border border-[var(--border)] px-4 py-3 text-center text-sm font-medium text-[var(--text-light)]"
            >
              Acceso clientes
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Main Page Component ──────────────────────────────────────────
 * FloatingShape, ScrollProgress, FloatingWhatsApp, BackToTop live under
 * components/landing/chrome.tsx. FadeIn, FAQItem, TestimonialCarousel
 * live under components/landing/{fade-in,faq-item,testimonial-carousel}.
 * Edit those files to change behaviour; this page just composes them.   */

export default function HomePage() {
  const heroCount1 = useCountUp(7463, 2000, true)
  const heroCount2 = useCountUp(75, 2000, true)
  const heroVariant = useHeroVariant() // null on first SSR pass; resolves to 'A' | 'B' on hydrate

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
                <div className="mb-4 flex flex-col items-center gap-3">
                  <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-5 py-2.5 backdrop-blur-sm">
                    <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--success)]" />
                    <span className="text-sm font-medium text-[var(--text-light)]">
                      {heroCount1.toLocaleString()} negocios identificados en Paraguay
                    </span>
                  </div>
                  <ActivityTicker />
                </div>
              </FadeIn>

              <FadeIn delay={150}>
                {heroVariant === 'B' ? (
                  <h1 className="mb-8 text-5xl font-extrabold leading-[1.1] tracking-tight text-[var(--text)] sm:text-6xl md:text-7xl lg:text-8xl">
                    Como las marcas de Paraguay y Uruguay que{' '}
                    <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                      ya están con nosotros
                    </span>
                  </h1>
                ) : (
                  <h1 className="mb-8 text-5xl font-extrabold leading-[1.1] tracking-tight text-[var(--text)] sm:text-6xl md:text-7xl lg:text-8xl">
                    Tu sitio web{' '}
                    <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                      profesional
                    </span>{' '}
                    en 48{'\u00A0'}horas
                  </h1>
                )}
              </FadeIn>

              <FadeIn delay={300}>
                <p className="mx-auto mb-10 max-w-2xl text-xl text-[var(--text-light)] md:text-2xl">
                  {heroVariant === 'B'
                    ? 'Sitios profesionales para negocios paraguayos en 48 horas. Demo gratis antes de pagar — pagás solo si te convence.'
                    : 'Todo incluido: diseño, textos, dominio, hosting, SEO y WhatsApp. Vos nos pasás los datos por WhatsApp, nosotros entregamos el sitio listo.'}
                </p>
              </FadeIn>

              <FadeIn delay={450}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href={waLink('Hola, quiero una demo gratis de ParaguAI para mi negocio.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 text-lg font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <MessageCircle size={20} />
                    Pedir demo gratis
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#clientes"
                    className="group inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-8 py-4 text-lg font-bold text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <PlayCircle size={20} />
                    Ver clientes reales
                  </a>
                </div>
              </FadeIn>

              {/* Stats Bar */}
              <FadeIn delay={600}>
                <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-8 backdrop-blur-sm sm:grid-cols-4">
                  {[
                    { value: '16', label: 'Rubros cubiertos' },
                    { value: '7.4K+', label: 'Mercado PY' },
                    { value: `${heroCount2}%`, label: 'Sin web' },
                    { value: '48h', label: 'Entrega' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-3xl font-bold text-[var(--primary)] md:text-4xl">{stat.value}</p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Real-client logo strip + press mentions + video walkthrough */}
              <FadeIn delay={700}>
                <LogoStrip />
              </FadeIn>

              <FadeIn delay={720}>
                <PressStrip />
              </FadeIn>

              <FadeIn delay={750}>
                <div className="mt-16">
                  <VideoBlock fallbackHref="#como-funciona" />
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

        {/* ── Guarantees Strip ───────────────────────────────────── */}
        <section aria-label="Garantías" className="border-y border-[var(--border)] bg-[var(--surface)] py-10">
          <Container>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {GUARANTEES.map((g) => {
                const Icon = g.icon
                return (
                  <div key={g.title} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text)]">{g.title}</p>
                      <p className="text-sm text-[var(--text-muted)]">{g.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>

        {/* ── Real Clients ───────────────────────────────────────── */}
        <section id="clientes" className="scroll-mt-20 py-24 md:py-32">
          <Container>
            <FadeIn>
              <div className="mx-auto mb-16 max-w-2xl text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                  Clientes reales
                </p>
                <h2 className="mb-4 text-4xl font-bold text-[var(--text)] sm:text-5xl">
                  Sitios que están online hoy
                </h2>
                <p className="text-lg text-[var(--text-light)]">
                  No son maquetas ni mockups. Son negocios paraguayos y de la región usando ParaguAI ahora mismo.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {REAL_CLIENTS.map((c, i) => (
                <FadeIn key={c.name} delay={i * 80}>
                  <Link
                    href={c.href}
                    className="group relative block h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--primary)]/30 hover:shadow-xl"
                  >
                    <div
                      className="mb-4 h-1.5 w-12 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <h3 className="mb-2 text-lg font-bold text-[var(--text)]">{c.name}</h3>
                    <p className="mb-1 text-sm text-[var(--text)]">{c.tagline}</p>
                    <p className="mb-6 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                      {c.vertical}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] opacity-70 transition-opacity group-hover:opacity-100">
                      Visitar sitio
                      <ExternalLink size={14} />
                    </span>
                  </Link>
                </FadeIn>
              ))}
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
                          Mercado PY: {t.leads.toLocaleString()} negocios · {t.pct}% sin web
                        </p>
                      ) : isAvailable ? (
                        <p className="mb-4 text-sm text-[var(--text-muted)]">Demo disponible</p>
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
                  <FAQItem question={faq.question} answer={faq.answer} defaultOpen={i === 0} />
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
        <section id="testimonios" className="scroll-mt-20 bg-[var(--surface-light)] py-24 md:py-32">
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

            <TestimonialCarousel testimonials={TESTIMONIALS} />
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

            {/* ROI anchor */}
            <FadeIn>
              <p className="mx-auto mb-10 max-w-2xl text-center text-[var(--text-light)]">
                <strong className="text-[var(--text)]">2 clientes nuevos al mes pagan tu plan.</strong>{' '}
                Setup único + mensualidad baja. Sin permanencia, sin sorpresas. Pago en Gs por Mercado Pago o transferencia.
              </p>
            </FadeIn>

            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100}>
                  <div
                    className={`relative flex h-full flex-col rounded-3xl border-2 p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                      plan.popular
                        ? 'border-[var(--primary)] bg-gradient-to-b from-[var(--primary)]/5 to-transparent'
                        : 'border-[var(--border)] bg-[var(--surface)]'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-2 text-sm font-bold text-[var(--primary-foreground)] shadow-lg whitespace-nowrap">
                          Recomendado
                        </span>
                      </div>
                    )}

                    <div className="mb-6 text-center">
                      <h3 className="mb-2 text-xl font-bold text-[var(--text)]">{plan.name}</h3>
                      <p className="mb-4 text-sm text-[var(--text-muted)]">{plan.description}</p>
                      <div className="flex flex-col items-center gap-1 rounded-2xl bg-[var(--surface-light)] py-4 px-3">
                        <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Setup único</span>
                        <span className="text-2xl font-extrabold text-[var(--text)]">{plan.setup}</span>
                        <span className="mt-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">Después</span>
                        <span className="text-lg font-bold text-[var(--primary)]">{plan.monthly}</span>
                        <span className="text-xs text-[var(--text-muted)]">{plan.period}</span>
                      </div>
                    </div>

                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${feature.included ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--border)] text-[var(--text-muted)]'}`}>
                            {feature.included ? <Check size={12} /> : <X size={12} />}
                          </div>
                          <span className={feature.included ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={waLink(plan.waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-auto block w-full rounded-2xl py-3.5 text-center text-sm font-bold transition-all ${
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
                      <span className="mt-1 block text-xs text-[var(--text-muted)]">Fuente: análisis propio sobre 7.463 negocios mapeados en 209 ciudades del país (2026).</span>
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
                    { value: '48h', label: 'De idea a online' },
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
                  <a
                    href={waLink('Hola, quiero una demo gratis de ParaguAI para mi negocio.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[var(--primary)] shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <MessageCircle size={20} />
                    Pedir demo por WhatsApp
                    <ArrowRight size={20} />
                  </a>
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
                <NewsletterForm />
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
              <h3 className="mb-4 font-bold text-[var(--text)]">Producto</h3>
              <ul className="space-y-2 text-[var(--text-muted)]">
                <li><Link href="/p" className="hover:text-[var(--primary)]">Plantillas</Link></li>
                <li><Link href="/precios" className="hover:text-[var(--primary)]">Precios</Link></li>
                <li><Link href="/comparacion" className="hover:text-[var(--primary)]">Comparación</Link></li>
                <li><Link href="/demo" className="hover:text-[var(--primary)]">Pedir demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-[var(--text)]">Recursos</h3>
              <ul className="space-y-2 text-[var(--text-muted)]">
                <li><Link href="/casos" className="hover:text-[var(--primary)]">Casos reales</Link></li>
                <li><Link href="/blog" className="hover:text-[var(--primary)]">Blog</Link></li>
                <li><Link href="/seguridad" className="hover:text-[var(--primary)]">Privacidad</Link></li>
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
      <StickyMobileCTA />
      <HeroVariantChip />
      <ScrollDepthTracker />
    </>
  )
}

/* ── Sub-components ──────────────────────────────────────────────
 * FadeIn, FAQItem, and TestimonialCarousel now live under
 * `components/landing/` — see those files to edit the reveal / FAQ /
 * carousel behaviour.                                                  */