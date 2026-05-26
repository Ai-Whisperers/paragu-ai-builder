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
  Egg, Building2, BarChart3, Calculator,
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
              "name": "Diagnóstico"
            },
            "price": "0",
            "priceCurrency": "PYG",
            "description": "Diagnóstico + demo estratégica por WhatsApp"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Autónomo"
            },
            "price": "650000",
            "priceCurrency": "PYG",
            "description": "Sitio desde template con asistente IA. Dominio .com.py, SSL, WhatsApp, SEO."
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Profesional"
            },
            "price": "1200000",
            "priceCurrency": "PYG",
            "description": "Sitio personalizado con IA contextual, blog SEO, features a medida."
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Empresa"
            },
            "price": "2000000",
            "priceCurrency": "PYG",
            "description": "CRM, automatizaciones, multi-sucursal, landing pages, soporte same-day."
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
            "text": "Entre 24 y 48 horas desde que elegís tu plan. Te clonamos un template exitoso o te diseñamos algo desde cero, según el plan. Recibís el sitio funcionando con tu asistente IA incluido."
          }
        },
        {
          "@type": "Question",
          "name": "¿Necesito saber algo de tecnología?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nada. Tu sitio viene con un asistente IA entrenado con tu negocio. Le pedís cambios de texto, fotos o precios y la IA lo hace. Para cambios complejos, nosotros te ayudamos."
          }
        },
        {
          "@type": "Question",
          "name": "¿Puedo ver algo antes de contratar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí. Empezamos con diagnóstico gratis por WhatsApp. Te mostramos cómo quedaría tu sitio con IA y decidís después sin compromiso."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué incluye el dominio .com.py?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Incluimos el dominio gratis el primer año. También configuramos SSL, emails profesionales y todo lo técnico sin costo extra."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cómo funciona el pago?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sin entrada. Solo pagás la mensualidad. Aceptamos transferencia bancaria y Mercado Pago. Cancelás cuando quieras, sin contrato de permanencia."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué pasa si no me gusta el sitio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tenés 30 días de garantía. Si no te convence, cancelás y no pagás más. Sin preguntas ni letra chica."
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
  demoUrl?: string
}

const TEMPLATES: Template[] = [
  { id: 'peluqueria', name: 'Peluquería', icon: Scissors, leads: 2393, pct: 81, color: '#b76e79', demoUrl: 'https://magnolia-peluqueria.paragu-ai.com' },
  { id: 'salon_belleza', name: 'Salón de Belleza', icon: Sparkles, leads: 1210, pct: 75, color: '#d4a574', demoUrl: 'https://mantraspa.paragu-ai.com' },
  { id: 'gimnasio', name: 'Gimnasio / Fitness', icon: Dumbbell, leads: 1087, pct: 72, color: '#2d6a4f', demoUrl: 'https://bichosgym.paragu-ai.com' },
  { id: 'spa', name: 'Spa & Wellness', icon: Flower2, leads: 927, pct: 76, color: '#7c9885', demoUrl: 'https://mantraspa.paragu-ai.com' },
  { id: 'barberia', name: 'Barbería', icon: User, leads: 778, pct: 77, color: '#8b6914' },
  { id: 'unas', name: 'Uñas', icon: Hand, leads: 488, pct: 75, color: '#c77dba' },
  { id: 'tatuajes', name: 'Tatuajes & Piercing', icon: PenTool, leads: 272, pct: 70, color: '#1a1a2e', demoUrl: 'https://jotaink.paragu-ai.com' },
  { id: 'estetica', name: 'Estética / Facial', icon: Sparkles, leads: 137, pct: 77, color: '#9b7cb8' },
  { id: 'diseno_grafico', name: 'Diseño Gráfico', icon: Palette, leads: 100, pct: 80, color: '#c44569', demoUrl: 'https://dayah.paragu-ai.com' },
  { id: 'pestanas', name: 'Pestañas y Cejas', icon: Eye, leads: 49, pct: 76, color: '#6c5ce7' },
  { id: 'depilacion', name: 'Depilación', icon: Zap, leads: 20, pct: 78, color: '#e17055', demoUrl: 'https://depiflash.paragu-ai.com' },
  { id: 'relocation', name: 'Reubicación', icon: Globe, leads: 0, pct: 0, color: '#1e3a5f', demoUrl: 'https://nexa.paragu-ai.com' },
  { id: 'real_estate', name: 'Inmobiliaria', icon: Building2, leads: 0, pct: 0, color: '#2d6a4f' },
  { id: 'meal_prep', name: 'Meal Prep & Compras', icon: ShoppingCart, leads: 0, pct: 0, color: '#3a6b4a' },
  { id: 'egg_farm', name: 'Granja / Huevos', icon: Egg, leads: 0, pct: 0, color: '#c89b3c' },
  { id: 'data_analytics_consulting', name: 'Consultoría Datos', icon: BarChart3, leads: 0, pct: 0, color: '#0f4c81' },
  { id: 'contador', name: 'Contador / Estudio Contable', icon: Calculator, leads: 0, pct: 0, color: '#1e5f3a' },
  { id: 'restaurant', name: 'Restaurante', icon: UtensilsCrossed, leads: 0, pct: 0, color: '#8B4513' },
  { id: 'sushi_bar', name: 'Sushi Bar', icon: Fish, leads: 0, pct: 0, color: '#1A1A1A' },
  { id: 'kaiten_zushi', name: 'Sushi Cinta', icon: CircleDot, leads: 0, pct: 0, color: '#2196F3' },
]

const FEATURES = [
  { icon: Search, title: 'Aparece en Google', desc: 'Cuando alguien busca "peluquería Asunción" o "gimnasio cerca", tu negocio aparece. Sin publicidad.' },
  { icon: MessageCircle, title: 'Leads por WhatsApp', desc: 'Cada visitante puede escribirte directo desde el celular. Sin formularios, sin perder clientes.' },
  { icon: BarChart3, title: 'Sabés cuántos te visitan', desc: 'Dashboard semanal: visitas, consultas, reservas. Datos reales, no intuición.' },
  { icon: Layers, title: 'Diseño por rubro', desc: 'Cada negocio tiene un diseño especializado. Peluquería ≠ Restaurante ≠ Gimnasio.' },
  { icon: Globe, title: 'Dominio propio .com.py', desc: 'Tu marca en la dirección del negocio. Incluye SSL, emails profesionales y todo configurado.' },
  { icon: Smartphone, title: 'Impecable en celular', desc: 'El 85% de tus clientes buscan desde el móvil. Tu sitio se ve impecable en cualquier pantalla.' },
]

const STEPS = [
  { num: '01', title: 'Nos escribís por WhatsApp', desc: 'Nos contás el nombre de tu negocio, qué servicios ofrecés, tus precios y nos mandás algunas fotos.' },
  { num: '02', title: 'Tu sitio + tu IA', desc: 'En 24-48 horas te mandamos el link de tu sitio funcionando con tu asistente IA entrenado en tu negocio. Revisás, pedís ajustes, y cuando te guste lo publicamos.' },
  { num: '03', title: 'Manejás con IA', desc: 'Te damos de alta en tu dominio .com.py con todo configurado. A partir de ahí manejás el contenido vos mismo con tu asistente IA: cambiás textos, fotos, precios sin pedir permiso.' },
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
    name: 'Magnolia',
    role: 'Dueña',
    business: 'Magnolia Peluquería',
    location: 'Asunción',
    quote: 'Ahora cuando alguien busca peluquería en Asunción, mi sitio aparece primero. Las clientas me escriben directo por WhatsApp desde el celular. Nunca imaginé que tener página web fuera tan fácil.',
    rating: 5,
  },
]

const GUARANTEES = [
  { icon: PlayCircle, title: 'Ves antes de pagar', desc: 'Te armamos tu sitio demo gratis. Solo pagás si te gusta.' },
  { icon: RotateCcw, title: '30 días de garantía', desc: 'Si no te convence, cancelás y no pagás más. Sin preguntas.' },
  { icon: Activity, title: 'Siempre online', desc: 'Infraestructura en Cloudflare + Supabase. 99.9% uptime garantizado.' },
  { icon: Unlock, title: 'Sin contrato', desc: 'Cancelás cuando quieras. Tu dominio es tuyo, te lo llevás.' },
]

const REAL_CLIENTS = [
  {
    name: 'Magnolia Peluquería',
    tagline: 'Cortes y coloración profesional',
    vertical: 'Peluquería · Asunción',
    href: 'https://magnolia-peluqueria.paragu-ai.com',
    color: '#b76e79',
  },
  {
    name: 'Mantra Spa',
    tagline: 'Masajes y tratamientos faciales',
    vertical: 'Spa & Wellness · Asunción',
    href: 'https://mantraspa.paragu-ai.com',
    color: '#7c9885',
  },
  {
    name: 'Bichos Gym',
    tagline: 'Entrenamiento funcional',
    vertical: 'Gimnasio · Asunción',
    href: 'https://bichosgym.paragu-ai.com',
    color: '#2d6a4f',
  },
  {
    name: 'Jota Ink Tattoo',
    tagline: 'Tatuajes personalizados',
    vertical: 'Tatuajes · Asunción',
    href: 'https://jotaink.paragu-ai.com',
    color: '#1a1a2e',
  },
  {
    name: 'DepiFlash',
    tagline: 'Depilación láser a domicilio',
    vertical: 'Depilación · Paraguay',
    href: 'https://depiflash.paragu-ai.com',
    color: '#e17055',
  },
  {
    name: 'Dayah Litworks',
    tagline: 'Diseño de tapas de libros',
    vertical: 'Portfolio · Remoto',
    href: 'https://dayah.paragu-ai.com',
    color: '#c44569',
  },
  {
    name: 'Nexa Paraguay',
    tagline: 'Reubicación para europeos',
    vertical: 'Servicios · 4 idiomas',
    href: 'https://nexa.paragu-ai.com',
    color: '#1e3a5f',
  },
  {
    name: 'El Viajero',
    tagline: 'Tienda de regalos y souvenirs',
    vertical: 'Retail · CdE',
    href: 'https://tiendaelviajero.com.py',
    color: '#2563eb',
  },
  {
    name: 'Trentina',
    tagline: 'Cerveza artesanal paraguaya',
    vertical: 'Cervecería · Santa Rita',
    href: 'https://trentina.paragu-ai.com',
    color: '#d97706',
  },
  {
    name: 'Reina de Copas',
    tagline: 'Copas menstruales ecológicas',
    vertical: 'Salud · Paraguay',
    href: 'https://reina-de-copas.paragu-ai.com',
    color: '#ec4899',
  },
  {
    name: 'El Gato Siamés',
    tagline: 'Stand up paraguayo',
    vertical: 'Entretenimiento · Asunción',
    href: 'https://elgatosiames.paragu-ai.com',
    color: '#6366f1',
  },
]

const PLANS = [
  {
    name: 'Diagnóstico',
    setup: 'Gratis',
    monthly: null,
    period: 'sin compromiso',
    description: 'Analizamos tu negocio y te mostramos cómo sería tu sitio con IA',
    features: [
      { text: 'Análisis de tu negocio y competencia local', included: true },
      { text: 'Demo de tu futuro sitio funcionando', included: true },
      { text: 'Recomendación de plan según tus objetivos', included: true },
      { text: 'Sin tarjeta, sin contrato', included: true },
      { text: 'Tu propio dominio .com.py', included: false },
      { text: 'Tu asistente IA para manejar el contenido', included: false },
    ],
    cta: 'Pedir diagnóstico gratis',
    waMessage: 'Hola, quiero pedir el diagnóstico gratis para mi negocio.',
    popular: false,
  },
  {
    name: 'Autónomo',
    setup: '0',
    monthly: 'Gs 650.000',
    period: '/mes',
    description: 'Tu sitio clonado de un template exitoso. Lo manejás con tu IA.',
    features: [
      { text: 'Sitio profesional basado en template (hasta 5 páginas)', included: true },
      { text: 'Dominio .com.py + hosting + SSL', included: true },
      { text: 'WhatsApp integrado + formulario de contacto', included: true },
      { text: 'Asistente IA entrenado con TU negocio para autogestionar contenido', included: true },
      { text: 'SEO local + ficha Google Business', included: true },
      { text: 'Reporte mensual de visitas y leads', included: true },
      { text: 'Soporte técnico incluido', included: true },
      { text: 'Cambios y arreglos por IA (sin costo)', included: true },
      { text: 'Funcionalidades nuevas o arreglos complejos', included: false, extra: 'consultar precio' },
    ],
    cta: 'Elegir Autónomo',
    waMessage: 'Hola, me interesa el plan Autónomo (0 setup + Gs 650.000/mes). Cuentenme más.',
    popular: true,
  },
  {
    name: 'Profesional',
    setup: '0',
    monthly: 'Gs 1.200.000',
    period: '/mes',
    description: 'Sitio personalizado desde cero con IA contextual y features a medida.',
    features: [
      { text: 'Todo lo del plan Autónomo', included: true },
      { text: 'Sitio diseñado desde cero para tu negocio (no template)', included: true },
      { text: 'IA entrenada con todo el contexto de tu negocio', included: true },
      { text: 'Blog + contenidos SEO mensuales', included: true },
      { text: 'Funcionalidades nuevas creadas a tu medida', included: true },
      { text: 'Panel de leads y conversiones', included: true },
      { text: 'Soporte prioritario + sesión estratégica mensual', included: true },
      { text: '6 actualizaciones por mes', included: true },
    ],
    cta: 'Elegir Profesional',
    waMessage: 'Hola, me interesa el plan Profesional (0 setup + Gs 1.200.000/mes). ¿Podemos hablar?',
    popular: false,
  },
  {
    name: 'Empresa',
    setup: '0',
    monthly: 'Gs 2.000.000',
    period: '/mes',
    description: 'Sistema completo para negocios con múltiples sucursales y operaciones.',
    features: [
      { text: 'Todo lo del plan Profesional', included: true },
      { text: 'Múltiples sucursales o ubicaciones', included: true },
      { text: 'CRM + automatizaciones y flujos de seguimiento', included: true },
      { text: 'Landing pages para campañas pagas', included: true },
      { text: 'Optimización quincenal de conversión', included: true },
      { text: 'Soporte same-day + asesor dedicado', included: true },
    ],
    cta: 'Elegir Empresa',
    waMessage: 'Hola, me interesa el plan Empresa (0 setup + Gs 2.000.000/mes). ¿Podemos agendar una llamada?',
    popular: false,
  },
]

const FAQS = [
  { question: '¿Cuánto tiempo tarda en estar listo mi sitio?', answer: 'Entre 24 y 48 horas desde que elegís tu plan. Te clonamos un template exitoso o te diseñamos algo desde cero, según el plan.' },
  { question: '¿Necesito saber algo de tecnología?', answer: 'Nada. Tu sitio viene con un asistente IA entrenado con tu negocio. Le pedís cambios de texto, fotos o precios y la IA lo hace automáticamente. Si necesitás algo más complejo, nosotros lo creamos.' },
  { question: '¿Cómo funciona lo de la IA?', answer: 'Te damos acceso a un chat con tu propio asistente IA que conoce tu negocio. Le decís "cambiá el precio de la peluquería a 50.000" o "agregá una foto nueva" y él lo hace. No necesitás saber de código ni pedirnos permiso.' },
  { question: '¿Y si la IA no puede hacer lo que necesito?', answer: 'Ahí entramos nosotros. Si necesitás una funcionalidad nueva o la IA no entiende algo, te lo resolvemos. Eso puede tener un costo extra si es un cambio grande, pero los cambios normales los hace la IA sin cargo.' },
  { question: '¿Puedo ver algo antes de contratar?', answer: 'Sí. Empezamos con diagnóstico gratis por WhatsApp. Te mostramos cómo quedaría tu sitio con IA y decidís después.' },
  { question: '¿Qué incluye el dominio .com.py?', answer: 'Incluimos el dominio gratis el primer año. También configuramos SSL, emails profesionales y todo lo técnico.' },
  { question: '¿Cómo funciona el pago?', answer: 'Sin entrada. Solo pagás la mensualidad. Aceptamos transferencia bancaria y Mercado Pago. Cancelás cuando quieras, sin contrato.' },
  { question: '¿Qué pasa si no me gusta?', answer: 'Tenés 30 días de garantía. Si no te convence, cancelás y no pagás más. Sin preguntas.' },
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
    { href: '/', label: 'Inicio' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/metodo', label: 'Cómo funciona' },
    { href: '/precios', label: 'Precios' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/changelog', label: 'Novedades' },
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
                <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                  Tu negocio crece{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    mientras dormís
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={300}>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
                  Tu sitio web en 48 horas con inteligencia artificial para que lo manejés solo.
                  Aparecés en Google, recibís consultas por WhatsApp y sabés cuántos te visitan.
                  Sin entrada, Gs 650.000/mes.
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
                    href={template.demoUrl || (template.demoSlug ? `/${template.demoSlug}` : waLink(`Hola, quiero un sitio web para mi negocio de ${template.name.toLowerCase()}.`))}
                    target={template.demoUrl ? '_blank' : undefined}
                    rel={template.demoUrl ? 'noopener noreferrer' : undefined}
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
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.setup === '0' ? 'Sin entrada' : plan.setup === 'Gratis' ? 'Gratis' : plan.setup}
                      </span>
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
                <li><Link href="/metodo" className="text-gray-600 hover:text-blue-600">Cómo funciona</Link></li>
                <li><Link href="/precios" className="text-gray-600 hover:text-blue-600">Precios</Link></li>
                <li><Link href="/clientes" className="text-gray-600 hover:text-blue-600">Clientes</Link></li>
                <li><Link href="/changelog" className="text-gray-600 hover:text-blue-600">Novedades</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Recursos</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link></li>
                <li><Link href="/contacto" className="text-gray-600 hover:text-blue-600">Contacto</Link></li>
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
