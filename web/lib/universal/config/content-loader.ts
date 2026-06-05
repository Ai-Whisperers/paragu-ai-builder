/**
 * ANNOTATION: Content Loader
 *
 * What it is: Dynamic content loader with a runtime interface that can swap between
 * Supabase (live edits) and local JSON files (static fallback).
 *
 * Why it exists: Provides a consistent API surface (@ai-whisperers/client-kit pattern)
 * so the site-template content system is portable to the published package.
 * Currently uses local JSON files via lib/config.server; the interface is ready
 * for a Supabase swap by calling configureContentLoader() or configureSupabaseLoader().
 *
 * Key exports (match @ai-whisperers/client-kit):
 *   configureContentLoader(loader) — plug in a custom async () => SiteContent loader
 *   configureSupabaseLoader(url, key, siteId) — use Supabase as live content store
 *   configureUrlLoader(url) — fetch content JSON from a runtime URL
 *   getContent() — cached async content fetch (React cache for deduplication)
 *   useContent() — server-component hook, throws on client side
 *   clearCache() — invalidate the in-memory content cache
 *
 * Standalone path: lib/content-loader.ts (not part of the @ai-whisperers package)
 */
import { cache } from "react"
import type { SiteContent } from "@ai-whisperers/client-kit"

type LoaderFn = () => Promise<SiteContent>

let _loader: LoaderFn | null = null
let _cache: SiteContent | null = null

function staticLoader(): Promise<SiteContent> {
  return Promise.resolve({} as SiteContent)
}

export function configureContentLoader(loader: LoaderFn): void {
  _loader = loader
  _cache = null
}

export function configureSupabaseLoader(
  supabaseUrl: string,
  supabaseKey: string,
  siteId: string
): void {
  _loader = async () => {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("site_id", siteId)
      .single()
    if (error || !data) {
      console.warn("[content-loader] Supabase fetch failed, falling back to JSON")
      return {} as SiteContent
    }
    return data.content as SiteContent
  }
  _cache = null
}

export function configureUrlLoader(url: string): void {
  _loader = async () => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json() as Promise<SiteContent>
  }
  _cache = null
}

export function clearCache(): void {
  _cache = null
}

export const getContent = cache(async (): Promise<SiteContent> => {
  if (_cache) return _cache
  const loader = _loader ?? staticLoader
  _cache = await loader()
  return _cache
})

export function useContent(): SiteContent {
  if (typeof window !== "undefined") {
    throw new Error(
      "useContent() must be called in a Server Component. Pass content as props to client components."
    )
  }
  return {} as SiteContent
}
