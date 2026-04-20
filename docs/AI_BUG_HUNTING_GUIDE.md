# AI Agent Bug Hunting & Self-Improvement Guide

> Based on real fixes from Paragu-AI Builder project
> Generated after fixing 25+ TypeScript errors and 10+ build failures

---

## Part 1: The Bug Hunting Framework

### 1.1 Bug Categories Discovered

Based on our fixes, bugs fall into these categories:

```
┌─────────────────────────────────────────────────────────────────┐
│ BUG CATEGORY           │ FREQUENCY │ DETECTION DIFFICULTY        │
├─────────────────────────────────────────────────────────────────┤
│ Content Structure      │ ████████  │ Hard (runtime only)         │
│ JSON Syntax            │ ██████    │ Easy (validation)           │
│ TypeScript Types       │ ████████  │ Medium (typecheck)          │
│ Missing Defensive Code │ ███████   │ Hard (edge cases)          │
│ Data Resolution        │ ██████    │ Medium (debug logs)         │
│ Duplicate Keys         │ ████      │ Medium (JSON parse)         │
│ $ref Resolution        │ █████     │ Hard (nested objects)       │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Pre-Build Validation Checklist

**CRITICAL: Run these BEFORE attempting build**

```bash
#!/bin/bash
# save as: validate-before-build.sh

echo "🔍 Pre-Build Validation Suite"
echo "============================"

# 1. JSON Syntax Validation
echo "1️⃣  Validating all JSON files..."
find sites -name "*.json" -exec python3 -c "import json; json.load(open('{}'))" \; 2>&1 | grep -i error

# 2. Check for duplicate keys
echo "2️⃣  Checking for duplicate JSON keys..."
find sites -name "*.json" -exec python3 -c "
import json
data = json.load(open('{}'))
def check_duplicates(obj, path=''):
    if isinstance(obj, dict):
        keys = list(obj.keys())
        seen = set()
        for k in keys:
            if k in seen:
                print(f'Duplicate key: {path}.{k}')
            seen.add(k)
            check_duplicates(obj[k], f'{path}.{k}')
check_duplicates(data)
" \;

# 3. TypeScript Type Check
echo "3️⃣  Running TypeScript checks..."
npm run typecheck 2>&1 | grep -E "(error|Error)" | head -20

# 4. Content Structure Validation
echo "4️⃣  Validating site content structures..."
node web/scripts/validate-sites.ts 2>&1 | grep -E "(ERROR|FAIL)"

echo "✅ Validation complete!"
```

### 1.3 Content Structure Validation Matrix

Every site content file MUST have these structures:

```typescript
// Required content structure for tenant sites
interface SiteContentStructure {
  siteName: string
  tagline: string
  placeholders: Record<string, string>
  navigation: {
    businessName: string
    navItems: Array<{ label: string; href: string }>
    ctaText: string
    ctaHref: string
  }
  home: {
    seo?: { title: string; description: string }
    hero?: { headline: string; subheadline: string; ctaPrimary?: string; ctaSecondary?: string }
    trust?: { eyebrow?: string; title?: string; credentials?: Array<{ icon: string; label: string }> }
    programs?: { eyebrow?: string; title: string; subtitle?: string; tiers: ProgramTier[] }
    whyCountry?: { eyebrow?: string; title: string; subtitle?: string; pillars: WhyPillar[] }
    process?: { eyebrow?: string; title: string; subtitle?: string; steps: ProcessStep[] }
    testimonials?: { eyebrow?: string; title: string; subtitle?: string; testimonials: Testimonial[] }
    finalCta?: { eyebrow?: string; title: string; subtitle?: string; ctaText: string; ctaHref: string }
  }
  footer: {
    businessName: string
    tagline?: string
    address?: string
    phone?: string
    email?: string
  }
  whatsapp?: {
    phone: string
    message: string
  }
}
```

### 1.4 Section Component Defensive Patterns

**ALWAYS add these guards to section components:**

```typescript
// Pattern 1: Array guard for .map() operations
export function SectionComponent({ items, title }: SectionProps) {
  // Guard against undefined/null arrays
  if (!items || items.length === 0) {
    return null  // Don't render if no data
  }
  
  // Guard against missing required props
  if (!title) {
    console.warn('SectionComponent: missing required title prop')
    return null
  }
  
  return (
    <section>
      <h2>{title}</h2>
      {items.map((item, i) => (...))}
    </section>
  )
}

// Pattern 2: Nested property guard
export function NestedSection({ data }: { data?: { items?: Item[] } }) {
  const items = data?.items ?? []
  if (items.length === 0) return null
  
  return <div>{items.map(...)}</div>
}

// Pattern 3: Safe array operations
export function SafeSection({ items }: { items?: Item[] }) {
  // Use empty array as default, never undefined
  const safeItems = items || []
  
  return (
    <div>
      {safeItems.length > 0 ? (
        safeItems.map((item) => <ItemComponent {...item} />)
      ) : (
        <p>No items available</p>
      )}
    </div>
  )
}
```

### 1.5 Services Content Builder - Multi-Format Support

The `buildServices` builder must handle THREE content formats:

```typescript
// Format 1: Category-based (peluqueria, estetica)
{
  servicesPage: {
    title: "...",
    categories: [
      { title: "Cat 1", defaultServices: [{ name: "...", price: "..." }] }
    ]
  }
}

// Format 2: Direct services array
{
  servicesPage: {
    title: "...",
    services: [{ name: "...", price: "..." }]
  }
}

// Format 3: Nested object with services array (nexa-propiedades)
{
  servicesPage: {
    services: {
      title: "...",
      services: [{ name: "...", price: "..." }]
    }
  }
}
```

**Implementation:**
```typescript
function resolveServicesFromContent(servicesContent: ServicesContent['servicesPage']): BusinessData['services'] {
  // Handle nested format
  if (servicesContent?.services && !Array.isArray(servicesContent.services)) {
    const nested = servicesContent.services.services
    if (Array.isArray(nested)) return nested
  }
  
  // Handle direct array
  if (Array.isArray(servicesContent?.services)) {
    return servicesContent.services
  }
  
  // Handle category format
  return (servicesContent?.categories || []).flatMap(cat => 
    cat.defaultServices?.map(s => ({ ...s, category: cat.title })) || []
  )
}
```

---

## Part 2: Self-Improvement Research

### 2.1 AI Agent Configuration Best Practices

Based on our experience, configure AI agents with:

```yaml
# .ai-config.yaml - AI Agent Behavioral Configuration
agent_behavior:
  # Defensive coding priority
  defensive_coding: "MANDATORY"
  null_checks: "ALWAYS"
  array_guards: "REQUIRED_BEFORE_MAP"
  
  # Validation priority
  validation_order:
    - json_syntax
    - typescript_types
    - content_structure
    - build_test
  
  # Error handling
  error_strategy: "FAIL_FAST_WITH_CONTEXT"
  silent_catch: "FORBIDDEN"
  log_and_rethrow: "REQUIRED"
  
  # Content awareness
  content_patterns:
    recognize_structures: true
    validate_references: true
    check_duplicate_keys: true
  
  # Testing discipline
  test_before_commit: "REQUIRED"
  test_commands:
    - "npm run typecheck"
    - "npm run build"
    - "npm run test:unit"
```

### 2.2 Content-Aware Code Generation

When generating/modifying code, AI should:

```typescript
// Step 1: Read and analyze existing content
async function analyzeContent(siteSlug: string, locale: string) {
  const content = await loadSiteContent(siteSlug, locale)
  
  // Identify which sections are used
  const usedSections = identifySectionsFromContent(content)
  
  // Check data availability for each section
  const sectionDataStatus = usedSections.map(section => ({
    section,
    hasData: checkSectionData(content, section),
    dataPath: getDataPath(section),
    requiredFields: getRequiredFields(section)
  }))
  
  return sectionDataStatus
}

// Step 2: Generate appropriate code based on data availability
function generateSectionCode(sectionStatus: SectionStatus) {
  if (!sectionStatus.hasData) {
    // Generate defensive component that returns null
    return generateNullSafeComponent(sectionStatus.section)
  }
  
  // Generate full component with data guards
  return generateFullComponent(sectionStatus)
}
```

### 2.3 Bug Prediction Model

Based on our fixes, bugs cluster around these patterns:

```python
# Pseudocode: Bug prediction based on code patterns
BUG_PATTERNS = {
    "high_risk": [
        {"pattern": "\.map\((?!.*\?\.)", "confidence": 0.85, "fix": "Add array guard"},
        {"pattern": "content\.(\w+)\.(\w+)", "confidence": 0.75, "fix": "Add optional chaining"},
        {"pattern": "services\.(?!.*Array\.isArray)", "confidence": 0.70, "fix": "Add type check"},
    ],
    "medium_risk": [
        {"pattern": "JSON\.parse", "confidence": 0.60, "fix": "Add try/catch"},
        {"pattern": "\$ref", "confidence": 0.55, "fix": "Validate reference resolution"},
    ],
    "validation": [
        {"pattern": "\.json$", "check": "duplicates", "tool": "python json.tool"},
        {"pattern": "content/", "check": "structure", "tool": "validate-sites.ts"},
    ]
}
```

### 2.4 Learning From Build Failures

**Build Error → Solution Mapping:**

| Error Pattern | Root Cause | Solution | Prevention |
|--------------|-----------|----------|------------|
| `Cannot read properties of undefined (reading 'some')` | Services array undefined | Add defensive check before `.some()` | Always guard array methods |
| `Cannot read properties of undefined (reading 'map')` | Data array undefined | Add null check before `.map()` | Validate content structure |
| `Expected ',' or '}'` | JSON syntax error | Fix missing/extra braces | Validate JSON before commit |
| `Type 'X' is not assignable` | TypeScript mismatch | Align types with content | Check types against content |
| `No registry config for page type` | Missing registry entry | Add page type config | Maintain registry completeness |

### 2.5 Content Structure Discovery Protocol

When working with new sites, follow this protocol:

```typescript
// Step 1: Discover content structure
const discoverContentStructure = (content: Record<string, unknown>) => {
  const findings = {
    availableSections: [],
    missingRequiredFields: [],
    dataTypeMismatches: [],
    duplicateKeys: []
  }
  
  // Check each expected section
  const expectedSections = [
    'home.hero', 'home.programs', 'home.whyCountry', 
    'home.process', 'home.testimonials', 'home.finalCta'
  ]
  
  expectedSections.forEach(section => {
    const data = getByPath(content, section)
    if (data === undefined) {
      findings.missingRequiredFields.push(section)
    } else {
      findings.availableSections.push({
        path: section,
        type: Array.isArray(data) ? 'array' : typeof data,
        hasData: Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0
      })
    }
  })
  
  return findings
}
```

---

## Part 3: Automated Bug Prevention

### 3.1 Pre-Commit Hooks Configuration

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run typecheck && npm run build:check"
    }
  },
  "lint-staged": {
    "*.json": [
      "python3 -m json.tool",
      "node scripts/validate-json-structure.js"
    ],
    "*.{ts,tsx}": [
      "eslint --fix",
      "tsc --noEmit"
    ]
  }
}
```

### 3.2 CI/CD Validation Pipeline

```yaml
# .github/workflows/validate.yml
name: Content & Code Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate JSON Syntax
        run: |
          find sites -name "*.json" | xargs -I {} \
            python3 -c "import json; json.load(open('{}'))"
      
      - name: Check for Duplicate Keys
        run: node scripts/check-duplicate-keys.js
      
      - name: Validate Content Structure
        run: node web/scripts/validate-sites.ts
      
      - name: TypeScript Type Check
        run: npm run typecheck
      
      - name: Build Test
        run: npm run build
```

### 3.3 Content Validation Script

```typescript
// scripts/validate-content-structure.ts
import { loadSiteContent } from '../web/lib/engine/site-loader'

const REQUIRED_SECTIONS = {
  'relocacion': [
    'home.hero',
    'home.programs.tiers',
    'home.whyCountry.pillars',
    'home.process.steps',
    'home.testimonials.testimonials'
  ],
  'inmobiliaria': [
    'servicesPage.services.services',
    'propertiesPage.listings.properties',
    'contact'
  ]
}

export function validateSiteContent(siteSlug: string, locale: string) {
  const content = loadSiteContent(siteSlug, locale)
  const vertical = detectVertical(siteSlug)
  const required = REQUIRED_SECTIONS[vertical] || []
  
  const errors = []
  
  required.forEach(path => {
    const value = getByPath(content, path)
    if (value === undefined) {
      errors.push(`Missing required field: ${path}`)
    } else if (Array.isArray(value) && value.length === 0) {
      errors.push(`Empty array: ${path}`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

---

## Part 4: Emergency Response Procedures

### 4.1 Build Failure Response Protocol

```
BUILD FAILURE DETECTED
├── Step 1: Identify error type (30 seconds)
│   ├── TypeScript error? → Run npm run typecheck
│   ├── JSON error? → Validate syntax
│   ├── Runtime error? → Check section components
│   └── Content error? → Validate site content
│
├── Step 2: Isolate the issue (2 minutes)
│   ├── Identify failing page/site
│   ├── Check recent changes
│   └── Review error stack trace
│
├── Step 3: Apply fix (5 minutes)
│   ├── Add defensive guards if needed
│   ├── Fix content structure
│   └── Verify with minimal test
│
└── Step 4: Verify and commit (2 minutes)
    ├── Run full build
    ├── Update AGENTS.md if new pattern
    └── Commit with detailed message
```

### 4.2 Content Data Recovery

When content is missing or malformed:

```typescript
// Content recovery patterns
const CONTENT_TEMPLATES = {
  testimonials: () => ({
    title: "What our clients say",
    testimonials: [
      { quote: "Great service!", author: "Client Name", role: "Business Owner", rating: 5 }
    ]
  }),
  
  programs: () => ({
    title: "Our Programs",
    tiers: [
      { id: "basic", name: "Basic", description: "Entry level", included: ["Feature 1"], ctaLabel: "Learn more", ctaHref: "#" }
    ]
  }),
  
  process: () => ({
    title: "How it works",
    steps: [
      { number: 1, title: "Step 1", description: "Description" }
    ]
  })
}

export function recoverContent(content: any, missingPath: string) {
  const template = CONTENT_TEMPLATES[missingPath]
  if (template) {
    return { ...content, [missingPath]: template() }
  }
  return content
}
```

---

## Part 5: Knowledge Base

### 5.1 Common Pitfalls & Solutions

**Pitfall 1: Assuming content structure**
```typescript
// ❌ WRONG: Assumes services is always an array
const hasCategories = services.some(s => s.category)

// ✅ CORRECT: Guards against undefined
const hasCategories = services?.some(s => s.category) ?? false
```

**Pitfall 2: JSON key duplication**
```json
// ❌ WRONG: Duplicate keys (second overwrites first)
{
  "servicesPage": { ... },
  "servicesPage": { ... }
}

// ✅ CORRECT: Single key with merged content
{
  "servicesPage": {
    "seo": { ... },
    "hero": { ... },
    "services": { ... },
    "calculator": { ... }
  }
}
```

**Pitfall 3: $ref resolution without fallback**
```typescript
// ❌ WRONG: Fails if $ref not found
const data = resolveRef(content.servicesPage.services)

// ✅ CORRECT: Provides fallback
const data = resolveRef(content.servicesPage.services) || { services: [] }
```

**Pitfall 4: Missing array guards in sections**
```typescript
// ❌ WRONG: Will crash on undefined
function Section({ items }) {
  return <div>{items.map(...)}</div>
}

// ✅ CORRECT: Handles all cases
function Section({ items }) {
  if (!items?.length) return null
  return <div>{items.map(...)}</div>
}
```

### 5.2 TypeScript Type Defense Patterns

```typescript
// Pattern: Optional with default
interface Props {
  items?: Item[]  // Optional
}
function Section({ items = [] }: Props) {  // Default to empty
  return <div>{items.map(...)}</div>
}

// Pattern: Nullish coalescing
function Section({ items }: Props) {
  const safeItems = items ?? []  // Nullish coalescing
  return <div>{safeItems.map(...)}</div>
}

// Pattern: Type guards
function isValidArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0
}

function Section({ items }: Props) {
  if (!isValidArray<Item>(items)) return null
  return <div>{items.map(...)}</div>
}
```

---

## Part 6: Continuous Improvement

### 6.1 Post-Fix Analysis Template

After every bug fix, document:

```markdown
## Bug Fix Post-Mortem

**Date:** 2026-04-20
**Issue:** Build failed on /s/es/nexa-propiedades
**Root Cause:** Services content structure mismatch
**Files Changed:** 
- web/lib/engine/section-builders.ts
- sites/nexa-propiedades/content/es.json

**Prevention Measures:**
- [ ] Add content structure validation to CI
- [ ] Update section builder to handle all formats
- [ ] Document content structure requirements

**Detection Time:** 2 minutes
**Fix Time:** 10 minutes
**Prevention Potential:** High
```

### 6.2 AI Agent Self-Checklist

Before submitting any code changes:

```markdown
## Pre-Submission Checklist

### Content Changes
- [ ] JSON syntax validated
- [ ] No duplicate keys
- [ ] All required fields present
- [ ] Arrays have at least one item (if required)

### Code Changes
- [ ] TypeScript compiles without errors
- [ ] No hardcoded colors (use CSS vars)
- [ ] All array operations have guards
- [ ] Error handling present (no silent catches)

### Section Components
- [ ] Props have default values or guards
- [ ] Returns null for missing data
- [ ] No .map() on potentially undefined arrays
- [ ] Uses theme CSS variables

### Testing
- [ ] npm run typecheck passes
- [ ] npm run build succeeds
- [ ] Site pages render without errors
- [ ] No console warnings
```

---

## Appendix: Quick Reference

### A. Content Path Patterns
```
Tenant Sites:
├── sites/[site]/
│   ├── site.json              # Site configuration
│   ├── content/
│   │   ├── es.json           # Spanish content ← START HERE
│   │   ├── en.json           # English content
│   │   └── pt.json           # Portuguese content
│   └── pages/
│       ├── home.json         # Page sections config
│       └── [page].json       # Other pages
```

### B. Section Data Paths
```
home.hero                    → HeroSection
home.programs.tiers          → ProgramsComparisonSection  
home.whyCountry.pillars      → WhyDestinationSection
home.process.steps           → ProcessTimelineSection
home.testimonials.testimonials → TestimonialsSection
servicesPage.services        → ServicesSection (tenant sites)
```

### C. Validation Commands
```bash
# Quick validation
npm run typecheck            # TypeScript check
python3 -m json.tool file.json  # JSON syntax

# Full validation
npm run build               # Build test
npm run test:unit          # Unit tests
node scripts/validate-sites.ts  # Site content
```

---

**Version:** 1.0  
**Last Updated:** 2026-04-20  
**Based on:** 25+ fixes in Paragu-AI Builder
