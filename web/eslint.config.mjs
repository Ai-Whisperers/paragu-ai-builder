import nextConfig from 'eslint-config-next'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.vercel/**',
      'coverage/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'out/**',
    ],
  },
  ...nextConfig,
  ...coreWebVitals,
  ...typescript,

  // Runtime code must use @/lib/logger — never raw console.*.
  // Scope-restricted so scripts/**, tests/**, and the logger itself can still
  // call console as needed.
  {
    files: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'middleware.ts'],
    ignores: ['lib/obs/logger.ts'],
    rules: {
      'no-console': 'error',
    },
  },

  // Section / landing components must use the <Heading> primitive — never
  // raw <h1>/<h2>/<h3>. The primitive owns font-family + responsive scale.
  // All existing violations were migrated on 2026-04-20; this is now
  // enforced as an ERROR to prevent regressions.
  {
    files: ['components/sections/**/*.{ts,tsx}', 'components/landing/**/*.{ts,tsx}'],
    ignores: ['components/ui/heading.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXOpeningElement[name.name='h1']",
          message: 'Use <Heading level={1}> from @/components/ui/heading instead of raw <h1>.',
        },
        {
          selector: "JSXOpeningElement[name.name='h2']",
          message: 'Use <Heading level={2}> instead of raw <h2>.',
        },
        {
          selector: "JSXOpeningElement[name.name='h3']",
          message: 'Use <Heading level={3}> instead of raw <h3>.',
        },
      ],
    },
  },
]

export default eslintConfig
