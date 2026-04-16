import { describe, it, expect } from 'vitest'
import { fillTemplate } from '@/lib/utils'

describe('fillTemplate', () => {
  it('replaces {{placeholder}} tokens with provided values', () => {
    expect(fillTemplate('Hola {{name}}', { name: 'Maria' })).toBe('Hola Maria')
  })

  it('supports multiple distinct placeholders', () => {
    expect(
      fillTemplate('{{a}} y {{b}}', { a: 'uno', b: 'dos' })
    ).toBe('uno y dos')
  })

  it('stringifies numeric values', () => {
    expect(fillTemplate('Ano {{year}}', { year: 2026 })).toBe('Ano 2026')
  })

  it('leaves unknown placeholders intact so failures are visible', () => {
    expect(fillTemplate('Hola {{name}}', {})).toBe('Hola {{name}}')
  })

  it('treats undefined the same as missing — leaves the placeholder', () => {
    expect(fillTemplate('Hola {{name}}', { name: undefined })).toBe(
      'Hola {{name}}'
    )
  })

  it('does not recursively expand replaced content', () => {
    expect(fillTemplate('{{a}}', { a: '{{b}}', b: 'x' })).toBe('{{b}}')
  })

  it('replaces every occurrence of the same placeholder', () => {
    expect(fillTemplate('{{x}}-{{x}}', { x: 'a' })).toBe('a-a')
  })
})
