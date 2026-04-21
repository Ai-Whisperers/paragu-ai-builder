import { describe, it, expect } from 'vitest'

/**
 * Re-implements the WCAG contrast helpers from scripts/contrast-audit.ts.
 * A test-side twin insulates the audit script from silent regressions when
 * the inlined maths is tweaked.
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1]
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const c = [r, g, b].map((v) => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

function contrast(fg: string, bg: string): number | null {
  const fgRgb = hexToRgb(fg)
  const bgRgb = hexToRgb(bg)
  if (!fgRgb || !bgRgb) return null
  const lighter = Math.max(relLuminance(fgRgb), relLuminance(bgRgb))
  const darker = Math.min(relLuminance(fgRgb), relLuminance(bgRgb))
  return (lighter + 0.05) / (darker + 0.05)
}

describe('WCAG contrast', () => {
  it('returns null for invalid hex', () => {
    expect(contrast('oops', '#fff')).toBeNull()
  })

  it('black on white = 21:1 (maximum)', () => {
    const ratio = contrast('#000000', '#ffffff')!
    expect(ratio).toBeCloseTo(21, 0)
  })

  it('white on white = 1:1 (minimum)', () => {
    const ratio = contrast('#ffffff', '#ffffff')!
    expect(ratio).toBeCloseTo(1, 2)
  })

  it('3-digit hex resolves like its 6-digit twin', () => {
    const a = contrast('#333', '#fff')!
    const b = contrast('#333333', '#ffffff')!
    expect(a).toBeCloseTo(b, 3)
  })

  it('known failing pair: near-black on near-black', () => {
    // barberia optionA regression from the audit script
    const ratio = contrast('#1a1a1a', '#0d0d0d')!
    expect(ratio).toBeLessThan(3.0)
  })

  it('known passing pair: gray text on white passes AA', () => {
    const ratio = contrast('#595959', '#ffffff')!
    expect(ratio).toBeGreaterThan(4.5)
  })
})
