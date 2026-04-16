/**
 * Zod schemas for JSON content files.
 *
 * These mirror the shapes the engine actually reads. We validate at the
 * loader boundary so malformed JSON surfaces as a clear error instead of
 * `Cannot read properties of undefined` deep inside section builders.
 *
 * Schemas are intentionally lenient with `.passthrough()` where the JSON
 * file may contain extra keys the runtime doesn't care about (e.g. `$schema`).
 */

import { z } from 'zod'

// ─── Registry ──────────────────────────────────────────────────────────
export const registryTypeSchema = z
  .object({
    id: z.string(),
    pages: z.object({
      homepage: z.object({
        sections: z.array(z.string()),
        requiredSections: z.array(z.string()).optional(),
      }),
    }),
    features: z.record(z.string(), z.record(z.string(), z.unknown())).default({}),
    nav: z.object({
      items: z.array(z.string()),
      cta: z.object({ text: z.string(), action: z.string() }).optional(),
    }),
    hero: z
      .object({
        headlineTemplate: z.string().optional(),
        subheadlineTemplate: z.string().optional(),
        ctaPrimary: z.object({ text: z.string() }).optional(),
        ctaSecondary: z.object({ text: z.string() }).optional(),
      })
      .optional(),
    seo: z.object({
      titleTemplate: z.string(),
      descriptionTemplate: z.string(),
    }),
  })
  .passthrough()

export type RegistryType = z.infer<typeof registryTypeSchema>

// ─── Content ───────────────────────────────────────────────────────────
const heroContent = z.object({
  headline: z.string(),
  subheadline: z.string(),
  ctaPrimary: z.string(),
  ctaSecondary: z.string().optional(),
})

const defaultService = z.object({
  name: z.string(),
  price: z.string().nullable().optional(),
  priceFrom: z.string().nullable().optional(),
  duration: z.number().optional(),
  description: z.string().optional(),
})

const servicesPageContent = z.object({
  title: z.string(),
  categories: z
    .array(
      z.object({
        key: z.string(),
        title: z.string(),
        description: z.string().optional(),
        defaultServices: z.array(defaultService).optional(),
      })
    )
    .optional(),
})

export const contentTemplateSchema = z
  .object({
    hero: heroContent,
    servicesPage: servicesPageContent.optional(),
    teamPage: z.object({ title: z.string() }).optional(),
    galleryPage: z
      .object({ title: z.string(), subtitle: z.string().optional() })
      .optional(),
    contactPage: z.object({ title: z.string() }).optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    productCatalogPage: z
      .object({
        title: z.string(),
        subtitle: z.string().optional(),
        orderButtonText: z.string().optional(),
        orderMessageTemplate: z.string().optional(),
        categories: z.array(z.string()).optional(),
      })
      .optional(),
    ctaBanner: z.object({ title: z.string(), buttonText: z.string() }).optional(),
    footer: z.object({
      quickLinks: z.array(z.string()),
      copyright: z.string(),
    }),
    whatsapp: z.object({ defaultMessage: z.string() }).optional(),
  })
  .passthrough()

export type ContentTemplate = z.infer<typeof contentTemplateSchema>

// ─── Tokens ────────────────────────────────────────────────────────────
const tokenValue = z.object({ value: z.string() }).passthrough()

export const baseTokensSchema = z
  .object({
    spacing: z.record(z.string(), tokenValue),
    borderRadius: z.record(z.string(), tokenValue),
    shadows: z.object({
      card: tokenValue,
      cardHover: tokenValue,
      button: tokenValue,
      nav: tokenValue,
    }),
    typography: z.object({
      scale: z.record(z.string(), tokenValue),
      lineHeight: z.record(z.string(), tokenValue),
    }),
    animation: z.object({
      duration: z.object({
        fast: tokenValue,
        default: tokenValue,
        slow: tokenValue,
      }),
    }),
    layout: z.record(z.string(), z.record(z.string(), tokenValue)).optional(),
  })
  .passthrough()

export type BaseTokens = z.infer<typeof baseTokensSchema>

const palette = z.object({
  name: z.string(),
  colors: z
    .object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string().optional(),
      background: z.string(),
      surface: z.string(),
      text: z.string(),
      textLight: z.string().optional(),
      textMuted: z.string().optional(),
      success: z.string().optional(),
      error: z.string().optional(),
      warning: z.string().optional(),
      surfaceLight: z.string().optional(),
      secondaryHover: z.string().optional(),
    })
    .passthrough(),
})

export const typeTokensSchema = z
  .object({
    name: z.string(),
    extends: z.string(),
    theme: z.enum(['light', 'dark']),
    mood: z.array(z.string()).optional().default([]),
    palettes: z.record(z.string(), palette),
    defaultPalette: z.string(),
    typography: z.object({
      heading: z.string(),
      body: z.string(),
      accent: z.string().optional(),
      headingWeight: z.string(),
      bodyWeight: z.string(),
      textTransform: z.string().optional(),
    }),
    googleFonts: z.array(z.string()).default([]),
    borderRadius: z.string().optional(),
    buttonStyle: z.string().optional(),
    components: z.record(z.string(), z.record(z.string(), z.unknown())).default({}),
  })
  .passthrough()

export type TypeTokens = z.infer<typeof typeTokensSchema>
