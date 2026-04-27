# Tenant Upgrade: Demo Tenants

## Current Problems
1. **demo-contador** and **demo-estudio-contable** are clearly template demos with placeholder content.
2. Not clearly distinguished from real tenants.

## Changes

### File: `sites/demo-contador/site.json`
Add `is_demo: true` if not set, or add a demo badge visual.
Ensure no residual TODO markers in content.

### File: `sites/demo-estudio-contable/site.json`
Same treatment.

## Verification
- [ ] Demo tenants render without errors
- [ ] Build passes
