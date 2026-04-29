/**
 * Next.js Configuration
 * Adapted from Vete (ai-whisperers/vete) - security headers + optimizations.
 * @type {import('next').NextConfig}
 */

import withBundleAnalyzer from '@next/bundle-analyzer'

const isDev = process.env.NODE_ENV === 'development'
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
  reportFilename: 'bundle-analysis.html',
})

/**
 * Content Security Policy
 * Development: Allow 'unsafe-eval' for Next.js HMR
 * Production: Strict CSP
 */
// GA4 + generic Google Tag needs googletagmanager.com (script host) and
// google-analytics.com (beacon + img tracking pixel). Drop tenants' media
// hosts in too so WhatsApp shares embed OG images cleanly.
const ContentSecurityPolicy = isDev
  ? `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.supabase.co https://*.cloudinary.com https://images.unsplash.com https://images.pexels.com https://placehold.co https://www.google-analytics.com https://www.googletagmanager.com https://www.superspuma.com.py https://maps.googleapis.com https://lh3.googleusercontent.com https://*.googleusercontent.com https://*.scdn.co;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cloudflareinsights.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com;
    frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://calendly.com;
    frame-ancestors 'self';
  `
  : `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.supabase.co https://*.cloudinary.com https://images.unsplash.com https://images.pexels.com https://placehold.co https://www.google-analytics.com https://www.googletagmanager.com https://www.superspuma.com.py https://maps.googleapis.com https://lh3.googleusercontent.com https://*.googleusercontent.com https://*.scdn.co;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cloudflareinsights.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com;
    frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://calendly.com;
    frame-ancestors 'self';
  `

/**
 * Security headers (ported from Vete ARCH-024)
 */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim(),
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig = {
  // Simple standalone output
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  // Use Turbopack (default in Next.js 16)
  // Empty config to enable it explicitly
  turbopack: {},

  // Disable trailing slash to match catch-all route behavior
  trailingSlash: false,
  // Don't use filesystem for public routes — prevents Next.js 16 locale
  // directories (s/en/, s/es/) from shadowing the [locale] dynamic segment.
  skipMiddlewareUrlNormalize: true,
  useFileSystemPublicRoutes: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/**' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      // Tenant-owned assets — referenced from their production WordPress / CDN.
      // Hot-linked during demo; swap to our CDN once they sign.
      { protocol: 'https', hostname: 'www.superspuma.com.py', pathname: '/wp-content/uploads/**' },
      { protocol: 'https', hostname: 'maps.googleapis.com', pathname: '/maps/api/place/photo/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    // Disable image optimization in self-hosted Docker (Sharp native module
    // is unreliable cross-platform). Images from allowed remotePatterns
    // still render via direct <img> tags.
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: false,
  },

  async redirects() {
    return [
      // fun4me: /store was the legacy catalog-embed page; /tienda is the real
      // store with full search + filters. Redirect permanently so any
      // bookmark / search-engine link lands on the right URL.
      {
        source: '/fun4me/store',
        destination: '/fun4me/tienda',
        permanent: true,
      },
      // Canonical locale-prefixed version too.
      {
        source: '/s/:locale/fun4me/store',
        destination: '/s/:locale/fun4me/tienda',
        permanent: true,
      },
      // Dayah LitWorks: /portafolio and /blog pages were removed (catalogo
      // covers the portfolio need, and blog was placeholder-only). Redirect
      // inbound links to pages that actually have content.
      {
        source: '/s/:locale/dayah-litworks/portafolio',
        destination: '/s/:locale/dayah-litworks/catalogo',
        permanent: true,
      },
      {
        source: '/s/:locale/dayah-litworks/blog',
        destination: '/s/:locale/dayah-litworks/contacto',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },

      // Admin + auth: never cache (private session-bound responses).
      {
        source: '/admin/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },
      {
        source: '/auth/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },
      {
        source: '/login',
        headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
      },

      // Sitemap + robots: short browser cache, longer CDN cache.
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }],
      },
      {
        source: '/robots.txt',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }],
      },

      // OG / favicon images: long-lived, content-hashed.
      {
        source: '/(.*)/opengraph-image',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000' }],
      },
      {
        source: '/favicon.:ext(ico|png|svg)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800' }],
      },
    ]
  },

  reactCompiler: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
    ],
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu/**',
        'node_modules/@next/swc-linux-x64-gnu/**',
        'node_modules/caniuse-lite/**',
        'node_modules/typescript/**',
      ],
    },
  },

  // Compress output
  compress: true,

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

export default withAnalyzer(nextConfig)
