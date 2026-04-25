/**
 * Utils Tests
 * Win 51: Test slugify, fillTemplate functions
 */
import { describe, it, expect } from 'vitest'
import { slugify, fillTemplate, cn } from '@/lib/utils'

describe('slugify', () => {
  it('should convert simple text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world')
  })

  it('should convert to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world')
  })

  it('should trim leading and trailing spaces', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world')
  })

  it('should handle accents and diacritics', () => {
    expect(slugify('Café')).toBe('cafe')
    expect(slugify('Naïve')).toBe('naive')
    expect(slugify('Résumé')).toBe('resume')
    expect(slugify('Señor')).toBe('senor')
  })

  it('should handle special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
    expect(slugify('Hello & World')).toBe('hello-world')
    expect(slugify('Hello@World')).toBe('helloworld')
  })

  it('should handle multiple hyphens', () => {
    expect(slugify('Hello---World')).toBe('hello-world')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('should handle numbers', () => {
    expect(slugify('Hello World 123')).toBe('hello-world-123')
  })

  it('should handle Spanish text with accents', () => {
    expect(slugify('Película Española')).toBe('pelicula-espanola')
    expect(slugify('Año Nuevo')).toBe('ano-nuevo')
    expect(slugify('Música Maestro')).toBe('musica-maestro')
  })
})

describe('fillTemplate', () => {
  it('should replace single placeholder', () => {
    expect(fillTemplate('Hello {{name}}!', { name: 'World' })).toBe('Hello World!')
  })

  it('should replace multiple placeholders', () => {
    const template = '{{greeting}} {{name}}, welcome to {{city}}!'
    const data = { greeting: 'Hi', name: 'Alice', city: 'Asunción' }
    expect(fillTemplate(template, data)).toBe('Hi Alice, welcome to Asunción!')
  })

  it('should leave unmatched placeholders unchanged', () => {
    expect(fillTemplate('Hello {{name}}, your code is {{code}}', { name: 'Alice' }))
      .toBe('Hello Alice, your code is {{code}}')
  })

  it('should handle numeric values', () => {
    expect(fillTemplate('Price: ${{price}}', { price: 99.99 })).toBe('Price: $99.99')
    expect(fillTemplate('Count: {{count}}', { count: 42 })).toBe('Count: 42')
  })

  it('should handle empty template', () => {
    expect(fillTemplate('', { name: 'Alice' })).toBe('')
  })

  it('should handle empty data object', () => {
    expect(fillTemplate('Hello {{name}}!', {})).toBe('Hello {{name}}!')
  })

  it('should handle undefined values', () => {
    expect(fillTemplate('Value: {{value}}', { value: undefined })).toBe('Value: {{value}}')
  })

  it('should handle nested word characters only', () => {
    // Only \w+ matches (word characters: letters, numbers, underscore)
    expect(fillTemplate('Hello {{user_name}}!', { user_name: 'Alice' })).toBe('Hello Alice!')
    expect(fillTemplate('Hello {{user-name}}!', { 'user-name': 'Alice' })).toBe('Hello {{user-name}}!')
  })
})

describe('cn (className merge)', () => {
  it('should merge simple classes', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  it('should resolve Tailwind conflicts (last wins)', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle conditional classes', () => {
    expect(cn('px-2', true && 'py-2')).toBe('px-2 py-2')
    expect(cn('px-2', false && 'py-2')).toBe('px-2')
  })

  it('should handle arrays', () => {
    expect(cn(['text-red-500', 'bg-blue-500'])).toBe('text-red-500 bg-blue-500')
  })

  it('should handle objects', () => {
    expect(cn({ 'text-red-500': true, 'bg-blue-500': false })).toBe('text-red-500')
  })

  it('should handle mixed inputs', () => {
    expect(cn('base', ['class-a', 'class-b'], { 'class-c': true })).toBe('base class-a class-b class-c')
  })

  it('should handle undefined and null', () => {
    expect(cn('text-red-500', undefined, null)).toBe('text-red-500')
  })
})
