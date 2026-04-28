# Paragu-AI Commerce — Complete Refactoring & Abstraction Plan

> Analisis: Abril 2026 | Basado en: revision de 55+ componentes, 35+ modulos lib, 17 API routes, 3 pages de tienda
> Problemas identificados: 12 categorias de issues arquitectonicos

---

## Resumen Ejecutivo

El sistema commerce crecio organicamente a partir de fun4me (sex shop) y se esta reutilizando para viajero-comercio (outdoor). Esto dejo:

- **Hardcoding de logica de negocio** en componentes compartidos
- **Duplicacion de data fetching** en paginas (tienda, categoria, PDP)
- **Ausencia de capa de abstraccion** entre datos y presentacion
- **Componentes God-object** (tienda-toolbar: 578 lineas, products.ts: 441 lineas)
- **Mezcla de concerns** en paginas (data fetching + state management + rendering)
- **Falta de tipado estricto** en modulos clave

---

## Problema 1: Capa de Datos Duplicada (CRITICAL)

### Diagnostico

Tres paginas hacen data fetching practicamente identico:

| Pagina | Archivo | Lineas | Data fetching |
|--------|---------|--------|---------------|
| /tienda | `tienda/page.tsx` | 414 | `resolveBusinessBySlug + listActiveProducts + countActiveProducts + listDistinctCategories + listCategoryCounts + listDistinctBrands + listDistinctTags + getReviewAggregatesByBusiness + loadPygRates + listTopSearches` |
| /categoria/[category] | `categoria/[category]/page.tsx` | 263 | `resolveBusinessBySlug + listActiveProducts + countActiveProducts + listCategoryCounts + loadPygRates` |
| /producto/[slug] | `producto/[slug]/page.tsx` | 399 | `resolveBusinessBySlug + getProductBySlug + listRelatedProducts + getReviewAggregatesByBusiness` |

### Solucion

Crear una **Data Access Layer (DAL)** que encapsule todo el fetching:

```typescript
// web/lib/commerce/dal.ts — Data Access Layer
// Unifica todo el fetching de datos para storefront pages

export interface TiendaPageData {
  business: Business
  products: Product[]
  totalCount: number
  categories: string[]
  categoryCounts: Record<string, number>
  brands: string[]
  tags: string[]
  reviewAggregates: Record<string, { avg: number; count: number }>
  rates: Record<string, number>
  topSearches: string[]
}

export interface CategoryPageData {
  business: Business
  products: Product[]
  totalCount: number
  categoryCounts: Record<string, number>
}

export async function loadTiendaPageData(
  siteSlug: string,
  filters: ProductFilterOptions,
): Promise<TiendaPageData> {
  const business = await resolveBusinessBySlug(siteSlug)
  // ... parallel fetching
}

export async function loadCategoryPageData(
  siteSlug: string,
  category: string,
  filters: ProductFilterOptions,
): Promise<CategoryPageData> {
  // ... reuses same patterns
}
```

**Impacto**: Elimina ~200 lineas de codigo duplicado, centraliza errores, facilita testing.

---

## Problema 2: God Components (CRITICAL)

### Diagnostico

| Componente | Lineas | Responsabilidades |
|------------|--------|-------------------|
| `tienda-toolbar.tsx` | 578 | Search input, sort dropdown, category filters (rendering + toggling), brand filters, tag filters (6 grupos), price range, stock/sale toggles, active filter chips, clear all, result count |
| `checkout-form.tsx` | 366 | Customer info form, cart summary, payment selection, shipping, order submission, error handling |
| `product-card.tsx` | 322 | Image rendering, hover swap, badges (4 tipos), wishlist, quick view, add-to-cart, price display, installments, brand display, review stars |
| `products.ts` (lib) | 441 | 20+ funciones: CRUD, listing, counting, popularity, search, categories, brands, tags, imports |

### Solucion

Dividir en modulos de una sola responsabilidad:

**tienda-toolbar.tsx** → 5 componentes:
```
tienda-toolbar/
  ├── index.tsx            → Orchestrator (10 lineas, compose los hijos)
  ├── search-box.tsx       → Solo el input de busqueda
  ├── sort-select.tsx      → Solo el dropdown de ordenamiento
  ├── category-filters.tsx → Solo los pills de categoria
  └── price-filters.tsx    → Solo rango de precio + checkboxes
```

**product-card.tsx** → Modularizar las secciones:
```
product-card/
  ├── index.tsx            → Card wrapper (orquesta badges + image + info + cta)
  ├── product-badges.tsx   → Badges (descuento, nuevo, bajo stock, envio gratis)
  ├── product-price.tsx    → Price + compareAt + installments
  └── product-actions.tsx  → Add-to-cart + wishlist buttons
```

**products.ts** → Dividir por dominio:
```
lib/commerce/
  ├── products.ts          → Solo queries de lista (listActiveProducts, countActiveProducts)
  ├── product-detail.ts    → getProductBySlug, listRelatedProducts
  ├── product-admin.ts     → createProduct, updateProduct, deleteProduct, importProducts
  └── product-catalog.ts   → listDistinctCategories, listDistinctBrands, listDistinctTags
```

---

## Problema 3: Per-Tenant Configuration Dispersa (HIGH)

### Diagnostico

Actualmente la config per-tenant esta en 4 lugares diferentes:

| Archivo | Que configura |
|---------|---------------|
| `lib/commerce/tenant-config.ts` | hideDiscreetMode, hideCurrencyToggle, tagGroups, showQuizFab |
| `lib/commerce/shipping-threshold.ts` | Free shipping umbral por tenant |
| `lib/commerce/installments.ts` | Cuotas sin interes por tenant |
| `tienda/page.tsx` (inline) | Trust items por tenant (hardcodeado con `site === "viajero-comercio"`) |

### Solucion

Unificar TODO en `tenant-config.ts`:

```typescript
// lib/commerce/tenant-config.ts — UNICO punto de config per-tenant

export interface TenantCommerceConfig {
  // Feature flags
  hideDiscreetMode: boolean
  hideCurrencyToggle: boolean
  showQuizFab: boolean

  // Trust signals
  trustItems?: TrustItem[]

  // Commerce rules
  freeShippingThresholdCents: number
  installments?: { maxCuotas: number; minAmountCents: number }

  // Filter configuration
  tagGroups: TagGroup[]
  categoryIcons?: Record<string, string>

  // Theme overrides (para components que necesitan color custom)
  theme?: {
    primaryColor?: string
    accentColor?: string
  }
}
```

**Impacto**: Un solo archivo para entender el comportamiento de cada tenant. Agregar un nuevo tenant = agregar una entrada en este archivo.

---

## Problema 4: Tipos Compartidos Duplicados (HIGH)

### Diagnostico

El tipo `Product` esta definido en `lib/schemas/commerce/product.ts`, pero hay conversiones manuales en `products.ts` (`rowToProduct`). Ademas, hay tipos sueltos:

- `ProductSort` definido en `products.ts` (deberia estar en schemas)
- `TrustItem` definido en `trust-strip.tsx` (deberia estar en schemas)
- `QuickFilter` definido en `tienda-quick-filters.tsx` (deberia estar en types)

### Solucion

Centralizar TODOS los tipos en `lib/schemas/commerce/`:

```typescript
lib/schemas/commerce/
  ├── product.ts       → Product, ProductSort, ProductFilter
  ├── cart.ts          → Cart, CartItem
  ├── order.ts         → Order, OrderItem
  ├── review.ts        → Review, ReviewAggregate
  ├── ui.ts            → TrustItem, QuickFilter, BreadcrumbItem
  └── index.ts         → Re-exporta todo
```

---

## Problema 5: Storefront Pages Mezclan Concerns (HIGH)

### Diagnostico

`tienda/page.tsx` (414 lineas) hace TODO en un solo archivo:

1. **Data fetching**: 8 llamadas asincronas paralelas
2. **Data transformation**: sorting por popularidad, rating
3. **State computation**: `hasActiveFilters`, `totalPages`, `trustItems`
4. **Metadata generation**: SEO
5. **Rendering**: HTML completo de la pagina
6. **Client hydratation**: CartStoreHydrator

### Solucion

Separar en capas:

```
app/s/[locale]/[site]/tienda/
  ├── page.tsx              → Solo orquestacion (importa loader + layout, ~30 lineas)
  ├── layout.tsx            → Layout de la pagina (header, footer, breadcrumbs)
  ├── loading.tsx           → Skeleton (YA EXISTE)
  ├── tienda-page-layout.tsx → Componente Server que renderiza el contenido
  └── tienda-data-loader.ts → Data fetching logic (usa DAL)
```

```typescript
// page.tsx — SOLO orquestacion
export default async function StorePage({ params, searchParams }) {
  const { site, locale } = await params
  const filters = parseFilters(await searchParams)
  const data = await loadTiendaPageData(site, filters)
  return <StorePageLayout data={data} filters={filters} locale={locale} />
}
```

---

## Problema 6: Categoria Pages Duplican Tienda Page (MEDIUM)

### Diagnostico

`categoria/[category]/page.tsx` (263 lineas) y `categoria/[category]/[tag]/page.tsx` comparten ~80% del codigo con `tienda/page.tsx`. Son esencialmente la misma pagina con un filtro pre-aplicado.

### Solucion

Convertir las category pages en **redirects a /tienda con query params**:

```typescript
// categoria/[category]/page.tsx — REDIRECT
export default function CategoryPage({ params }) {
  const { site, locale, category } = await params
  redirect(`/s/${locale}/${site}/tienda?category=${encodeURIComponent(category)}`)
}
```

O, si se necesita URL canonicas, hacer que `tienda/page.tsx` maneje el caso:
```typescript
// En tienda/page.tsx
const categoryFromPath = params.category // viene del catch-all o middleware
const filters = {
  ...parseFilters(searchParams),
  categories: categoryFromPath ? [categoryFromPath] : undefined,
}
```

**Impacto**: Elimina ~500 lineas de codigo duplicado.

---

## Problema 7: Estilos Duplicados (MEDIUM)

### Diagnostico

Patrones CSS repetidos literalmente en 10+ componentes:

```typescript
// Aparece en 15+ archivos:
"text-[color:var(--text-muted,#6b7280)]"
"border border-[color:var(--border,#e5e7eb)]"
"focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--primary,#111)]"
"bg-surface"
"text-[color:var(--text,#111)]"
"hover:bg-surface-light"
"text-[color:var(--primary,#111)]"
"rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4"
```

### Solucion

Crear **componentes UI atomicos** en `components/ui/`:

```typescript
// components/ui/card.tsx
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface ${className ?? ''}`}>
      {children}
    </div>
  )
}

// components/ui/badge.tsx — badge reutilizable
// components/ui/pill.tsx — filter pill reutilizable
// components/ui/button.tsx — button variants
// components/ui/chip.tsx — active filter chip
```

**Impacto**: Reduce el bundle CSS en ~15%, elimina errores de copypaste, facilita cambios de diseno globales.

---

## Problema 8: Manejo de Errores Inconsistente (MEDIUM)

### Diagnostico

El `CommerceErrorBoundary` creado cubre el grid de productos, pero el toolbar, trust strip, y category tiles no tienen proteccion. Ademas:

- Algunas paginas usan `try/catch`, otras no
- Los mensajes de error son inconsistentes (algunas en ingles, otras en español)
- No hay logging centralizado de errores de commerce

### Solucion

```typescript
// lib/commerce/error-handling.ts
export class CommerceError extends Error {
  constructor(
    message: string,
    public code: CommerceErrorCode,
    public context?: Record<string, unknown>,
  ) {
    super(message)
  }
}

export function handleCommerceError(error: unknown, context: string): void {
  logger.error(`[Commerce] ${context}:`, error)
  // En produccion: enviar a servicio de monitoring
}
```

---

## Problema 9: Storefront API Routes Sin Estandarizar (LOW)

### Diagnostico

17 endpoints REST en `/api/storefront/[site]/` con patrones inconsistentes:
- Algunos usan `withRequestLog`, otros no
- Algunos validan input, otros no
- Las respuestas de error no tienen formato uniforme

### Solucion

Crear un **API Router Base**:

```typescript
// lib/api/storefront-router.ts
export function createStorefrontHandler<T>(
  handler: (request: Request, context: { business: Business }) => Promise<Response>,
) {
  return withRequestLog(async (request, log, params) => {
    const business = await resolveBusinessBySlug(params.site)
    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    return handler(request, { business })
  })
}
```

---

## Problema 10: UI Components vs Commerce Components (LOW)

### Diagnostico

Hay componentes UI duplicados entre `components/ui/` y `components/commerce/`:
- `components/commerce/breadcrumbs.tsx` podria ser UI generico
- `components/commerce/price-display.tsx` es basicamente `formatCents` con wrapper
- `components/commerce/highlight.tsx` es utilidad de texto, no commerce-specific

### Solucion

Mover componentes genericos a `components/ui/`:
```
components/ui/
  ├── breadcrumbs.tsx
  ├── price-display.tsx
  ├── highlight.tsx
  ├── review-stars.tsx
  ├── skeleton-card.tsx  (el patron de skeleton del loading)
  └── button.tsx
```

---

## Problema 11: Test Coverage Gaps (LOW)

### Diagnostico

| Area | Tests | Cobertura |
|------|-------|-----------|
| lib/commerce/ (35 modulos) | 17 test files | ~50% |
| components/commerce/ (48 archivos) | 0 | **0%** |
| storefront pages (3) | 1 E2E file | **0%** |
| API routes (17) | 0 | **0%** |

### Solucion

Priorizar tests para:
1. `tienda-toolbar.tsx` — el componente mas complejo
2. `product-card.tsx` — el componente mas critico
3. `products.ts` — el modulo de datos principal

---

## Problema 12: Dependencias Circulares Potenciales (LOW)

### Diagnostico

`lib/commerce/products.ts` importa de `lib/compute-totals.ts` que exporta `formatCents` desde `lib/format.ts`. Si `format.ts` importara de `commerce/`, habria ciclo. Actualmente no hay ciclos pero la estructura es fragil.

### Solucion

Mantener `lib/format.ts` como modulo de proposito general SIN dependencias de `lib/commerce/`. Documentar esta restriccion.

---

## Plan de Implementacion por Fases

### Fase 1: Inmediato (2-3 dias) — ALTO IMPACTO

| # | Que | Archivos | Dependencias |
|---|-----|----------|--------------|
| 1 | Unificar tenant-config.ts | `tenant-config.ts`, `shipping-threshold.ts`, `installments.ts`, `tienda/page.tsx` | Ninguna |
| 2 | Crear DAL (data access layer) | Nuevo `dal.ts`, modificar `tienda/page.tsx`, `categoria/page.tsx` | Ninguna |
| 3 | Estandarizar tipos en schemas/ | `schemas/commerce/`, varios imports | Items 1, 2 |

### Fase 2: Corto plazo (1 semana) — IMPACTO MEDIO

| # | Que | Archivos | Dependencias |
|---|-----|----------|--------------|
| 4 | Dividir tienda-toolbar en 5 componentes | `tienda-toolbar/` directorio | Items 1, 2, 3 |
| 5 | Dividir product-card en modulos | `product-card/` directorio | Item 3 |
| 6 | Convertir category pages a redirects | `categoria/[category]/page.tsx`, `categoria/[category]/[tag]/page.tsx` | Item 2 |
| 7 | Crear componentes UI atomicos | `components/ui/card.tsx`, `pill.tsx`, `badge.tsx` | Ninguna |

### Fase 3: Mediano plazo (2 semanas) — IMPACTO BAJO

| # | Que | Archivos | Dependencias |
|---|-----|----------|--------------|
| 8 | Estandarizar API routes | `lib/api/storefront-router.ts`, 17 routes | Items 1, 2 |
| 9 | Centralizar error handling | `lib/commerce/error-handling.ts` | Ninguna |
| 10 | Mover UI components a components/ui/ | Varios | Item 7 |
| 11 | Agregar tests para componentes | `tests/unit/commerce/components/` | Items 4, 5 |

---

## Resumen de Archivos

### Archivos a Crear
```
web/lib/commerce/dal.ts                    → Data Access Layer
web/lib/commerce/error-handling.ts          → Error handling centralizado
web/lib/api/storefront-router.ts            → API route factory
web/components/ui/card.tsx                  → UI atomico
web/components/ui/pill.tsx                  → UI atomico
web/components/ui/badge.tsx                 → UI atomico
web/components/ui/button.tsx                → UI atomico
web/components/commerce/tienda-toolbar/     → Directorio con 5 componentes
web/components/commerce/product-card/       → Directorio con 4 componentes
web/lib/schemas/commerce/ui.ts             → Tipos UI compartidos
web/lib/schemas/commerce/index.ts          → Re-export
```

### Archivos a Modificar
```
web/lib/commerce/tenant-config.ts          → Unificar toda la config
web/lib/commerce/shipping-threshold.ts     → Eliminar (mover a tenant-config)
web/lib/commerce/installments.ts            → Eliminar (mover a tenant-config)
web/lib/commerce/products.ts               → Dividir en 4 modulos
web/lib/schemas/commerce/product.ts        → Agregar ProductSort, ProductFilter
web/app/s/[locale]/[site]/tienda/page.tsx  → Simplificar (usar DAL)
web/app/s/[locale]/[site]/tienda/categoria/ → Convertir a redirect
web/app/s/[locale]/[site]/producto/page.tsx → Simplificar (usar DAL)
```

### Archivos a Eliminar
```
web/app/s/[locale]/[site]/tienda/categoria/[category]/page.tsx  → Redirect
web/app/s/[locale]/[site]/tienda/categoria/[category]/[tag]/page.tsx  → Redirect
```

---

## Metricas de Exito

| Metrica | Antes | Despues (estimado) |
|---------|-------|-------------------|
| Archivos commerce | ~75 | ~60 |
| Lineas totales | ~15,000 | ~12,000 |
| Duplicacion de data fetching | 3 paginas con fetching similar | 1 DAL compartido |
| Config per-tenant dispersa | 4 archivos | 1 archivo |
| Componentes >300 lineas | 4 | 0 |
| Tests unitarios | 17 files (~50%) | 25 files (~75%) |
| Tiempo para agregar nuevo tenant | ~2h (modificar 4+ archivos) | ~15min (1 entrada en config) |
