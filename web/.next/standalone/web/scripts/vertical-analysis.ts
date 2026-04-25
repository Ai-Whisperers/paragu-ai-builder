#!/usr/bin/env node
/**
 * Win 73: Vertical Analysis Script
 * Compare conversion metrics by business type (vertical)
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

interface VerticalMetrics {
  vertical: string
  displayName: string
  totalLeads: number
  new: number
  contacted: number
  converted: number
  lost: number
  conversionRate: number
  avgPriorityScore: number
  topCities: Array<{ city: string; count: number }>
  avgRating: number | null
  hasWebsite: number
  noWebsite: number
  websiteGap: number // Percentage without website
}

// Vertical display names mapping
const VERTICAL_NAMES: Record<string, string> = {
  peluqueria: 'Hair Salons',
  salon_belleza: 'Beauty Salons',
  unas: 'Nail Salons',
  barberia: 'Barbershops',
  spa: 'Spas',
  gimnasio: 'Gyms/Fitness',
  maquillaje: 'Makeup Artists',
  depilacion: 'Waxing Services',
  pestanas: 'Eyelash Services',
  tatuajes: 'Tattoo Studios',
  estetica: 'Esthetics',
  diseno_grafico: 'Graphic Design',
  legal: 'Legal Services',
  consultoria: 'Consulting',
  educacion: 'Education',
  salud: 'Health Services',
  inversiones: 'Investment',
  inmobiliaria: 'Real Estate',
  relocation: 'Relocation Services',
  meal_prep: 'Food Services',
  restaurant: 'Restaurants',
  sushi_bar: 'Sushi Bars',
}

async function generateVerticalAnalysis(): Promise<VerticalMetrics[]> {
  console.log('📊 Analyzing verticals (business types)...\n')

  // Get all leads grouped by business type
  const { data: leads, error } = await supabase
    .from('leads')
    .select('business_type, status, priority_score, city, rating, has_website')
    .is('deleted_at', null)

  if (error) {
    console.error('Error fetching leads:', error)
    throw error
  }

  // Group by vertical
  const verticalData = (leads || []).reduce((acc: Record<string, Partial<VerticalMetrics>>, lead: {
    business_type: string
    status: string
    priority_score: number
    city: string
    rating: number | null
    has_website: boolean
  }) => {
    const vertical = lead.business_type || 'unknown'
    
    if (!acc[vertical]) {
      acc[vertical] = {
        vertical,
        displayName: VERTICAL_NAMES[vertical] || vertical,
        totalLeads: 0,
        new: 0,
        contacted: 0,
        converted: 0,
        lost: 0,
        priorityScores: [],
        cities: {},
        ratings: [],
        hasWebsite: 0,
        noWebsite: 0,
      }
    }

    acc[vertical].totalLeads!++
    
    if (lead.status === 'new') acc[vertical].new!++
    if (lead.status === 'contacted') acc[vertical].contacted!++
    if (lead.status === 'converted') acc[vertical].converted!++
    if (lead.status === 'lost') acc[vertical].lost!++
    
    acc[vertical].priorityScores!.push(lead.priority_score || 0)
    acc[vertical].cities![lead.city] = (acc[vertical].cities![lead.city] || 0) + 1
    
    if (lead.rating) {
      acc[vertical].ratings!.push(lead.rating)
    }
    
    if (lead.has_website) {
      acc[vertical].hasWebsite!++
    } else {
      acc[vertical].noWebsite!++
    }

    return acc
  }, {})

  // Calculate metrics for each vertical
  const results: VerticalMetrics[] = Object.values(verticalData).map((data: Partial<VerticalMetrics> & {
    priorityScores?: number[]
    cities?: Record<string, number>
    ratings?: number[]
  }) => ({
    vertical: data.vertical!,
    displayName: data.displayName!,
    totalLeads: data.totalLeads!,
    new: data.new!,
    contacted: data.contacted!,
    converted: data.converted!,
    lost: data.lost!,
    conversionRate: data.totalLeads! > 0 
      ? Math.round((data.converted! / data.totalLeads!) * 100) 
      : 0,
    avgPriorityScore: data.priorityScores!.length > 0
      ? Math.round(data.priorityScores!.reduce((a, b) => a + b, 0) / data.priorityScores!.length)
      : 0,
    topCities: Object.entries(data.cities!)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3),
    avgRating: data.ratings!.length > 0
      ? Math.round((data.ratings!.reduce((a, b) => a + b, 0) / data.ratings!.length) * 10) / 10
      : null,
    hasWebsite: data.hasWebsite!,
    noWebsite: data.noWebsite!,
    websiteGap: data.totalLeads! > 0
      ? Math.round((data.noWebsite! / data.totalLeads!) * 100)
      : 0,
  }))

  // Sort by total leads (descending)
  return results.sort((a, b) => b.totalLeads - a.totalLeads)
}

function renderBar(value: number, max: number, width: number = 20): string {
  const filled = Math.round((value / max) * width)
  const empty = width - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}

function renderConversionBar(rate: number, width: number = 15): string {
  const filled = Math.round((rate / 20) * width) // Max 20% for scale
  const empty = width - filled
  const color = rate >= 10 ? '🟢' : rate >= 5 ? '🟡' : '🔴'
  return color + '█'.repeat(filled) + '░'.repeat(empty)
}

async function printVerticalAnalysis() {
  try {
    const metrics = await generateVerticalAnalysis()
    const maxLeads = Math.max(...metrics.map(m => m.totalLeads))
    const totalLeads = metrics.reduce((sum, m) => sum + m.totalLeads, 0)
    const totalConverted = metrics.reduce((sum, m) => sum + m.converted, 0)

    console.log('╔══════════════════════════════════════════════════════════════════════════════╗')
    console.log('║                    VERTICAL ANALYSIS (By Business Type)                        ║')
    console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n')

    console.log(`Total Verticals: ${metrics.length}`)
    console.log(`Total Leads: ${totalLeads.toLocaleString()}`)
    console.log(`Overall Conversion Rate: ${((totalConverted / totalLeads) * 100).toFixed(1)}%\n`)

    console.log('─'.repeat(100))
    console.log('VERTICAL PERFORMANCE RANKING:')
    console.log('─'.repeat(100))

    metrics.forEach((m, index) => {
      const bar = renderBar(m.totalLeads, maxLeads)
      const convBar = renderConversionBar(m.conversionRate)
      
      console.log(`\n${index + 1}. ${m.displayName} (${m.vertical})`)
      console.log(`   ${bar} ${m.totalLeads.toLocaleString()} leads`)
      console.log(`   Conversion: ${convBar} ${m.conversionRate}% (${m.converted}/${m.totalLeads})`)
      console.log(`   Pipeline: ${m.new} new | ${m.contacted} contacted | ${m.converted} converted | ${m.lost} lost`)
      console.log(`   Avg Score: ${m.avgPriorityScore}/100 | Avg Rating: ${m.avgRating || 'N/A'} ⭐`)
      console.log(`   Website Gap: ${m.websiteGap}% without website (${m.noWebsite}/${m.totalLeads})`)
      
      if (m.topCities.length > 0) {
        const cities = m.topCities.map(c => `${c.city} (${c.count})`).join(', ')
        console.log(`   Top Cities: ${cities}`)
      }
    })

    // Summary by performance tier
    console.log('\n' + '─'.repeat(100))
    console.log('PERFORMANCE TIERS:')
    console.log('─'.repeat(100))

    const highConverting = metrics.filter(m => m.conversionRate >= 10)
    const mediumConverting = metrics.filter(m => m.conversionRate >= 5 && m.conversionRate < 10)
    const lowConverting = metrics.filter(m => m.conversionRate < 5)

    console.log(`\n🟢 High Converting (10%+): ${highConverting.length} verticals`)
    highConverting.forEach(m => {
      console.log(`   • ${m.displayName}: ${m.conversionRate}% (${m.totalLeads} leads)`)
    })

    console.log(`\n🟡 Medium Converting (5-10%): ${mediumConverting.length} verticals`)
    mediumConverting.forEach(m => {
      console.log(`   • ${m.displayName}: ${m.conversionRate}% (${m.totalLeads} leads)`)
    })

    console.log(`\n🔴 Low Converting (<5%): ${lowConverting.length} verticals`)
    lowConverting.slice(0, 5).forEach(m => {
      console.log(`   • ${m.displayName}: ${m.conversionRate}% (${m.totalLeads} leads)`)
    })
    if (lowConverting.length > 5) {
      console.log(`   ... and ${lowConverting.length - 5} more`)
    }

    // Opportunity analysis
    console.log('\n' + '─'.repeat(100))
    console.log('OPPORTUNITY ANALYSIS:')
    console.log('─'.repeat(100))

    const highVolumeNoWebsite = metrics
      .filter(m => m.totalLeads > 20 && m.websiteGap > 70)
      .sort((a, b) => b.noWebsite - a.noWebsite)

    console.log(`\n💎 High-opportunity verticals (high volume, low web presence):`)
    highVolumeNoWebsite.slice(0, 5).forEach(m => {
      console.log(`   • ${m.displayName}: ${m.noWebsite} leads without website (${m.websiteGap}%)`)
    })

    const underperformingHighVolume = metrics
      .filter(m => m.totalLeads > 30 && m.conversionRate < 5)
      .sort((a, b) => b.totalLeads - a.totalLeads)

    if (underperformingHighVolume.length > 0) {
      console.log(`\n⚠️ Underperforming verticals (high volume, low conversion):`)
      underperformingHighVolume.forEach(m => {
        console.log(`   • ${m.displayName}: ${m.conversionRate}% conversion on ${m.totalLeads} leads`)
      })
      console.log(`   → Review outreach messaging and demo templates for these verticals`)
    }

    // Best practices
    console.log('\n' + '═'.repeat(100))
    console.log('VERTICAL-SPECIFIC RECOMMENDATIONS:')
    console.log('─'.repeat(100))

    const bestVertical = metrics.reduce((max, m) => m.conversionRate > max.conversionRate ? m : max)
    console.log(`\n✨ Best performing vertical: ${bestVertical.displayName} (${bestVertical.conversionRate}% conversion)`)
    console.log(`   → Study what's working and apply to similar verticals`)

    const biggestGap = metrics.reduce((max, m) => m.noWebsite > max.noWebsite ? m : max)
    console.log(`\n💼 Biggest market opportunity: ${biggestGap.displayName} (${biggestGap.noWebsite} leads without website)`)
    console.log(`   → Prioritize template development and outreach for this vertical`)

    const fastestGrowing = metrics
      .filter(m => m.totalLeads > 10)
      .sort((a, b) => b.avgPriorityScore - a.avgPriorityScore)[0]
    if (fastestGrowing) {
      console.log(`\n🚀 Highest quality leads: ${fastestGrowing.displayName} (avg score: ${fastestGrowing.avgPriorityScore})`)
    }

    console.log('\n' + '═'.repeat(100))

  } catch (error) {
    console.error('❌ Failed to generate vertical analysis:', error)
    process.exit(1)
  }
}

// Run if called directly
printVerticalAnalysis()

// Export for programmatic use
export { generateVerticalAnalysis }
export type { VerticalMetrics }
