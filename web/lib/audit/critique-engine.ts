import type { SectionUsageReport, ContentGap } from './section-analyzer'

export interface CritiqueResult {
  slug: string
  score: number
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  sectionCritique: string[]
}

const VERTICAL_LABELS: Record<string, string> = {
  'beauty-personal-care': 'Belleza',
  'food-beverage': 'Gastronomía',
  'health-wellness': 'Salud',
  'automotive': 'Automotor',
  'trades-home-services': 'Oficios',
  'pets-animals': 'Mascotas',
  'education-training': 'Educación',
  'real-estate-relocation': 'Inmobiliaria',
  'sports-recreation': 'Deportes',
  'retail-local': 'Comercio',
  'b2b-professional': 'Profesional',
  'technology-digital': 'Tecnología',
  'portfolio-professional': 'Portfolio',
  'hospitality-tourism': 'Hospitalidad',
  'service-booking': 'Servicios',
  'membership-community': 'Comunidad',
  'media-publishing': 'Medios',
  'death-care': 'Servicios Funerarios',
  'trades-industrial': 'Industria',
  'agriculture-agribusiness': 'Agricultura',
  'finance-insurance': 'Finanzas',
  'logistics-transport': 'Logística',
  'arts-entertainment-venues': 'Entretenimiento',
}

export function generateCritique(report: SectionUsageReport, gaps: ContentGap[]): CritiqueResult {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const recommendations: string[] = []
  const sectionCritique: string[] = []

  const verticalLabel = VERTICAL_LABELS[report.vertical] || report.vertical

  // Analyze section variety
  if (report.sectionCount >= 8) {
    strengths.push(`Uses ${report.sectionCount} different sections — good content variety for a ${verticalLabel} site`)
  } else if (report.sectionCount >= 5) {
    strengths.push(`Uses ${report.sectionCount} sections — adequate for a basic ${verticalLabel} presence`)
  } else {
    weaknesses.push(`Only ${report.sectionCount} sections — very limited content. Consider adding more sections to create a complete ${verticalLabel} experience`)
  }

  // Analyze coverage
  if (report.coverage >= 80) {
    strengths.push(`Covers ${report.coverage}% of allowed sections — excellent use of available components`)
  } else if (report.coverage >= 50) {
    weaknesses.push(`Only ${report.coverage}% section coverage. ${report.missingSections.length} allowed sections not used`)
  } else {
    weaknesses.push(`Low section coverage (${report.coverage}%). Most allowed sections are missing — site feels incomplete`)
  }

  // Analyze missing critical sections
  const criticalMissing = gaps.filter((g) => g.severity === 'high')
  if (criticalMissing.length > 0) {
    for (const gap of criticalMissing) {
      sectionCritique.push(`Missing: "${gap.section}" — ${gap.suggestion}`)
    }
  }

  const mediumMissing = gaps.filter((g) => g.severity === 'medium')
  if (mediumMissing.length > 0) {
    weaknesses.push(`${mediumMissing.length} optional allowed sections not used — could add more depth`)
    for (const gap of mediumMissing.slice(0, 3)) {
      sectionCritique.push(`Consider adding: "${gap.section}"`)
    }
  }

  // Analyze expected sections by vertical
  const heroIndex = report.usedSections.indexOf('hero')
  const servicesIndex = report.usedSections.indexOf('services')
  const contactIndex = report.usedSections.indexOf('contact')
  const testimonialsIndex = report.usedSections.indexOf('testimonials')
  const faqIndex = report.usedSections.indexOf('faq')

  if (heroIndex === -1) {
    weaknesses.push('No hero section — the first thing visitors see is missing')
  } else {
    strengths.push('Has hero section for first impression')
  }

  if (servicesIndex === -1) {
    weaknesses.push('No services/products section — visitors can\'t see what you offer')
  } else {
    strengths.push('Services section present - visitors can see offerings')
  }

  if (contactIndex === -1) {
    weaknesses.push('No contact section — visitors have no way to get in touch')
  } else {
    strengths.push('Contact section present')
  }

  if (testimonialsIndex === -1) {
    recommendations.push('Add testimonials to build trust with potential customers')
  }

  if (faqIndex === -1) {
    recommendations.push('Add an FAQ section to answer common questions and reduce support inquiries')
  }

  if (report.usedSections.includes('whatsapp-float') || report.usedSections.includes('whatsapp')) {
    strengths.push('WhatsApp integration present — critical for PY market')
  } else {
    recommendations.push('Add WhatsApp float button — essential for Paraguayan customers')
  }

  if (report.usedSections.includes('google-maps') || report.usedSections.includes('contact')) {
    strengths.push('Location/maps information available')
  } else {
    recommendations.push('Add location/maps so customers can find the business')
  }

  // Variant usage
  if (report.uniqueVariants.length > 5) {
    strengths.push('Uses ${report.uniqueVariants.length} different section variants — good visual variety')
  }

  // Generate score
  let score = 50
  if (report.sectionCount >= 10) score += 15
  else if (report.sectionCount >= 7) score += 10
  else if (report.sectionCount >= 4) score += 5

  if (report.coverage >= 80) score += 15
  else if (report.coverage >= 60) score += 10

  if (heroIndex >= 0) score += 5
  if (servicesIndex >= 0) score += 5
  if (contactIndex >= 0) score += 5
  if (testimonialsIndex >= 0) score += 5
  if (faqIndex >= 0) score += 3
  if (report.usedSections.includes('whatsapp-float') || report.usedSections.includes('whatsapp')) score += 5

  score = Math.min(100, Math.max(0, score))

  // Summary
  let summary: string
  if (score >= 80) {
    summary = `Strong ${verticalLabel} site with ${report.sectionCount} sections covering ${report.coverage}% of available components`
  } else if (score >= 60) {
    summary = `Decent ${verticalLabel} site, but ${report.missingSections.length} allowed sections are unused and some key components (${criticalMissing.map((g) => g.section).join(', ') || 'none'}) are missing`
  } else {
    summary = `${verticalLabel} site needs significant improvement. Only ${report.sectionCount} of ${report.allowedSections.length || 'available'} sections used (${report.coverage}% coverage)`
  }

  return { slug: report.slug, score, summary, strengths, weaknesses, recommendations, sectionCritique }
}

export function generateCrossSiteAnalysis(reports: CritiqueResult[]): string {
  const demos = reports.filter((r) => r.slug.startsWith('demo-') || r.slug.startsWith('preview-'))
  const real = reports.filter((r) => !r.slug.startsWith('demo-') && !r.slug.startsWith('preview-'))

  const avgDemoScore = Math.round(demos.reduce((s, r) => s + r.score, 0) / Math.max(demos.length, 1))
  const avgRealScore = Math.round(real.reduce((s, r) => s + r.score, 0) / Math.max(real.length, 1))

  const allWeaknesses = reports.flatMap((r) => r.weaknesses)
  const topWeaknesses = Object.entries(
    allWeaknesses.reduce<Record<string, number>>((acc, w) => {
      const key = w.split('—')[0].trim()
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  ).sort(([, a], [, b]) => b - a).slice(0, 5)

  return `## Site Quality Analysis

**Overall**: Demo avg: ${avgDemoScore}/100 | Real tenant avg: ${avgRealScore}/100 | Gap: ${avgRealScore - avgDemoScore} points

### Most common issues across all sites:
${topWeaknesses.map(([issue, count], i) => `${i + 1}. "${issue}" — affects ${count} site${count > 1 ? 's' : ''}`).join('\n')}

### Sites needing most improvement:
${reports.filter((r) => r.score < 50).map((r) => `- **${r.slug}** (${r.score}/100): ${r.summary}`).join('\n') || 'None — all sites score 50+'}

### Top recommendations:
${reports.flatMap((r) => r.recommendations).reduce<Record<string, number>>((acc, r) => { acc[r] = (acc[r] || 0) + 1; return acc }, {})
  |> Object.entries($$).sort(([, a], [, b]) => b - a).slice(0, 5)
  .map(([rec, count], i) => `${i + 1}. "${rec}" — recommended for ${count} site${count > 1 ? 's' : ''}`).join('\n')}
`
}
