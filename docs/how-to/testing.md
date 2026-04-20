# Testing Guide

How to run tests for the Paragu-AI Builder project.

## Prerequisites

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your test credentials
```

## Running Tests

### TypeScript Type Checking

```bash
# Check for TypeScript errors
npm run typecheck

# Check with stricter settings
npx tsc --noEmit --strict
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:unit -- --coverage

# Run specific test file
npm run test:unit -- lib/utils.test.ts

# Run in watch mode
npm run test:unit -- --watch
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Requires database to be running
npm run test:integration -- --setup
```

### E2E Tests

```bash
# Start dev server first
npm run dev

# Run E2E tests (in another terminal)
npm run test:e2e

# Run with headed browser
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- e2e/business-page.spec.ts
```

### Build Tests

```bash
# Test production build
npm run build

# Test static export
npm run export

# Analyze bundle size
npm run analyze
```

## Writing Tests

### Unit Test Example

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { slugify, fillTemplate } from './utils'

describe('slugify', () => {
  it('converts text to URL-friendly slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Café')).toBe('cafe')
  })
})

describe('fillTemplate', () => {
  it('replaces placeholders with values', () => {
    const template = 'Hello {{name}}!'
    expect(fillTemplate(template, { name: 'World' })).toBe('Hello World!')
  })
})
```

### Component Test Example

```typescript
// components/sections/hero-section.test.tsx
import { render, screen } from '@testing-library/react'
import { HeroSection } from './hero-section'

describe('HeroSection', () => {
  it('renders headline and subheadline', () => {
    render(<HeroSection headline="Test" subheadline="Subtitle" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })
})
```

## Test Data

### Using Demo Data

Tests can use demo businesses from `lib/engine/demo-data.ts`:

```typescript
import { DEMO_BUSINESSES } from '@/lib/engine/demo-data'

const testBusiness = DEMO_BUSINESSES['peluqueria']
```

### Mocking Supabase

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({ data: [], error: null })
    }))
  }))
}))
```

## Continuous Integration

Tests run automatically on:
- Every pull request
- Every push to main branch
- Nightly builds

### CI Pipeline

```yaml
# .github/workflows/test.yml
- name: Install dependencies
  run: npm ci

- name: Type check
  run: npm run typecheck

- name: Lint
  run: npm run lint

- name: Unit tests
  run: npm run test:unit

- name: Build test
  run: npm run build
```

## Debugging Tests

### VS Code Configuration

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Unit Tests",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter", "verbose"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Test Coverage

Current coverage goals:
- Lines: 80%
- Functions: 80%
- Branches: 70%
- Statements: 80%

View coverage report:
```bash
npm run test:unit -- --coverage
open coverage/index.html
```
