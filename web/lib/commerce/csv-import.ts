import { z } from 'zod'

/**
 * Minimal CSV parser — RFC 4180 subset covering the shapes merchants
 * actually produce (Google Sheets / Excel exports with quoted commas +
 * optional BOM). Single-file so we don't pull in papaparse for ~30 lines
 * of logic.
 *
 * Assumes UTF-8. Strips BOM if present. Supports:
 *   - comma-separated (default) or semicolon-separated (Latin-America
 *     Excel default) — auto-detected from the header row
 *   - double-quoted fields with embedded commas / newlines / "" escapes
 *   - \r\n or \n row terminators
 */
export function parseCsv(raw: string): string[][] {
  const text = raw.replace(/^﻿/, '')
  const headerLine = text.slice(0, text.indexOf('\n'))
  const delimiter = (headerLine.match(/;/g)?.length ?? 0) > (headerLine.match(/,/g)?.length ?? 0) ? ';' : ','

  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === delimiter) {
        row.push(field)
        field = ''
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && next === '\n') i++
        row.push(field)
        field = ''
        if (row.length > 1 || row[0] !== '') rows.push(row)
        row = []
      } else {
        field += ch
      }
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

/**
 * The "shape" we accept from merchants. Column names are lowercased +
 * trimmed on header parse so case/whitespace differences don't cause
 * pointless rejections.
 */
export const CsvProductRowSchema = z
  .object({
    slug: z.string().trim().min(1).max(120),
    name: z.string().trim().min(1).max(200),
    description: z.string().trim().max(5000).optional().default(''),
    category: z.string().trim().max(80).optional().default(''),
    price: z.union([z.string(), z.number()]),
    compare_at_price: z.union([z.string(), z.number()]).optional().default(''),
    sku: z.string().trim().max(80).optional().default(''),
    stock: z.union([z.string(), z.number()]).optional().default('0'),
    status: z.enum(['active', 'draft', 'archived']).optional().default('active'),
    image_url: z.string().trim().max(500).optional().default(''),
  })
  .passthrough() // extra columns are ignored rather than rejected

export type CsvProductRow = z.infer<typeof CsvProductRowSchema>

/**
 * Parses a PY-friendly price string: accepts "150000", "150.000", "Gs 150000",
 * "150,000" etc. Returns integer PYG.
 */
export function parsePygPrice(raw: string | number): number {
  if (typeof raw === 'number') return Math.round(raw)
  const stripped = raw.replace(/[^\d-]/g, '')
  const n = parseInt(stripped || '0', 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export interface ParsedRow {
  rowIndex: number // 1-based including header for error messages
  ok: boolean
  error?: string
  data?: {
    slug: string
    name: string
    description: string | null
    category: string | null
    priceCents: number
    compareAtPriceCents: number | null
    sku: string | null
    inventoryQty: number
    status: 'active' | 'draft' | 'archived'
    imageUrl: string | null
  }
}

export function normaliseHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w]/g, '')
}

export function parseProductCsv(raw: string): { rows: ParsedRow[]; headerWarnings: string[] } {
  const grid = parseCsv(raw)
  if (grid.length === 0) return { rows: [], headerWarnings: [] }

  const rawHeaders = grid[0].map(normaliseHeader)
  const REQUIRED = ['slug', 'name', 'price']
  const missing = REQUIRED.filter((h) => !rawHeaders.includes(h))
  if (missing.length > 0) {
    return {
      rows: [],
      headerWarnings: [`Faltan columnas obligatorias: ${missing.join(', ')}`],
    }
  }

  const rows: ParsedRow[] = []
  for (let i = 1; i < grid.length; i++) {
    const line = grid[i]
    // Skip fully-empty rows — Excel exports often add trailing blank lines.
    if (line.every((cell) => !cell || !cell.trim())) continue

    const record: Record<string, unknown> = {}
    rawHeaders.forEach((h, colIdx) => {
      record[h] = line[colIdx] ?? ''
    })
    const parsed = CsvProductRowSchema.safeParse(record)
    if (!parsed.success) {
      rows.push({
        rowIndex: i + 1,
        ok: false,
        error: parsed.error.issues.map((x) => `${x.path.join('.')}: ${x.message}`).join('; '),
      })
      continue
    }
    const d = parsed.data
    const priceCents = parsePygPrice(d.price)
    if (priceCents <= 0) {
      rows.push({ rowIndex: i + 1, ok: false, error: 'Precio inválido o <= 0' })
      continue
    }
    rows.push({
      rowIndex: i + 1,
      ok: true,
      data: {
        slug: d.slug,
        name: d.name,
        description: d.description?.trim() || null,
        category: d.category?.trim() || null,
        priceCents,
        compareAtPriceCents:
          d.compare_at_price && String(d.compare_at_price).trim() !== ''
            ? parsePygPrice(d.compare_at_price)
            : null,
        sku: d.sku?.trim() || null,
        inventoryQty: parseInt(String(d.stock ?? '0').replace(/[^\d-]/g, ''), 10) || 0,
        status: d.status,
        imageUrl: d.image_url?.trim() || null,
      },
    })
  }
  return { rows, headerWarnings: [] }
}
