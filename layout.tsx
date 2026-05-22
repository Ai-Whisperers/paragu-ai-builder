import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import { HOME_PLANS_SCHEMA, HOME_REVIEWS } from '@/lib/landing/home-data'
import { WebVitalsReporter } from '@/components/analytics/web-vitals-reporter'
import { SkipToContent } from '@/components/ui/skip-to-content'
import { isLocale, LOCALE_HTML_LANG } from '@/lib/i18n/config'
import { rootFontVariables } from '@/lib/fonts'

// Extract the tenant locale from `/s/<locale>/<site>/...` paths so the
// `<html lang>` attribute is correct per-request. Without this, every
// tenant page (including /s/en/... and /s/de/...) was rendered with
// `lang="es"` — a direct Lighthouse SEO audit failure.
async function resolveHtmlLang(): Promise<string> {
  try {
    const h = await headers()
    const path = h.get('x-pathname') || ''
    const match = path.match(/^\/s\/([^/]+)\//)
    if (match && isLocale(match[1])) {
      return LOCALE_HTML_LANG[match[1]]
    }
  } catch {
    // headers() can throw outside a request context (static metadata gen).
  }
  return 'es' // Default: the ParaguAI landing is Spanish-first (Paraguay).
}

export const metadata: Metadata = {
  metadataBase: new URL('https://paragu-ai.com'),
  title: {
    default: 'ParaguAI Builder — Sitio web profesional en 48 horas, todo incluido (Paraguay)',
    template: '%s | ParaguAI Builder',
  },
  description:
    'Sitios web profesionales para negocios paraguayos en 48 horas. Todo incluido: diseño, dominio .com.py, SEO, WhatsApp y hosting. Demo gratis antes de pagar. 4 planes desde Gs 650.000.',
  keywords: ['sitios web Paraguay', 'diseño web Asunción', 'página web negocio', 'dominio .com.py', 'web peluquería', 'web spa', 'web restaurante', 'Mercado Pago', 'ParaguAI'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1A1A2E' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    url: 'https://paragu-ai.com',
    siteName: 'ParaguAI Builder',
    title: 'ParaguAI Builder — Sitios Web con IA para Negocios',
    description: 'Motor de generación con IA que crea sitios web profesionales, rápidos y optimizados para cualquier tipo de negocio en Paraguay.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'ParaguAI Builder — Sitios web profesionales en 48 horas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParaguAI Builder',
    description: 'Sitios web profesionales con IA para negocios en Paraguay',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const htmlLang = await resolveHtmlLang()
  return (
    <html lang={htmlLang} className={rootFontVariables}>
      <head>
        {/*
          Preconnect hints for Google Fonts. Tenant pages load per-site
          Playfair/Inter/etc. via a `<link rel="stylesheet"
          href="https://fonts.googleapis.com/...">` — that's render-blocking
          and discovered late. Pre-warming the DNS + TLS + HTTP handshake
          shaves 100–250ms off FCP/LCP for first-time visitors.
          `fonts.gstatic.com` serves the actual font files and MUST be
          crossorigin (browsers treat font requests as CORS).
        */}
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
              areaServed: { '@type': 'Country', name: 'Paraguay' },
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
      <body className="antialiased">
        <SkipToContent />
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  )
}
