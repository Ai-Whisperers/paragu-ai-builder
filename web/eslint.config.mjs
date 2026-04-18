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
]

export default eslintConfig
