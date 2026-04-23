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
    img-src 'self' blob: data: https://*.supabase.co https://*.cloudinary.com https://images.unsplash.com https://images.pexels.com https://placehold.co https://www.google-analytics.com https://www.googletagmanager.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cloudflareinsights.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com;
    frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://calendly.com;
    frame-ancestors 'self';
  `
  : `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.supabase.co https://*.cloudinary.com https://images.unsplash.com https://images.pexels.com https://placehold.co https://www.google-analytics.com https://www.googletagmanager.com;
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

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/**' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
    formats: ['image/avif', 'image/webp'],
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

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable tree shaking and optimization
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
    ],
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
