'use client'

import { useState, useEffect } from 'react'
import {
  Scissors, Dumbbell, Flower2, Hand, PenTool, User, Sparkles,
  Palette, Zap, Eye, Globe, Smartphone, Search, MessageCircle,
  ArrowRight, Layers, Star,
  ShoppingCart, Check,
  Menu, X as XIcon, PlayCircle,
  UtensilsCrossed, Fish, CircleDot,
  RotateCcw, Activity, Unlock,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { FadeIn } from '@/components/landing/fade-in'
import { FAQItem } from '@/components/landing/faq-item'
import { LogoStrip } from '@/components/landing/logo-strip'
import { FloatingShape } from '@/components/landing/chrome'
import { BrandMark } from '@/components/ui/brand-icons'

/* ── Schema.org Structured Data ────────────────────────────────── */

const SCHEMA_ORG_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://paragu-ai.com/#organization",
      "name": "ParaguAI",
      "url": "https://paragu-ai.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://paragu-ai.com/logo.png"
      },
      "description": "Sitios web profesionales para negocios paraguayos en 48 horas. Todo incluido: diseño, dominio .com.py, SEO y WhatsApp.",
      "foundingLocation": {
        "@type": "Place",
        "name": "Asunción, Paraguay"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Paraguay"
      },
      "sameAs": [
        "https://wa.me/595981324569"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://paragu-ai.com/#website",
      "url": "https://paragu-ai.com",
      "name": "ParaguAI - Sitios Web Profesionales para Negocios Paraguayos",
      "publisher": {
        "@id": "https://paragu-ai.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://paragu-ai.com/buscar?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://paragu-ai.com/#webpage",
      "url": "https://paragu-ai.com",
      "name": "ParaguAI - Tu negocio vendiendo mientras dormís",
      "isPartOf": {
        "@id": "https://paragu-ai.com/#website"
      },
      "about": {
        "@id": "https://paragu-ai.com/#organization"
      },
      "description": "Sitio web profesional en 48 horas para negocios paraguayos. Todo incluido: diseño, dominio .com.py, SEO y WhatsApp. Empezá gratis.",
      "inLanguage": "es-PY"
    },
    {
      "@type": "Service",
      "@id": "https://paragu-ai.com/#service",
      "name": "Creación de Sitios Web para Negocios",
      "provider": {
        "@id": "https://paragu-ai.com/#organization"
      },
      "description": "Diseño y desarrollo de sitios web profesionales para pequeños y medianos negocios en Paraguay",
      "areaServed": {
        "@type": "Country",
        "name": "Paraguay"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Planes de Servicio",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Plan Starter"
            },
            "price": "0",
            "priceCurrency": "PYG",
            "description": "Subdominio gratis, página única, WhatsApp"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Plan Profesional"
            },
            "price": "650000",
            "priceCurrency": "PYG",
            "description": "Dominio .com.py, hasta 5 páginas, SEO, 2 cambios mensuales"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Plan Negocio"
            },
            "price": "1200000",
            "priceCurrency": "PYG",
            "description": "Reservas online, catálogo de productos, blog, soporte prioritario"
          }
        ]
      }
    },
    {
      "@type": "AggregateRating",
      "@id": "https://paragu-ai.com/#aggregate-rating",
      "itemReviewed": {
        "@id": "https://paragu-ai.com/#organization"
      },
      "ratingValue": "4.9",
      "reviewCount": "250",
      "bestRating": "5",
      "worstRating": "1"
    },
    {
      "@type": "FAQPage",
      "@id": "https://paragu-ai.com/#faq-page",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuánto tiempo tarda en estar listo mi sitio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Entre 24 y 48 horas desde que nos mandás los datos. Primero generamos el sitio automáticamente, después un editor humano lo revisa y optimiza antes de entregártelo."
          }
        },
        {
          "@type": "Question",
          "name": "¿Necesito saber algo de tecnología?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nada. Nosotros hacemos todo: el diseño, los textos, las fotos, el dominio y la publicación. Vos solo nos mandás la info de tu negocio por WhatsApp y recibís el sitio listo para usar."
          }
        },
        {
          "@type": "Question",
          "name": "¿Puedo ver mi sitio antes de pagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí. En el plan Starter te armamos tu sitio gratis en un subdominio. Si te gusta, podés pasarte al plan Profesional con dominio propio. Si no, no pagás nada."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué incluye el dominio .com.py?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Incluimos el dominio gratis el primer año (por ejemplo: tunegocio.com.py). También configuramos el certificado SSL para que tu sitio sea seguro, y te ayudamos a crear emails profesionales."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cómo funciona el pago?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tenés dos pagos: el setup inicial (una sola vez) y la mensualidad. Aceptamos transferencia bancaria y Mercado Pago. No hay contrato de permanencia, cancelás cuando quieras."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué pasa si no me gusta el sitio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tenés 30 días de garantía. Si no te convence, te devolvemos el 100% del setup. Sin preguntas ni letra chica."
          }
        }
      ]
    }
  ]
}

/* ── Data Constants ─────────────────────────────────────────────── */

type Template = {
  id: string
  name: string
  icon: LucideIcon
  leads: number
  pct: number
  color: string
  demoSlug?: string
}

const TEMPLATES: Template[] = [
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
]

const FEATURES = [
  { icon: Check, title: 'Todo incluido', desc: 'Diseño, textos, fotos, dominio .com.py, hosting y soporte. Vos solo nos mandás la info por WhatsApp.' },
  { icon: MessageCircle, title: 'WhatsApp directo', desc: 'Botón flotante en tu sitio. Tus clientes te escriben con un clic, sin formularios complicados.' },
  { icon: Globe, title: 'Dominio propio', desc: 'TuURL.com.py con certificado SSL incluido. También configuramos emails profesionales.' },
  { icon: Search, title: 'Aparecé en Google', desc: 'SEO optimizado para que tus clientes te encuentren cuando busquen tus servicios en Paraguay.' },
  { icon: Smartphone, title: 'Perfecto en celular', desc: 'El 80% de tus clientes te van a buscar desde el móvil. Tu sitio se ve impecable en cualquier pantalla.' },
  { icon: Layers, title: 'Diseño por rubro', desc: 'Cada negocio tiene una plantilla especializada. Peluquería ≠ Restaurante ≠ Gimnasio.' },
]

const STEPS = [
  { num: '01', title: 'Nos escribís por WhatsApp', desc: 'Nos contás el nombre de tu negocio, qué servicios ofrecés, tus precios y nos mandás algunas fotos.' },
  { num: '02', title: 'Te armamos tu sitio', desc: 'En 24-48 horas te mandamos el link de tu sitio listo. Lo revisás, pedís los ajustes que quieras.' },
  { num: '03', title: 'Publicamos y listo', desc: 'Te damos de alta en tu dominio .com.py con todo configurado. Después podés pedir cambios cuando quieras.' },
]

const TESTIMONIALS = [
  {
    name: 'Marcelo Ríos',
    role: 'Fundador',
    business: 'Nexa Paraguay',
    location: 'Asunción',
    quote: 'Necesitábamos un sitio profesional en 4 idiomas para clientes europeos. ParaguAI lo entregó en 48 horas sin que toquemos nada de código.',
    rating: 5,
  },
  {
    name: 'Dayah Benítez',
    role: 'Diseñadora',
    business: 'Dayah Litworks',
    location: 'Remoto',
    quote: 'Mi portafolio antes estaba solo en Instagram. Ahora los autores me ven como una profesional. Cerré 3 comisiones en el primer mes.',
    rating: 5,
  },
  {
    name: 'Iván Giménez',
    role: 'Chef',
    business: 'De Abasto a Casa',
    location: 'Asunción',
    quote: 'Mandé los datos un jueves y el lunes el sitio estaba online. Mis clientes reservan solos, dejé de perder pedidos en los grupos de WhatsApp.',
    rating: 5,
  },
]

const GUARANTEES = [
  { icon: PlayCircle, title: 'Ves antes de pagar', desc: 'Te armamos tu sitio demo gratis. Solo pagás si te gusta.' },
  { icon: RotateCcw, title: '30 días de garantía', desc: 'Si no te convence, te devolvemos el 100% del setup. Sin preguntas.' },
  { icon: Activity, title: 'Siempre online', desc: 'Infraestructura en Cloudflare + Supabase. 99.9% uptime garantizado.' },
  { icon: Unlock, title: 'Sin contrato', desc: 'Cancelás cuando quieras. Tu dominio es tuyo, te lo llevás.' },
]

const REAL_CLIENTS = [
  {
    name: 'Nexa Paraguay',
    tagline: 'Reubicación para europeos',
    vertical: 'Servicios · 4 idiomas',
    href: '/s/es/nexa-paraguay',
    color: '#1e3a5f',
  },
  {
    name: 'Nexa Propiedades',
    tagline: 'Inmobiliaria residencial',
    vertical: 'Real estate · 3 idiomas',
    href: '/s/es/nexa-propiedades',
    color: '#2d6a4f',
  },
  {
    name: 'Dayah Litworks',
    tagline: 'Diseño de tapas de libros',
    vertical: 'Portfolio · cobro en USD',
    href: '/dayah-litworks',
    color: '#c44569',
  },
  {
    name: 'De Abasto a Casa',
    tagline: 'Meal prep semanal',
    vertical: 'Comida · pedidos WhatsApp',
    href: '/de-abasto-a-casa',
    color: '#3a6b4a',
  },
]

const PLANS = [
  {
    name: 'Starter',
    setup: 'Gratis',
    monthly: null,
    period: 'por siempre',
    description: 'Para probar sin compromiso',
    features: [
      { text: 'Subdominio gratis (tunegocio.paragu-ai.com)', included: true },
      { text: 'Página única con tus datos', included: true },
      { text: 'Botón de WhatsApp', included: true },
      { text: 'Válido por 3 meses', included: true },
      { text: 'Dominio .com.py propio', included: false },
      { text: 'Cambios mensuales', included: false },
    ],
    cta: 'Empezar gratis',
    waMessage: 'Hola, quiero empezar con el plan Starter gratis.',
    popular: false,
  },
  {
    name: 'Profesional',
    setup: 'Gs 650.000',
    monthly: 'Gs 100.000',
    period: '/mes',
    description: 'Para negocios que quieren crecer',
    features: [
      { text: 'Dominio .com.py incluido 1 año', included: true },
      { text: 'Hasta 5 páginas', included: true },
      { text: 'Google Maps + SEO local', included: true },
      { text: 'Formulario de contacto', included: true },
      { text: '2 cambios mensuales', included: true },
      { text: 'Soporte por WhatsApp', included: true },
    ],
    cta: 'Elegir Profesional',
    waMessage: 'Hola, me interesa el plan Profesional (Gs 650.000 + Gs 100.000/mes).',
    popular: true,
  },
  {
    name: 'Negocio',
    setup: 'Gs 1.200.000',
    monthly: 'Gs 150.000',
    period: '/mes',
    description: 'Con reservas y catálogo',
    features: [
      { text: 'Todo lo del plan Profesional', included: true },
      { text: 'Sistema de reservas online', included: true },
      { text: 'Catálogo de hasta 20 productos', included: true },
      { text: 'Blog incluido', included: true },
      { text: '5 cambios mensuales', included: true },
      { text: 'Soporte prioritario', included: true },
    ],
    cta: 'Elegir Negocio',
    waMessage: 'Hola, me interesa el plan Negocio (Gs 1.200.000 + Gs 150.000/mes).',
    popular: false,
  },
]

const FAQS = [
  { question: '¿Cuánto tiempo tarda en estar listo mi sitio?', answer: 'Entre 24 y 48 horas desde que nos mandás los datos. Primero generamos el sitio automáticamente, después un editor humano lo revisa y optimiza antes de entregártelo.' },
  { question: '¿Necesito saber algo de tecnología?', answer: 'Nada. Nosotros hacemos todo: el diseño, los textos, las fotos, el dominio y la publicación. Vos solo nos mandás la info de tu negocio por WhatsApp y recibís el sitio listo para usar.' },
  { question: '¿Puedo ver mi sitio antes de pagar?', answer: 'Sí. En el plan Starter te armamos tu sitio gratis en un subdominio. Si te gusta, podés pasarte al plan Profesional con dominio propio. Si no, no pagás nada.' },
  { question: '¿Qué incluye el dominio .com.py?', answer: 'Incluimos el dominio gratis el primer año (por ejemplo: tunegocio.com.py). También configuramos el certificado SSL para que tu sitio sea seguro, y te ayudamos a crear emails profesionales.' },
  { question: '¿Cómo funciona el pago?', answer: 'Tenés dos pagos: el setup inicial (una sola vez) y la mensualidad. Aceptamos transferencia bancaria y Mercado Pago. No hay contrato de permanencia, cancelás cuando quieras.' },
  { question: '¿Puedo pedir cambios después?', answer: 'Sí. Según tu plan, tenés de 2 a 5 cambios mensuales incluidos. Son cambios de texto, fotos o precios. Pedís por WhatsApp y los hacemos en 24-48 horas.' },
  { question: '¿Y si ya tengo un dominio?', answer: 'Lo conectamos sin costo extra. También te ayudamos a migrar si tenés tu sitio en Wix, WordPress u otra plataforma.' },
  { question: '¿Qué pasa si no me gusta el sitio?', answer: 'Tenés 30 días de garantía. Si no te convence, te devolvemos el 100% del setup. Sin preguntas ni letra chica.' },
]


/* ── Helper Functions ───────────────────────────────────────────── */

function waLink(message: string): string {
  return `https://wa.me/595981324569?text=${encodeURIComponent(message)}`
}

/* ── Navigation Component ───────────────────────────────────────── */

function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/casos', label: 'Casos' },
    { href: '/p', label: 'Rubros' },
    { href: '/precios', label: 'Precios' },
    { href: '/demo', label: 'Demo' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-gray-200 bg-white/95 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white transition-transform group-hover:scale-110">
                <BrandMark width={20} height={20} />
              </div>
              <span className="text-lg font-bold">
                <span className="text-gray-900">Paragu</span>
                <span className="text-blue-600">AI</span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="hidden text-sm font-medium text-gray-600 hover:text-blue-600 md:block"
              >
                Acceso clientes
              </Link>
              <a
                href={waLink('Hola, quiero una demo gratis de mi sitio web.')}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg md:inline-flex md:items-center md:gap-2"
              >
                <MessageCircle size={16} />
                Demo gratis
              </a>
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menú"
                className="rounded-lg p-2 text-gray-700 md:hidden"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                <BrandMark width={20} height={20} />
              </div>
              <span className="text-lg font-bold">
                <span className="text-gray-900">Paragu</span>
                <span className="text-blue-600">AI</span>
              </span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú" className="rounded-lg p-2 text-gray-700">
              <XIcon size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-4 text-lg font-medium text-gray-900 hover:bg-gray-100"
              >
                {link.label}
              </a>
            ))}
            <a
              href={waLink('Hola, quiero una demo gratis de mi sitio web.')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-center text-lg font-semibold text-white"
            >
              <MessageCircle size={18} />
              Pedir demo gratis
            </a>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Main Page Component ────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG_DATA) }}
      />
      <Navigation />

      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative min-h-screen overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
            <FloatingShape className="top-20 right-20 h-[500px] w-[500px] bg-blue-200/30" delay={0} />
            <FloatingShape className="bottom-20 left-10 h-[400px] w-[400px] bg-teal-200/30" delay={1} />
          </div>

          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <FadeIn delay={0}>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 backdrop-blur-sm">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Más de 250 negocios en Paraguay ya tienen su sitio
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={150}>
                <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Tu negocio vendiendo{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    mientras dormís
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={300}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
                  Sitio web profesional en 48 horas. Todo incluido: diseño, dominio .com.py, 
                  SEO y WhatsApp. Vos solo nos mandás los datos, nosotros hacemos el resto.
                </p>
              </FadeIn>

              <FadeIn delay={450}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href={waLink('Hola, quiero una demo gratis de mi sitio web.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                  >
                    <MessageCircle size={20} />
                    Quiero mi demo gratis
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#clientes"
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600"
                  >
                    <PlayCircle size={20} />
                    Ver sitios reales
                  </a>
                </div>
              </FadeIn>

              <FadeIn delay={600}>
                <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 rounded-2xl border border-gray-100 bg-white/80 p-8 backdrop-blur-sm sm:grid-cols-4">
                  {[
                    { value: '250+', label: 'Sitios publicados' },
                    { value: '48h', label: 'Tiempo promedio' },
                    { value: '4.9★', label: 'Valoración' },
                    { value: '98%', label: 'Clientes felices' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-3xl font-bold text-blue-600 md:text-4xl">{stat.value}</p>
                      <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* ── Real Clients ───────────────────────────────────────── */}
        <section id="clientes" className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Negocios reales, sitios reales
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  No son plantillas vacías. Estos son negocios paraguayos que ya venden online.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {REAL_CLIENTS.map((client, idx) => (
                <FadeIn key={client.name} delay={idx * 100}>
                  <a
                    href={client.href}
                    className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div 
                      className="mb-4 h-2 w-16 rounded-full"
                      style={{ backgroundColor: client.color }}
                    />
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                      {client.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{client.tagline}</p>
                    <p className="mt-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      {client.vertical}
                    </p>
                  </a>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={400}>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
                <LogoStrip />
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* ── Templates ──────────────────────────────────────────── */}
        <section id="rubros" className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Diseños por tipo de negocio
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Cada rubro tiene un diseño especializado. Elegí el tuyo.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {TEMPLATES.filter(t => t.leads > 0 || t.demoSlug).map((template, idx) => (
                <FadeIn key={template.id} delay={idx * 50}>
                  <a
                    href={`/${template.demoSlug}`}
                    className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: template.color }}
                    >
                      <template.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {template.name}
                      </h3>
                      {template.leads > 0 && (
                        <p className="text-xs text-gray-500">
                          {template.leads.toLocaleString()} negocios en PY
                        </p>
                      )}
                    </div>
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                  </a>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* ── How it Works ───────────────────────────────────────── */}
        <section id="como-funciona" className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Así de simple
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Tres pasos y tu negocio está online. Sin tocar código.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-8 md:grid-cols-3">
              {STEPS.map((step, idx) => (
                <FadeIn key={step.num} delay={idx * 150}>
                  <div className="relative rounded-2xl border border-gray-200 bg-white p-8">
                    <span className="absolute -top-4 left-8 rounded-full bg-blue-600 px-4 py-1 text-sm font-bold text-white">
                      {step.num}
                    </span>
                    <h3 className="mb-3 mt-2 text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={500}>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {GUARANTEES.map((g) => (
                  <div key={g.title} className="flex items-start gap-3 rounded-xl bg-white p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <g.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{g.title}</h4>
                      <p className="text-sm text-gray-600">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* ── Features ───────────────────────────────────────────── */}
        <section className="py-20">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Todo lo que necesitás incluido
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Sin sorpresas, sin costos extras, sin letra chica.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, idx) => (
                <FadeIn key={feature.title} delay={idx * 100}>
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <feature.icon size={24} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Testimonials ───────────────────────────────────────── */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold md:text-4xl">
                  Lo que dicen nuestros clientes
                </h2>
              </div>
            </FadeIn>

            <div className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, idx) => (
                <FadeIn key={t.name} delay={idx * 150}>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-6 text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-white/70">{t.business}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Pricing ────────────────────────────────────────────── */}
        <section id="precios" className="py-20 bg-gray-50">
          <Container>
            <FadeIn>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Elegí tu plan
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Empezá gratis y escalá cuando tu negocio crezca.
                </p>
              </div>
            </FadeIn>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              {PLANS.map((plan, idx) => (
                <FadeIn key={plan.name} delay={idx * 100}>
                  <div className={`relative rounded-2xl border bg-white p-8 ${
                    plan.popular 
                      ? 'border-blue-600 shadow-xl ring-2 ring-blue-600' 
                      : 'border-gray-200'
                  }`}>
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                        Más elegido
                      </span>
                    )}
                    
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                    
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">{plan.setup}</span>
                      {plan.monthly && (
                        <div className="mt-1 text-sm text-gray-600">
                          + <span className="font-semibold">{plan.monthly}</span> {plan.period}
                        </div>
                      )}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f.text} className="flex items-start gap-3">
                          <Check size={18} className={f.included ? 'text-green-500' : 'text-gray-300'} />
                          <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={waLink(plan.waMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-8 block w-full rounded-xl py-3 text-center font-semibold transition-all ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-2 border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={400}>
              <div className="mt-12 text-center">
                <p className="text-gray-600">
                  ¿Necesitás algo más avanzado?{' '}
                  <a 
                    href={waLink('Hola, necesito un plan personalizado para mi negocio.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Hablamos por WhatsApp
                  </a>
                </p>
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section id="faq" className="py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <FadeIn>
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                    Preguntas frecuentes
                  </h2>
                </div>
              </FadeIn>

              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <FadeIn key={idx} delay={idx * 50}>
                    <FAQItem question={faq.question} answer={faq.answer} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── Final CTA ──────────────────────────────────────────── */}
        <section className="py-20 bg-gray-900 text-white">
          <Container>
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold md:text-4xl">
                  Tu negocio merece estar online
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                  Empezá gratis. Sin tarjeta, sin compromiso. Solo pagás si te gusta.
                </p>
                <a
                  href={waLink('Hola, quiero empezar con mi sitio web gratis.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold transition-all hover:bg-blue-700 hover:shadow-xl"
                >
                  <MessageCircle size={20} />
                  Empezar gratis por WhatsApp
                  <ArrowRight size={20} />
                </a>
              </div>
            </FadeIn>
          </Container>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <Container>
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                  <BrandMark width={16} height={16} />
                </div>
                <span className="font-bold">
                  <span className="text-gray-900">Paragu</span>
                  <span className="text-blue-600">AI</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-gray-600">
                Sitios web profesionales para negocios paraguayos. Hecho con 💙 en Asunción.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Producto</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/p" className="text-gray-600 hover:text-blue-600">Rubros</Link></li>
                <li><Link href="/precios" className="text-gray-600 hover:text-blue-600">Precios</Link></li>
                <li><Link href="/demo" className="text-gray-600 hover:text-blue-600">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Recursos</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/casos" className="text-gray-600 hover:text-blue-600">Casos</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link></li>
                <li><Link href="/seguridad" className="text-gray-600 hover:text-blue-600">Privacidad</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Contacto</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a 
                    href={waLink('Hola, tengo una consulta.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    WhatsApp
                  </a>
                </li>
                <li><Link href="/admin" className="text-gray-600 hover:text-blue-600">Acceso clientes</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ParaguAI. Todos los derechos reservados.
          </div>
        </Container>
      </footer>

      {/* ── Floating WhatsApp ────────────────────────────────────── */}
      <a
        href={waLink('Hola, quiero más información sobre ParaguAI.')}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </>
  )
}
