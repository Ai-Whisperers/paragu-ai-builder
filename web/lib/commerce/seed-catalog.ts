import { promises as fs } from 'fs'
import path from 'path'
import { createProduct } from './products'
import { generateDescription } from './description-templates'
import { logger } from '@/lib/logger'

interface SeedProduct {
  slug: string
  name: string
  category?: string
  priceCents: number
  compareAtPriceCents?: number
  images: Array<{ url: string; alt?: string; isCover?: boolean }>
  inventoryQty: number
}

interface SeedFile {
  type: string
  products: SeedProduct[]
}

async function loadSeedFile(businessType: string): Promise<SeedFile | null> {
  const candidates = [
    path.join(process.cwd(), '..', 'src', 'content', 'commerce-seeds', `${businessType}.seed.json`),
    path.join(process.cwd(), 'src', 'content', 'commerce-seeds', `${businessType}.seed.json`),
  ]
  for (const file of candidates) {
    try {
      const raw = await fs.readFile(file, 'utf8')
      return JSON.parse(raw) as SeedFile
    } catch {
      /* try next */
    }
  }
  return null
}

/**
 * Seeds a business's catalog with the stock-photo demo products for its type.
 * Idempotent: products are marked is_seed=true; re-runs that hit the unique
 * (business_id, slug) constraint are swallowed silently.
 */
export async function seedCatalog(businessId: string, businessType: string): Promise<number> {
  const file = await loadSeedFile(businessType)
  if (!file) {
    logger.warn('[commerce] no seed file for business type', { businessId, businessType })
    return 0
  }
  let count = 0
  for (const p of file.products) {
    try {
      await createProduct(businessId, {
        slug: p.slug,
        name: p.name,
        description: generateDescription(businessType, { name: p.name, category: p.category }),
        category: p.category,
        priceCents: p.priceCents,
        compareAtPriceCents: p.compareAtPriceCents,
        currency: 'PYG',
        inventoryQty: p.inventoryQty,
        inventoryPolicy: 'deny',
        images: p.images,
        status: 'active',
        metadata: {},
        isSeed: true,
      })
      count++
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message.includes('duplicate') || message.includes('unique')) continue
      logger.warn('[commerce] seed product failed', { businessId, slug: p.slug, error: message })
    }
  }
  return count
}
