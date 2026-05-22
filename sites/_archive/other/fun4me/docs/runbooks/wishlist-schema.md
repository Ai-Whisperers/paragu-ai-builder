# Runbook — Wishlist schema

Platform-level table needed to support wishlist feature for Fun4Me (and future tenants).

## Supabase DDL

```sql
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_token text, -- for non-logged-in users
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT wishlist_owner CHECK (
    (user_id IS NOT NULL AND anonymous_token IS NULL) OR
    (user_id IS NULL AND anonymous_token IS NOT NULL)
  )
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id uuid NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  notes text,
  added_at timestamptz DEFAULT now(),
  UNIQUE(wishlist_id, product_id, variant_id)
);

CREATE INDEX idx_wishlist_business ON wishlists(business_id);
CREATE INDEX idx_wishlist_user ON wishlists(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_wishlist_token ON wishlists(anonymous_token) WHERE anonymous_token IS NOT NULL;
CREATE INDEX idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);
CREATE INDEX idx_wishlist_items_product ON wishlist_items(product_id);

-- RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own wishlists" ON wishlists
  FOR SELECT USING (
    user_id = auth.uid()
    OR anonymous_token = current_setting('app.anonymous_token', true)
  );

CREATE POLICY "Users insert own wishlists" ON wishlists
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR (user_id IS NULL AND anonymous_token IS NOT NULL)
  );

CREATE POLICY "Users update own wishlists" ON wishlists
  FOR UPDATE USING (
    user_id = auth.uid()
    OR anonymous_token = current_setting('app.anonymous_token', true)
  );

CREATE POLICY "Users delete own wishlists" ON wishlists
  FOR DELETE USING (
    user_id = auth.uid()
    OR anonymous_token = current_setting('app.anonymous_token', true)
  );

-- Same pattern for wishlist_items (inherit access via wishlist_id)
CREATE POLICY "Users manage own wishlist items" ON wishlist_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM wishlists w
      WHERE w.id = wishlist_items.wishlist_id
      AND (w.user_id = auth.uid() OR w.anonymous_token = current_setting('app.anonymous_token', true))
    )
  );
```

## Platform API endpoints

Add to `web/app/api/wishlist/`:

- `GET /api/wishlist` — read current wishlist (by session or user)
- `POST /api/wishlist/items` — add product
- `DELETE /api/wishlist/items/:id` — remove
- `POST /api/wishlist/merge` — merge anonymous wishlist into user's on login

## Anonymous → logged-in merge

On login:
1. Read anonymous token from cookie
2. Find wishlist by anonymous_token
3. Transfer items to user's logged-in wishlist
4. Delete anonymous wishlist

Prevents losing cart on signup flow.

## Back-in-stock notifications

When a wishlist item transitions to `stock > 0`, fire notification:
- Email (if user has email)
- WhatsApp Business (if opt-in + WA Business API live)
- In-site badge next login

Background job: `web/app/api/jobs/wishlist-stock-check/route.ts` runs every 30 min.

## Migration plan

- Phase 1: anonymous-only (localStorage fallback) — works immediately, no DB.
- Phase 2: Supabase table with anonymous_token (above DDL). Transparent upgrade from localStorage.
- Phase 3: back-in-stock notifications.

## Security considerations

- Anonymous token: 32 chars, cryptographically random. Cookie with httpOnly, secure, sameSite=lax.
- Rate limit: 100 items max per anonymous wishlist.
- Expire anonymous wishlists after 60 days of inactivity.
