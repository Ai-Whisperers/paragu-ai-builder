/**
 * Placeholder gallery generator.
 *
 * Emits six SVG-gradient images keyed off the business type so the gallery
 * section has something to render before the owner uploads real photos.
 * Kept deliberately pure (no `fs`, no network) so it's trivially testable.
 */

import type { BusinessType } from '@/lib/types'
import type { GalleryImage } from './business'

interface PlaceholderTheme {
  colors: string[]
  categories: string[]
}

const PLACEHOLDER_THEMES: Record<BusinessType, PlaceholderTheme> = {
  peluqueria: {
    colors: ['#b76e79', '#d4a574', '#8b6f5e'],
    categories: ['Cortes', 'Color', 'Peinados', 'Tratamientos'],
  },
  salon_belleza: {
    colors: ['#a67c52', '#d4b88c', '#8b6f5e'],
    categories: ['Cabello', 'Unas', 'Maquillaje', 'Tratamientos'],
  },
  gimnasio: {
    colors: ['#e74c3c', '#f39c12', '#2ecc71'],
    categories: ['Sala', 'Clases', 'Equipos', 'Resultados'],
  },
  spa: {
    colors: ['#5b8a72', '#8fbc8f', '#d4a574'],
    categories: ['Ambiente', 'Tratamientos', 'Relajacion'],
  },
  unas: {
    colors: ['#e91e63', '#ff6090', '#c9a96e'],
    categories: ['Gel', 'Acrilicas', 'Nail Art', 'Pedicura'],
  },
  tatuajes: {
    colors: ['#1a1a1a', '#c0392b', '#7f8c8d'],
    categories: ['Tradicional', 'Realismo', 'Geometrico'],
  },
  barberia: {
    colors: ['#2c3e50', '#c0392b', '#d4a574'],
    categories: ['Cortes', 'Barba', 'Estilo'],
  },
  estetica: {
    colors: ['#9b59b6', '#e8d5f5', '#3498db'],
    categories: ['Facial', 'Corporal', 'Resultados'],
  },
  maquillaje: {
    colors: ['#e91e63', '#9b59b6', '#f39c12'],
    categories: ['Social', 'Novias', 'Artistico'],
  },
  depilacion: {
    colors: ['#3498db', '#1abc9c', '#e8d5f5'],
    categories: ['Laser', 'Cera', 'Resultados'],
  },
  pestanas: {
    colors: ['#c4788b', '#d4a574', '#1a1a1a'],
    categories: ['Clasicas', 'Volumen', 'Cejas'],
  },
  diseno_grafico: {
    colors: ['#c4788b', '#d4af37', '#e8b4c8'],
    categories: ['Portadas', 'Premade', 'Mockups', 'Branding'],
  },
}

const FALLBACK_THEME: PlaceholderTheme = PLACEHOLDER_THEMES.peluqueria
const PLACEHOLDER_COUNT = 6

function buildSvg(color1: string, color2: string, angle: number, initial: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient></defs>
      <rect width="600" height="600" fill="url(#g)"/>
      <text x="300" y="320" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-size="200" font-family="serif">${initial}</text>
    </svg>`
}

function toDataUri(svg: string): string {
  // `btoa` is available in both Node 22+ and browsers.
  const encoded = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${encoded}`
}

export function generatePlaceholderGallery(
  businessType: BusinessType,
  businessName: string,
  count: number = PLACEHOLDER_COUNT
): GalleryImage[] {
  const theme = PLACEHOLDER_THEMES[businessType] ?? FALLBACK_THEME
  const initial = businessName.trim().charAt(0).toUpperCase() || '?'

  const items: GalleryImage[] = []
  for (let i = 0; i < count; i++) {
    const color1 = theme.colors[i % theme.colors.length]
    const color2 = theme.colors[(i + 1) % theme.colors.length]
    const angle = 135 + i * 30
    const category = theme.categories[i % theme.categories.length]
    items.push({
      src: toDataUri(buildSvg(color1, color2, angle, initial)),
      alt: `${category} - ${businessName}`,
      category,
    })
  }
  return items
}
