import '@testing-library/jest-dom'
import { vi } from 'vitest'

// next/font/google relies on Next.js's build-time transform to replace
// the font-family helpers with objects containing className/variable.
// In a plain Vitest run the imports resolve to the raw loader functions
// and calling them throws "X is not a function". Mock the module so
// `@/lib/fonts` (which uses Inter(), Playfair_Display(), etc.) works in
// tests as well as in the Next build.
function mockFont(cssVar: string) {
  return () => ({
    className: `mock-${cssVar}`,
    variable: `--${cssVar}`,
    style: { fontFamily: `mock-${cssVar}` },
  })
}

vi.mock('next/font/google', () => ({
  Inter: mockFont('font-inter'),
  Playfair_Display: mockFont('font-playfair'),
  Cormorant_Garamond: mockFont('font-cormorant'),
  Montserrat: mockFont('font-montserrat'),
  Oswald: mockFont('font-oswald'),
  Lora: mockFont('font-lora'),
}))
