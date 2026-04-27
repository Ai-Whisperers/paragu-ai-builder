# Plan: Add Testing Infrastructure and CI Pipeline

## Current State

- **Zero tests** across the entire codebase
- No unit tests, no integration tests, no E2E tests
- No CI pipeline — `docker build` runs manually on VPS
- No lint/typecheck gate before deploy
- No preview/staging environment

### Risk

Without tests, every deploy is a gamble. The 28 pre-existing TS errors (now 0 after the refactor session) show that type-checking alone catches real issues. But runtime errors in commerce checkout, booking, or cron jobs are invisible until a customer reports them.

## Phase 1: Testing Infrastructure

### 1.1 Vitest Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

`web/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts', 'components/**/*.tsx'],
      exclude: ['lib/engine/generated/**'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

### 1.2 Test Categories (Prioritized)

#### Tier 1: Business Logic (highest value, easiest to test)

| Module | Test File | What to Test |
|---|---|---|
| `lib/commerce/compute-totals.ts` | `compute-totals.test.ts` | Cart totals, discounts, shipping |
| `lib/format.ts` | `format.test.ts` | Number/currency/date formatting |
| `lib/commerce/price-parser.ts` | `price-parser.test.ts` | Price string parsing |
| `lib/commerce/currency.ts` | `currency.test.ts` | Currency conversion |
| `lib/engine/resolve-copy.ts` | `resolve-copy.test.ts` | Content ref resolution, template filling |

#### Tier 2: Integration (critical paths)

| Module | Test File | What to Test |
|---|---|---|
| Checkout flow | `checkout.test.ts` | Full cart → payment → order |
| Booking flow | `booking.test.ts` | Availability → create → confirm |
| Webhook handlers | `webhooks.test.ts` | Bancard/Pagopar signature validation |

#### Tier 3: Component Rendering

| Component | Test File | What to Test |
|---|---|---|
| `IntakeWizardSection` | `intake-wizard.test.tsx` | Steps, tier recommendation, GA events |
| `CalculatorShell` | `calculator-shell.test.tsx` | Input → compute → display |
| `ProductCard` | `product-card.test.tsx` | WhatsApp URL, email URL generation |

### 1.3 Critical Test: Checkout Flow

```typescript
// test/commerce/checkout.test.ts
import { describe, it, expect } from 'vitest'
import { computeCartTotal } from '@/lib/commerce/compute-totals'

describe('computeCartTotal', () => {
  it('sums item prices', () => {
    const result = computeCartTotal([
      { id: '1', price: 10000, quantity: 2 },
      { id: '2', price: 5000, quantity: 1 },
    ])
    expect(result.subtotal).toBe(25000)
  })

  it('applies percentage discount', () => {
    const result = computeCartTotal([{ id: '1', price: 10000, quantity: 1 }], { type: 'percent', value: 10 })
    expect(result.discount).toBe(1000)
    expect(result.total).toBe(9000)
  })

  it('applies fixed discount', () => {
    const result = computeCartTotal([{ id: '1', price: 10000, quantity: 1 }], { type: 'fixed', value: 2000 })
    expect(result.discount).toBe(2000)
    expect(result.total).toBe(8000)
  })

  it('handles free shipping', () => {
    const result = computeCartTotal([{ id: '1', price: 10000, quantity: 1 }], undefined, { free: true })
    expect(result.shipping).toBe(0)
  })
})
```

## Phase 2: CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: web/package-lock.json
      
      - name: Install
        run: npm ci
        working-directory: web

      - name: TypeCheck
        run: npx tsc --noEmit
        working-directory: web

      - name: Lint
        run: npx next lint
        working-directory: web

      - name: Test
        run: npx vitest run --coverage
        working-directory: web

      - name: Check generated renderer map
        run: npm run generate:renderer && git diff --exit-code
        working-directory: web

  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: docker build -f web/Dockerfile -t paragu-ai:ci .
      
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'paragu-ai:ci'
          format: 'sarif'
          output: 'trivy-results.sarif'
```

## Phase 3: Staging Environment

Add a staging stack that deploys from the `develop` branch:

```yaml
# stack-staging.yml — on VPS alongside stack-prod.yml
version: '3.8'
services:
  web:
    image: paragu-ai:staging
    ports:
      - "3001:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_APP_URL: https://staging.paragu-ai.com
```

## Files to Touch

| File | Change |
|---|---|
| `web/vitest.config.ts` | NEW |
| `web/test/setup.ts` | NEW |
| `web/test/commerce/compute-totals.test.ts` | NEW |
| `web/test/format.test.ts` | NEW |
| `web/test/components/intake-wizard.test.tsx` | NEW |
| `.github/workflows/ci.yml` | NEW |
| `web/package.json` | Add vitest scripts |
| `stack-staging.yml` | NEW (VPS staging) |

## Effort & Risk

| Phase | Effort | Risk |
|---|---|---|
| Vitest setup + config | 30 min | Low |
| ComputeTotals tests | 30 min | Low |
| Format tests | 20 min | Low |
| CI pipeline | 1 hour | Low |
| Staging deploy | 30 min | Low |
| **Total** | **~3 hours** | |

## Success Criteria

- [ ] `npm test` runs in <10s
- [ ] CI passes typecheck + lint + test on every PR
- [ ] At least 3 module-level test files with >80% coverage of business logic
- [ ] Staging environment accessible at `staging.paragu-ai.com`
