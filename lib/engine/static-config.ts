/**
 * Static config with embedded JSON content
 * Generated at build time - DO NOT EDIT MANUALLY
 * 
 * Generated: 2026-04-18T20:44:25.344Z
 */

export const REGISTRY_MAP: Record<string, unknown> = {

}

export const CONTENT_MAP: Record<string, unknown> = {

}

export function getRegistry(type: string): unknown | null {
  return REGISTRY_MAP[type] || null
}

export function getContent(type: string): unknown | null {
  return CONTENT_MAP[type] || null
}
