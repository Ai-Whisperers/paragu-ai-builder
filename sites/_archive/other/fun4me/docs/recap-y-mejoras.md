# Recap completo y plan de mejoras — fun4me

_Última actualización: 2026-04-21_

Este documento consolida **todo lo que se construyó** para fun4me y la plataforma
durante la saga de la tienda (PRs #188, #189 y los anteriores de commerce), y
propone un plan de mejoras priorizado.

Lectores: equipo ParaguAI (interno). Para fun4me como cliente, ver
`estado-y-plan.md`.

---

## Parte 1 — Lo que existe hoy (fun4me)

### 1.1 Sitio y rutas activas

| Ruta | Estado | Notas |
|------|--------|-------|
| `/s/es/fun4me` | live | landing con hero, beneficios, categorías, destacados, CTA |
| `/s/es/fun4me/tienda` | live | catálogo con búsqueda, filtros, sort, paginación |
| `/s/es/fun4me/tienda/categoria/[slug]` | live | rutas dedicadas por categoría + breadcrumb |
| `/s/es/fun4me/producto/[slug]` | live | PDP con wishlist + back-in-stock si agotado |
| `/s/es/fun4me/favoritos` | live | wishlist del usuario (localStorage) |
| `/s/es/fun4me/bundles`, `/suscripciones`, `/blog`, `/gift-cards`, `/placer-plus`, `/quienes-somos`, `/faq`, `/contacto` | live | páginas de contenido |

### 1.2 Datos seed en Supabase

- `businesses` row — `id = 5de6a1cb-6170-4047-a6db-8c4995820fe4`
- `products` — 12 productos con precio, stock, imágenes, categoría
- `shipping_zones` — Gran Asunción y Interior configurados
- `discounts` — cupón `BIENVENIDA10` activo

### 1.3 Extras específicos de fun4me

- **Age-gate** (18+) inyectado como primer elemento de las 11 páginas — modal
  con `localStorage` + focus trap + variantes por locale.
- **Trust-badges** (envío discreto / pago seguro / envío a todo el país)
  integrados en home, tienda y PDP.
- **Copys** en castellano paraguayo neutro, listos para revisión por el cliente.
- **OG image** por tenant vía `opengraph-image.tsx`: cuando se comparte el link
  en WhatsApp / Instagram aparece marca fun4me y no el logo genérico.

---

## Parte 2 — Lo que se construyó a nivel plataforma (reutilizable)

Todo lo de abajo vive en `web/` y sirve para **cualquier tenant** que active
`commerce_enabled = true`. fun4me es hoy el piloto, pero nexa/gym/spa pueden
heredar cualquiera de estas piezas cambiando solo el contenido.

### 2.1 Secciones de contenido (`web/components/sections`)

| Sección | Uso | Tenants |
|---------|-----|---------|
| `commerce-catalog-section` | grid + toolbar + paginación de productos | fun4me |
| `featured-products-section` | slider de destacados | fun4me, futuros |
| `trust-badges-section` | grid de íconos + label | fun4me, nexa (prev) |
| `age-gate-section` | modal 18+ con persistencia | fun4me (único por ahora) |
| `hero-section` | ahora locale-aware (trust-badge labels DE/EN/ES/NL/PT) | todos |
| `footer-section` | ahora locale-aware (`rights` por idioma) | todos |
| `header-section` | scroll-hide / scroll-reveal, opaco siempre | todos |

### 2.2 Commerce core (`web/components/commerce` + `web/lib/commerce`)

- `product-card.tsx` con wishlist overlay + quick-view modal + hover image swap.
- `header-search.tsx` con autocomplete debounced (220ms) + recent searches.
- `quick-view-modal.tsx` para hacer peek del PDP sin navegar.
- `back-in-stock-signup.tsx` en PDPs agotadas.
- `tienda-toolbar.tsx` filtros en 4 filas (search/sort, pills, precio/toggles,
  chips activos + clear-all).
- `tienda-pagination.tsx` paginación numérica con ventana ±2 + elipsis.
- `wishlist-button.tsx` + `wishlist-page-client.tsx`.

### 2.3 Búsqueda y analytics

- **Accent-insensitive search** vía `search_haystack` (columna generada con
  `unaccent` + `lower`) + `pg_trgm` gin index. "acai" matchea "açaí".
- `lib/commerce/search-normalize.ts` — `normalizeSearchTerm()` cliente + server.
- `lib/commerce/search-events.ts` — `recordSearchEvent()` guarda cada query +
  result-count en `search_events`. `listTopSearches()` agrega top/zero-result.
- Admin dashboard: `/admin/commerce/[businessId]/search-analytics` muestra las
  queries más populares y las zero-result para mejorar el catálogo.

### 2.4 Back-in-stock

- Tabla `back_in_stock_subscriptions (business_id, product_id, email)` única.
- API POST `/api/storefront/[site]/back-in-stock` con validación Zod.
- Cron `GET /api/cron/commerce-back-in-stock` escanea pendientes cuando el stock
  vuelve > 0 y enquea en `commerce_email_outbox` con template `back_in_stock`.
- Template email en `lib/commerce/email-templates.ts::backInStockEmail`.

### 2.5 Stores del cliente (localStorage + `useSyncExternalStore`)

- `lib/stores/wishlist.ts` — persistencia + evento `paragu:wishlist-change`
  para sincronización cross-tab.
- `lib/stores/recent-searches.ts` — últimas 5 búsquedas del usuario.
- Cart store (previo) — sigue funcionando igual.

### 2.6 Infraestructura

- **CSP extendido** en `next.config.mjs` para GA4 (googletagmanager,
  google-analytics, analytics.google.com).
- **Per-tenant OG** — `app/s/[locale]/[site]/opengraph-image.tsx` + override
  explícito en `generateMetadata` para que `next/og` no se pise con el
  genérico.
- **Path-based tenants** (`/fun4me/*`) funcionando vía middleware rewrite a
  rutas canónicas `/s/es/fun4me/*`.
- **Engine section catalog** — registry único (`SECTION_CATALOG`,
  `SECTION_MAP`, `SECTION_BUILDERS`, `site-renderer`) para que añadir una
  nueva sección sea un PR de una línea en cada array.

---

## Parte 3 — Fixes de infra que salieron en el camino

Estos no son features pero son aprendizajes permanentes:

1. **`DYNAMIC_SERVER_USAGE` no se resuelve con `unstable_noStore()`** en el
   componente. Hay que poner `export const dynamic = 'force-dynamic'` en la
   **ruta** (`app/s/[locale]/[site]/[[...page]]/page.tsx`) cuando un server
   component dentro del árbol usa `cookies()`.
2. **Docker Swarm puede desplegar imágenes viejas silenciosamente** si el build
   falla. Siempre chequear `docker service logs paragu-ai_web --tail 200` tras
   un deploy que "pasó" pero el sitio sigue igual.
3. **Los textos hardcoded en idioma equivocado se filtran entre tenants**
   (caso "Professionell / Vertrauenswürdig" alemán apareciendo en fun4me
   castellano). Cualquier copy debe ser locale-keyed.
4. **Nav `href: "/"` en content files brinca fuera del tenant.**
   `compose-site.ts` ahora reescribe `""` / `"/"` → `site.path ??
   /s/{locale}/{siteSlug}`.
5. **PostgREST embedded joins** devuelven array cuando hay FK, objeto cuando no
   — hay que tener un `pickOne<T>(v: T | T[] | null)` helper defensivo.
6. **Header translúcido sobre hero busy** hace la nav ilegible — por eso ahora
   es opaco o completamente fuera de pantalla.

---

## Parte 4 — Plan de mejoras (priorizado)

Ordenado por **impacto / esfuerzo** para el trimestre. Los tiempos son estimados
rough para una sola persona trabajando foco.

### Ronda 1 — polish de conversión (1-2 semanas)

| # | Mejora | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 1 | **Reviews + moderación** en PDP (1-5 estrellas + texto) | alto — aumenta conversión | 2 días |
| 2 | **Upsell/cross-sell en carrito** (3 productos "te puede interesar") | alto | 1 día |
| 3 | **Checkout progress indicator** (3 pasos visuales) | medio | 0.5 días |
| 4 | **Abandoned cart email** (ya hay outbox, falta trigger + template) | alto — recupera ventas | 1.5 días |
| 5 | **Stock threshold warning** ("solo quedan 2") en PDP | medio | 0.5 días |

### Ronda 2 — activación de pagos (2-3 semanas)

| # | Mejora | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 6 | **Pagopar live** — webhook signature verification + estado real en orders | crítico para cobrar | 1 semana |
| 7 | **WhatsApp-order fallback** (si Pagopar falla, botón "pagar por transferencia via WhatsApp") | medio | 1 día |
| 8 | **Recibo PDF** auto-generado y enviado al cliente | medio | 1-2 días |
| 9 | **Admin orders dashboard** — estado, tracking, marcar enviado | alto | 3-4 días |

### Ronda 3 — plataforma (3-4 semanas)

| # | Mejora | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 10 | **Unified admin** — un dashboard por tenant (ventas, stock, SEO, search analytics) | alto — ahora hay 4 URLs distintas | 1 semana |
| 11 | **Suscripciones recurrentes** (tabla + billing cron + UI de gestión) | medio — fun4me y otros lo necesitan | 1-2 semanas |
| 12 | **Gift cards reales** (hoy es página estática — no hay modelo DB ni canje) | medio | 1 semana |
| 13 | **Multi-moneda visual** (PYG nativo, USD/EUR mostrado, tasa cacheada) — ya hay `loadPygRates`, falta el selector UI | bajo | 2 días |

### Ronda 4 — crecimiento orgánico (cuando haya cliente pagando)

| # | Mejora | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 14 | **Programa de referidos** (ya hay `referral.ts` WIP — completar flow) | alto — viralidad | 3-4 días |
| 15 | **Blog con MDX real + RSS** (hoy el `/blog` es placeholder) | medio — SEO | 1 semana |
| 16 | **Schema.org Product + Offer** en todos los PDPs | alto — Google Shopping free | 2 días |
| 17 | **Sitemap.xml dinámico** por tenant (hoy es estático) | alto — SEO indexación | 1 día |
| 18 | **Búsqueda server-side con filtros facetados** (price ranges auto-calculados, category counts) — arquitectura ya lo soporta, falta UX | medio | 3 días |

### Riesgos técnicos conocidos

- `lib/commerce/{referral,reviews,wishlist}.ts` tienen typecheck rotos
  (`@/lib/supabase/server-client` y `@/types/database` no existen). Borrar o
  refactorizar en el próximo tramo. _Actualmente están como untracked local
  files en el worktree, NO mergeados a Main._
- El store en Main (reviews + referrals) está parcialmente empezado; decidir:
  terminar o eliminar. Recomendación: terminar reviews (alto ROI), eliminar
  referral por ahora (bajo ROI sin tráfico pago).
- La age-gate solo persiste en `localStorage` — si abren desde incognito cada
  vez les vuelve a aparecer. Considerar cookie de 30 días si molesta a usuarios.
- `search_events` crece sin límite — agregar cron de pruning >90 días antes de
  que sea gigante.

### Decisiones que necesita el humano (no-engineering)

- ¿Activamos Pagopar con cuenta real de fun4me o seguimos con transferencia +
  WhatsApp por ahora?
- ¿Reviews moderadas manualmente o auto-publicadas con flag NSFW?
- ¿Gift cards reales o mantener página como "próximamente"?
- ¿Programa de referidos con descuento % o monto fijo?

---

## Apéndice — Archivos clave modificados/creados en esta saga

### Secciones nuevas
- `web/components/sections/commerce-catalog-section.tsx`
- `web/components/sections/featured-products-section.tsx`
- `web/components/sections/trust-badges-section.tsx`
- `web/components/sections/age-gate-section.tsx`

### Secciones modificadas
- `web/components/sections/header-section.tsx` (scroll-hide behavior — PR #189)
- `web/components/sections/hero-section.tsx` (locale-aware trust badges)
- `web/components/sections/footer-section.tsx` (locale-aware rights)

### Commerce
- `web/components/commerce/product-card.tsx`
- `web/components/commerce/header-search.tsx`
- `web/components/commerce/quick-view-modal.tsx`
- `web/components/commerce/back-in-stock-signup.tsx`
- `web/components/commerce/tienda-toolbar.tsx`
- `web/components/commerce/tienda-pagination.tsx`
- `web/components/commerce/wishlist-button.tsx`
- `web/components/commerce/wishlist-page-client.tsx`

### Lib
- `web/lib/stores/wishlist.ts`, `recent-searches.ts`
- `web/lib/commerce/products.ts`
- `web/lib/commerce/search-normalize.ts`
- `web/lib/commerce/search-events.ts`
- `web/lib/commerce/back-in-stock.ts`
- `web/lib/commerce/email-templates.ts`
- `web/lib/engine/compose-site.ts` (nav href fix)

### App routes
- `web/app/s/[locale]/[site]/[[...page]]/page.tsx` (force-dynamic + per-tenant OG)
- `web/app/s/[locale]/[site]/opengraph-image.tsx`
- `web/app/s/[locale]/[site]/tienda/page.tsx`
- `web/app/s/[locale]/[site]/tienda/categoria/[category]/page.tsx`
- `web/app/s/[locale]/[site]/favoritos/page.tsx`
- `web/app/s/[locale]/[site]/producto/[slug]/page.tsx`
- `web/app/api/storefront/[site]/search-suggest/route.ts`
- `web/app/api/storefront/[site]/back-in-stock/route.ts`
- `web/app/api/cron/commerce-back-in-stock/route.ts`
- `web/app/admin/commerce/[businessId]/search-analytics/page.tsx`

### Config / infra
- `web/next.config.mjs` (CSP para GA4)
- `src/verticals/retail-local/vertical.json` (allowedSections)
- Migrations Supabase: `unaccent`, `search_haystack`, `pg_trgm` index,
  `back_in_stock_subscriptions`, `search_events`, CHECK extension de
  `commerce_email_outbox.template`.

### Content (fun4me-specific)
- `sites/fun4me/pages/*.json` (age-gate inyectado, store usa commerce-catalog)
- `sites/fun4me/docs/cuestionario-completo.md`
- `sites/fun4me/docs/estado-y-plan.md`
- `sites/fun4me/docs/recap-y-mejoras.md` (este documento)
