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
      exclude: [
        'node_modules/**',
        '.next/**',
        'tests/__fixtures__/**',
        'tests/__mocks__/**',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 40,
        statements: 50,
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
