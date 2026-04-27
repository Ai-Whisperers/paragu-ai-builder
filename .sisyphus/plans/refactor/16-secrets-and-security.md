# Plan: Remove Hardcoded Secrets from Dockerfile and Add Security Hardening

## Current State

### Issue 1: Secrets in Dockerfile (HIGH)

`web/Dockerfile` has ARG and ENV declarations that bake secrets into the Docker image:

```dockerfile
ARG SUPABASE_SERVICE_ROLE_KEY
ARG GOOGLE_PLACES_API_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV GOOGLE_PLACES_API_KEY=${GOOGLE_PLACES_API_KEY}
```

This means:
- Anyone who pulls the image can `docker inspect` and see the secret values in image history
- The secrets are embedded in every layer that uses them
- Build args are passed on the command line → visible in `ps aux` during build

**Note**: The actual values passed at build time are real. The Dockerfile has 4 `SecretsUsedInArgOrEnv` build warnings.

### Issue 2: Sentry is in package.json but not configured

`@sentry/nextjs` v10 is listed as a dependency (`web/package.json:75`) but there's no Sentry initialization file, no `sentry.client.config.ts` or `sentry.server.config.ts`. It's either unused or the config was never committed.

### Issue 3: Webhooks without Idempotency Keys

Webhooks from Bancard and Pagopar can be retried by the provider. There's no deduplication logic — a retried webhook could process the same payment twice.

### Issue 4: No Signature Verification on Webhooks

Neither `webhooks/bancard/route.ts` nor `webhooks/pagopar/route.ts` has HMAC signature verification. An attacker who knows the webhook URL could forge payment notifications.

## Proposed Fixes

### Fix 1: Use Docker BuildKit Secrets

Instead of ARG/ENV, use BuildKit's `--secret` flag:

```dockerfile
# web/Dockerfile — replace ARG + ENV with:
RUN --mount=type=secret,id=supabase_key \
    export SUPABASE_SERVICE_ROLE_KEY=$(cat /run/secrets/supabase_key) && \
    npm run build
```

Build command:
```bash
docker build \
  --secret id=supabase_key,env=SUPABASE_SERVICE_ROLE_KEY \
  --secret id=google_places_key,env=GOOGLE_PLACES_API_KEY \
  -f web/Dockerfile \
  -t paragu-ai:prod .
```

This way:
- Secrets never appear in image layers
- No `docker inspect` leakage
- BuildKit warns if you try to persist a secret

### Fix 2: Configure Sentry

Create the two config files:

```typescript
// web/sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
})
```

```typescript
// web/sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.2,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
})
```

Or, if you don't want Sentry, remove it:

```bash
npm uninstall @sentry/nextjs
```

### Fix 3: Add Webhook Idempotency

```typescript
// lib/webhooks/idempotency.ts
import { createAdminClient } from '@/lib/supabase/admin'

const WEBHOOK_TTL = 300_000 // 5 minutes

export async function isDuplicate(idempotencyKey: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('idempotency_key', idempotencyKey)
    .single()
  return !!data
}

export async function markProcessed(idempotencyKey: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('webhook_events').insert({ idempotency_key: idempotencyKey })
}
```

### Fix 4: Add Webhook Signature Verification

Bancard sends an `X-Signature` header. The webhook should verify it:

```typescript
// app/api/webhooks/bancard/route.ts
function verifyBancardSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
}
```

## Files to Touch

| File | Change |
|---|---|
| `web/Dockerfile` | Use `--mount=type=secret` instead of ARG/ENV |
| `web/sentry.client.config.ts` | NEW or remove Sentry dep |
| `web/sentry.server.config.ts` | NEW or remove Sentry dep |
| `web/lib/webhooks/idempotency.ts` | NEW |
| `web/app/api/webhooks/bancard/route.ts` | Add signature verification + idempotency |
| `web/app/api/webhooks/pagopar/route.ts` | Add idempotency |

## Effort & Risk

- **Docker secrets**: 30 min, low risk but HIGH impact for security
- **Sentry**: 20 min configure or remove
- **Webhook idempotency**: 1 hour, medium risk (needs new DB table)
- **Total**: ~2 hours

## DB Migration for Idempotency

```sql
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_webhook_events_key ON webhook_events(idempotency_key);
```
