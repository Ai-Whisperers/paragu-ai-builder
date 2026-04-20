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
const ContentSecurityPolicy = isDev
  ? `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.supabase.co https://*.cloudinary.com https://images.unsplash.com https://images.pexels.com https://placehold.co;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cloudflareinsights.com;
    frame-ancestors 'self';
  `
  : `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.supabase.co https://*.cloudinary.com https://images.unsplash.com https://images.pexels.com https://placehold.co;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cloudflareinsights.com;
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

/**
 * Performance Budget Configuration
 * Win 62: Add performance budget
 */
const performanceBudget = {
  // JavaScript bundle size limits (in bytes)
  javascript: {
    main: 250 * 1024,        // 250KB for main bundle
    vendor: 350 * 1024,      // 350KB for vendor chunk
    framework: 100 * 1024,   // 100KB for framework code
    total: 1024 * 1024,      // 1MB total JS budget
  },
  // CSS budget
  css: {
    total: 50 * 1024,       // 50KB for all CSS
  },
  // Image optimization
  images: {
    maxSize: 500 * 1024,      // 500KB max per image
    formats: ['image/avif', 'image/webp'],
  },
  // Build time budget
  buildTime: {
    maxSeconds: 300,          // 5 minutes max build time
  },
}

/**
 * Bundle Analyzer Configuration
 * Win 63: Bundle analyzer already configured via withBundleAnalyzer
 */
const bundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,      // Don't open browser automatically in CI
  analyzerMode: 'static',     // Generate static HTML report
  reportFilename: 'bundle-analysis.html',
  generateStatsFile: true,
  statsFilename: 'bundle-stats.json',
}

const nextConfig = {
  // Simple standalone output 
  output: 'standalone',
  outputFileTracing: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance budget reference (for documentation)
  // Actual enforcement happens via CI checks
  performanceBudget,

  // Use Turbopack (default in Next.js 16)
  // Empty config to enable it explicitly
  turbopack: {},

  // Disable trailing slash to match catch-all route behavior
  trailingSlash: false,

  // Ensure / is pre-rendered
  dynamicParams: 'force-static',

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

  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
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
