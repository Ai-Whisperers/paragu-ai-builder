# AI Agent Self-Configuration for Paragu-AI Builder

> Optimal configuration based on project patterns and bug analysis

---

## 1. Core Behavioral Configuration

### 1.1 Defensive Coding Priority Matrix

```yaml
priority_levels:
  P0 - CRITICAL (Never Compromise):
    - array_guards_before_map: "MANDATORY"
    - null_checks_on_optional_props: "MANDATORY"
    - json_syntax_validation: "MANDATORY"
    - typescript_strict_mode: "MANDATORY"
  
  P1 - HIGH (Always Include):
    - content_structure_validation: "REQUIRED"
    - error_logging_with_context: "REQUIRED"
    - fallback_default_values: "REQUIRED"
  
  P2 - MEDIUM (Best Practice):
    - early_return_patterns: "PREFERRED"
    - type_narrowing_checks: "PREFERRED"
    - optional_chaining_usage: "PREFERRED"
```

### 1.2 Decision Tree for Code Changes

```
START: Task Received
│
├─ Does it involve content files?
│  ├─ YES → Validate JSON syntax first
│  │         ├─ Check for duplicate keys
│  │         ├─ Verify required fields
│  │         └─ Test with Python json.tool
│  │
│  └─ NO → Continue
│
├─ Does it modify section components?
│  ├─ YES → Add defensive guards
│  │         ├─ Guard all .map() operations
│  │         ├─ Guard all .some()/.filter()
│  │         ├─ Add null/undefined checks
│  │         └─ Return null for missing data
│  │
│  └─ NO → Continue
│
├─ Does it modify content builders?
│  ├─ YES → Support all content formats
│  │         ├─ Check for nested structures
│  │         ├─ Handle both array and object formats
│  │         ├─ Provide fallbacks
│  │         └─ Log format detection
│  │
│  └─ NO → Continue
│
├─ Run TypeScript check
│  ├─ FAIL → Fix all errors before proceeding
│  └─ PASS → Continue
│
├─ Run Build test
│  ├─ FAIL → Debug with verbose logging
│  └─ PASS → Continue
│
└─ Submit changes
```

---

## 2. Content-Aware Development Mode

### 2.1 Content Structure Recognition

When working with any site, I should:

```typescript
// Automatic content analysis
const contentProfile = {
  // Detect vertical type
  vertical: detectVertical(siteSlug),  // 'relocacion' | 'inmobiliaria' | etc
  
  // Check content completeness
  completeness: {
    hasHome: checkPath(content, 'home'),
    hasServices: checkPath(content, 'servicesPage.services') || checkPath(content, 'servicesPage.categories'),
    hasTestimonials: checkPath(content, 'home.testimonials.testimonials'),
    hasPrograms: checkPath(content, 'home.programs.tiers'),
    missingFields: identifyMissing(content, REQUIRED_FIELDS)
  },
  
  // Detect content format variants
  formatVariant: {
    services: detectServicesFormat(content),  // 'categories' | 'direct-array' | 'nested-object'
    testimonials: detectTestimonialsFormat(content),
    programs: detectProgramsFormat(content)
  }
}
```

### 2.2 Auto-Generated Defensive Code

Based on content analysis, generate appropriate guards:

```typescript
// Example: Auto-generated section guard
function generateSectionGuard(sectionName: string, content: any) {
  const dataPath = SECTION_DATA_PATHS[sectionName]
  const isArray = SECTION_ARRAY_SECTIONS.includes(sectionName)
  
  if (isArray) {
    return `
      // Auto-generated guard for ${sectionName}
      const ${sectionName}Data = ${dataPath}
      if (!${sectionName}Data || ${sectionName}Data.length === 0) {
        return null
      }
    `
  }
}
```

---

## 3. Validation Integration Points

### 3.1 Continuous Validation Strategy

```yaml
validation_stages:
  stage_1_pre_edit:
    - read_existing_content
    - analyze_structure
    - identify_required_changes
    - validate_json_syntax_before_edit
  
  stage_2_during_edit:
    - maintain_json_validity
    - preserve_required_fields
    - no_duplicate_keys
    - proper_nesting
  
  stage_3_post_edit:
    - python_json_validation
    - duplicate_key_check
    - structure_completeness
    - required_field_presence
  
  stage_4_pre_commit:
    - npm_run_typecheck
    - npm_run_build
    - site_specific_tests
  
  stage_5_post_commit:
    - verify_in_ci
    - monitor_build_status
```

### 3.2 Smart Error Recovery

When errors are detected, use these recovery patterns:

```typescript
// Error Type → Recovery Strategy
const ERROR_RECOVERY = {
  'JSON_SYNTAX_ERROR': {
    detection: 'python3 -m json.tool fails',
    recovery: 'Fix syntax (missing braces, commas)',
    tool: 'python json.tool with line numbers'
  },
  
  'TYPE_MISMATCH': {
    detection: 'TypeScript compiler error',
    recovery: 'Align types with actual content structure',
    tool: 'npm run typecheck'
  },
  
  'UNDEFINED_MAP': {
    detection: 'Runtime error: Cannot read properties of undefined',
    recovery: 'Add defensive guard before .map()',
    tool: 'Check section component'
  },
  
  'MISSING_CONTENT': {
    detection: 'Build error on specific page',
    recovery: 'Add missing content structure',
    tool: 'validate-sites.ts'
  },
  
  'DUPLICATE_KEY': {
    detection: 'JSON overwrites or validation',
    recovery: 'Merge duplicate keys or rename',
    tool: 'check-duplicate-keys.js'
  }
}
```

---

## 4. Knowledge Retention & Learning

### 4.1 Pattern Recognition Database

Maintain awareness of these patterns:

```typescript
// Known Content Structure Patterns
const CONTENT_PATTERNS = {
  'services': [
    { variant: 'categories', path: 'servicesPage.categories', flatMap: true },
    { variant: 'direct', path: 'servicesPage.services', direct: true },
    { variant: 'nested', path: 'servicesPage.services.services', nested: true }
  ],
  
  'testimonials': [
    { variant: 'array', path: 'home.testimonials.testimonials', required: true },
    { variant: 'metadata-only', path: 'home.testimonials', hasArray: false }
  ],
  
  'programs': [
    { variant: 'tiered', path: 'home.programs.tiers', array: true },
    { variant: 'comparison', path: 'home.programs.comparisonRows', optional: true }
  ],
  
  'process': [
    { variant: 'steps', path: 'home.process.steps', array: true },
    { variant: 'timeline', path: 'home.process.timeline', array: true }
  ]
}

// Known Section Component Patterns  
const SECTION_PATTERNS = {
  'array-map-sections': [
    'testimonials', 'services', 'programs', 'process', 
    'features', 'team', 'gallery', 'faq', 'pricing'
  ],
  
  'object-sections': [
    'hero', 'contact', 'cta', 'footer', 'trust-signals'
  ],
  
  'nested-array-sections': [
    { section: 'programs', nested: 'tiers.included' },
    { section: 'services', nested: 'categories.defaultServices' }
  ]
}
```

### 4.2 Fix Template Library

```typescript
// Reusable fix templates
const FIX_TEMPLATES = {
  'add_array_guard': {
    description: 'Add defensive guard before .map()',
    pattern: 'BEFORE: items.map(',
    replacement: `BEFORE: if (!items?.length) return null
AFTER:  items.map(`
  },
  
  'fix_json_syntax': {
    description: 'Fix missing brace or comma',
    pattern: /"(\w+)":\s*"([^"]+)"\s*"/,  // Missing comma
    replacement: '"$1": "$2",\n  "'
  },
  
  'merge_duplicate_keys': {
    description: 'Merge duplicate JSON keys',
    steps: [
      'Identify duplicate keys',
      'Extract content from both',
      'Merge into single key',
      'Verify no data loss'
    ]
  },
  
  'add_content_fallback': {
    description: 'Add missing content structure',
    template: (missingPath: string) => {
      const templates = {
        'home.testimonials.testimonials': [
          { quote: '...', author: '...', role: '...', rating: 5 }
        ],
        'home.programs.tiers': [
          { id: 'basic', name: 'Basic', included: [], ctaLabel: '...', ctaHref: '...' }
        ]
      }
      return templates[missingPath]
    }
  }
}
```

---

## 5. Project-Specific Configuration

### 5.1 Paragu-AI Builder Constraints

```yaml
hard_constraints:
  tailwind_version: "3.4.19"  # NEVER upgrade to v4
  color_system: "css_variables"  # NEVER hardcode colors
  build_output: "static"  # Must generate static pages
  deployment: "cloudflare_pages"

soft_constraints:
  component_reuse: "preferred"  # Reuse existing sections
  content_inheritance: "supported"  # Use $ref for shared content
  section_variants: "encouraged"  # Multiple variants per section

forbidden_patterns:
  - "tailwindcss v4"
  - "hardcoded hex colors"
  - "silent error catching"
  - "missing business_id in queries"
  - "unprotected .map() calls"
  - "committing .env files"

required_patterns:
  - "var(--primary) for colors"
  - "array guards before .map()"
  - "error logging with context"
  - "TypeScript strict mode"
  - "content validation before build"
```

### 5.2 Site-Specific Knowledge

```typescript
// Tenant site configurations
const TENANT_CONFIGS = {
  'nexa-paraguay': {
    vertical: 'relocacion',
    locales: ['nl', 'en', 'de', 'es'],
    features: { testimonials: true, blog: true },
    contentStructure: 'full-relocation'
  },
  
  
  'nexa-propiedades': {
    vertical: 'inmobiliaria',
    locales: ['es', 'en', 'pt'],
    features: { testimonials: false, properties: true },
    contentStructure: 'real-estate',
    servicesFormat: 'nested-object'  // servicesPage.services.services
  }
}

// Vertical-specific requirements
const VERTICAL_REQUIREMENTS = {
  'relocacion': {
    requiredSections: ['hero', 'programs', 'process', 'whyCountry'],
    optionalSections: ['testimonials', 'faq', 'blog'],
    contentFormat: 'tiered-programs'
  },
  
  'inmobiliaria': {
    requiredSections: ['hero', 'property-listings', 'services', 'contact'],
    optionalSections: ['testimonials', 'team'],
    contentFormat: 'nested-services'
  },
  
  'peluqueria': {
    requiredSections: ['hero', 'services', 'booking'],
    optionalSections: ['team', 'gallery', 'testimonials'],
    contentFormat: 'category-services'
  }
}
```

---

## 6. Testing & Verification Protocol

### 6.1 Three-Stage Verification

```
Stage 1: Content Validation (30 seconds)
├── Validate all edited JSON files
├── Check for duplicate keys
├── Verify required fields present
└── Confirm no syntax errors

Stage 2: Type Safety (60 seconds)
├── Run npm run typecheck
├── Fix any TypeScript errors
├── Verify type alignment with content
└── Check for missing imports

Stage 3: Build Verification (120 seconds)
├── Run npm run build
├── Verify all pages generate
├── Check for runtime errors
└── Confirm static output
```

### 6.2 Site-Specific Tests

```bash
# Test specific tenant sites
curl -s http://localhost:3000/s/es/nexa-propiedades | grep -i error
curl -s http://localhost:3000/s/nl/nexa-paraguay | grep -i error

# Test business demo sites
curl -s http://localhost:3000/salon-maria | grep -i error
curl -s http://localhost:3000/granja-cabral | grep -i error
```

---

## 7. Communication Patterns

### 7.1 Commit Message Templates

```
fix: Add defensive guards to {section} section
- Prevents .map() error on undefined data
- Returns null gracefully when content missing
- Affects: {affected_sites}

type: {bug_number}
```

```
fix: Resolve content structure in {site}
- Fixed JSON syntax error (missing brace)
- Consolidated duplicate servicesPage keys
- Added missing {sections} content
- Validated with npm run build
```

```
feat: Support {format} services format in builder
- Handles category-based format
- Handles direct array format
- Handles nested object format
- Maintains backward compatibility
```

### 7.2 Progress Reporting Format

```markdown
## Build Fix Progress

### Identified Issues
1. **{Issue 1}** - {brief description}
2. **{Issue 2}** - {brief description}

### Fixes Applied
✅ **{Fix 1}** - {description}
✅ **{Fix 2}** - {description}
⏳ **{Fix 3}** - {in progress}

### Current Status
- TypeScript Errors: {count}
- Build Status: {status}
- Remaining: {items}

### Next Steps
1. {next action}
2. {following action}
```

---

## 8. Continuous Improvement Metrics

### 8.1 Success Metrics

```yaml
metrics:
  detection_time:
    target: < 2 minutes
    measurement: time from error to root cause identification
  
  fix_time:
    target: < 10 minutes for simple fixes
    target: < 30 minutes for complex issues
    measurement: time from identification to verified fix
  
  prevention_rate:
    target: > 80%
    measurement: percentage of bugs prevented by validation
  
  recurrence_rate:
    target: < 5%
    measurement: percentage of same-type bugs recurring
```

### 8.2 Learning Loop

```
Bug Encountered
    ↓
Analyze Root Cause
    ↓
Apply Fix
    ↓
Document Pattern
    ↓
Update Validation Rules
    ↓
Improve Detection
    ↓
Next Bug (better prepared)
```

---

## 9. Emergency Configuration Override

### 9.1 When Build is Broken

```yaml
emergency_mode:
  enabled: true
  when: "Build failing on main branch"
  
  priorities:
    1: "Get build working (minimal fix)"
    2: "Add defensive guards"
    3: "Document for prevention"
    4: "Full refactor (post-fix)"
  
  allowed_shortcuts:
    - "Remove problematic sections temporarily"
    - "Add minimal content to satisfy requirements"
    - "Disable failing features"
  
  forbidden_shortcuts:
    - "Skip TypeScript checks"
    - "Commit without validation"
    - "Remove error logging"
```

### 9.2 Rollback Decision Tree

```
Build Failing
    ↓
Can identify fix quickly? (< 15 min)
    ├─ YES → Apply fix
    └─ NO  → Consider rollback
              ↓
              Last known good commit?
              ├─ YES → Rollback to that commit
              └─ NO  → Minimal fix to get working
                        ↓
                        Document technical debt
```

---

## Appendix: Configuration Quick Reference

### A. Required Commands Sequence
```bash
# 1. Validate JSON
find sites -name "*.json" -exec python3 -c "import json; json.load(open('{}'))" \;

# 2. TypeScript check
npm run typecheck

# 3. Build test
npm run build

# 4. Verify (if dev server running)
curl -s http://localhost:3000/s/es/nexa-propiedades | head -20
```

### B. Defensive Code Snippets
```typescript
// Array guard
if (!items?.length) return null

// Object guard  
const safeData = data ?? {}

// Nested property guard
const value = obj?.prop?.nested ?? defaultValue

// Type guard
function isValidArray<T>(v: unknown): v is T[] {
  return Array.isArray(v) && v.length > 0
}
```

### C. Content Validation Checklist
- [ ] JSON syntax valid
- [ ] No duplicate keys
- [ ] Required fields present
- [ ] Arrays have items (if required)
- [ ] $ref resolves correctly
- [ ] TypeScript types align
- [ ] Build succeeds
- [ ] Pages render without errors

---

**Version:** 1.0  
**Effective Date:** 2026-04-20  
**Project:** Paragu-AI Builder  
**Based on:** 20+ bug fixes and patterns discovered
