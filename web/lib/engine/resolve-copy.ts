import { fillTemplate } from '@/lib/utils'

export interface CopyContext {
  siteContent: Record<string, unknown>
  verticalCopy: Record<string, unknown>
  placeholders: Record<string, string | number | undefined>
}

function getByPath(root: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, root)
}

export function resolveRef(ref: string, ctx: CopyContext): unknown {
  const siteHit = getByPath(ctx.siteContent, ref)
  if (siteHit !== undefined) return followRefs(siteHit, ctx)
  const verticalHit = getByPath(ctx.verticalCopy, ref)
  if (verticalHit !== undefined) return followRefs(verticalHit, ctx)
  return undefined
}

function followRefs(value: unknown, ctx: CopyContext, depth = 0): unknown {
  if (depth > 10) return value
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const rec = value as Record<string, unknown>
    if (typeof rec.$ref === 'string') {
      const resolved = resolveRef(rec.$ref, ctx)
      return resolved !== undefined
        ? followRefs(resolved, ctx, depth + 1)
        : fillDeep(value, ctx.placeholders)
    }
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(rec)) {
      out[k] = followRefs(v, ctx, depth + 1)
    }
    return fillDeep(out, ctx.placeholders)
  }
  if (Array.isArray(value)) {
    return value.map((v) => followRefs(v, ctx, depth + 1))
  }
  return fillDeep(value, ctx.placeholders)
}

export function fillDeep(
  value: unknown,
  placeholders: Record<string, string | number | undefined>,
): unknown {
  if (typeof value === 'string') return fillTemplate(value, placeholders)
  if (Array.isArray(value)) {
    return value.map((v) => fillDeep(v, placeholders))
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = fillDeep(v, placeholders)
    }
    return out
  }
  return value
}

export function mergeOverrides(
  base: unknown,
  overrides: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const baseObj = (base && typeof base === 'object' && !Array.isArray(base)
    ? (base as Record<string, unknown>)
    : {}) as Record<string, unknown>
  if (!overrides) return { ...baseObj }
  return { ...baseObj, ...overrides }
}
