#!/usr/bin/env node
/**
 * City Breakdown Visualization Script
 * Win 72: Visualize leads by city
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

interface CityStats {
  city: string
  totalLeads: number
  new: number
  contacted: number
  converted: number
  conversionRate: number
  topBusinessTypes: Array<{ type: string; count: number }>
}

async function generateCityBreakdown(): Promise<CityStats[]> {
  console.log('📊 Generating city breakdown report...\n')

  // Get all leads grouped by city
  const { data: leads, error } = await supabase
    .from('leads')
    .select('city, status, business_type')
    .is('deleted_at', null)

  if (error) {
    console.error('Error fetching leads:', error)
    throw error
  }

  // Group by city
  const cityData = (leads || []).reduce((acc: Record<string, CityStats>, lead: { city: string; status: string; business_type: string }) => {
    const city = lead.city || 'Unknown'
    
    if (!acc[city]) {
      acc[city] = {
        city,
        totalLeads: 0,
        new: 0,
        contacted: 0,
        converted: 0,
        conversionRate: 0,
        topBusinessTypes: [],
      }
    }

    acc[city].totalLeads++
    
    if (lead.status === 'new') acc[city].new++
    if (lead.status === 'contacted') acc[city].contacted++
    if (lead.status === 'converted') acc[city].converted++

    return acc
  }, {})

  // Calculate conversion rates and get top business types per city
  for (const city of Object.values(cityData) as CityStats[]) {
    city.conversionRate = city.totalLeads > 0 
      ? Math.round((city.converted / city.totalLeads) * 100) 
      : 0

    // Get business types for this city
    const { data: typeData } = await supabase
      .from('leads')
      .select('business_type')
      .eq('city', city.city)
      .is('deleted_at', null)

    const typeCounts = (typeData || []).reduce((acc: Record<string, number>, lead: { business_type: string }) => {
      acc[lead.business_type] = (acc[lead.business_type] || 0) + 1
      return acc
    }, {})

    city.topBusinessTypes = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }

  // Sort by total leads
  return Object.values(cityData).sort((a, b) => b.totalLeads - a.totalLeads)
}

function renderBar(value: number, max: number, width: number = 30): string {
  const filled = Math.round((value / max) * width)
  const empty = width - filled
  return '█'.repeat(filled) + '░'.repeat(empty)
}

async function printCityBreakdown() {
  try {
    const stats = await generateCityBreakdown()
    const maxLeads = Math.max(...stats.map(s => s.totalLeads))

    console.log('╔════════════════════════════════════════════════════════════════════╗')
    console.log('║                    LEADS BY CITY BREAKDOWN                         ║')
    console.log('╚════════════════════════════════════════════════════════════════════╝\n')

    console.log(`Total cities: ${stats.length}`)
    console.log(`Total leads: ${stats.reduce((sum, s) => sum + s.totalLeads, 0)}\n`)

    console.log('─'.repeat(80))
    console.log('CITY DISTRIBUTION:')
    console.log('─'.repeat(80))

    stats.forEach((city, index) => {
      const bar = renderBar(city.totalLeads, maxLeads)
      console.log(`\n${index + 1}. ${city.city}`)
      console.log(`   ${bar} ${city.totalLeads.toLocaleString()} leads`)
      console.log(`   Conversion: ${city.conversionRate}% (${city.converted}/${city.totalLeads})`)
      console.log(`   Status: ${city.new} new | ${city.contacted} contacted | ${city.converted} converted`)
      
      if (city.topBusinessTypes.length > 0) {
        const types = city.topBusinessTypes.map(t => `${t.type} (${t.count})`).join(', ')
        console.log(`   Top types: ${types}`)
      }
    })

    // Summary statistics
    console.log('\n' + '─'.repeat(80))
    console.log('SUMMARY STATISTICS:')
    console.log('─'.repeat(80))

    const totalConverted = stats.reduce((sum, s) => sum + s.converted, 0)
    const totalLeads = stats.reduce((sum, s) => sum + s.totalLeads, 0)
    const avgConversionRate = totalLeads > 0 
      ? ((totalConverted / totalLeads) * 100).toFixed(1) 
      : '0.0'

    console.log(`\nOverall Conversion Rate: ${avgConversionRate}%`)
    console.log(`Best Performing City: ${stats.reduce((max, s) => s.conversionRate > max.conversionRate ? s : max).city}`)
    console.log(`Most Leads: ${stats[0].city} (${stats[0].totalLeads} leads)`)

    // City tiers
    console.log('\n' + '─'.repeat(80))
    console.log('CITY TIERS (by lead volume):')
    console.log('─'.repeat(80))

    const tier1 = stats.filter(s => s.totalLeads >= 50)
    const tier2 = stats.filter(s => s.totalLeads >= 20 && s.totalLeads < 50)
    const tier3 = stats.filter(s => s.totalLeads >= 10 && s.totalLeads < 20)
    const tier4 = stats.filter(s => s.totalLeads < 10)

    console.log(`\nTier 1 (50+ leads): ${tier1.length} cities`)
    tier1.forEach(c => console.log(`  • ${c.city}: ${c.totalLeads} leads`))

    console.log(`\nTier 2 (20-49 leads): ${tier2.length} cities`)
    tier2.slice(0, 5).forEach(c => console.log(`  • ${c.city}: ${c.totalLeads} leads`))
    if (tier2.length > 5) console.log(`  ... and ${tier2.length - 5} more`)

    console.log(`\nTier 3 (10-19 leads): ${tier3.length} cities`)
    console.log(`Tier 4 (<10 leads): ${tier4.length} cities`)

    // Recommendations
    console.log('\n' + '═'.repeat(80))
    console.log('RECOMMENDATIONS:')
    console.log('─'.repeat(80))

    const underperforming = stats.filter(s => s.totalLeads > 20 && s.conversionRate < 5)
    if (underperforming.length > 0) {
      console.log(`\n⚠️ Underperforming cities (high volume, low conversion):`)
      underperforming.forEach(c => {
        console.log(`   • ${c.city}: ${c.conversionRate}% conversion (${c.totalLeads} leads)`)
      })
      console.log(`   → Review outreach strategy for these cities`)
    }

    const untapped = tier4.filter(s => ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá'].includes(s.city))
    if (untapped.length > 0) {
      console.log(`\n💡 Major cities with low lead volume:`)
      untapped.forEach(c => console.log(`   • ${c.city}: ${c.totalLeads} leads`))
      console.log(`   → Consider targeted marketing campaigns`)
    }

    console.log('\n' + '═'.repeat(80))

  } catch (error) {
    console.error('❌ Failed to generate city breakdown:', error)
    process.exit(1)
  }
}

// Run if called directly
printCityBreakdown()

// Export for programmatic use
export { generateCityBreakdown }
export type { CityStats }
