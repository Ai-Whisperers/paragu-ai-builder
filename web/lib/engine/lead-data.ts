/**
 * Stub — lead-import business data.
 *
 * This module can optionally be overwritten by a site-generation pipeline
 * that imports leads and scaffolds BusinessData entries for them. When
 * the pipeline hasn't run (fresh checkouts, CI builds, most environments)
 * this stub provides an empty LEAD_BUSINESSES record so data-loader.ts
 * keeps working.
 *
 * Previously data-loader.ts tried to `require('./lead-data')` in a
 * try/catch — Turbopack (Next.js 16+) can't statically resolve that,
 * which broke the Docker build. Keeping a real stub file here is the
 * simplest fix: the require succeeds, the empty object flows through,
 * and `getAllSlugs()` / `getBusinessBySlug()` behave exactly as before.
 *
 * The pipeline that populates this file (if re-introduced) should export
 * a Record<string, BusinessData> named LEAD_BUSINESSES.
 */

import type { BusinessData } from './compose'

export const LEAD_BUSINESSES: Record<string, BusinessData> = {}
