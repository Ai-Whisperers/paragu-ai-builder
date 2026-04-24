# Tenant Self-Service Portal — Implementation Plan

> Goal: Every business owner can log in, edit their site content, manage orders, and create promotions — without admin intervention.

---

## Phase 0 — Auth & Data Model (essential, ~3 days)

### 0.1 Database Migration: `tenant_users`

```sql
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'manager')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: service_role full access; authenticated tenant_users can read own
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
```

### 0.2 Magic Link Auth

Leverage existing Supabase magic link (already wired in `auth/callback/`).

New route: `/api/auth/tenant/login`
- Accept email
- Map to `tenant_users` table
- Send magic link via Resend (existing email infrastructure)
- On callback: set session with `tenant_id` and `business_id` claims

### 0.3 Tenant Auth Middleware

Extend `middleware.ts` to check:
- Cookie for tenant session
- Route pattern `/dashboard/*` requires valid tenant session
- On invalid: redirect to `/login` (not the admin login, a tenant login)

### 0.4 Create Tenant Login Page

`web/app/tenant-login/page.tsx`
- Email input → sends magic link
- Simple, branded, says "Acceso para clientes" or similar
- No admin auth required

---

## Phase 1 — Dashboard Shell (~2 days)

### 1.1 Route Structure

```
/dashboard/[slug]/
├── layout.tsx           ← Nav sidebar + top bar + auth check
├── page.tsx             ← Overview stats (orders, products, content status)
├── contenido/           ← Content editor (reuse existing components)
│   └── page.tsx
├── pedidos/             ← Order viewer (reuse existing admin components)
│   └── page.tsx
├── productos/           ← Product management
│   └── page.tsx
├── descuentos/          ← Discount/promo management
│   └── page.tsx
└── configuracion/       ← Business info editor
    └── page.tsx
```

### 1.2 Dashboard Layout

- Sidebar nav: Inicio, Contenido, Pedidos, Productos, Descuentos, Configuración
- Top bar: business name + logout button
- All routes protected by tenant auth middleware
- Fetch `business_id` from session → scope all queries

### 1.3 Overview Page

Show:
- Business name and status
- Orders this week count
- Pending orders count
- Products count
- Quick links: "Edit homepage text", "View recent orders", "Create discount"

---

## Phase 2 — Wiring Content Editor to Live Site (~3 days)

### 2.1 Current Problem

Content editor saves to `businesses.data_json.content` but the live site reads from static JSON files (`sites/<slug>/content/`).

### 2.2 Fix: Engine Reads from DB First

Modify `web/lib/engine/compose.ts` (or the content resolution layer):

```typescript
async function loadContent(businessId: string, locale: string) {
  // 1. Read DB content first (tenant-edited)
  const dbContent = await loadBusinessContent(businessId)
  if (dbContent) return dbContent

  // 2. Fall back to static JSON files (build-time defaults)
  return loadStaticContent(businessId, locale)
}
```

This way:
- If tenant has saved edits → DB content is used
- If no edits exist → static JSON is used (backward compatible)
- Edits take effect immediately (no redeploy needed)

### 2.3 Expose Content Editor to Tenant

Reuse `ContentEditor` component from:
`web/components/admin/content/content-editor.tsx`

New route: `/dashboard/[slug]/contenido`
- Same component, new auth context
- Calls same PUT API but with tenant auth (not admin auth)
- After save: show success toast, confirm changes are live

### 2.4 New API Route

`PUT /api/tenant/content/[businessId]`

Same logic as existing `PUT /api/admin/content/[businessId]` but:
- Validates tenant session + business_id match
- No admin email check

---

## Phase 3 — Expose Existing Commerce UI to Tenants (~2 days)

### 3.1 Order Viewer

Reuse: `web/app/admin/commerce/[businessId]/orders/`

New route: `/dashboard/[slug]/pedidos`
- Table: order #, date, customer, total, status
- Detail: status timeline, items, payment info, comprobante
- No admin-only features (invoicing, reconciliation)
- Actions: mark as preparing/shipped/delivered

### 3.2 Discount Creator

Reuse: `web/components/admin/commerce/discounts-manager.tsx`

New route: `/dashboard/[slug]/descuentos`
- Create: percent off, Gs. off, free shipping
- Activate/pause existing discounts
- No delete (admin-only for control)

### 3.3 Product Manager

Reuse: product CRUD components

New route: `/dashboard/[slug]/productos`
- List products with stock status
- Edit name, price, description, image, stock
- Toggle active/inactive
- Quick add new product

### 3.4 New Tenant API Routes

```
GET /api/tenant/[businessId]/orders        → business-scoped orders
PATCH /api/tenant/[businessId]/orders/[id]  → status update
GET /api/tenant/[businessId]/products       → product list
POST /api/tenant/[businessId]/products      → create product
PATCH /api/tenant/[businessId]/products/[id] → update product
GET /api/tenant/[businessId]/discounts      → discount list
POST /api/tenant/[businessId]/discounts     → create discount
PATCH /api/tenant/[businessId]/discounts/[id] → toggle active
```

Each route checks:
- Tenant session is valid
- Session `business_id` matches URL `businessId`
- Returns 403 if mismatch

---

## Phase 4 — Business Info Editor (~1 day)

### 4.1 Info Form

`/dashboard/[slug]/configuracion`

Fields:
- Business name
- Phone / WhatsApp
- Email
- Address, city, neighborhood
- Hours (7-day, already have component)
- Logo URL
- Social links (Instagram, Facebook)

Save to `businesses` table directly:
```sql
UPDATE businesses SET name = $1, phone = $2, whatsapp = $3, ... WHERE id = $4
```

### 4.2 API Route

`PATCH /api/tenant/[businessId]/settings`
- Saves to `businesses` row
- Returns updated business object

---

## Phase 5 — Onboarding Wizard (~2 days)

### 5.1 Post-Signup Flow

When lead status changes to `onboarded`:
1. Send welcome email with dashboard link
2. Create `tenant_users` record
3. First login → redirect to wizard

### 5.2 Wizard Steps

```
Step 1: Welcome + connect payment method (manual, etc.)
Step 2: Fill business info (name, phone, hours, etc.)
Step 3: Choose sections for homepage (they pick what to show)
Step 4: Write hero text + upload logo
Step 5: Done → redirect to dashboard
```

### 5.3 Token-Based Access

`onboarding_tokens` table already exists. Use it:
- Generate token on lead → onboarded transition
- Email link: `/onboarding/{token}`
- Token validates once, creates tenant session
- Redirect to dashboard

---

## Summary

| Phase | Effort | Dependencies | Delivers |
|-------|--------|-------------|----------|
| 0. Auth + Data Model | 3 days | Supabase, Resend | Tenant login works |
| 1. Dashboard Shell | 2 days | Phase 0 | Tenant can log in, see stats |
| 2. Content Wiring | 3 days | Phase 0-1 | Edits go live immediately |
| 3. Commerce UI | 2 days | Phase 0-1 | Orders, discounts, products |
| 4. Business Info | 1 day | Phase 0-1 | Hours, phone, address editable |
| 5. Onboarding | 2 days | Phase 0-2 | New tenants get setup flow |
| **Total** | **~13 days** | | |

---
### Quick Wins (do first, high impact)

1. **Content wiring** (Phase 2.2) — just modify the engine to read from DB. Zero new UI. Admin-made edits become live overnight.
2. **Tenant login page** (Phase 0.4) — copy existing login page, remove admin check. Simple.
3. **Stats overview** (Phase 1.3) — reuse existing `businesses` query. Show order count, product count.

