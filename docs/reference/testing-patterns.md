# Testing Patterns

> Testing strategy and patterns for Paragu-AI Builder
> Win 65: Document testing patterns

## Overview

We use a comprehensive testing strategy with three levels:

1. **Unit Tests** - Fast, isolated tests for functions and utilities
2. **Integration Tests** - Testing component interactions and API contracts
3. **E2E Tests** - Full user journey testing with Playwright

## Test Structure

```
tests/
├── unit/              # Unit tests (Vitest)
│   ├── utils.test.ts
│   ├── compose.test.ts
│   └── *.test.ts
├── integration/       # Integration tests (Vitest)
│   └── api-*.test.ts
├── e2e/             # End-to-end tests (Playwright)
│   ├── smoke.test.ts
│   └── *.test.ts
├── accessibility/    # A11y tests (Playwright + axe-core)
│   └── axe.test.ts
├── fixtures/         # Test data
│   └── business-data.ts
└── __mocks__/        # Mock implementations
    └── server-only.ts
```

## Running Tests

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# All tests (unit + integration)
npm test

# With coverage
npm run test:ci

# E2E tests
npm run test:e2e

# E2E with headed browser
npm run test:e2e:headed

# All tests including E2E
npm run test:all

# Watch mode
npm run test:watch
```

## Unit Testing Patterns

### Testing Utility Functions

```typescript
import { describe, it, expect } from 'vitest'
import { slugify, fillTemplate } from '@/lib/utils'

describe('slugify', () => {
  it('should convert text to URL-friendly slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should handle accents and diacritics', () => {
    expect(slugify('Café')).toBe('cafe')
    expect(slugify('Señor')).toBe('senor')
  })
})
```

### Testing with Mocks

```typescript
import { describe, it, expect, vi } from 'vitest'

// Mock modules before importing
vi.mock('fs', () => ({
  readFileSync: vi.fn(() => JSON.stringify(mockData))
}))

import { resolveTokens } from '@/lib/tokens/resolver'
```

### Testing Async Functions

```typescript
it('should resolve tokens for a business type', async () => {
  const result = await resolveTokens('peluqueria')
  
  expect(result).toBeDefined()
  expect(result.cssVariables).toHaveProperty('--primary')
})
```

## Integration Testing Patterns

### Testing API Endpoints

```typescript
describe('/api/generate endpoint', () => {
  it('should generate page with valid business data', async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ businessId: '123', pageType: 'homepage' })
    })
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('sections')
  })
})
```

### Testing Database Interactions

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.TEST_DB_URL!, process.env.TEST_DB_KEY!)

describe('Database operations', () => {
  beforeEach(async () => {
    // Clean up test data
    await supabase.from('test_table').delete().eq('is_test', true)
  })

  it('should insert data', async () => {
    const { data, error } = await supabase
      .from('test_table')
      .insert({ name: 'Test', is_test: true })
    
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
})
```

## E2E Testing Patterns

### Basic Page Test

```typescript
import { test, expect } from '@playwright/test'

test('should load homepage', async ({ page }) => {
  await page.goto('/')
  
  await expect(page).toHaveTitle(/Paragu-AI/)
  await expect(page.locator('main')).toBeVisible()
})
```

### User Flow Test

```typescript
test('complete booking flow', async ({ page }) => {
  await page.goto('/booking')
  
  // Fill form
  await page.fill('[name="name"]', 'Test User')
  await page.fill('[name="email"]', 'test@example.com')
  
  // Submit
  await page.click('button[type="submit"]')
  
  // Verify success
  await expect(page.locator('.success-message')).toBeVisible()
})
```

### Mobile Testing

```typescript
test('mobile navigation works', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })
  
  await page.goto('/')
  
  // Open mobile menu
  await page.click('[aria-label="Open menu"]')
  
  // Click link
  await page.click('text=Services')
  
  await expect(page).toHaveURL(/\/services/)
})
```

## Accessibility Testing

### Using axe-core

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('page should be accessible', async ({ page }) => {
  await page.goto('/')
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  
  expect(results.violations).toHaveLength(0)
})
```

## Test Fixtures

### Creating Reusable Test Data

```typescript
// tests/fixtures/business-data.ts
export const mockBusiness = {
  name: 'Test Business',
  slug: 'test-business',
  type: 'peluqueria',
  city: 'Asunción',
  services: [
    { name: 'Service 1', price: '50.000' },
    { name: 'Service 2', price: '100.000' }
  ]
}

export function createMockBusiness(overrides = {}) {
  return { ...mockBusiness, ...overrides }
}
```

### Using Fixtures in Tests

```typescript
import { mockBusiness, createMockBusiness } from '../fixtures/business-data'

describe('Business operations', () => {
  it('should use default mock', () => {
    expect(mockBusiness.name).toBe('Test Business')
  })

  it('should create custom mock', () => {
    const custom = createMockBusiness({ name: 'Custom' })
    expect(custom.name).toBe('Custom')
    expect(custom.city).toBe('Asunción') // Keeps default
  })
})
```

## Best Practices

### 1. Test Naming

- Use descriptive test names: `should do X when Y happens`
- Group related tests in describe blocks
- Use consistent naming patterns

```typescript
describe('slugify', () => {
  describe('accent handling', () => {
    it('should remove acute accents from vowels', () => {
      expect(slugify('á')).toBe('a')
    })
  })
})
```

### 2. Test Isolation

- Clean up after each test
- Don't share mutable state between tests
- Use `beforeEach` for setup

```typescript
describe('database operations', () => {
  beforeEach(async () => {
    await cleanDatabase()
  })

  afterEach(async () => {
    await rollbackTransaction()
  })
})
```

### 3. Assertions

- Use specific assertions
- Avoid testing implementation details
- Test behavior, not structure

```typescript
// Good - tests behavior
expect(result).toBe('hello-world')

// Avoid - tests implementation
expect(result.replace).toHaveBeenCalled()
```

### 4. Edge Cases

- Test empty inputs
- Test maximum values
- Test special characters
- Test error conditions

```typescript
it('should handle empty string', () => {
  expect(slugify('')).toBe('')
})

it('should handle null gracefully', () => {
  expect(() => slugify(null as any)).toThrow()
})
```

### 5. Async Testing

- Always await async operations
- Use proper timeout handling
- Test loading and error states

```typescript
it('should load data', async () => {
  const result = await fetchData()
  expect(result).toBeDefined()
})

it('should handle timeout', async () => {
  await expect(
    fetchData({ timeout: 1 })
  ).rejects.toThrow('Timeout')
})
```

## Coverage Requirements

| Module Type | Minimum Coverage |
|------------|----------------|
| Utilities | 90% |
| Engine/Core | 80% |
| Components | 70% |
| API Routes | 75% |

Current coverage thresholds (in `vitest.config.ts`):
- Lines: 60%
- Functions: 60%
- Branches: 40%
- Statements: 55%

## CI/CD Integration

Tests run automatically on:
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`
- Scheduled nightly runs

### Required Checks

All tests must pass before merging:
- ✅ Lint check
- ✅ Type check
- ✅ Unit tests (60% coverage)
- ✅ Integration tests
- ✅ Build test
- ✅ Security audit

## Troubleshooting

### Common Issues

1. **Module not found**: Check path aliases in `vitest.config.ts`
2. **Test timeout**: Increase timeout in config or use `test.setTimeout()`
3. **Coverage not collected**: Check include patterns in config
4. **E2E fails in CI**: Ensure server starts before tests

### Debug Mode

```bash
# Run single test file
npx vitest run tests/unit/utils.test.ts

# Run with verbose output
npx vitest run --reporter=verbose

# Debug specific test
npx vitest run --reporter=verbose -t "should convert"

# E2E debug
npx playwright test --debug
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/)

---

Last updated: April 2026
