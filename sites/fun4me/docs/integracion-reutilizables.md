# Integración de piezas reutilizables en fun4me

_Última actualización: 2026-04-21_

> **Estado de ejecución (2026-04-21 cierre):** Fases 0 y 1 mayormente
> shipped en PRs #193–#196 salvo lo marcado como "refactor-pending" abajo.
> Ver sección final "Estado de ejecución" para detalle PR-por-PR.

Auditoría de **todo lo construido en la plataforma** (sections, lib, commerce,
infra, otros tenants) cruzado contra **lo que fun4me ya usa** para identificar
qué podemos enchufar sin construir nada nuevo.

Complemento a `recap-y-mejoras.md` (ese documento habla de features _nuevas_;
éste habla de lo que _ya existe y no estamos usando_).

---

## TL;DR

- **89 sections** existen en la plataforma. fun4me usa **14**. Hay ~75 sin
  tocar, de las cuales **~12 tienen sentido directo** para fun4me.
- **29 libs de commerce + 25 dirs de utilidades** — fun4me usa un subset. Hay
  **8 pistas concretas** de código ya existente que podemos enchufar hoy (ej:
  recently-viewed-rail, promo-banner, countdown-timer, schema.org).
- **Nexa** es la mina de oro de patterns B2B (process-timeline, programs-
  comparison, team, why-destination) — varios aplican a fun4me re-semantizados.
- **Granja Cabral** tiene patterns B2B-wholesale + enhanced-faq searchable +
  our-story que fun4me puede adoptar 1-a-1.
- **1 cambio de whitelist** en `retail-local/vertical.json` desbloquea 8
  sections adicionales.

---

## Parte 1 — Lo que fun4me ya usa

Contando todas las 11 páginas de fun4me:

```
age-gate · hero · trust-badges · services · testimonials · gallery ·
faq · contact · footer · header · whatsapp-float · cta-banner ·
commerce-catalog · featured-products
```

14 section types. Suficiente para la tienda básica, pero por debajo del
potencial de lo que ya existe.

---

## Parte 2 — Qué adoptar, categorizado

### Categoría A — ALLOWED por `retail-local`, drop-in cero fricción

Estas ya están permitidas en el whitelist del vertical; solo falta incluirlas
en los pages JSON de fun4me.

| Sección | De dónde viene | Aplicación en fun4me | Effort |
|---------|----------------|----------------------|--------|
| **trust-signals** | nexa-paraguay (credentials) | Badge de "Verified 18+", PCI DSS compliant, discretion guarantee — arriba del fold del home | 30min |
| **business-hours** | Plataforma base | "Pedidos abiertos hasta las 20:00 — después envío al día siguiente" en home + tienda | 20min |
| **google-maps** | Plataforma base | Zonas de envío (Gran Asunción verde, Interior naranja) en footer o página de envíos | 45min |
| **product-catalog** | Plataforma base (variant) | Estático JSON con curadas "top sellers" — más rápido que DB para landing page | 1h |
| **product-grid** | Plataforma base (variant) | Grid alternativo para categoria landings más simples | skip — commerce-catalog ya cubre |

### Categoría B — Requieren extender `allowedSections` (1 PR de una línea)

Alto ROI pero el vertical `retail-local` no las lista aún. Solución: agregar al
array de `src/verticals/retail-local/vertical.json`.

| Sección | De dónde viene | Aplicación en fun4me | Effort | Recomendación |
|---------|----------------|----------------------|--------|---------------|
| **why-destination** (3-col) | nexa-paraguay | "¿Por qué fun4me?" — 3 columnas: "Discreto" / "Seguro" / "Rápido" — alternativa al hero genérico | 1h | **SÍ** |
| **process-timeline** (vertical) | nexa-paraguay | "Así funciona tu pedido": elegís → pagás → empacamos discreto → llega a tu puerta. Idéntico a /proceso de nexa pero semantizado al flujo de tienda | 1.5h | **SÍ** |
| **enhanced-faq** (searchable) | granja-cabral | La FAQ de fun4me ya tiene 15+ entries — añadir search mejora UX sin rehacer contenido | 30min | **SÍ** |
| **programs-comparison** (matrix) | nexa-paraguay | Tabla de comparación para /suscripciones y /placer-plus — hoy son solo cards | 2h | **SÍ** |
| **our-story** (narrative) | granja-cabral | Brand story en /quienes-somos — fun4me hoy solo tiene hero+CTA ahí | 1h | **SÍ si cliente da texto** |
| **compliance-disclaimer-footer** | nexa-paraguay | Aviso legal "sólo adultos / jurisdicción PY" visible en todas las páginas además del age-gate | 30min | **SÍ** |
| **newsletter-signup** | Plataforma base | Captura de email con consentimiento para marketing — footer o popup post-compra | 45min | **SÍ** |
| **promo-banner** | Plataforma base | Anuncio rotativo arriba del header: "Envío gratis sobre Gs 300k" / "BIENVENIDA10 = 10% off" | 30min | **SÍ** |
| **team** (cards) | nexa, granja-cabral | **NO** — fun4me quiere probable anonimato; discutir con cliente antes | 1h | **MAYBE — preguntar** |
| **b2b-wholesale** (tiered) | granja-cabral | Bulk orders para despedidas, hoteles, sex shops franquiciados — nicho pero lucrativo | 2h | **MAYBE — modelo de negocio nuevo** |
| **booking-embed** (Calendly) | nexa | Consultas privadas pagadas con educadora sexual — nicho premium | 1h | **MAYBE — producto nuevo** |
| **intake-questionnaire** | nexa-paraguay | Cuestionario pre-consulta si activan booking de consultas | 1h | **Depende de booking** |

**Cambio de whitelist propuesto en `retail-local/vertical.json`:**

```json
"allowedSections": [
  "header", "hero", "product-catalog", "product-grid", "services",
  "gallery", "testimonials", "faq", "business-hours", "google-maps",
  "contact", "cta-banner", "footer", "whatsapp-float",
  "commerce-catalog", "featured-products", "trust-signals", "age-gate", "trust-badges",
  // NUEVAS:
  "why-destination", "process-timeline", "enhanced-faq",
  "programs-comparison", "our-story", "compliance-disclaimer-footer",
  "newsletter-signup", "promo-banner"
]
```

### Categoría C — Sections especializadas que **no** tienen sentido para fun4me

Las pongo para cerrar el circuito — así queda claro qué descartamos y por qué.

| Sección | Por qué NO |
|---------|-----------|
| `menu-categorized-priced`, `sushi-menu`, `sake-menu`, `omakase`, `huevo-del-dia`, `recipe`, `nutritional-info` | F&B-específico |
| `property-listings`, `service-area-map-zones`, `mortgage-calculator` | Real-estate-específico |
| `class-schedule`, `membership-plans`, `room-booking`, `event-venues`, `preorder-calendar` | Hospitality / fitness / educación |
| `conveyor-belt`, `before-after`, `portfolio` | Visual-specific a otros verticales |
| `multi-step-form`, `lead-form`, `quote-form` | Modelo de venta consultiva, no retail |
| `countdown-timer` | Útil solo para flash sales — **reconsiderar cuando activemos campañas** |
| `savings-calculator`, `bulk-calculator`, `delivery-calculator` | No hay caso de uso directo (shipping ya se calcula en checkout) |
| `instagram-feed` | Podría servir si fun4me tiene IG activo — **maybe** |

### Backlog de refactor de plataforma

Durante la adopción encontramos 5 sections que están en el repo pero con
**contenido hardcoded granja-cabral-específico** dentro del componente.
No son drop-in reutilizables hasta que se parametricen:

| Sección | Hardcoded que bloquea | Refactor necesario |
|---------|----------------------|---------------------|
| `enhanced-faq-section.tsx` | Array FAQS interno con preguntas de granja (huevos, gallinas, maples) | Aceptar `items[]` desde content prop |
| `our-story-section.tsx` | Icons Egg/Bird/Sprout hardcoded + shape de `BusinessData` con `sustainability.composting/biogas/waterRecycling` | Aceptar story/values/stats genéricos desde content; icons por key |
| `b2b-wholesale-section.tsx` | Copy granja en el componente | Aceptar tiers/benefits/copy desde content |
| `smart-whatsapp-section.tsx` | `WHATSAPP_TEMPLATES` con "huevos/semana", "maple gratis" | Aceptar templates[] desde content prop |
| `referral-section.tsx` | Prefijo "CABAL", URL granjacabral.com.py, emoji de huevo, "maple de huevos gratis" | Aceptar businessName, codePrefix, rewardCopy, baseUrl desde props |

Cada uno es ~30min-2h de refactor. Recomendación: hacerlo cuando un
tenant concreto lo pida; mientras tanto, no usar en fun4me.

### Categoría D — Libs y utilidades que no estamos usando

Pistas de código ya construido que fun4me no enchufa todavía.

| Lib / Componente | Qué hace | Cómo lo usa fun4me | Effort |
|------------------|---------|---------------------|--------|
| **recently-viewed-rail** (`components/commerce/`) | Carrusel de "visto recientemente" en PDP/tienda | Pegar en PDP + tienda footer | 15min |
| **smart-whatsapp-section** (`components/sections/`) | WhatsApp con mensaje prellenado por contexto | Reemplazar whatsapp-float genérico en PDPs: "Hola, quiero saber más sobre {productName}" | 45min |
| **countdown-timer-section** | Timer a deadline | Para expiration de cupón BIENVENIDA10 en banner | 30min |
| **stock-indicator-section** | Badge de stock ("solo 2") | Ya hay stock en DB — solo hay que usarlo en product-card | 30min |
| **open-hours-status-section** | Live open/closed | "Pedidos abiertos" / "Cerrado — abre a las 10:00" en header | 45min |
| **referral-section** (+ `lib/commerce/referral.ts` WIP) | Programa de referidos | Activar para dar %off al referido — **requiere terminar el WIP en stash@{0}** | 1 día |
| **lib/seo/json-ld.ts** | Schema.org Product + Offer | Inyectar en PDP — **Google Shopping free** | 45min |
| **lib/experiments/ab-test.ts** + hero-variant | A/B testing framework | Probar 2 hero copys distintos en home | 1h |
| **lib/hooks/use-section-impression.ts** | Track section views | Entender qué sections del home convierten y cuáles no | 1h |
| **currency-toggle-section** + `lib/commerce/currency.ts` | Multi-moneda | Mostrar USD+PYG toggle (turistas / nearshoring buyers) | 1h |
| **cart-recovery email** (template ya existe en `email-templates.ts`) | Email de carrito abandonado | Añadir cron trigger — template listo | 2h |

---

## Parte 3 — Adopción sugerida en fases

### Fase 0 — Ship hoy (esta semana, 1 día total)

Zero-risk, zero-decisión-humana. Adopción de Categoría A + pistas D de bajo costo.

1. Whitelist update en `retail-local/vertical.json` (1 línea)
2. Añadir **trust-signals** a home (discretion + payment + verified 18+)
3. Añadir **business-hours** a home + footer
4. Añadir **recently-viewed-rail** a PDP y tienda
5. Añadir **stock-indicator-section** en product-card
6. Añadir **schema.org Product/Offer** en PDP (json-ld)

**Impacto esperado:** +5-10% conversión por trust signals + schema.org
indexación + stock urgency. Cero código nuevo.

### Fase 1 — Esta quincena (3-4 días)

Adopción de Categoría B (las con "SÍ") + pistas D restantes.

7. **why-destination** en home (reemplaza una sección de services dup)
8. **process-timeline** nueva página `/como-pedir` (referenciada desde hero CTA)
9. **enhanced-faq** reemplaza `faq-section` en /faq y /legal
10. **programs-comparison** (matrix) en /suscripciones y /placer-plus
11. **promo-banner** arriba del header (BIENVENIDA10)
12. **newsletter-signup** en footer
13. **countdown-timer** en promo-banner si hay fecha de expiración
14. **smart-whatsapp** en PDPs (contextual)
15. **compliance-disclaimer-footer** en todas las páginas (legal/age)

**Impacto esperado:** +15-20% conversión por comparación clara de planes,
reducción de abandonos por FAQ mejorada, up-sell por recently-viewed + promo.

### Fase 2 — Mes siguiente (1-2 semanas)

Adopción de pistas D pesadas.

16. Terminar `lib/commerce/referral.ts` (WIP en stash@{0}) + UI de referidos
17. Activar cart-recovery email (trigger cron + test)
18. Añadir `use-section-impression` analytics → dashboard de section performance
19. A/B test 2 hero copys en home
20. Traducción a EN (opcional — depende si cliente quiere mercado turista)
21. our-story en /quienes-somos (si cliente aporta texto)

**Impacto esperado:** aprendizaje de data para iteraciones futuras; recuperar
carritos; generar growth orgánico por referidos.

### Fase 3 — Evaluar con cliente (decisión humana requerida)

22. **team** en /quienes-somos — ¿cliente quiere mostrar cara o mantener anonimato?
23. **b2b-wholesale** — ¿tiene sentido un canal mayorista?
24. **booking-embed** Calendly — ¿quieren ofrecer consultas pagadas?
25. **intake-questionnaire** — depende de la anterior

---

## Parte 4 — Lo que fun4me **inventó** y otros tenants pueden reusar

Equilibrando la audit: lo construido _para_ fun4me que otros deberían absorber.

| Pieza | Hecho para fun4me | Quién más lo necesita |
|-------|-------------------|------------------------|
| **age-gate-section** | Sí (18+ sexwellness) | Cualquier licorería, tabaquería, casino, gaming |
| **commerce-catalog-section** (con unaccent search + analytics) | Sí (tienda pilot) | Todos los que activen `commerce_enabled` — salon-maria, gymfit, granja-cabral |
| **trust-badges-section** | Compartido (nexa también tenía) | Cualquier tenant que quiera reforzar confianza |
| **back-in-stock + `search_events` + `search_haystack`** | Sí (tienda) | Cualquier tenant con `products` — especialmente retail |
| **header scroll-hide pattern (PR #189)** | Disparado por fun4me (hero busy) | **Ya activo para todos** — es global |
| **Wishlist + recent-searches stores** | Sí (tienda) | Cualquier tenant comercial |
| **Per-tenant OG image** | Disparado por fun4me | **Ya activo para todos** — es global |
| **locale-aware hero/footer** | Disparado por fun4me (German leak) | **Ya activo para todos** — es global |

**Moraleja:** la mayoría del build de fun4me ya beneficia al resto de la
plataforma. Ahora toca el movimiento inverso: fun4me adoptar lo que Nexa y
Granja Cabral validaron.

---

## Parte 5 — Decisiones que necesito del humano

Listo para ejecutar, solo necesito luz verde en:

1. **¿Fase 0 completa la merge-o esta semana?** (recomiendo sí — riesgo 0)
2. **¿Fase 1 para esta quincena?** (recomiendo sí — alto ROI)
3. **¿Team section sí/no?** (anonimato del cliente)
4. **¿B2B wholesale sí/no?** (modelo de negocio nuevo)
5. **¿Consultas pagadas via booking sí/no?** (producto nuevo)
6. **¿Multi-locale EN activado?** (mercado turista)

Si la respuesta a las 6 es "sí" → 2-3 semanas de trabajo, nada nuevo que
construir, todo es adaptación + content.

---

## Estado de ejecución (cierre 2026-04-21)

### Shipped

| PR | Contenido |
|----|-----------|
| #193 | Vertical whitelist update + home: trust-signals, why-destination, process-timeline. suscripciones: programs-comparison matrix. |
| #194 | compliance-disclaimer-footer wired en site-renderer + agregado a 10 páginas fun4me. |
| #195 | promo-banner (carousel BIENVENIDA10 + envío gratis) + newsletter-signup (Mailchimp) wired y usados en home. |
| #196 | Nueva página `/quienes-somos` (about) con why-destination `alternating` + trust-signals + testimonials. Agregado a nav. |

Schema.org Product/Offer en PDP, RecentlyViewedRail, BackInStockSignup,
WishlistButton, ProductShare y stock-indicator vía `lowStockThreshold` en
product-card — **todos estos ya estaban shipped antes de esta sesión**.

### No shipped (y por qué)

- `enhanced-faq`, `our-story`, `b2b-wholesale`, `smart-whatsapp`,
  `referral-section` → necesitan refactor de parametrización antes de ser
  usables por fun4me. Ver "Backlog de refactor de plataforma" arriba.
- **EN locale** → requiere traducir ~1000 líneas de `es.json` + routing;
  pendiente de decisión humana sobre prioridad del mercado turista.
- **Team section** → fun4me probablemente prefiere mantener anonimato;
  pendiente conversación con cliente.
- **Booking-embed consultas** → necesita URL de Calendly (o equivalente)
  de una educadora sexual que contrate fun4me.
- **countdown-timer standalone** → redundante con `promo-banner` variant
  `countdown`. Dejar como está.
- **Cart-recovery cron trigger** → el outbox + template ya existen; falta
  sólo el cron que escanea carritos abandonados >24h. 2h de trabajo.
- **Referral UI integration** → referral-section necesita refactor; los
  archivos WIP `lib/commerce/referral.ts` en `stash@{0}` tienen imports
  rotos (`@/lib/supabase/server-client` no existe). Orden: refactor
  componente → refactor lib → shippear.

### Próximos pasos sugeridos (si seguimos)

1. Refactor de `enhanced-faq` para aceptar items desde content (30min).
2. Refactor de `our-story` para aceptar shape genérico (1h).
3. Fix de imports en `lib/commerce/referral.ts` + refactor de
   `referral-section` para parametrizar (2-3h).
4. Cron trigger de cart-recovery (1-2h).
5. EN locale traducción si el negocio lo necesita (1-2 días).

## Apéndice — Dónde está cada pieza

- Sections: `web/components/sections/*.tsx`
- Commerce: `web/components/commerce/*.tsx`
- Libs: `web/lib/**/*.ts`
- Verticals: `src/verticals/*/vertical.json`
- Fun4me pages: `sites/fun4me/pages/*.json`
- Nexa pages (referencia): `sites/nexaparaguay/pages/*.json`
- Granja Cabral pages (referencia): `sites/granja-cabral/pages/*.json`
