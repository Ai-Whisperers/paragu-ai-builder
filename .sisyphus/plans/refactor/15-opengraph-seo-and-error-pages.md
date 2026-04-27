# Plan: Fix OpenGraph Images, 404 Pages, and Tenant Sitemaps

## Current State

### OpenGraph Images (broken)

- Root `opengraph-image.tsx` generates one generic image for all routes
- Tenant-level `s/[locale]/[site]/opengraph-image.tsx` and `twitter-image.tsx` exist and work correctly
- But the root layout at `app/layout.tsx` sets a **hardcoded shared OG image URL** (`/opengraph-image`) that overrides tenant-specific OG images on tenant pages
- This means every tenant page shares the same OG preview on social media

### 404 Page (missing)

- No `app/not-found.tsx` — Next.js renders its generic 404
- No tenant-aware 404 (should redirect to the tenant's homepage or show their branding)
- The `s/[locale]/[site]/[[...page]]/page.tsx` might handle 404s via `notFound()`, but without a custom UI

### Sitemap (basic)

- `app/s/[locale]/[site]/sitemap.xml/route.ts` exists and generates per-tenant sitemaps
- No blog post entries in sitemap (blog posts are routed via `/s/[locale]/[site]/blog/[slug]`)
- No lastmod dates

## Proposed Fixes

### 1. Fix OpenGraph Image Resolution

```typescript
// app/layout.tsx — remove the hardcoded og:image
// The tenant layout already sets its own via opengraph-image.tsx and twitter-image.tsx

// Before:
export const metadata: Metadata = {
  openGraph: {
    images: ['/opengraph-image'],  // This OVERRIDES tenant-specific OG images
  },
}

// After:
export const metadata: Metadata = {
  // No opengraph.images here — let tenant layouts set their own
}
```

### 2. Add a Custom 404 Page

```typescript
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)]">
      <h1 className="text-6xl font-bold text-[var(--primary)]">404</h1>
      <p className="mt-4 text-lg text-[var(--text-muted)]">Página no encontrada</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--secondary-foreground)]"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
```

### 3. Add Tenant-Aware Not Found

```typescript
// app/s/[locale]/[site]/not-found.tsx
import Link from 'next/link'

export default function SiteNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)]">
      <h1 className="text-6xl font-bold text-[var(--primary)]">404</h1>
      <p className="mt-4 text-lg text-[var(--text-muted)]">Esta página no existe</p>
      <p className="text-sm text-[var(--text-light)]">La página que buscas no está disponible o fue movida.</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-[var(--secondary)] px-6 py-3 text-sm font-semibold"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
```

### 4. Enhance Tenant Sitemap

```typescript
// app/s/[locale]/[site]/sitemap.xml/route.ts
// Add blog post entries to sitemap
const blogSlugs = listBlogSlugs(siteSlug)
const entries = [
  ...pageSlugs.map(slug => ({
    url: buildLocaleUrl({ locale, siteSlug, pageSlug: slug }),
    lastModified: new Date(),
    changeFrequency: slug === 'home' ? 'weekly' as const : 'monthly' as const,
    priority: slug === 'home' ? 1.0 : 0.8,
  })),
  ...blogSlugs.map(slug => ({
    url: buildLocaleUrl({ locale, siteSlug, pageSlug: `blog/${slug}` }),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })),
]
```

## Files to Touch

| File | Change |
|---|---|
| `web/app/layout.tsx` | Remove hardcoded `opengraph.images` |
| `web/app/not-found.tsx` | NEW — global 404 page |
| `web/app/s/[locale]/[site]/not-found.tsx` | NEW — tenant-aware 404 page |
| `web/s/[locale]/[site]/sitemap.xml/route.ts` | Add blog posts, lastmod, priority |

## Effort

- **Effort**: Small (1 hour)
- **Risk**: Low
