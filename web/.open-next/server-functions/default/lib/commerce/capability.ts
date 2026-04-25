import { promises as fs } from 'fs'
import path from 'path'

type Capability = {
  commerce?: {
    enabled?: boolean
    provider?: string
    currency?: string
  }
  extends?: string
}

const cache = new Map<string, Capability>()

async function loadTypeJson(typeId: string): Promise<Capability | null> {
  if (cache.has(typeId)) return cache.get(typeId) ?? null
  try {
    const filePath = path.join(process.cwd(), '..', 'src', 'registry', `${typeId}.type.json`)
    const contents = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(contents) as Capability
    cache.set(typeId, parsed)
    return parsed
  } catch {
    try {
      const filePath = path.join(process.cwd(), 'src', 'registry', `${typeId}.type.json`)
      const contents = await fs.readFile(filePath, 'utf8')
      const parsed = JSON.parse(contents) as Capability
      cache.set(typeId, parsed)
      return parsed
    } catch {
      cache.set(typeId, {})
      return null
    }
  }
}

async function resolveCommerce(typeId: string, seen = new Set<string>()): Promise<Capability['commerce'] | null> {
  if (seen.has(typeId)) return null
  seen.add(typeId)
  const entry = await loadTypeJson(typeId)
  if (!entry) return null
  if (entry.commerce) return entry.commerce
  if (entry.extends) return resolveCommerce(entry.extends, seen)
  return null
}

export async function isCommerceEnabled(typeId: string): Promise<boolean> {
  const commerce = await resolveCommerce(typeId)
  return Boolean(commerce?.enabled)
}
