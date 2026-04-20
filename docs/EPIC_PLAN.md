# 📋 Paragu-AI Builder: Complete Epic/Story/Task Plan

> **Document Type:** Product Backlog & Planning Guide  
> **Project:** Paragu-AI Builder (Multi-tenant Website Generation Engine)  
> **Generated:** April 2026  
> **Purpose:** Ticket planning and work organization (NOT implementation guide)

---

## 📊 Executive Overview

### Current State Summary
- **Codebase Size:** ~39,457 lines TypeScript
- **Total Files:** ~150+
- **Test Coverage:** 37 test files exist (needs verification)
- **Business Types:** 1,000+ registered
- **Verticals:** 12 major categories
- **Sections:** 21 reusable components
- **Documentation:** 30+ markdown files
- **Audit Grade:** D+ (requires significant work before production)

### Critical Stats
- 🚨 **55 feature gaps** identified
- 🔴 **5 critical security issues** 
- 🟠 **545 console.log statements** in production code
- 🟡 **Zero E2E tests** (Playwright configured but empty)
- 🟢 **Strong foundation** with good architecture patterns

---

## 🎯 EPIC STRUCTURE

### How to Use This Document

Each **EPIC** represents a major initiative.  
Each **STORY** is a deliverable user/technical outcome.  
Each **TASK** is a concrete work item (estimable, assignable).  

**Priority Levels:**
- **P0:** Blocks production - Immediate attention required
- **P1:** Required for MVP launch
- **P2:** Required for first paying customers  
- **P3:** Growth and scale features
- **P4:** Nice to have / future considerations

---

# 🔴 EPIC 1: SECURITY & COMPLIANCE HARDENING
**Priority:** P0  
**Status:** 🔴 NOT STARTED  
**Estimated Effort:** 3-4 weeks  
**Owner:** Security Lead / Senior Backend

## Summary
Address critical security vulnerabilities before any production deployment. This epic blocks all other production work.

### STORY 1.1: Critical Security Vulnerabilities
**Priority:** P0  
**Story Points:** 21  
**Acceptance Criteria:**
- All CRITICAL and HIGH vulnerabilities resolved
- Security audit passed
- Penetration testing completed

#### TASK 1.1.1: Fix SQL Injection Vulnerability
**Priority:** P0 | **Type:** Bug | **Points:** 3
- **Context:** Admin search uses unsafe string interpolation
- **File:** `app/admin/leads/page.tsx:97`
- **Acceptance:**
  - [ ] Replace string interpolation with parameterized queries
  - [ ] Add input validation with Zod
  - [ ] Test with malicious payloads
  - [ ] Document fix in security changelog

#### TASK 1.1.2: Fix XSS via dangerouslySetInnerHTML
**Priority:** P0 | **Type:** Bug | **Points:** 5
- **Context:** 6 files render unsanitized HTML/CSS
- **Files:** Multiple theme and content components
- **Acceptance:**
  - [ ] Audit all dangerouslySetInnerHTML usages
  - [ ] Install and configure DOMPurify
  - [ ] Create sanitize utilities module
  - [ ] Apply sanitization to all 6 identified files
  - [ ] Add CSP headers to all routes
  - [ ] Test with XSS payloads

#### TASK 1.1.3: Fix Bulk Update API Data Loss
**Priority:** P0 | **Type:** Bug | **Points:** 5
- **Context:** Uses in-memory Map instead of database
- **File:** `app/api/leads/bulk-update/route.ts`
- **Acceptance:**
  - [ ] Replace Map with Supabase queries
  - [ ] Add transaction support
  - [ ] Implement proper error handling
  - [ ] Add audit logging
  - [ ] Test with 100+ lead updates
  - [ ] Verify data persists across restarts

#### TASK 1.1.4: Enable Authentication on Admin Routes
**Priority:** P0 | **Type:** Bug | **Points:** 3
- **Context:** Auth check is commented out
- **File:** `app/admin/leads/page.tsx`
- **Acceptance:**
  - [ ] Uncomment and fix auth middleware
  - [ ] Add proper session validation
  - [ ] Test unauthorized access is blocked
  - [ ] Add redirect to login for unauthenticated users
  - [ ] Verify role-based access control

#### TASK 1.1.5: Fix RLS Policy Inadequacies
**Priority:** P0 | **Type:** Bug | **Points:** 3
- **Context:** Policies allow cross-tenant access
- **File:** `supabase/migrations/000_complete_schema.sql`
- **Acceptance:**
  - [ ] Audit all existing RLS policies
  - [ ] Create proper user-scoped policies
  - [ ] Add business_id filtering to all queries
  - [ ] Test cross-tenant isolation
  - [ ] Create migration for policy updates

#### TASK 1.1.6: Security Audit & Penetration Testing
**Priority:** P0 | **Type:** Testing | **Points:** 5
- **Acceptance:**
  - [ ] Run Snyk security scan
  - [ ] Run npm audit
  - [ ] Hire external penetration testing
  - [ ] Document all findings
  - [ ] Create remediation plan for any new issues
  - [ ] Obtain security sign-off

### STORY 1.2: Security Infrastructure
**Priority:** P1  
**Story Points:** 13  
**Acceptance Criteria:**
- Security tooling configured
- Monitoring active
- Incident response documented

#### TASK 1.2.1: Set Up Security Scanning Tools
**Priority:** P1 | **Type:** Tooling | **Points:** 3
- **Acceptance:**
  - [ ] Install and configure Snyk
  - [ ] Set up GitGuardian for secret scanning
  - [ ] Configure Dependabot alerts
  - [ ] Set up pre-commit hooks with security checks
  - [ ] Document tool configurations

#### TASK 1.2.2: Implement Rate Limiting
**Priority:** P1 | **Type:** Feature | **Points:** 5
- **Context:** No rate limiting on any API routes
- **Acceptance:**
  - [ ] Set up Upstash Redis account
  - [ ] Create rate limiting utilities
  - [ ] Apply rate limits to login endpoint
  - [ ] Apply rate limits to API endpoints
  - [ ] Apply rate limits to bulk operations
  - [ ] Test rate limiting effectiveness
  - [ ] Document rate limit policies

#### TASK 1.2.3: Remove Console Logs from Production
**Priority:** P1 | **Type:** Cleanup | **Points:** 3
- **Context:** 545 console.log statements, some leak secrets
- **Acceptance:**
  - [ ] Identify and catalog all console.logs
  - [ ] Remove or replace with proper logger
  - [ ] Ensure no API keys in logs
  - [ ] Add ESLint rule to prevent future usage
  - [ ] Verify no sensitive data exposure

#### TASK 1.2.4: Create Security Incident Response Plan
**Priority:** P1 | **Type:** Documentation | **Points:** 2
- **Acceptance:**
  - [ ] Document incident response procedures
  - [ ] Define escalation paths
  - [ ] Create security runbooks
  - [ ] Set up on-call rotation
  - [ ] Schedule tabletop exercise

---

# 🧪 EPIC 2: COMPREHENSIVE TESTING STRATEGY
**Priority:** P1  
**Status:** 🟡 PARTIALLY STARTED (37 test files exist)  
**Estimated Effort:** 4-6 weeks  
**Owner:** QA Lead / Engineering Team

## Summary
Establish robust testing coverage including unit, integration, E2E, security, and performance tests. Target: 80%+ coverage.

### STORY 2.1: Unit Testing Foundation
**Priority:** P1  
**Story Points:** 21  
**Current State:** Some tests exist, coverage unknown

#### TASK 2.1.1: Audit Existing Unit Tests
**Priority:** P1 | **Type:** Analysis | **Points:** 3
- **Acceptance:**
  - [ ] Run existing test suite
  - [ ] Measure current coverage
  - [ ] Identify gaps in coverage
  - [ ] Document which components lack tests
  - [ ] Create coverage baseline report

#### TASK 2.1.2: Write Unit Tests for Core Utilities
**Priority:** P1 | **Type:** Testing | **Points:** 5
- **Target Files:**
  - `lib/utils.ts` - slugify, fillTemplate
  - `lib/validation.ts` - validation schemas
  - `lib/engine/compose.ts` - page composition
  - `lib/tokens/resolver.ts` - token resolution
- **Acceptance:**
  - [ ] Test all utility functions
  - [ ] Test edge cases
  - [ ] Test error conditions
  - [ ] Achieve 80%+ coverage on utilities

#### TASK 2.1.3: Write Unit Tests for Section Components
**Priority:** P1 | **Type:** Testing | **Points:** 8
- **Target Components:**
  - HeroSection
  - ServicesSection
  - TeamSection
  - TestimonialsSection
  - ContactSection
  - BookingSection
- **Acceptance:**
  - [ ] Test component rendering
  - [ ] Test prop handling
  - [ ] Test interactive elements
  - [ ] Test accessibility attributes
  - [ ] Test responsive behavior

#### TASK 2.1.4: Write Unit Tests for API Utilities
**Priority:** P1 | **Type:** Testing | **Points:** 5
- **Target:**
  - API route handlers
  - Supabase client wrappers
  - Data transformation functions
- **Acceptance:**
  - [ ] Test API utilities in isolation
  - [ ] Mock Supabase responses
  - [ ] Test error handling
  - [ ] Test data transformations

### STORY 2.2: Integration Testing
**Priority:** P1  
**Story Points:** 13  
**Current State:** Integration test directory exists

#### TASK 2.2.1: Write Integration Tests for API Routes
**Priority:** P1 | **Type:** Testing | **Points:** 5
- **Target Routes:**
  - `/api/leads`
  - `/api/businesses`
  - `/api/generate`
  - `/api/webhooks/mercadopago`
- **Acceptance:**
  - [ ] Test happy paths
  - [ ] Test error scenarios
  - [ ] Test authentication
  - [ ] Test data persistence

#### TASK 2.2.2: Write Integration Tests for Database Layer
**Priority:** P1 | **Type:** Testing | **Points:** 5
- **Acceptance:**
  - [ ] Test CRUD operations
  - [ ] Test RLS policies
  - [ ] Test transactions
  - [ ] Test connection pooling
  - [ ] Test query performance

#### TASK 2.2.3: Write Integration Tests for Site Generation
**Priority:** P1 | **Type:** Testing | **Points:** 3
- **Acceptance:**
  - [ ] Test compose engine
  - [ ] Test renderer
  - [ ] Test token resolution
  - [ ] Test multi-page generation

### STORY 2.3: End-to-End Testing
**Priority:** P2  
**Story Points:** 21  
**Current State:** Playwright configured, no tests written

#### TASK 2.3.1: Write E2E Tests for Critical User Flows
**Priority:** P2 | **Type:** Testing | **Points:** 8
- **Flows:**
  - Admin login → Dashboard → Lead management
  - Generate preview site → View site
  - Bulk update leads
  - Site generation and preview
- **Acceptance:**
  - [ ] Cover critical happy paths
  - [ ] Test error states
  - [ ] Test across browsers
  - [ ] Run in CI pipeline

#### TASK 2.3.2: Write E2E Tests for Business Site Rendering
**Priority:** P2 | **Type:** Testing | **Points:** 8
- **Acceptance:**
  - [ ] Test each business type renders correctly
  - [ ] Test all 21 section components
  - [ ] Test responsive layouts
  - [ ] Test theme switching
  - [ ] Test navigation

#### TASK 2.3.3: Set Up Visual Regression Testing
**Priority:** P2 | **Type:** Testing | **Points:** 5
- **Acceptance:**
  - [ ] Configure Playwright for screenshots
  - [ ] Create baseline screenshots
  - [ ] Set up comparison workflow
  - [ ] Document visual testing process

### STORY 2.4: Security Testing
**Priority:** P1  
**Story Points:** 13

#### TASK 2.4.1: Write Security Unit Tests
**Priority:** P1 | **Type:** Testing | **Points:** 5
- **Acceptance:**
  - [ ] Test SQL injection prevention
  - [ ] Test XSS prevention
  - [ ] Test input sanitization
  - [ ] Test authentication enforcement

#### TASK 2.4.2: Write Security Integration Tests
**Priority:** P1 | **Type:** Testing | **Points:** 5
- **Acceptance:**
  - [ ] Test rate limiting
  - [ ] Test CORS policies
  - [ ] Test CSRF protection
  - [ ] Test session management

#### TASK 2.4.3: Automate Security Testing in CI
**Priority:** P1 | **Type:** Tooling | **Points:** 3
- **Acceptance:**
  - [ ] Add security tests to CI pipeline
  - [ ] Configure Snyk in CI
  - [ ] Set up dependency scanning
  - [ ] Block PRs with vulnerabilities

---

# 📚 EPIC 3: DOCUMENTATION COMPLETENESS
**Priority:** P1-P2  
**Status:** 🟢 GOOD FOUNDATION (30+ docs exist)  
**Estimated Effort:** 2-3 weeks  
**Owner:** Technical Writer / Engineering Team

## Summary
Complete documentation for all aspects: user guides, API docs, architecture docs, runbooks, and onboarding materials.

### STORY 3.1: User Documentation
**Priority:** P2  
**Story Points:** 13

#### TASK 3.1.1: Create Admin User Guide
**Priority:** P2 | **Type:** Documentation | **Points:** 5
- **Sections:**
  - Dashboard overview
  - Lead management
  - Site generation
  - Analytics and reporting
  - Troubleshooting
- **Acceptance:**
  - [ ] Written in Spanish and English
  - [ ] Includes screenshots
  - [ ] Step-by-step instructions
  - [ ] FAQ section

#### TASK 3.1.2: Create Business Owner Guide
**Priority:** P2 | **Type:** Documentation | **Points:** 5
- **Sections:**
  - Getting started
  - Customizing your site
  - Managing content
  - Understanding analytics
  - Getting support
- **Acceptance:**
  - [ ] Non-technical language
  - [ ] Visual guides
  - [ ] Video tutorials (optional)

#### TASK 3.1.3: Create Quick Start Guide
**Priority:** P2 | **Type:** Documentation | **Points:** 3
- **Acceptance:**
  - [ ] 5-minute getting started
  - [ ] Common tasks
  - [ ] Cheat sheet
  - [ ] One-pager for reference

### STORY 3.2: Technical Documentation
**Priority:** P1  
**Story Points:** 21

#### TASK 3.2.1: Complete API Documentation
**Priority:** P1 | **Type:** Documentation | **Points:** 5
- **Current:** Partial API_ENDPOINTS.md exists
- **Acceptance:**
  - [ ] Document all endpoints
  - [ ] Include request/response examples
  - [ ] Document error codes
  - [ ] Authentication guide
  - [ ] Rate limiting details

#### TASK 3.2.2: Document Architecture Decisions
**Priority:** P1 | **Type:** Documentation | **Points:** 5
- **Deliverables:**
  - Architecture Decision Records (ADRs)
  - System architecture diagrams
  - Data flow documentation
  - Integration patterns
- **Acceptance:**
  - [ ] Document key decisions with rationale
  - [ ] Create C4 diagrams
  - [ ] Document data models

#### TASK 3.2.3: Create Developer Onboarding Guide
**Priority:** P1 | **Type:** Documentation | **Points:** 5
- **Sections:**
  - Environment setup
  - Codebase overview
  - Development workflow
  - Testing guide
  - Deployment process
  - Troubleshooting
- **Acceptance:**
  - [ ] New dev can be productive in 1 day
  - [ ] Includes all necessary links

#### TASK 3.2.4: Document Component Library
**Priority:** P1 | **Type:** Documentation | **Points:** 3
- **Current:** COMPONENT_LIBRARY.md exists
- **Acceptance:**
  - [ ] Document all 21 sections
  - [ ] Include prop types and examples
  - [ ] Add visual examples
  - [ ] Document theming

#### TASK 3.2.5: Create Database Schema Documentation
**Priority:** P1 | **Type:** Documentation | **Points:** 3
- **Acceptance:**
  - [ ] Entity Relationship Diagram
  - [ ] Table descriptions
  - [ ] Index documentation
  - [ ] Migration history

### STORY 3.3: Operations Documentation
**Priority:** P2  
**Story Points:** 13

#### TASK 3.3.1: Create Deployment Runbooks
**Priority:** P2 | **Type:** Documentation | **Points:** 5
- **Current:** DEPLOYMENT_CHECKLIST.md exists
- **Acceptance:**
  - [ ] Step-by-step deployment procedures
  - [ ] Rollback procedures
  - [ ] Environment configuration
  - [ ] Verification steps

#### TASK 3.3.2: Create Monitoring & Alerting Runbooks
**Priority:** P2 | **Type:** Documentation | **Points:** 3
- **Acceptance:**
  - [ ] Dashboard interpretation
  - [ ] Alert response procedures
  - [ ] Common issues and solutions

#### TASK 3.3.3: Create Incident Response Runbooks
**Priority:** P2 | **Type:** Documentation | **Points:** 3
- **Acceptance:**
  - [ ] Severity classification
  - [ ] Response procedures by type
  - [ ] Communication templates
  - [ ] Post-incident process

#### TASK 3.3.4: Create Business Type Addition Guide
**Priority:** P2 | **Type:** Documentation | **Points:** 2
- **Current:** ADDING_BUSINESS_TYPES.md exists
- **Acceptance:**
  - [ ] Update with latest patterns
  - [ ] Add troubleshooting section
  - [ ] Include validation steps

---

# 🏗️ EPIC 4: CORE PLATFORM FEATURES
**Priority:** P1-P2  
**Status:** 🟡 PARTIALLY IMPLEMENTED  
**Estimated Effort:** 6-8 weeks  
**Owner:** Product Lead / Engineering Team

## Summary
Complete core platform functionality: site generation, admin CRUD, multi-page support, and lead management.

### STORY 4.1: Site Generation Engine Completion
**Priority:** P1  
**Story Points:** 21

#### TASK 4.1.1: Implement Multi-Page Site Generation
**Priority:** P1 | **Type:** Feature | **Points:** 8
- **Context:** Currently only generates homepage
- **Acceptance:**
  - [ ] Generate services page
  - [ ] Generate gallery page
  - [ ] Generate team page
  - [ ] Generate contact page
  - [ ] Generate blog index (if applicable)
  - [ ] Link pages in navigation

#### TASK 4.1.2: Implement On-Demand Site Generation API
**Priority:** P1 | **Type:** Feature | **Points:** 5
- **Acceptance:**
  - [ ] Create `/api/generate` endpoint
  - [ ] Support async generation
  - [ ] Add generation queue
  - [ ] Implement progress tracking
  - [ ] Add webhook notifications

#### TASK 4.1.3: Implement Site Versioning
**Priority:** P1 | **Type:** Feature | **Points:** 5
- **Context:** Table exists but unused
- **Acceptance:**
  - [ ] Store version on each generation
  - [ ] Support rollback to previous version
  - [ ] Add version comparison
  - [ ] Create version history UI

#### TASK 4.1.4: Implement Palette Selection UI
**Priority:** P1 | **Type:** Feature | **Points:** 3
- **Context:** Backend ready, no UI
- **Acceptance:**
  - [ ] Create palette picker component
  - [ ] Show preview of each palette
  - [ ] Save palette preference
  - [ ] Apply palette to generated site

### STORY 4.2: Admin Dashboard Enhancement
**Priority:** P1  
**Story Points:** 21

#### TASK 4.2.1: Implement Full CRUD for Businesses
**Priority:** P1 | **Type:** Feature | **Points:** 8
- **Context:** Currently read-only
- **Acceptance:**
  - [ ] Create business form
  - [ ] Edit business data
  - [ ] Delete business with confirmation
  - [ ] Bulk operations
  - [ ] Import from CSV

#### TASK 4.2.2: Implement Site Generation Trigger
**Priority:** P1 | **Type:** Feature | **Points:** 5
- **Acceptance:**
  - [ ] Add Generate Site button
  - [ ] Show generation progress
  - [ ] Display preview link
  - [ ] Show generation history

#### TASK 4.2.3: Implement Lead Management Dashboard
**Priority:** P1 | **Type:** Feature | **Points:** 5
- **Acceptance:**
  - [ ] Filterable lead table
  - [ ] Lead detail view
  - [ ] Status management
  - [ ] Notes and activity log
  - [ ] Export functionality

#### TASK 4.2.4: Implement Business Analytics Dashboard
**Priority:** P2 | **Type:** Feature | **Points:** 3
- **Acceptance:**
  - [ ] Site view analytics
  - [ ] Lead conversion metrics
  - [ ] Popular sections report
  - [ ] Export reports

### STORY 4.3: Lead Management System
**Priority:** P1  
**Story Points:** 13

#### TASK 4.3.1: Implement Lead Import Pipeline
**Priority:** P1 | **Type:** Feature | **Points:** 5
- **Context:** Script exists, needs to be run
- **Acceptance:**
  - [ ] Run import for 3,960 Priority A leads
  - [ ] Validate imported data
  - [ ] Handle duplicates
  - [ ] Create import history log

#### TASK 4.3.2: Implement Lead Scoring v2
**Priority:** P1 | **Type:** Feature | **Points:** 5
- **Acceptance:**
  - [ ] Incorporate social signals
  - [ ] Weight IG follower count
  - [ ] Add activity recency scoring
  - [ ] Recalibrate all scores
  - [ ] Update Priority A list

#### TASK 4.3.3: Implement Lead Status Pipeline
**Priority:** P1 | **Type:** Feature | **Points:** 3
- **Acceptance:**
  - [ ] Define status states
  - [ ] Implement state transitions
  - [ ] Add status history tracking
  - [ ] Create status dashboard

---

# 🎨 EPIC 5: GENERATED SITE FEATURES
**Priority:** P2  
**Status:** 🟡 BASIC FEATURES EXIST  
**Estimated Effort:** 4-6 weeks  
**Owner:** Frontend Lead / Engineering Team

## Summary
Enhance generated business sites with booking, contact forms, SEO, and media capabilities.

### STORY 5.1: Booking & Contact Integration
**Priority:** P2  
**Story Points:** 13

#### TASK 5.1.1: Implement Online Booking Widget
**Priority:** P2 | **Type:** Feature | **Points:** 5
- **Acceptance:**
  - [ ] Integrate Fresha widget
  - [ ] Support Calendly embed
  - [ ] WhatsApp booking flow
  - [ ] Service selection
  - [ ] Date/time picker

#### TASK 5.1.2: Implement Contact Form Submissions
**Priority:** P2 | **Type:** Feature | **Points:** 5
- **Context:** Forms defined but static
- **Acceptance:**
  - [ ] Create form submission API
  - [ ] Store submissions in database
  - [ ] Send email notifications
  - [ ] Show confirmation message
  - [ ] Spam protection

#### TASK 5.1.3: Implement Google Maps Integration
**Priority:** P2 | **Type:** Feature | **Points:** 3
- **Context:** Works with embed URL, most have link URLs
- **Acceptance:**
  - [ ] Convert link URLs to embed format
  - [ ] Handle missing map data gracefully
  - [ ] Add directions link
  - [ ] Mobile-optimized display

### STORY 5.2: SEO & Marketing Features
**Priority:** P2  
**Story Points:** 13

#### TASK 5.2.1: Implement Structured Data (JSON-LD)
**Priority:** P2 | **Type:** Feature | **Points:** 5
- **Context:** SchemaType defined but not generated
- **Acceptance:**
  - [ ] Generate LocalBusiness schema
  - [ ] Generate Service schema
  - [ ] Generate FAQ schema
  - [ ] Validate with Google Rich Results

#### TASK 5.2.2: Implement Sitemap Generation
**Priority:** P2 | **Type:** Feature | **Points:** 3
- **Acceptance:**
  - [ ] Generate XML sitemap
  - [ ] Include all pages
  - [ ] Add lastmod dates
  - [ ] Submit to search engines

#### TASK 5.2.3: Implement Open Graph & Social Meta
**Priority:** P2 | **Type:** Feature | **Points:** 3
- **Context:** Title/description exist, need OG images
- **Acceptance:**
  - [ ] Generate OG images dynamically
  - [ ] Add Twitter card meta
  - [ ] Test social sharing

#### TASK 5.2.4: Implement Before/After Gallery
**Priority:** P2 | **Type:** Feature | **Points:** 2
- **Context:** Feature flag exists, no component
- **Acceptance:**
  - [ ] Create Before/After component
  - [ ] Support slider comparison
  - [ ] Support side-by-side
  - [ ] Mobile responsive

### STORY 5.3: Media & Assets Management
**Priority:** P2  
**Story Points:** 13

#### TASK 5.3.1: Implement Image Upload System
**Priority:** P2 | **Type:** Feature | **Points:** 5
- **Context:** Cloudinary env vars exist, no handling
- **Acceptance:**
  - [ ] Create upload API endpoint
  - [ ] Integrate Cloudinary
  - [ ] Support multiple image formats
  - [ ] Add image optimization
  - [ ] Create upload UI

#### TASK 5.3.2: Implement Placeholder Image System
**Priority:** P2 | **Type:** Feature | **Points:** 3
- **Acceptance:**
  - [ ] Generate category-based placeholders
  - [ ] Use as fallback for missing images
  - [ ] Support business type theming

#### TASK 5.3.3: Implement Image Optimization
**Priority:** P2 | **Type:** Feature | **Points:** 3
- **Context:** Using raw img tags
- **Acceptance:**
  - [ ] Convert to Next.js Image component
  - [ ] Implement lazy loading
  - [ ] Add responsive sizes
  - [ ] Optimize for Core Web Vitals

#### TASK 5.3.4: Implement Logo & Favicon Support
**Priority:** P2 | **Type:** Feature | **Points:** 2
- **Acceptance:**
  - [ ] Support business logo upload
  - [ ] Generate favicons
  - [ ] Apply to generated sites

