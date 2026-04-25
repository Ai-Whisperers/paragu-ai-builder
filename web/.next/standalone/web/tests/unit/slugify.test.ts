/**
 * Slugify Edge Cases Tests
 * Win 52: Test edge cases (accents, special chars)
 */
import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/utils'

describe('slugify - Paraguay context', () => {
  it('should handle Paraguayan city names', () => {
    expect(slugify('Asunción')).toBe('asuncion')
    expect(slugify('Ciudad del Este')).toBe('ciudad-del-este')
    expect(slugify('San Lorenzo')).toBe('san-lorenzo')
    expect(slugify('Luque')).toBe('luque')
    expect(slugify('Capiatá')).toBe('capiata')
  })

  it('should handle Spanish business names', () => {
    expect(slugify('Cafetería El Buen Sabor')).toBe('cafeteria-el-buen-sabor')
    expect(slugify('Salón de Belleza María')).toBe('salon-de-belleza-maria')
    expect(slugify('Diseño Gráfico Profesional')).toBe('diseno-grafico-profesional')
    expect(slugify('Electrónica Guaireña')).toBe('electronica-guairena')
    expect(slugify('Farmacia 24 Hrs')).toBe('farmacia-24-hrs')
  })

  it('should handle accented vowels', () => {
    expect(slugify('á é í ó ú')).toBe('a-e-i-o-u')
    expect(slugify('Á É Í Ó Ú')).toBe('a-e-i-o-u')
  })

  it('should handle ñ character', () => {
    expect(slugify('niño')).toBe('nino')
    expect(slugify('Ñandú')).toBe('nandu')
    expect(slugify('Año Nuevo')).toBe('ano-nuevo')
  })

  it('should handle umlauts and other diacritics', () => {
    expect(slugify('naïve')).toBe('naive')
    expect(slugify('Zürich')).toBe('zurich')
    expect(slugify('Français')).toBe('francais')
  })

  it('should handle special characters commonly used', () => {
    expect(slugify('Hello & Co')).toBe('hello-co')
    expect(slugify('Price: $100')).toBe('price-100')
    expect(slugify('Value @ 50%')).toBe('value-50')
    expect(slugify('C++ Programming')).toBe('c-programming')
    expect(slugify('HTML/ CSS/ JS')).toBe('html-css-js')
  })

  it('should handle punctuation', () => {
    expect(slugify('Hello!')).toBe('hello')
    expect(slugify('What?')).toBe('what')
    expect(slugify('Test.')).toBe('test')
    expect(slugify('Comma, Test')).toBe('comma-test')
    expect(slugify('Semi;colon')).toBe('semicolon')
  })

  it('should handle multiple spaces and tabs', () => {
    expect(slugify('Hello    World')).toBe('hello-world')
    expect(slugify('Hello\t\tWorld')).toBe('hello-world')
  })

  it('should handle leading/trailing whitespace', () => {
    expect(slugify('  hello  ')).toBe('hello')
    expect(slugify('\t\thello\n')).toBe('hello')
  })

  it('should handle consecutive hyphens', () => {
    expect(slugify('hello---world')).toBe('hello-world')
    expect(slugify('hello--world--test')).toBe('hello-world-test')
  })

  it('should handle parentheses and brackets', () => {
    expect(slugify('Company (Ltd)')).toBe('company-ltd')
    expect(slugify('Store [Asunción]')).toBe('store-asuncion')
    expect(slugify('Brand {2024}')).toBe('brand-2024')
  })

  it('should handle quotes', () => {
    expect(slugify('"Quoted"')).toBe('quoted')
    expect(slugify("'Single'")).toBe('single')
  })

  it('should handle phone numbers mixed with text', () => {
    // Hyphens between digits are preserved (slugify treats them as word chars).
    expect(slugify('Call +595-981-123456')).toBe('call-595-981-123456')
    expect(slugify('Tel: (021) 123-4567')).toBe('tel-021-123-4567')
  })

  it('should handle email-like strings', () => {
    expect(slugify('contact@example.com')).toBe('contactexamplecom')
  })

  it('should handle URLs', () => {
    expect(slugify('https://example.com/path')).toBe('httpsexamplecompath')
    expect(slugify('www.example.com')).toBe('wwwexamplecom')
  })

  it('should handle mathematical symbols', () => {
    expect(slugify('Price = $100')).toBe('price-100')
    expect(slugify('2 + 2 = 4')).toBe('2-2-4')
  })

  it('should handle currency symbols', () => {
    expect(slugify('₲100.000')).toBe('100000')
    expect(slugify('$50 USD')).toBe('50-usd')
    expect(slugify('€100 EUR')).toBe('100-eur')
  })

  it('should handle empty and edge cases', () => {
    expect(slugify('')).toBe('')
    expect(slugify('   ')).toBe('')
    expect(slugify('---')).toBe('')
    expect(slugify('!!!')).toBe('')
  })

  it('should handle long strings', () => {
    const longName = 'A'.repeat(100)
    expect(slugify(longName)).toBe('a'.repeat(100))
  })

  it('should preserve numbers', () => {
    expect(slugify('Version 2.0')).toBe('version-20')
    expect(slugify('Chapter 1: Introduction')).toBe('chapter-1-introduction')
  })
})
