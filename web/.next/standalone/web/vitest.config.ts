/**
 * Vitest Configuration
 * Adapted from Vete (ai-whisperers/vete).
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { config as loadDotenv } from 'dotenv'
import { existsSync } from 'fs'

const envTestPath = resolve(__dirname, '.env.test')
const envLocalPath = resolve(__dirname, '.env.local')
const envPath = resolve(__dirname, '.env')

if (existsSync(envTestPath)) {
  loadDotenv({ path: envTestPath })
} else if (existsSync(envLocalPath)) {
  loadDotenv({ path: envLocalPath })
} else if (existsSync(envPath)) {
  loadDotenv({ path: envPath })
}

export default defineConfig(() => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/src': resolve(__dirname, '../src'),
      'server-only': resolve(__dirname, './tests/__mocks__/server-only.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8' as const,
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Scope coverage to the modules we actively test. UI components and
      // Next.js app routes are exercised by E2E/Playwright instead, so they
      // should not skew this gate.
      include: [
        'lib/engine/compose.ts',
        'lib/engine/compose-site.ts',
        'lib/engine/resolve-copy.ts',
        'lib/engine/section-registry.ts',
        'lib/engine/data-loader.ts',
        'lib/engine/renderer.tsx',
        'lib/generation/validate.ts',
        'lib/generation/log-event.ts',
        'lib/integrations/**/*.ts',
        'lib/logger.ts',
      ],
      exclude: [
        'node_modules/**',
        '.next/**',
        '.open-next/**',
        '.vercel/**',
        'tests/__fixtures__/**',
        'tests/__mocks__/**',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      // Floor thresholds — current coverage. Ratchet these up as the suite
      // grows; never lower them except in a dedicated PR with justification.
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 40,
        statements: 55,
      },
    },
    testTimeout: 10000,
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['node_modules/**', 'e2e/**', '.next/**'],
    reporters: ['verbose'],
    pool: 'forks',
    forks: { singleFork: true },
    isolate: true,
    maxConcurrency: 1,
    sequence: { shuffle: false },
    retry: 1,
    watch: false,
  },
}))
