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
