# Nexa Paraguay — DNS cutover

Target: `nexaparaguay.com` serves from Cloudflare Pages.

## Preconditions

- Domain `nexaparaguay.com` registered (Cloudflare Registrar recommended).
- Cloudflare Pages project `nexa-paraguay` linked to `Main` branch.
- Staging already green at `staging.nexaparaguay.com`.

## Records to publish (production)

| Type | Name | Target | Proxy |
|---|---|---|---|
| CNAME | `@` (apex alias) | `<pages-project>.pages.dev` | Proxied (orange cloud) |
| CNAME | `www` | `<pages-project>.pages.dev` | Proxied |
| CNAME | `staging` | `<pages-project>-<preview-branch>.pages.dev` | Proxied |
| TXT | `@` | SPF for transactional email — value depends on Resend/Postmark setup | — |
| MX | `@` | Google Workspace MX set (if `hola@nexaparaguay.com` is Google) | — |

## Settings to verify

- SSL/TLS → **Full (strict)**.
- HTTPS → **Always use HTTPS** on.
- Redirect rule: `http://www.nexaparaguay.com/*` → `https://nexaparaguay.com/$1` (301).
- Page rule / Worker: none required — hostname rewrite handled in `web/middleware.ts`.

## Cutover sequence

1. Lower TTL on the current `nexaparaguay.com` A/CNAME record to **300s**, 24 hours before cutover (accelerates rollback).
2. At cutover T-0: swap CNAME to Pages project, enable proxy, enable HTTPS, verify SSL certificate issued (auto via Cloudflare).
3. T+5 min: `curl -I https://nexaparaguay.com` should return 200 from Cloudflare. If 522/525, wait or switch to DNS-only until cert issues.
4. T+15 min: submit sitemaps per locale:
   - `https://nexaparaguay.com/s/nl/nexa-paraguay/sitemap.xml`
   - `https://nexaparaguay.com/s/en/nexa-paraguay/sitemap.xml`
   - `https://nexaparaguay.com/s/de/nexa-paraguay/sitemap.xml`
   - `https://nexaparaguay.com/s/es/nexa-paraguay/sitemap.xml`

## Post-cutover

- Enable Cloudflare Web Analytics (consent-gated by our banner).
- Leave TTL at 300s for 72 hours, then raise to 3600s.
- If problems: revert DNS to prior target — CDN caches are edge-only and flush fast.
