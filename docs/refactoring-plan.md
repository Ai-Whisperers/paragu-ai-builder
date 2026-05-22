# Paragu-AI Builder Refactoring Plan

> Goal: Reduce duplication, improve maintainability, and simplify adding new business types and sections. Target: eliminate ~2500 lines of duplicative code, make adding a section a single-file change.

**Architecture:** Extract shared leader/CRM dashboard components (leads + inbox share 70% code), make section renderer dynamic, create SectionWrapper to eliminate repeated patterns across 106 section files, and consolidate 1970 business type JSONs into a trait-based composition system.

**Tech Stack:** Next.js 15, TypeScript, React Server Components + Client Components, Tailwind CSS, Supabase.

**Execution:** Use subagent-driven-development. Each phase = one delegate_task per numbered step. Spec review then code review per step.

---

## Phase 1: Admin Dashboard Unification (ALTA prioridad)

### Task 1.1: Extract LeadTable shared component

**Objective:** Create a generic, reusable lead table component used by both inbox and leads dashboards.

**Files:**
- Create: `web/components/admin/lead-table.tsx`
- Create: `web/components/admin/lead-table.types.ts`
- Reference: `web/app/admin/inbox/inbox-dashboard.tsx` (lines 1-200: table rendering, pagination, selection)
- Reference: `web/app/admin/leads/leads-dashboard-client.tsx` (lines 1-400: table rendering, pagination, selection)

**Step 1: Define shared types**

Create `web/components/admin/lead-table.types.ts`:

```ts
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed'
export type SlaLevel = 'ok' | 'warning' | 'overdue' | null

export interface LeadTableItem {
  id: string
  business_name: string
  business_type: string
  city: string
  phone: string
  status: LeadStatus
  priority_score: number
  has_website: boolean
  assigned_to: string | null
  created_at: string
  contacted_at: string | null
  site_slug?: string
}

export interface LeadTableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  render?: (item: LeadTableItem) => React.ReactNode
}

export interface LeadTableProps {
  items: LeadTableItem[]
  columns: LeadTableColumn[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onRowClick?: (item: LeadTableItem) => void
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  loading?: boolean
  emptyMessage?: string
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
}
```

**Step 2: Write test for LeadTable rendering**

Create `web/tests/admin/lead-table.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LeadTable } from '@/components/admin/lead-table'
import type { LeadTableItem, LeadTableColumn } from '@/components/admin/lead-table.types'

const mockItems: LeadTableItem[] = [
  { id: '1', business_name: 'Test Barber', business_type: 'barberia', city: 'Asuncion', phone: '0984 123456', status: 'new', priority_score: 70, has_website: false, assigned_to: null, created_at: '2026-04-26T00:00:00Z', contacted_at: null }
]

const mockColumns: LeadTableColumn[] = [
  { key: 'business_name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' },
]

test('renders items and handles selection', () => {
  const onToggle = jest.fn()
  render(
    <LeadTable
      items={mockItems}
      columns={mockColumns}
      selectedIds={new Set()}
      onToggleSelect={onToggle}
      onToggleSelectAll={() => {}}
      page={1}
      pageSize={20}
      totalCount={1}
      onPageChange={() => {}}
    />
  )
  expect(screen.getByText('Test Barber')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('checkbox'))
  expect(onToggle).toHaveBeenCalledWith('1')
})
```

**Step 3: Implement LeadTable**

Create `web/components/admin/lead-table.tsx`:

```tsx
'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LeadTableProps } from './lead-table.types'

export function LeadTable({
  items, columns, selectedIds, onToggleSelect, onToggleSelectAll,
  onRowClick, page, pageSize, totalCount, onPageChange,
  loading, emptyMessage, sortKey, sortDir, onSort,
}: LeadTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  const allSelected = items.length > 0 && selectedIds.size === items.length

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-10 px-3 py-3">
                <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer hover:bg-slate-100'
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-slate-500">
                  {loading ? 'Loading...' : emptyMessage || 'No items found.'}
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr
                  key={item.id}
                  className={cn(
                    'hover:bg-slate-50 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={() => onToggleSelect(item.id)}
                    />
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-sm">
                      {col.render ? col.render(item) : (item as any)[col.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages} ({totalCount} total)
          </span>
          <div className="flex gap-1">
            <button
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Step 4: Run test**

```bash
npx jest --testPathPattern='admin/lead-table' -v
```
Expected: PASS

**Step 5: Commit**

```bash
git add web/components/admin/lead-table.tsx web/components/admin/lead-table.types.ts web/tests/admin/lead-table.test.tsx
git commit -m "refactor: extract shared LeadTable component from inbox/leads dashboards"
```

---

### Task 1.2: Extract StatusBadge + SLA urgency indicators

**Objective:** Create reusable StatusBadge with SLA coloring and overdue detection. Used in both inbox and leads dashboards.

**Files:**
- Create: `web/components/admin/status-badge.tsx`
- Reference: `web/app/admin/inbox/inbox-dashboard.tsx:30-65` (SLA logic)
- Reference: `web/app/admin/leads/leads-dashboard-client.tsx` (status badge render)

**Code:**

```tsx
'use client'

import { cn } from '@/lib/utils'
import { Clock, AlertTriangle, XCircle } from 'lucide-react'
import type { LeadStatus, SlaLevel } from './lead-table.types'

interface StatusBadgeProps {
  status: LeadStatus
  slaLevel: SlaLevel
  created_at: string
  contacted_at?: string | null
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; base: string; sla: { warning: number; overdue: number } }> = {
  new: { label: 'New', base: 'bg-blue-50 text-blue-700 border-blue-200', sla: { warning: 12, overdue: 24 } },
  contacted: { label: 'Contacted', base: 'bg-amber-50 text-amber-700 border-amber-200', sla: { warning: 48, overdue: 72 } },
  qualified: { label: 'Qualified', base: 'bg-purple-50 text-purple-700 border-purple-200', sla: { warning: 48, overdue: 72 } },
  closed: { label: 'Closed', base: 'bg-slate-100 text-slate-600 border-slate-200', sla: { warning: 72, overdue: 120 } },
}

function calcSla(status: LeadStatus, created_at: string, contacted_at?: string | null): SlaLevel {
  const now = Date.now()
  const start = status === 'new' ? new Date(created_at).getTime() : contacted_at ? new Date(contacted_at).getTime() : new Date(created_at).getTime()
  const hours = (now - start) / 3_600_000
  const config = STATUS_CONFIG[status]
  if (hours > config.sla.overdue) return 'overdue'
  if (hours > config.sla.warning) return 'warning'
  return 'ok'
}

export function StatusBadge({ status, slaLevel, created_at, contacted_at }: StatusBadgeProps) {
  const actualSla = calcSla(status, created_at, contacted_at)
  const config = STATUS_CONFIG[status]
  const icon = actualSla === 'overdue' ? XCircle : actualSla === 'warning' ? AlertTriangle : Clock

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
      config.base,
      actualSla === 'overdue' && '!bg-red-50 !text-red-700 !border-red-200',
      actualSla === 'warning' && '!bg-amber-50 !text-amber-700 !border-amber-200',
    )}>
      {icon({ className: 'w-3 h-3' })}
      {config.label}
    </span>
  )
}
```

**Test:**

```tsx
test('StatusBadge shows correct SLA level', () => {
  const oldDate = new Date(Date.now() - 48 * 3_600_000).toISOString() // 48h ago
  const { container } = render(<StatusBadge status="new" slaLevel={null} created_at={oldDate} />)
  expect(container.querySelector('.text-red-700')).toBeTruthy() // overdue
})
```

**Commit:**
```bash
git add web/components/admin/status-badge.tsx web/tests/admin/status-badge.test.tsx
git commit -m "refactor: extract StatusBadge with SLA detection from inbox/leads"
```

---

### Task 1.3: Extract BulkActionsBar

**Files:**
- Create: `web/components/admin/bulk-actions-bar.tsx`
- Reference: `web/app/admin/inbox/inbox-dashboard.tsx:300-330` (bulk actions)
- Reference: `web/app/admin/leads/leads-dashboard-client.tsx:700-750` (bulk actions)

**Code:**

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Trash2, Tag, UserRound } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface BulkActionsBarProps {
  selectedCount: number
  onBulkStatusUpdate?: (status: string) => Promise<void>
  onBulkAssign?: (userId: string) => Promise<void>
  onBulkExport?: () => void
  onBulkDelete?: () => Promise<void>
  assignees?: { id: string; name: string }[]
  statusOptions?: { value: string; label: string }[]
}

export function BulkActionsBar({
  selectedCount, onBulkStatusUpdate, onBulkAssign, onBulkExport,
  onBulkDelete, assignees, statusOptions,
}: BulkActionsBarProps) {
  const [openAction, setOpenAction] = useState<string | null>(null)

  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border">
      <span className="text-sm text-slate-600 font-medium mr-2">{selectedCount} selected</span>

      {statusOptions && onBulkStatusUpdate && (
        <Select onValueChange={v => { onBulkStatusUpdate(v); setOpenAction(null) }}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <Tag className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Set status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {assignees && onBulkAssign && (
        <Select onValueChange={v => { onBulkAssign(v); setOpenAction(null) }}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <UserRound className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Assign to" />
          </SelectTrigger>
          <SelectContent>
            {assignees.map(a => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onBulkExport && (
        <Button variant="outline" size="sm" onClick={onBulkExport}>
          <Download className="w-3 h-3 mr-1" /> Export
        </Button>
      )}

      {onBulkDelete && (
        <Button variant="destructive" size="sm" onClick={onBulkDelete}>
          <Trash2 className="w-3 h-3 mr-1" /> Delete
        </Button>
      )}
    </div>
  )
}
```

**Commit:**
```bash
git add web/components/admin/bulk-actions-bar.tsx
git commit -m "refactor: extract reusable BulkActionsBar from inbox/leads dashboards"
```

---

### Task 1.4: Refactor inbox dashboard to use shared components

**Files:**
- Modify: `web/app/admin/inbox/inbox-dashboard.tsx`

Replace inline table rendering with `<LeadTable>`, inline status rendering with `<StatusBadge>`, inline bulk actions with `<BulkActionsBar>`.

**Expected reduction:** From 629 lines to ~200 lines.

**Verify:** `npm run build` passes (typecheck). Manual: `http://localhost:3000/admin/inbox` renders same as before.

**Commit:**
```bash
git commit -m "refactor: use shared LeadTable/StatusBadge/BulkActionsBar in inbox dashboard"
```

---

### Task 1.5: Refactor leads dashboard to use shared components

**Files:**
- Modify: `web/app/admin/leads/leads-dashboard-client.tsx`

Same pattern: replace inline table/status/bulk-actions with shared components.

**Expected reduction:** From 1440 lines to ~400 lines.

**Verify:** `npm run build` passes.

**Commit:**
```bash
git commit -m "refactor: use shared LeadTable/StatusBadge/BulkActionsBar in leads dashboard"
```

**Total Phase 1 impact:** ~1700 lines eliminated from two files.

---

## Phase 2: Dynamic Section Renderer (ALTA prioridad)

### Task 2.1: Create dynamic section registry

**Objective:** Replace manual switch/case in renderer.tsx with a registry-based map. Each section component registers itself by section ID.

**Files:**
- Modify: `web/lib/engine/renderer.tsx`
- Modify: `web/lib/engine/section-registry.ts`
- No new files — the registry already exists (`SECTION_CATALOG`), just needs the component map.

**Step 1: Read current renderer.tsx**

```bash
cat web/lib/engine/renderer.tsx
```

Note the pattern: at the top there are 30+ manual `import { XSection } from '@/components/sections/x-section'`, then a `switch` or `if/else` block that maps section IDs to components.

**Step 2: Add component mapping to section-registry.ts**

```ts
// At bottom of section-registry.ts
import type { ComponentType } from 'react'

// Lazy-loaded section component map
// Sections auto-register here instead of renderer.tsx having to import each one
export const SECTION_COMPONENTS: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  header: () => import('@/components/sections/header-section'),
  hero: () => import('@/components/sections/hero-section'),
  services: () => import('@/components/sections/services-section'),
  booking: () => import('@/components/sections/booking-section'),
  portfolio: () => import('@/components/sections/portfolio-section'),
  'before-after': () => import('@/components/sections/before-after-section'),
  'class-schedule': () => import('@/components/sections/class-schedule-section'),
  'membership-plans': () => import('@/components/sections/membership-plans-section'),
  'room-booking': () => import('@/components/sections/room-booking-section'),
  'event-venues': () => import('@/components/sections/event-venues-section'),
  'quote-form': () => import('@/components/sections/quote-form-section'),
  'emergency-indicator': () => import('@/components/sections/emergency-indicator-section'),
  'product-catalog': () => import('@/components/sections/product-catalog-section'),
  gallery: () => import('@/components/sections/gallery-section'),
  team: () => import('@/components/sections/team-section'),
  testimonials: () => import('@/components/sections/testimonials-section'),
  contact: () => import('@/components/sections/contact-section'),
  faq: () => import('@/components/sections/faq-section'),
  'cta-banner': () => import('@/components/sections/cta-banner-section'),
  footer: () => import('@/components/sections/footer-section'),
  'age-gate': () => import('@/components/sections/age-gate-section'),
  features: () => import('@/components/sections/features-section'),
  pricing: () => import('@/components/sections/pricing-table-section'),
  process: () => import('@/components/sections/process-timeline-section'),
  'weekly-schedule': () => import('@/components/sections/weekly-schedule-section'),
}
```

**Step 3: Simplify renderer.tsx**

The renderer becomes a generic dynamic loader:

```tsx
import dynamic from 'next/dynamic'
import { SECTION_COMPONENTS } from './section-registry'

export function SectionRenderer({ section }: { section: ComposedSection }) {
  const Component = dynamic(SECTION_COMPONENTS[section.type], {
    loading: () => <div className="animate-pulse h-48 bg-slate-100 rounded-lg" />,
  })
  return <Component {...section.data} />
}
```

**Verify:** `npm run build` passes. All existing pages render sections correctly.

**Commit:**
```bash
git add web/lib/engine/renderer.tsx web/lib/engine/section-registry.ts
git commit -m "refactor: dynamic section renderer via registry map, no more manual switch"
```

---

### Task 2.2: Add section component test harness

**Objective:** Create a test utility that verifies all registered section components actually export a default component with the expected interface.

**Files:**
- Create: `web/tests/engine/section-registry.test.ts`

```tsx
import { SECTION_COMPONENTS } from '@/lib/engine/section-registry'

describe('Section Registry', () => {
  for (const [id, loader] of Object.entries(SECTION_COMPONENTS)) {
    it(`section "${id}" loads without error`, async () => {
      const mod = await loader()
      expect(mod.default).toBeDefined()
      expect(typeof mod.default).toBe('function')
    })
  }
})
```

**Run:** `npx jest --testPathPattern='section-registry' -v` — all ~25 sections pass.

**Commit:**
```bash
git add web/tests/engine/section-registry.test.ts
git commit -m "test: verify all section components load from registry"
```

**Total Phase 2 impact:** Adding a new section becomes: create component → add ONE line to `SECTION_COMPONENTS` map. No more touching renderer.tsx.

---

## Phase 3: SectionWrapper Component (MEDIA prioridad)

### Task 3.1: Create SectionWrapper

**Files:**
- Create: `web/components/sections/section-wrapper.tsx`

```tsx
'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  id?: string
  title?: string
  subtitle?: string
  className?: string
  background?: 'default' | 'muted' | 'primary' | 'dark'
  children: React.ReactNode
  /** Skip the standard container padding (for full-width sections) */
  fullWidth?: boolean
  /** Skip animation wrapper */
  noAnimation?: boolean
}

const BG_CLASSES = {
  default: 'bg-[var(--background)]',
  muted: 'bg-[var(--muted)]',
  primary: 'bg-[var(--primary)] text-white',
  dark: 'bg-slate-900 text-white',
}

export function SectionWrapper({
  id, title, subtitle, className, background = 'default',
  children, fullWidth, noAnimation,
}: SectionWrapperProps) {
  const content = (
    <>
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && <Heading level="h2" className="text-[var(--primary)]">{title}</Heading>}
          {subtitle && <p className="mt-2 text-[var(--muted-foreground)]">{subtitle}</p>}
        </div>
      )}
      {children}
    </>
  )

  return (
    <section id={id} className={cn('py-16', BG_CLASSES[background], className)}>
      {fullWidth ? content : <Container>{content}</Container>}
    </section>
  )
}
```

**Commit:**
```bash
git add web/components/sections/section-wrapper.tsx
git commit -m "refactor: create SectionWrapper for consistent section structure"
```

---

### Task 3.2: Refactor 5 highest-churn sections to use SectionWrapper

**Files to refactor (pick 5 most frequently modified):**
- `web/components/sections/services-section.tsx`
- `web/components/sections/team-section.tsx`
- `web/components/sections/testimonials-section.tsx`
- `web/components/sections/faq-section.tsx`
- `web/components/sections/gallery-section.tsx`

**Pattern for each:**

Before:
```tsx
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export function ServicesSection({ title, items }: Props) {
  return (
    <section className="py-16 bg-[var(--background)]">
      <Container>
        <AnimateOnScroll>
          <Heading level="h2" className="text-[var(--primary)]">{title}</Heading>
          {items.map(...)}
        </AnimateOnScroll>
      </Container>
    </section>
  )
}
```

After:
```tsx
import { SectionWrapper } from './section-wrapper'

export function ServicesSection({ title, items }: Props) {
  return (
    <SectionWrapper title={title}>
      {items.map(...)}
    </SectionWrapper>
  )
}
```

**Verify for each:** `npm run build` passes.

**Commit after each:**
```bash
git commit -m "refactor: use SectionWrapper in [section-name]"
```

**Total Phase 3 impact:** Removes ~15 lines of boilerplate per section (Container + Heading + animation imports). Target: 5 sections = ~75 lines eliminated.

---

## Phase 4: Business Type Trait System (ESTRATÉGICO — long-term)

### Task 4.1: Analyze registry JSON structure and find common patterns

**Files:**
- Read-only: `src/registry/*.type.json` (examine 5-10 samples)

**Command:**
```bash
# Find common section combinations across types
cd /root/paragu-ai-builder/src/registry
python3 -c "
import json, os
from collections import Counter
section_combo = Counter()
for f in __import__('glob').glob('*.type.json')[:500]:
    d = json.load(open(f))
    sections = tuple(sorted(d.get('sections', [])))
    section_combo[sections] += 1
for combo, count in section_combo.most_common(20):
    print(f'{count:4d}x: {list(combo)[:5]}...' if len(combo) > 5 else f'{count:4d}x: {list(combo)}')
"
```

**Don't implement yet** — this is analysis for a future phase. Save output to `docs/type-analysis.md`.

**Commit:**
```bash
git add docs/type-analysis.md
git commit -m "docs: registry type JSON pattern analysis for trait system"
```

---

## Verification

After each phase, run:

```bash
cd /root/paragu-ai-builder/web && npm run typecheck 2>&1
cd /root/paragu-ai-builder/web && npm run build 2>&1 | tail -10
```

Expected: `0 errors`, build completes with `✓ Compiled successfully`.

---

## Summary of Impact

| Phase | Files created | Files modified | Lines removed | Lines added | Net |
|-------|--------------|----------------|--------------|-------------|-----|
| 1. Dashboard unification | 4 | 2 | ~1700 | ~600 | **-1100** |
| 2. Dynamic renderer | 0 | 2 | ~80 | ~40 | **-40** |
| 3. SectionWrapper | 1 | 5 | ~75 | ~20 | **-55** |
| 4. Analysis only | 1 | 0 | 0 | ~50 | 0 |
| **Total** | **6** | **9** | **~1855** | **~710** | **-1195** |
