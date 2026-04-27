// Accepts common Paraguayan formats: "150000", "150.000", "150,000", "Gs 150.000".
// Returns integer PYG (no subunit — guaraní has no cents).
export function parsePygPrice(input: string | number): number {
  if (typeof input === 'number') return Math.round(input)
  const cleaned = input.replace(/[^\d.,-]/g, '').replace(/[.,]/g, '')
  const value = parseInt(cleaned, 10)
  if (Number.isNaN(value) || value < 0) {
    throw new Error(`invalid_price: ${input}`)
  }
  return value
}

export { formatPyg } from '@/lib/format'
