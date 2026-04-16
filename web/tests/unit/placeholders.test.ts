import { describe, it, expect } from 'vitest'
import { generatePlaceholderGallery } from '@/lib/engine/placeholders'

describe('generatePlaceholderGallery', () => {
  it('returns six images by default', () => {
    const imgs = generatePlaceholderGallery('peluqueria', 'Salon Maria')
    expect(imgs).toHaveLength(6)
  })

  it('honors the count parameter', () => {
    expect(generatePlaceholderGallery('gimnasio', 'GymFit', 3)).toHaveLength(3)
  })

  it('emits base64-encoded SVG data URIs', () => {
    const [first] = generatePlaceholderGallery('spa', 'Zen Spa', 1)
    expect(first.src).toMatch(/^data:image\/svg\+xml;base64,/)
    const decoded = Buffer.from(first.src.split(',')[1], 'base64').toString()
    expect(decoded).toContain('<svg')
    expect(decoded).toContain('</svg>')
  })

  it('uses the business initial in the SVG', () => {
    const [first] = generatePlaceholderGallery('barberia', 'alejandro', 1)
    const decoded = Buffer.from(first.src.split(',')[1], 'base64').toString()
    expect(decoded).toContain('>A<')
  })

  it('assigns a category and an alt with the business name', () => {
    const [first] = generatePlaceholderGallery('unas', 'Beauty Nails', 1)
    expect(first.category).toBeTruthy()
    expect(first.alt).toContain('Beauty Nails')
  })

  it('falls back to a default theme for unknown-but-valid types', () => {
    // All BusinessTypes have themes; this just guards the ?? fallback
    // code path by exercising a rarely-used business type.
    const imgs = generatePlaceholderGallery('diseno_grafico', 'Estudio X', 2)
    expect(imgs).toHaveLength(2)
    expect(imgs[0].src).toMatch(/^data:image\/svg\+xml;base64,/)
  })

  it('uses `?` for empty business names instead of crashing', () => {
    const [first] = generatePlaceholderGallery('estetica', '', 1)
    const decoded = Buffer.from(first.src.split(',')[1], 'base64').toString()
    expect(decoded).toContain('>?<')
  })
})
