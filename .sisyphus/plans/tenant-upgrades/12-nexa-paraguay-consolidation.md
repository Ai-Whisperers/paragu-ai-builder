# Tenant Upgrade: nexa-paraguay Consolidation

## Current Problems
1. **21 pages — some are too thin to justify separate pages** — `glosario` (glossary), `recursos` (resources).
2. **`privacidad` has `intake-questionnaire` section** — wrong section type for a privacy page.
3. **`benelux`, `lifestyle`, `inversor`, `empresa` pages are very similar** — same structure, different headers. Could be consolidated into parameterized pages.
4. **Homepage is missing `intake-wizard`** — the wizard was added to the page config in content but not in the section lineup.

## Changes

### File: `sites/nexa-paraguay/pages/privacidad.json`
Replace `intake-questionnaire` with regular `faq` section.

### File: `sites/nexa-paraguay/pages/glosario.json` — consider removing or merging
If glossary has no content, remove the page and clean up navigation.

### File: `sites/nexa-paraguay/site.json`
Update navigation if pages are removed.

## Verification
- [ ] privacidad page uses FAQ not intake-questionnaire
- [ ] Build passes
