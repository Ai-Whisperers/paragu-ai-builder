# Tenant Upgrade: bufete-mendez

## Current Problems
1. **Single locale** — ES only. Law firms serving expats need EN.
2. **No custom domain** — needs bufetemendez.com.py or similar.
3. **`terminos` page uses `features` section instead of proper terms** — features section for legal terms is semantically wrong.

## Changes

### File: `sites/bufete-mendez/site.json`
Add domain and EN locale:
```json
"domain": "bufetemendez.com.py",
"locales": ["es", "en"]
```

### File: `sites/bufete-mendez/pages/terminos.json`
Replace `features` with `faq` (terms and conditions work better as Q&A).

## Verification
- [ ] EN locale loads
- [ ] terminos page uses FAQ not features
- [ ] Build passes
