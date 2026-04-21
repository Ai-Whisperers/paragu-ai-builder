# 0006 · Module-scoped Supabase client cache for cold-start fix

**Status:** Accepted · 2026-04-21
**Deciders:** Ivan

## Context

`/api/analytics/track` was timing out with 504 on the first POST after a
container restart (BUG_HUNT_500 #423). The route created a fresh Supabase
client per request via `createClient()` inside the handler. The client itself
is cheap (a wrapper object), but the first network handshake plus first-call
SDK lazy init had visible latency on a cold container.

## Options considered

- **Cache the client at module scope** — initialize once on first use, reuse
  forever. Tested: `createClient` is called exactly once across N sequential
  requests. Risk: no risk on a long-running Docker container; mild risk on
  serverless platforms where module scope can be reset between invocations
  (we don't deploy serverless).
- **Migrate the route to Edge runtime** — fast cold-start (~50ms) but our
  hosting is a long-running Node container, not serverless. Edge runtime
  buys us nothing here, and `crypto.subtle.digest` (used for IP hashing)
  would still work but Supabase JS adds compatibility overhead.
- **Fire-and-forget the insert** — return 200 immediately, do the DB write
  in the background. Hides errors from the caller; analytics correctness
  drops.
- **Module-level top-level init** — would crash `next build` page-data
  collection where Supabase env vars aren't set.

## Decision

Cache the Supabase client at module scope behind a memoized getter. First
request initializes; all subsequent requests reuse the same instance.
Lazy init avoids the build-time crash.

## Consequences

- Cold-start cost is paid once per container lifetime (after restart or
  deploy), not once per request.
- Test asserts `createClient` is called exactly once across 5 sequential
  POSTs — regression-proof.
- Pattern can be lifted into a shared helper if more routes need it. For now,
  inline at each call site is clearer.

## Revisit if

- We move to Cloudflare Workers / serverless where module-scoped caches don't
  persist across invocations. (At that point, switch to a request-scoped
  cache OR rely on the platform's connection pooling.)
- Supabase JS client gains a meaningful per-request init cost (currently
  near-zero after the first call).
