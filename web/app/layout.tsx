import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://paragu-ai.com'),
  title: {
    default: 'ParaguAI Builder — Sitios Web para Belleza y Bienestar en Paraguay',
    template: '%s | ParaguAI Builder',
  },
  description:
    'Motor de generación con IA que crea sitios web profesionales para peluquerías, spas, gimnasios y negocios de belleza en Paraguay. 11 plantillas especializadas.',
  keywords: ['sitios web', 'IA', 'Paraguay', 'belleza', 'bienestar', 'peluquería', 'spa', 'gimnasio', 'generador web'],
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    url: 'https://paragu-ai.com',
    siteName: 'ParaguAI Builder',
    title: 'ParaguAI Builder — Sitios Web con IA para Negocios',
    description: 'Motor de generación con IA que crea sitios web profesionales, rápidos y optimizados para cualquier tipo de negocio en Paraguay.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ParaguAI Builder - Sitios Web con IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParaguAI Builder',
    description: 'Sitios web profesionales con IA para negocios en Paraguay',
    images: ['/og-image.png'],
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
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
