/**
 * Win 75: A/B Testing Framework
 * Simple A/B testing utility for experiments
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Experiment types
export const ExperimentTypes = {
  WHATSAPP_TEMPLATE: 'whatsapp_template',
  SUBJECT_LINE: 'subject_line',
  DEMO_LAYOUT: 'demo_layout',
  PRICING_DISPLAY: 'pricing_display',
  CTA_BUTTON: 'cta_button',
  ONBOARDING_FLOW: 'onboarding_flow',
  EMAIL_TEMPLATE: 'email_template',
} as const

export type ExperimentType = typeof ExperimentTypes[keyof typeof ExperimentTypes]

interface Experiment {
  id: string
  name: string
  type: ExperimentType
  description: string
  variants: Array<{
    id: string
    name: string
    weight: number // 0-1, must sum to 1 across all variants
    config: Record<string, unknown>
  }>
  status: 'draft' | 'running' | 'paused' | 'completed'
  startDate?: string
  endDate?: string
  targetAudience?: {
    businessTypes?: string[]
    cities?: string[]
    minPriorityScore?: number
  }
}

interface ExperimentAssignment {
  experimentId: string
  variantId: string
  leadId: string
  assignedAt: string
}

interface ExperimentResult {
  experimentId: string
  variantId: string
  metric: string
  value: number
  timestamp: string
  leadId?: string
}

// In-memory cache for assignments (to ensure consistency)
const assignmentCache = new Map<string, string>() // key: "experimentId:leadId" -> variantId

/**
 * Create a new experiment
 */
export async function createExperiment(
  supabase: SupabaseClient,
  experiment: Omit<Experiment, 'id' | 'status'>
): Promise<{ success: boolean; experiment?: Experiment; error?: string }> {
  try {
    const id = `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    
    // Validate variant weights sum to 1
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0)
    if (Math.abs(totalWeight - 1) > 0.001) {
      return { 
        success: false, 
        error: `Variant weights must sum to 1, got ${totalWeight}` 
      }
    }

    const newExperiment: Experiment = {
      id,
      status: 'draft',
      ...experiment,
    }

    const { error } = await supabase
      .from('experiments')
      .insert({
        id: newExperiment.id,
        name: newExperiment.name,
        type: newExperiment.type,
        description: newExperiment.description,
        variants: newExperiment.variants,
        status: newExperiment.status,
        target_audience: newExperiment.targetAudience || null,
        created_at: new Date().toISOString(),
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, experiment: newExperiment }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

/**
 * Start an experiment
 */
export async function startExperiment(
  supabase: SupabaseClient,
  experimentId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('experiments')
    .update({
      status: 'running',
      start_date: new Date().toISOString(),
    })
    .eq('id', experimentId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Stop an experiment
 */
export async function stopExperiment(
  supabase: SupabaseClient,
  experimentId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('experiments')
    .update({
      status: 'completed',
      end_date: new Date().toISOString(),
    })
    .eq('id', experimentId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Assign a lead to a variant
 * Uses deterministic assignment based on lead ID for consistency
 */
export async function assignVariant(
  supabase: SupabaseClient,
  experimentId: string,
  leadId: string
): Promise<{ 
  success: boolean
  variant?: { id: string; name: string; config: Record<string, unknown> }
  error?: string 
}> {
  const cacheKey = `${experimentId}:${leadId}`
  
  // Check cache first
  if (assignmentCache.has(cacheKey)) {
    const variantId = assignmentCache.get(cacheKey)!
    // Fetch variant details
    const { data: experiment } = await supabase
      .from('experiments')
      .select('variants')
      .eq('id', experimentId)
      .single()
    
    const variant = experiment?.variants?.find((v: { id: string }) => v.id === variantId)
    if (variant) {
      return { success: true, variant }
    }
  }

  // Check if already assigned in database
  const { data: existing } = await supabase
    .from('experiment_assignments')
    .select('*')
    .eq('experiment_id', experimentId)
    .eq('lead_id', leadId)
    .single()

  if (existing) {
    // Fetch variant details
    const { data: experiment } = await supabase
      .from('experiments')
      .select('variants')
      .eq('id', experimentId)
      .single()
    
    const variant = experiment?.variants?.find((v: { id: string }) => v.id === existing.variant_id)
    if (variant) {
      assignmentCache.set(cacheKey, variant.id)
      return { success: true, variant }
    }
  }

  // Get experiment details
  const { data: experiment, error: expError } = await supabase
    .from('experiments')
    .select('*')
    .eq('id', experimentId)
    .eq('status', 'running')
    .single()

  if (expError || !experiment) {
    return { success: false, error: 'Experiment not found or not running' }
  }

  // Check if lead matches target audience
  if (experiment.target_audience) {
    const { data: lead } = await supabase
      .from('leads')
      .select('business_type, city, priority_score')
      .eq('id', leadId)
      .single()

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    const audience = experiment.target_audience as {
      businessTypes?: string[]
      cities?: string[]
      minPriorityScore?: number
    }

    if (audience.businessTypes?.length && !audience.businessTypes.includes(lead.business_type)) {
      return { success: false, error: 'Lead does not match target audience' }
    }

    if (audience.cities?.length && !audience.cities.includes(lead.city)) {
      return { success: false, error: 'Lead does not match target audience' }
    }

    if (audience.minPriorityScore && lead.priority_score < audience.minPriorityScore) {
      return { success: false, error: 'Lead does not match target audience' }
    }
  }

  // Assign variant using weighted random selection
  const variants = experiment.variants as Array<{ id: string; name: string; weight: number; config: Record<string, unknown> }>
  const random = Math.random()
  let cumulativeWeight = 0
  let selectedVariant = variants[0]

  for (const variant of variants) {
    cumulativeWeight += variant.weight
    if (random <= cumulativeWeight) {
      selectedVariant = variant
      break
    }
  }

  // Store assignment
  const { error: assignError } = await supabase
    .from('experiment_assignments')
    .insert({
      experiment_id: experimentId,
      variant_id: selectedVariant.id,
      lead_id: leadId,
      assigned_at: new Date().toISOString(),
    })

  if (assignError) {
    return { success: false, error: assignError.message }
  }

  // Cache assignment
  assignmentCache.set(cacheKey, selectedVariant.id)

  return { 
    success: true, 
    variant: {
      id: selectedVariant.id,
      name: selectedVariant.name,
      config: selectedVariant.config,
    }
  }
}

/**
 * Track a conversion/event for an experiment
 */
export async function trackExperimentResult(
  supabase: SupabaseClient,
  experimentId: string,
  leadId: string,
  metric: string,
  value: number
): Promise<{ success: boolean; error?: string }> {
  // Get variant assignment
  const { data: assignment } = await supabase
    .from('experiment_assignments')
    .select('variant_id')
    .eq('experiment_id', experimentId)
    .eq('lead_id', leadId)
    .single()

  if (!assignment) {
    return { success: false, error: 'No variant assignment found for lead' }
  }

  const { error } = await supabase
    .from('experiment_results')
    .insert({
      experiment_id: experimentId,
      variant_id: assignment.variant_id,
      lead_id: leadId,
      metric,
      value,
      timestamp: new Date().toISOString(),
    })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Get experiment results/statistics
 */
export async function getExperimentResults(
  supabase: SupabaseClient,
  experimentId: string
): Promise<{
  experiment: Experiment
  variantStats: Array<{
    variantId: string
    variantName: string
    assignments: number
    results: Record<string, { count: number; total: number; avg: number }>
  }>
}> {
  // Get experiment
  const { data: experiment, error: expError } = await supabase
    .from('experiments')
    .select('*')
    .eq('id', experimentId)
    .single()

  if (expError || !experiment) {
    throw new Error('Experiment not found')
  }

  // Get assignments per variant
  const { data: assignments } = await supabase
    .from('experiment_assignments')
    .select('variant_id')
    .eq('experiment_id', experimentId)

  // Get results
  const { data: results } = await supabase
    .from('experiment_results')
    .select('*')
    .eq('experiment_id', experimentId)

  const variants = experiment.variants as Array<{ id: string; name: string }>
  
  // Calculate stats per variant
  const variantStats = variants.map(variant => {
    const variantAssignments = assignments?.filter(
      (a: { variant_id: string }) => a.variant_id === variant.id
    ).length || 0

    const variantResults = results?.filter(
      (r: { variant_id: string }) => r.variant_id === variant.id
    ) || []

    // Aggregate by metric
    const metrics: Record<string, { count: number; total: number; avg: number }> = {}
    variantResults.forEach((r: { metric: string; value: number }) => {
      if (!metrics[r.metric]) {
        metrics[r.metric] = { count: 0, total: 0, avg: 0 }
      }
      metrics[r.metric].count++
      metrics[r.metric].total += r.value
      metrics[r.metric].avg = Math.round((metrics[r.metric].total / metrics[r.metric].count) * 100) / 100
    })

    return {
      variantId: variant.id,
      variantName: variant.name,
      assignments: variantAssignments,
      results: metrics,
    }
  })

  return {
    experiment: experiment as Experiment,
    variantStats,
  }
}

/**
 * Simple hash function for deterministic assignment
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Get variant deterministically (useful for consistent UI rendering)
 */
export function getDeterministicVariant(
  experiment: Experiment,
  leadId: string
): { id: string; name: string; config: Record<string, unknown> } | null {
  const hash = hashString(`${experiment.id}:${leadId}`)
  const random = (hash % 1000) / 1000 // 0-1
  
  let cumulativeWeight = 0
  for (const variant of experiment.variants) {
    cumulativeWeight += variant.weight
    if (random <= cumulativeWeight) {
      return variant
    }
  }
  
  return experiment.variants[experiment.variants.length - 1] || null
}

/**
 * List all experiments
 */
export async function listExperiments(
  supabase: SupabaseClient,
  status?: Experiment['status']
): Promise<Experiment[]> {
  let query = supabase
    .from('experiments')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return (data || []).map((e: {
    id: string
    name: string
    type: ExperimentType
    description: string
    variants: Experiment['variants']
    status: Experiment['status']
    start_date?: string
    end_date?: string
    target_audience?: Experiment['targetAudience']
  }) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    description: e.description,
    variants: e.variants,
    status: e.status,
    startDate: e.start_date,
    endDate: e.end_date,
    targetAudience: e.target_audience,
  }))
}

/**
 * Hook for React components
 */
export function useExperiments(supabase: SupabaseClient) {
  return {
    create: (exp: Omit<Experiment, 'id' | 'status'>) => createExperiment(supabase, exp),
    start: (id: string) => startExperiment(supabase, id),
    stop: (id: string) => stopExperiment(supabase, id),
    assign: (expId: string, leadId: string) => assignVariant(supabase, expId, leadId),
    track: (expId: string, leadId: string, metric: string, value: number) => 
      trackExperimentResult(supabase, expId, leadId, metric, value),
    getResults: (id: string) => getExperimentResults(supabase, id),
    list: (status?: Experiment['status']) => listExperiments(supabase, status),
    getDeterministicVariant,
  }
}

// Example experiments for common use cases
export const ExampleExperiments = {
  whatsappTemplates: {
    name: 'WhatsApp Template Performance',
    type: ExperimentTypes.WHATSAPP_TEMPLATE,
    description: 'Compare initial outreach templates',
    variants: [
      { id: 'v1', name: 'Direct Value Prop', weight: 0.5, config: { template: 'direct' } },
      { id: 'v2', name: 'Question Based', weight: 0.5, config: { template: 'question' } },
    ],
  },
  pricingDisplay: {
    name: 'Pricing Page Layout',
    type: ExperimentTypes.PRICING_DISPLAY,
    description: 'Test different pricing display formats',
    variants: [
      { id: 'v1', name: 'Cards', weight: 0.5, config: { layout: 'cards' } },
      { id: 'v2', name: 'Table', weight: 0.5, config: { layout: 'table' } },
    ],
  },
}
