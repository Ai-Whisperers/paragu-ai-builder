# Add a new tenant · runbook

> Step-by-step for promoting a new business onto ParaguAI infrastructure.
> Closes BUG_HUNT_500 #486. Companion to `docs/DEMO_POLISH_PLAYBOOK.md`
> (which is for polishing existing demos, not creating new tenants).

## Decision tree

```
Is this for a real paying customer?
├── YES → "Real tenant" path below
└── NO  → "Demo tenant" path
            │
            └── Is the rubro already in src/registry/?
                ├── YES → use the existing template
                └── NO  → first add to src/registry/ (separate runbook needed)
```

## Real tenant path

### 1. Create the directory + scaffolding

```bash
SLUG=mi-cliente-nuevo  # kebab-case, no spaces
mkdir -p sites/$SLUG/content
```

### 2. Copy a similar tenant as starting point

Pick whichever existing tenant most resembles the new one:

```bash
# e.g. for another beauty/wellness:
cp sites/dayah-litworks/site.json sites/$SLUG/site.json
cp sites/dayah-litworks/content/es.json sites/$SLUG/content/es.json
```

### 3. Edit `site.json`

Required:

```json
{
  "vertical": "beauty-personal-care",   // or relocacion, food-beverage, etc.
  "businessType": "peluqueria",          // matches src/registry/<id>.type.json
  "country": "Paraguay",                 // or Uruguay
  "domain": "minegocio.com.py",          // optional, only if they own one
  "stagingDomain": "staging.minegocio.com.py",
  "defaultLocale": "es",
  "locales": ["es"],
  "contact": {
    "phone": "+595 XXX XXX XXX",         // real, monitored
    "email": "info@minegocio.com.py",
    "whatsapp": "595XXXXXXXXX"
  },
  "is_demo": false                       // CRITICAL — false for real tenants
}
```

### 4. Edit `content/es.json`

See `sites/de-abasto-a-casa/content/es.json` for a complete example.
Required keys:

- `siteName`, `tagline`, `placeholders.businessName`
- `navigation.businessName`, `navigation.ctaText`, `navigation.ctaHref`
- `home.seo.title`, `home.seo.description`
- `home.hero.headline`, `home.hero.subheadline`, `home.hero.ctaPrimaryText`,
  `home.hero.ctaPrimaryHref`
- `home.services.items[]` — at least 3
- `footer.businessName`, `footer.copyright`
- `whatsapp.defaultMessage`

### 5. Validate locally

```bash
cd web
npm run validate:sites
npm run validate:content
```

Both must pass with no errors. Warnings about translation quality are OK
during scaffolding.

### 6. Add to admin allowlist if multi-locale

If the tenant has >1 locale, decide which is `defaultLocale`. The flat URL
`paragu-ai.com/<slug>` redirects to `/s/<defaultLocale>/<slug>`.

For Nexa-style international tenants (relocation), default to `en`.
For PY-targeted tenants (most), default to `es`.

### 7. Commit

```bash
git add sites/$SLUG/
git commit -m "feat(sites): onboard $SLUG · <vertical> · <city>"
```

### 8. Push + deploy

Push to a feature branch, open PR, merge to Main. The GitHub Action
auto-deploys to the VPS in ~2 min.

### 9. Verify on prod

```bash
SLUG=mi-cliente-nuevo
curl -fsS -w "Status: %{http_code}\n" -o /dev/null https://paragu-ai.com/$SLUG
curl -fsS -w "Status: %{http_code}\n" -o /dev/null https://paragu-ai.com/s/es/$SLUG
```

Both should be 200.

### 10. (Optional) Custom domain

If the tenant owns a `.com.py` or similar domain:

1. Get them to point an A record to `72.61.44.159` (their registrar).
2. Add the hostname to the Traefik labels on the swarm service:
   ```bash
   ssh root@72.61.44.159
   docker service update --label-add 'traefik.http.routers.paragu-ai-tenants.rule=...||Host(`minegocio.com.py`)' paragu-ai_web
   ```
3. Wait ~15 min for Let's Encrypt to issue the cert.
4. Test: `curl -fsS https://minegocio.com.py/`.

### 11. Set up tenant in admin

```sql
-- Run once via Supabase SQL editor:
INSERT INTO public.businesses (slug, name, type, city, status, is_demo, data_json)
VALUES (
  'mi-cliente-nuevo',
  'Mi Cliente',
  'peluqueria',
  'Asunción',
  'active',
  false,
  '{"whatsapp_group_url": "https://chat.whatsapp.com/..."}'
);
```

Now `/admin/tenants/mi-cliente-nuevo` shows their info, contact log, and
notes panel.

## Demo tenant path (faster)

For "I need a demo of <vertical> for sales":

```bash
SLUG=demo-mi-rubro
RUBRO=peluqueria  # an existing entry in src/registry/

mkdir -p sites/$SLUG/content
cp sites/salon-maria/site.json sites/$SLUG/site.json   # if exists
# Or use the batch generator:
npx tsx web/scripts/batch-create-demos.ts --rubro $RUBRO --slug $SLUG
```

Critical:
- `site.json` must have `is_demo: true`
- Use ParaguAI sales line as WhatsApp (`595981324569`) — every demo CTA
  funnels back to sales
- Apply the polish playbook: `docs/DEMO_POLISH_PLAYBOOK.md`

## Common mistakes

- **Forgetting `is_demo` flag** — real tenants get accidental DEMO badge
  (or vice versa). Always set explicitly.
- **Real WhatsApp on a demo** — the demo's "real-looking" phone collects
  prospect contacts who think they're talking to the demo business. Always
  point demos at the sales line.
- **Skipping `validate:sites`** — content shape mismatches surface at
  prerender time and crash the build for the whole project. Catch locally.
- **Adding a tenant without admin row** — `/admin/tenants/<slug>` 404s
  even though the public URL works. Always insert into `businesses`.
- **`defaultLocale` missing or wrong** — flat URL redirect goes to a
  locale that doesn't exist, infinite redirect or 404.

## Promote a demo to a real tenant

When a prospect signs up:

1. Update `sites/<slug>/site.json`: `is_demo: false`, fill `domain` if
   they have one
2. Update `sites/<slug>/content/es.json` with their real services, prices,
   contact info
3. Update the `businesses` row: `UPDATE public.businesses SET is_demo=false,
   data_json = jsonb_set(data_json, '{whatsapp_group_url}', '"..."')
   WHERE slug='<slug>';`
4. Replace any AI-generated photos with real ones (per AI_ASSETS_PLAN.md
   if generating, or upload theirs)
5. Add them to LogoStrip and case studies if they consent

## See also

- `docs/DEMO_POLISH_PLAYBOOK.md` — per-demo content + asset workflow
- `docs/AI_ASSETS_PLAN.md` — image/video generation strategy
- `docs/runbooks/ENV_VARS.md` — secret rotation
- `docs/runbooks/CRON_STRATEGY.md` — cron schedule
- `docs/runbooks/ROLLBACK.md` — when a deploy breaks
