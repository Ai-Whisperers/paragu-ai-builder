import type { Metadata } from 'next'
import './globals.css'
import { HOME_FAQS, HOME_PLANS_SCHEMA, HOME_REVIEWS } from '@/lib/landing/home-data'

export const metadata: Metadata = {
  metadataBase: new URL('https://paragu-ai.com'),
  title: {
    default: 'ParaguAI Builder — Sitio web profesional en 48 horas, todo incluido (Paraguay)',
    template: '%s | ParaguAI Builder',
  },
  description:
    'Sitios web profesionales para negocios paraguayos en 48 horas. Todo incluido: diseño, dominio .com.py, SEO, WhatsApp y hosting. Demo gratis antes de pagar. 4 planes desde Gs 650.000.',
  keywords: ['sitios web Paraguay', 'diseño web Asunción', 'página web negocio', 'dominio .com.py', 'web peluquería', 'web spa', 'web restaurante', 'Mercado Pago', 'ParaguAI'],
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    url: 'https://paragu-ai.com',
    siteName: 'ParaguAI Builder',
    title: 'ParaguAI Builder — Sitios Web con IA para Negocios',
    description: 'Motor de generación con IA que crea sitios web profesionales, rápidos y optimizados para cualquier tipo de negocio en Paraguay.',
    // Image is provided by app/opengraph-image.tsx (dynamic via next/og).
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParaguAI Builder',
    description: 'Sitios web profesionales con IA para negocios en Paraguay',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ParaguAI Builder',
              url: 'https://paragu-ai.com',
              logo: 'https://paragu-ai.com/logo.png',
              description: 'Motor de generación de sitios web con IA para negocios en Paraguay',
              areaServed: {
                '@type': 'Country',
                name: 'Paraguay',
              },
              serviceType: 'Website Builder',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ParaguAI Builder',
              url: 'https://paragu-ai.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://paragu-ai.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: HOME_FAQS.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'ParaguAI Builder — Sitios web profesionales para negocios en Paraguay',
              description:
                'Sitios web completos con diseño, dominio .com.py, SEO, WhatsApp Business y hosting incluidos. Entrega en 48 horas.',
              brand: { '@type': 'Brand', name: 'ParaguAI' },
              offers: HOME_PLANS_SCHEMA.map((p) => ({
                '@type': 'Offer',
                name: p.name,
                price: p.setup,
                priceCurrency: 'PYG',
                description: `Setup único Gs ${p.setup.toLocaleString('es-PY')} + Gs ${p.monthly.toLocaleString('es-PY')} / mes`,
                availability: 'https://schema.org/InStock',
                url: 'https://paragu-ai.com/#precios',
              })),
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: HOME_REVIEWS.length,
                bestRating: '5',
              },
              review: HOME_REVIEWS.map((r) => ({
                '@type': 'Review',
                author: { '@type': 'Organization', name: r.author },
                reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
                reviewBody: r.body,
              })),
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
