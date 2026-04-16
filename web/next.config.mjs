/**
 * Next.js Configuration
 * Adapted from Vete (ai-whisperers/vete) - security headers + optimizations.
 * @type {import('next').NextConfig}
 */

const isDev = process.env.NODE_ENV === 'development'

/**
 * Content Security Policy
 * Development: Allow 'unsafe-eval' for Next.js HMR
 * Production: Strict CSP
 */
const ContentSecurityPolicy = isDev
  ? `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://*.cloudinary.com https://images.unsplash.com https://images.pexels.com https://placehold.co;
    font-src 'self';
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    frame-ancestors 'self';
  `
  : `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://*.cloudinary.com https://images.unsplash.com https://images.pexels.com https://placehold.co;
    font-src 'self';
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
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
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          maxSize: 512000,
          minSize: 100000,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/](react|react-dom|lucide-react|clsx)[\\/]/,
              name: 'core-vendor',
              chunks: 'all',
              priority: 20,
            },
            dataLibs: {
              test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
              name: 'data-libs',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      }
    }

    return config
  },

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
  },
}

export default nextConfig
