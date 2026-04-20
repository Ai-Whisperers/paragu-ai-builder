# Universal Components System

Complete guide to the universal, reusable components created for the Paragu-AI Builder project.

## Table of Contents

1. [Navigation System](#navigation-system)
2. [Footer System](#footer-system)
3. [SEO Meta Manager](#seo-meta-manager)
4. [Smart Search](#smart-search)
5. [Dynamic Form Builder](#dynamic-form-builder)
6. [Social Sharing](#social-sharing)
7. [Layout Wrappers](#layout-wrappers)
8. [Quick Start Guide](#quick-start-guide)

---

## Navigation System

**File:** `web/components/ui/navigation.tsx`

### AnchorNav

Scroll-spy navigation that highlights the current section.

```tsx
import { AnchorNav } from '@/components/ui/navigation'

<AnchorNav
  items={[
    { id: 'services', label: 'Services', icon: <Wrench /> },
    { id: 'about', label: 'About', icon: <Info /> },
    { id: 'contact', label: 'Contact', icon: <Phone /> },
  ]}
  sticky
  offset={80} // Header height
/>
```

**Props:**
- `items`: Array of `{ id, label, icon? }`
- `sticky`: Stick to top of viewport
- `offset`: Scroll offset for calculations
- `mobileDrawer`: Use mobile drawer on small screens

### MegaMenuNav

Multi-column dropdown navigation for businesses with many services.

```tsx
import { MegaMenuNav } from '@/components/ui/navigation'

<MegaMenuNav
  items={[
    { label: 'Home', href: '/' },
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'Hair Styling', href: '/services/hair', group: 'Hair' },
        { label: 'Coloring', href: '/services/color', group: 'Hair' },
        { label: 'Manicure', href: '/services/nails', group: 'Nails' },
      ]
    },
  ]}
  logo={<Logo />}
  cta={{ label: 'Book Now', href: '/book' }}
  columns={3}
/>
```

### BreadcrumbNav

Hierarchical navigation with structured data support.

```tsx
import { BreadcrumbNav } from '@/components/ui/navigation'

<BreadcrumbNav
  items={[
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Hair Styling' }, // Current page
  ]}
  includeSchema
/>
```

### Pagination

Page number navigation with accessibility.

```tsx
import { Pagination } from '@/components/ui/navigation'

<Pagination
  currentPage={3}
  totalPages={10}
  hrefPattern="/blog/page/:page"
  showFirstLast
/>
```

### LoadMore

Infinite scroll or "Load More" button.

```tsx
import { LoadMore } from '@/components/ui/navigation'

<LoadMore
  hasMore={hasMorePages}
  loading={isLoading}
  onLoadMore={loadNextPage}
  infiniteScroll
/>
```

---

## Footer System

**File:** `web/components/ui/footer.tsx`

### UniversalFooter

Multi-tier footer with columns, newsletter, and social links.

```tsx
import { UniversalFooter } from '@/components/ui/footer'

<UniversalFooter
  logo={<Logo />}
  columns={[
    { title: 'Services', links: [...] },
    { title: 'Company', links: [...] },
    { title: 'Support', links: [...] },
  ]}
  social={[
    { platform: 'facebook', href: 'https://facebook.com/...' },
    { platform: 'instagram', href: 'https://instagram.com/...' },
  ]}
  newsletter={{
    title: 'Subscribe to our newsletter',
    description: 'Get updates on new services and offers',
  }}
  showNewsletter
  bottomBar={{
    copyright: '© 2024 Company Name. All rights reserved.',
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ]
  }}
  variant="default" // 'default' | 'dark' | 'primary' | 'gradient'
/>
```

### BusinessFooter

Footer with business hours, contact info, and map.

```tsx
import { BusinessFooter } from '@/components/ui/footer'

<BusinessFooter
  logo={<Logo />}
  businessName="Studio Hair"
  description="Premium hair styling services"
  contact={{
    address: '123 Main St, Asunción',
    phone: '+595 21 123 456',
    email: 'info@studio.com',
    mapUrl: 'https://maps.google.com/...',
  }}
  hours={[
    { day: 'Mon-Fri', hours: '9:00 - 18:00', isOpen: true },
    { day: 'Sat', hours: '10:00 - 16:00', isOpen: true },
    { day: 'Sun', hours: 'Closed', isOpen: false },
  ]}
  social={[...]}
  quickLinks={[...]}
  showMap
  variant="default"
/>
```

### SimpleFooter

Minimal footer - just copyright and links.

```tsx
import { SimpleFooter } from '@/components/ui/footer'

<SimpleFooter
  logo={<Logo />}
  copyright="© 2024 Company Name"
  links={[
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ]}
  social={[...]}
/>
```

---

## SEO Meta Manager

**File:** `web/lib/seo.tsx`

### generateSEO()

Generate Next.js metadata from config.

```tsx
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: 'Services - Studio Hair',
  description: 'Professional hair styling services in Asunción',
  ogImage: 'https://site.com/og.jpg',
  canonical: 'https://site.com/services',
  type: 'website',
  publishedTime: '2024-01-15',
  tags: ['hair', 'beauty', 'salon'],
})
```

### Structured Data Generators

```tsx
import { 
  generateLocalBusinessSchema,
  generateArticleSchema,
  generateProductSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  JsonLd
} from '@/lib/seo'

// LocalBusiness schema
const businessSchema = generateLocalBusinessSchema({
  name: 'Studio Hair',
  description: 'Premium hair salon',
  url: 'https://studiohair.com',
  telephone: '+595 21 123 456',
  address: {
    streetAddress: 'Av. Mcal. López 123',
    addressLocality: 'Asunción',
    addressRegion: 'Asunción',
    postalCode: '001',
    addressCountry: 'PY',
  },
  openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-14:00'],
})

// Inject into page
<JsonLd data={businessSchema} />

// Multiple schemas
<JsonLd data={[
  generateLocalBusinessSchema(business),
  generateFAQSchema({ questions: [...] }),
  generateBreadcrumbSchema({ items: [...] }),
]} />
```

### SEO Page Wrapper

```tsx
import { PageSEO } from '@/lib/seo'

<PageSEO
  meta={{
    title: 'Services',
    description: 'Our services',
    ogImage: 'https://site.com/og.jpg',
  }}
  schemas={[businessSchema, faqSchema]}
  preconnect={['https://fonts.googleapis.com']}
>
  <PageContent />
</PageSEO>
```

---

## Smart Search

**File:** `web/components/ui/search.tsx`

### SearchModal

Full-screen search with suggestions and keyboard navigation.

```tsx
'use client'
import { SearchModal, useSearchShortcut } from '@/components/ui/search'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Enable Cmd/Ctrl + K shortcut
  useSearchShortcut(() => setIsOpen(true))
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <Search /> Search
      </button>
      
      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        businessId="studio-hair"
        popularSearches={['Hair Styling', 'Coloring', 'Manicure']}
        onResultClick={(result) => {
          // Track analytics
          console.log('Search result clicked:', result)
        }}
      />
    </>
  )
}
```

### SearchInput with Suggestions

```tsx
import { SearchInput } from '@/components/ui/search'

<SearchInput
  onSearch={(query) => router.push(`/search?q=${query}`)}
  businessId="studio-hair"
  placeholder="Search services..."
  suggestions
/>
```

### Search Button

```tsx
import { SearchButton } from '@/components/ui/search'

// Header style (shows ⌘K shortcut)
<SearchButton onClick={() => setIsOpen(true)} headerStyle />

// Regular button
<SearchButton onClick={() => setIsOpen(true)} />
```

### Search Index API

Create `/app/api/search/index/route.ts`:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('business')
  
  // Fetch business data
  const index = {
    pages: [...],
    services: [...],
    products: [...],
    team: [...],
    blog: [...],
    faq: [...],
  }
  
  return Response.json(index)
}
```

---

## Dynamic Form Builder

**File:** `web/components/ui/form-builder.tsx`

### Basic Form

```tsx
import { DynamicForm, createFormConfig } from '@/components/ui/form-builder'

const contactForm = createFormConfig({
  id: 'contact',
  preset: 'contact',
  title: 'Contact Us',
  submitLabel: 'Send Message',
  successMessage: 'Thank you for contacting us!',
})

<DynamicForm
  config={contactForm}
  onSubmit={async (submission) => {
    await fetch('/api/forms/submit', {
      method: 'POST',
      body: JSON.stringify(submission),
    })
  }}
/>
```

### Multi-Step Form

```tsx
const bookingForm = {
  id: 'booking',
  title: 'Book an Appointment',
  fields: [
    // Step 1 fields
    { id: 'name', name: 'name', label: 'Full Name', type: 'text', required: true, step: 0 },
    { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, step: 0 },
    // Step 2 fields
    { id: 'service', name: 'service', label: 'Service', type: 'select', required: true, step: 1, options: [...] },
    { id: 'date', name: 'date', label: 'Date', type: 'date', required: true, step: 1 },
  ],
  steps: [
    { title: 'Personal Info', description: 'Tell us about yourself', fields: ['name', 'email'] },
    { title: 'Booking Details', description: 'Choose your service', fields: ['service', 'date'] },
  ],
}

<DynamicForm config={bookingForm} onSubmit={handleSubmit} />
```

### Field Types

```tsx
const fields = [
  { id: 'name', name: 'name', label: 'Name', type: 'text', required: true },
  { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
  { id: 'phone', name: 'phone', label: 'Phone', type: 'tel' },
  { id: 'message', name: 'message', label: 'Message', type: 'textarea', required: true },
  { id: 'service', name: 'service', label: 'Service', type: 'select', options: [{ label: 'Option 1', value: '1' }] },
  { id: 'newsletter', name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox' },
  { id: 'contact_method', name: 'contact_method', label: 'Preferred contact', type: 'radio', options: [...] },
  { id: 'date', name: 'date', label: 'Date', type: 'date' },
  { id: 'time', name: 'time', label: 'Time', type: 'time' },
  { id: 'rating', name: 'rating', label: 'Rating', type: 'rating' },
  { id: 'budget', name: 'budget', label: 'Budget', type: 'number', validation: { min: 0, max: 10000 } },
]
```

### Form Presets

```tsx
import { formPresets, createFormConfig } from '@/components/ui/form-builder'

// Available presets:
// - 'contact' - Name, email, phone, message
// - 'booking' - Name, email, service, date, time
// - 'quote' - Name, email, service type, budget, details
// - 'newsletter' - Email, name
// - 'feedback' - Name, rating, review

const form = createFormConfig({
  id: 'custom',
  preset: 'contact', // Start from preset
  fields: [
    ...formPresets.contact,
    { id: 'custom', name: 'custom', label: 'Custom Field', type: 'text' },
  ]
})
```

---

## Social Sharing

**File:** `web/components/ui/social-share.tsx`

### Share Buttons

```tsx
import { ShareButtons, ShareButton } from '@/components/ui/social-share'

// Group of buttons
<ShareButtons
  data={{
    url: 'https://site.com/page',
    title: 'My Page Title',
    description: 'Page description',
  }}
  platforms={['facebook', 'twitter', 'whatsapp', 'copy']}
  direction="horizontal"
  size="md"
/>

// Individual button
<ShareButton
  platform="facebook"
  data={{ url: 'https://site.com/page', title: 'My Page' }}
  showLabel
/>
```

### Share Dropdown

```tsx
import { ShareDropdown } from '@/components/ui/social-share'

<ShareDropdown
  data={{ url: 'https://site.com/page', title: 'My Page' }}
  trigger={<Button>Share</Button>}
/>
```

### Native Share (Mobile)

```tsx
import { NativeShare } from '@/components/ui/social-share'

<NativeShare
  data={{ url, title, description }}
>
  <Button>Share</Button>
</NativeShare>
// On mobile: Opens native share sheet
// On desktop: Falls back to ShareDropdown
```

### Platforms Supported

- `facebook` - Facebook share dialog
- `twitter` - Twitter/X intent
- `linkedin` - LinkedIn share
- `whatsapp` - WhatsApp message
- `telegram` - Telegram share
- `email` - Email composer
- `copy` - Copy link to clipboard

---

## Layout Wrappers

**File:** `web/components/ui/section-wrapper.tsx` (already documented in UXUI_BEAUTIFICATION.md)

### SectionWrapper

```tsx
import { SectionWrapper } from '@/components/ui/section-wrapper'

<SectionWrapper
  id="services"
  title="Our Services"
  subtitle="What we offer"
  background="gradient"
  gradientVariant="primary-secondary"
  decorativeBlobs
  blobColors={['primary', 'accent']}
  padding="xl"
  animate
>
  <ServicesGrid />
</SectionWrapper>
```

### SplitSection

```tsx
import { SplitSection } from '@/components/ui/section-wrapper'

<SplitSection
  left={<TextContent />}
  right={<ImageContent />}
  leftWidth="1/2"
  gap="xl"
  background="default"
/>
```

### FeatureGrid

```tsx
import { FeatureGrid } from '@/components/ui/section-wrapper'

<FeatureGrid
  features={[
    { icon: <Icon1 />, title: 'Feature 1', description: 'Description' },
    { icon: <Icon2 />, title: 'Feature 2', description: 'Description' },
  ]}
  columns={3}
  cardStyle="glass"
  hoverEffect
/>
```

---

## Quick Start Guide

### 1. Add to Your Page

```tsx
import { generateSEO } from '@/lib/seo'
import { UniversalFooter } from '@/components/ui/footer'
import { MegaMenuNav } from '@/components/ui/navigation'

export const metadata = generateSEO({
  title: 'Home - My Business',
  description: 'Welcome to my business',
})

export default function Page() {
  return (
    <>
      <MegaMenuNav
        items={[...]}
        logo={<Logo />}
        cta={{ label: 'Book Now', href: '/book' }}
      />
      
      <main>
        {/* Page content */}
      </main>
      
      <UniversalFooter
        logo={<Logo />}
        columns={[...]}
        social={[...]}
      />
    </>
  )
}
```

### 2. Add Search to Header

```tsx
'use client'
import { SearchButton, SearchModal, useSearchShortcut } from '@/components/ui/search'

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  useSearchShortcut(() => setIsSearchOpen(true))
  
  return (
    <>
      <SearchButton onClick={() => setIsSearchOpen(true)} headerStyle />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        businessId="your-business-id"
        popularSearches={['Service 1', 'Service 2']}
      />
    </>
  )
}
```

### 3. Add Contact Form

```tsx
import { DynamicForm, createFormConfig } from '@/components/ui/form-builder'

const contactForm = createFormConfig({
  id: 'contact',
  preset: 'contact',
  title: 'Contact Us',
})

<DynamicForm
  config={contactForm}
  onSubmit={async (submission) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(submission),
    })
  }}
/>
```

### 4. Add SEO Structured Data

```tsx
import { generateLocalBusinessSchema, JsonLd } from '@/lib/seo'

const businessSchema = generateLocalBusinessSchema({
  name: 'My Business',
  description: 'Business description',
  url: 'https://mybusiness.com',
  // ... more fields
})

export default function Page() {
  return (
    <>
      <JsonLd data={businessSchema} />
      {/* Page content */}
    </>
  )
}
```

---

## Best Practices

### Navigation
- Use `AnchorNav` for long-scrolling landing pages
- Use `MegaMenuNav` for businesses with 8+ services
- Always include mobile menu support
- Use breadcrumbs for deep page hierarchies

### SEO
- Use `generateSEO()` for all pages
- Include `JsonLd` for LocalBusiness schema
- Generate sitemaps dynamically
- Use canonical URLs to prevent duplicate content

### Search
- Create search index API endpoint
- Cache index in localStorage
- Track popular searches
- Implement fuzzy search for typos

### Forms
- Use presets for consistency
- Enable multi-step for complex forms
- Validate on blur for better UX
- Show loading states during submission

### Performance
- Lazy load heavy components
- Use intersection observer for scroll animations
- Cache search indexes
- Optimize images with WebP format

---

## All Component Files

| Component | File | Purpose |
|-----------|------|---------|
| AnchorNav | `ui/navigation.tsx` | Scroll-spy section nav |
| MegaMenuNav | `ui/navigation.tsx` | Multi-column dropdown nav |
| BreadcrumbNav | `ui/navigation.tsx` | Hierarchical navigation |
| Pagination | `ui/navigation.tsx` | Page number nav |
| LoadMore | `ui/navigation.tsx` | Infinite scroll trigger |
| UniversalFooter | `ui/footer.tsx` | Multi-tier footer |
| BusinessFooter | `ui/footer.tsx` | Footer with hours/map |
| SimpleFooter | `ui/footer.tsx` | Minimal footer |
| generateSEO | `lib/seo.tsx` | Meta tag generator |
| generateLocalBusinessSchema | `lib/seo.tsx` | Structured data |
| JsonLd | `lib/seo.tsx` | JSON-LD injector |
| SearchModal | `ui/search.tsx` | Full-screen search |
| SearchInput | `ui/search.tsx` | Inline search with suggestions |
| DynamicForm | `ui/form-builder.tsx` | Dynamic form generator |
| createFormConfig | `ui/form-builder.tsx` | Form config helper |
| ShareButtons | `ui/social-share.tsx` | Social share group |
| ShareButton | `ui/social-share.tsx` | Individual share button |
| NativeShare | `ui/social-share.tsx` | Native share API |
| SectionWrapper | `ui/section-wrapper.tsx` | Enhanced section container |
| SplitSection | `ui/section-wrapper.tsx` | Two-column layout |
| FeatureGrid | `ui/section-wrapper.tsx` | Feature cards grid |

---

## Integration with Business Types

All components use CSS variables and work with any business type:

```tsx
// Colors automatically adapt to business tokens
--primary: from tokens
--secondary: from tokens  
--accent: from tokens
--text: from tokens
--background: from tokens
```

Components can be configured per business type in registry files:

```json
{
  "navigation": {
    "type": "mega-menu",
    "columns": 3,
    "showCta": true
  },
  "footer": {
    "type": "business",
    "showMap": true,
    "showNewsletter": true
  }
}
```

---

Total components created: **40+ new universal components**
All components are:
- ✅ Theme-aware (CSS variables)
- ✅ Accessible (ARIA labels, keyboard nav)
- ✅ Mobile-responsive
- ✅ Type-safe (TypeScript)
- ✅ Documented with examples
