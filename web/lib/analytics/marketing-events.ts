/**
 * GA4 marketing-funnel event helpers for Nexa Paraguay.
 *
 * Mirrors the shape of commerce-events.ts but targets the service/lead
 * funnel rather than ecommerce: hero CTA, intake wizard steps, tier
 * selection, lead submission. All events fire on `window.gtag` so they
 * show up in GA4 DebugView + the standard event reports.
 *
 * All functions are no-ops when gtag isn't on window (no consent, GA4
 * not configured) — safe to call unconditionally from client components.
 */

import { gtag } from './gtag-shared'

/**
 * Hero primary/secondary CTA click. `location` lets us split same-action
 * CTAs across multiple pages in GA4 (e.g. hero CTA on /home vs /programas).
 */
export function trackHeroCta(opts: {
  label: string
  href: string
  location: string
  tenant?: string
}) {
  gtag('event', 'cta_click', {
    cta_location: opts.location,
    cta_type: 'hero',
    cta_label: opts.label,
    cta_href: opts.href,
    tenant: opts.tenant,
  })
}

/** Intake wizard — user advanced to the next step with a selected answer. */
export function trackWizardStep(opts: {
  step: number
  stepKey: string
  answerKey: string
  answerLabel: string
  tenant?: string
}) {
  gtag('event', 'wizard_step', {
    wizard_step: opts.step,
    wizard_step_key: opts.stepKey,
    wizard_answer_key: opts.answerKey,
    wizard_answer_label: opts.answerLabel,
    tenant: opts.tenant,
  })
}

/**
 * Intake wizard — final "Programa recomendado" screen rendered. This is the
 * primary conversion signal before the user actually hits contact.
 */
export function trackWizardComplete(opts: {
  recommendedTier: string
  tenant?: string
}) {
  gtag('event', 'wizard_complete', {
    recommended_tier: opts.recommendedTier,
    tenant: opts.tenant,
  })
}

/**
 * Programs-comparison tier CTA click. `location` = which page the tier
 * card was rendered on (home, /programas, /comparacion, /benelux, ...).
 */
export function trackTierCta(opts: {
  tierId: string
  tierName: string
  location: string
  tenant?: string
}) {
  gtag('event', 'tier_cta_click', {
    tier_id: opts.tierId,
    tier_name: opts.tierName,
    cta_location: opts.location,
    tenant: opts.tenant,
  })
}

/**
 * Lead submission — contact form, exit-intent modal, newsletter signup.
 * `success` distinguishes forms that completed from those that fell back
 * to mailto. `source` is the component name for funnel attribution.
 */
export function trackLeadSubmit(opts: {
  source: string
  success: boolean
  tenant?: string
}) {
  gtag('event', opts.success ? 'lead_submit' : 'lead_fallback', {
    lead_source: opts.source,
    tenant: opts.tenant,
  })
  if (opts.success) {
    // Also fire GA4's standard `generate_lead` event so GA4's built-in
    // conversion reports pick it up without custom setup.
    gtag('event', 'generate_lead', {
      lead_source: opts.source,
      tenant: opts.tenant,
    })
  }
}
