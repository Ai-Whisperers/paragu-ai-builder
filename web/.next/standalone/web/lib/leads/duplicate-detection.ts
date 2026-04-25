/**
 * Duplicate Detection System for Leads
 * 
 * Detects potential duplicate leads based on multiple criteria:
 * - Phone number matching
 * - Business name similarity
 * - Address/location proximity
 * - Social media handle matching
 */

export interface Lead {
  id: string
  business_name: string
  phone: string | null
  whatsapp: string | null
  instagram: string | null
  city: string
  neighborhood: string | null
  google_maps_url: string | null
}

export interface DuplicateMatch {
  leadId: string
  confidence: 'high' | 'medium' | 'low'
  matchedFields: string[]
  similarityScore: number
}

export interface DuplicateCheckResult {
  isDuplicate: boolean
  matches: DuplicateMatch[]
  confidence: 'high' | 'medium' | 'low' | 'none'
}

// Normalize phone number for comparison
function normalizePhone(phone: string | null): string | null {
  if (!phone) return null
  return phone.replace(/\D/g, '').replace(/^0/, '595')
}

// Calculate string similarity using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  if (s1 === s2) return 1
  
  const len1 = s1.length
  const len2 = s2.length
  const matrix: number[][] = []
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }
  
  const distance = matrix[len1][len2]
  const maxLen = Math.max(len1, len2)
  return 1 - distance / maxLen
}

// Check if two leads are duplicates
export function checkForDuplicates(
  lead: Lead,
  existingLeads: Lead[],
  options: {
    phoneThreshold?: number
    nameThreshold?: number
    minConfidence?: 'high' | 'medium' | 'low'
  } = {}
): DuplicateCheckResult {
  const {
    phoneThreshold = 0.95,
    nameThreshold = 0.85,
    minConfidence = 'low'
  } = options

  const matches: DuplicateMatch[] = []
  const normalizedLeadPhone = normalizePhone(lead.phone)
  const normalizedLeadWhatsApp = normalizePhone(lead.whatsapp)

  for (const existing of existingLeads) {
    const matchedFields: string[] = []
    let score = 0

    // Check phone number match
    const existingPhone = normalizePhone(existing.phone)
    const existingWhatsApp = normalizePhone(existing.whatsapp)
    
    if (normalizedLeadPhone && existingPhone) {
      const phoneSimilarity = calculateSimilarity(normalizedLeadPhone, existingPhone)
      if (phoneSimilarity >= phoneThreshold) {
        matchedFields.push('phone')
        score += phoneSimilarity * 0.4
      }
    }

    if (normalizedLeadWhatsApp && existingWhatsApp) {
      const waSimilarity = calculateSimilarity(normalizedLeadWhatsApp, existingWhatsApp)
      if (waSimilarity >= phoneThreshold) {
        matchedFields.push('whatsapp')
        score += waSimilarity * 0.4
      }
    }

    // Check business name similarity
    const nameSimilarity = calculateSimilarity(lead.business_name, existing.business_name)
    if (nameSimilarity >= nameThreshold) {
      matchedFields.push('business_name')
      score += nameSimilarity * 0.3
    }

    // Check Instagram handle
    if (lead.instagram && existing.instagram) {
      const instaSimilarity = calculateSimilarity(
        lead.instagram.replace('@', ''),
        existing.instagram.replace('@', '')
      )
      if (instaSimilarity >= phoneThreshold) {
        matchedFields.push('instagram')
        score += instaSimilarity * 0.2
      }
    }

    // Check location proximity (same city + neighborhood)
    if (lead.city === existing.city) {
      score += 0.1
      if (lead.neighborhood && existing.neighborhood) {
        const neighborhoodSimilarity = calculateSimilarity(lead.neighborhood, existing.neighborhood)
        if (neighborhoodSimilarity >= nameThreshold) {
          matchedFields.push('neighborhood')
          score += neighborhoodSimilarity * 0.1
        }
      }
    }

    // Check Google Maps URL
    if (lead.google_maps_url && existing.google_maps_url) {
      const mapsSimilarity = calculateSimilarity(lead.google_maps_url, existing.google_maps_url)
      if (mapsSimilarity >= phoneThreshold) {
        matchedFields.push('google_maps')
        score += mapsSimilarity * 0.3
      }
    }

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' | null = null
    if (score >= 0.7) confidence = 'high'
    else if (score >= 0.5) confidence = 'medium'
    else if (score >= 0.3) confidence = 'low'

    if (confidence && matchedFields.length > 0) {
      const confidencePriority = { high: 3, medium: 2, low: 1 }
      const minPriority = confidencePriority[minConfidence]
      
      if (confidencePriority[confidence] >= minPriority) {
        matches.push({
          leadId: existing.id,
          confidence,
          matchedFields,
          similarityScore: Math.round(score * 100) / 100
        })
      }
    }
  }

  // Sort by confidence and score
  matches.sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 }
    if (priority[a.confidence] !== priority[b.confidence]) {
      return priority[b.confidence] - priority[a.confidence]
    }
    return b.similarityScore - a.similarityScore
  })

  // Determine overall confidence
  let overallConfidence: 'high' | 'medium' | 'low' | 'none' = 'none'
  if (matches.length > 0) {
    const highestMatch = matches[0]
    overallConfidence = highestMatch.confidence
  }

  return {
    isDuplicate: matches.length > 0,
    matches,
    confidence: overallConfidence
  }
}

// Find duplicates in a batch of leads
export function findDuplicatesInBatch(leads: Lead[]): Map<string, DuplicateMatch[]> {
  const duplicates = new Map<string, DuplicateMatch[]>()

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i]
    const otherLeads = leads.slice(0, i).concat(leads.slice(i + 1))
    
    const result = checkForDuplicates(lead, otherLeads, { minConfidence: 'medium' })
    
    if (result.isDuplicate) {
      duplicates.set(lead.id, result.matches)
    }
  }

  return duplicates
}

// Generate a duplicate report
export function generateDuplicateReport(leads: Lead[]): {
  totalLeads: number
  duplicateCount: number
  duplicateGroups: Array<{ primary: Lead; duplicates: Lead[] }>
} {
  const duplicates = findDuplicatesInBatch(leads)
  const processedIds = new Set<string>()
  const groups: Array<{ primary: Lead; duplicates: Lead[] }> = []

  for (const [leadId, matches] of duplicates.entries()) {
    if (processedIds.has(leadId)) continue

    const lead = leads.find(l => l.id === leadId)
    if (!lead) continue

    const duplicateLeads: Lead[] = []
    for (const match of matches) {
      if (!processedIds.has(match.leadId)) {
        const duplicateLead = leads.find(l => l.id === match.leadId)
        if (duplicateLead) {
          duplicateLeads.push(duplicateLead)
          processedIds.add(match.leadId)
        }
      }
    }

    if (duplicateLeads.length > 0) {
      groups.push({ primary: lead, duplicates: duplicateLeads })
      processedIds.add(leadId)
    }
  }

  return {
    totalLeads: leads.length,
    duplicateCount: processedIds.size,
    duplicateGroups: groups
  }
}
