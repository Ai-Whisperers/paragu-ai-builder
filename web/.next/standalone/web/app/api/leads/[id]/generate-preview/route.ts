import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { withRequestLog } from '@/lib/api/with-request-log'
import { checkAdmin } from '@/lib/auth/admin'
import { mapLeadToPreviewConfig, type BusinessSchema } from '@/lib/generation/from-lead'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

/**
 * POST /api/leads/[id]/generate-preview
 *
 * Generates a preview site from a lead's data. Writes to `sites/preview-<id>/`
 * and mutates `leads.status` to `demo_ready`. Admin-only — was previously
 * unauthenticated, which let any anonymous caller with a leadId trigger a
 * disk write + lead-status mutation.
 */
export const POST = withRequestLog<{ id: string }>(async (_request, _ctx, { id }) => {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status })
  }

  try {
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid lead ID' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch lead from database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      logger.error('Lead not found', { leadId: id, error: leadError })
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Map lead to preview config
    const previewConfig = mapLeadToPreviewConfig(lead)
    const siteSlug = previewConfig.siteSlug
    const siteDir = path.join(process.cwd(), 'sites', siteSlug)

    // Check if preview already exists
    if (fs.existsSync(siteDir)) {
      logger.info('Preview site already exists', { siteSlug, leadId: id })
      
      // Update timestamp
      const siteJsonPath = path.join(siteDir, 'site.json')
      if (fs.existsSync(siteJsonPath)) {
        const siteData = JSON.parse(fs.readFileSync(siteJsonPath, 'utf-8'))
        siteData.updatedAt = new Date().toISOString()
        fs.writeFileSync(siteJsonPath, JSON.stringify(siteData, null, 2))
      }
      
      return NextResponse.json({
        success: true,
        previewUrl: `/s/es/${siteSlug}`,
        siteSlug,
        message: 'Preview site already exists and has been updated',
        leadId: id,
      })
    }

    // Create site directory
    fs.mkdirSync(siteDir, { recursive: true })
    fs.mkdirSync(path.join(siteDir, 'content'), { recursive: true })
    fs.mkdirSync(path.join(siteDir, 'pages'), { recursive: true })

    // Generate site.json
    const siteJson = {
      vertical: previewConfig.verticalId,
      businessType: previewConfig.businessType,
      country: 'Paraguay',
      defaultLocale: 'es',
      locales: ['es'],
      currency: 'PYG',
      contact: {
        phone: previewConfig.schema.contact.phone,
        whatsapp: previewConfig.schema.contact.whatsapp,
      },
      location: previewConfig.schema.location,
      hours: previewConfig.schema.hours,
      features: {
        whatsappFloat: true,
        testimonials: true,
        onlineBooking: true,
      },
      seo: previewConfig.schema.seo,
      preview: true,
      previewLeadId: id,
      createdAt: new Date().toISOString(),
      source: previewConfig.source,
    }

    fs.writeFileSync(
      path.join(siteDir, 'site.json'),
      JSON.stringify(siteJson, null, 2)
    )

    // Generate page files based on vertical
    if (previewConfig.businessType === 'gimnasio') {
      await generateGimnasioPages(siteDir, previewConfig.schema)
    } else {
      await generatePeluqueriaPages(siteDir, previewConfig.schema)
    }

    // Update lead status
    await supabase
      .from('leads')
      .update({
        status: 'demo_ready',
        preview_site_id: siteSlug,
        preview_generated_at: new Date().toISOString(),
      })
      .eq('id', id)

    logger.info('Preview site generated successfully', {
      siteSlug,
      leadId: id,
      businessType: previewConfig.businessType,
    })

    return NextResponse.json({
      success: true,
      previewUrl: `/s/es/${siteSlug}`,
      siteSlug,
      message: 'Preview site generated successfully',
      leadId: id,
      businessType: previewConfig.businessType,
    })
  } catch (error) {
    logger.error('Error generating preview site', { leadId: id, error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

/**
 * Generate gimnasio page files
 */
async function generateGimnasioPages(siteDir: string, schema: BusinessSchema) {
  const pagesDir = path.join(siteDir, 'pages')
  
  // Home page
  const homePage = {
    slug: '',
    titleKey: 'home.seo.title',
    descriptionKey: 'home.seo.description',
    sections: [
      { id: 'header', variant: 'standard', content: 'navigation' },
      { id: 'hero', variant: 'image', content: 'home.hero' },
      { id: 'membership-plans', variant: 'cards', content: 'home.membership' },
      { id: 'class-schedule', variant: 'grid', content: 'home.schedule' },
      { id: 'team', variant: 'cards', content: 'home.team' },
      { id: 'testimonials', variant: 'carousel', content: 'home.testimonials' },
      { id: 'cta-banner', variant: 'gradient', content: 'home.cta' },
      { id: 'contact', variant: 'split', content: 'home.contact' },
      { id: 'footer', variant: 'standard', content: 'footer' },
      { id: 'whatsapp-float', variant: 'standard', content: 'whatsapp' },
    ],
  }
  
  fs.writeFileSync(
    path.join(pagesDir, 'home.json'),
    JSON.stringify(homePage, null, 2)
  )

  // Copy default gimnasio content
  const demoContentDir = path.join(process.cwd(), 'sites', 'demo-gimnasio', 'content')
  const contentDir = path.join(siteDir, 'content')
  
  if (fs.existsSync(demoContentDir)) {
    const files = fs.readdirSync(demoContentDir)
    for (const file of files) {
      const srcPath = path.join(demoContentDir, file)
      const destPath = path.join(contentDir, file)
      
      if (fs.statSync(srcPath).isFile()) {
        let content = fs.readFileSync(srcPath, 'utf-8')
        
        // Replace placeholder business name with actual
        content = content.replace(/PowerGym/g, schema.businessName)
        content = content.replace(/info@powergym\.com\.py/g, schema.contact?.email || 'info@example.com')
        
        fs.writeFileSync(destPath, content)
      }
    }
  }
}

/**
 * Generate peluqueria page files
 */
async function generatePeluqueriaPages(siteDir: string, schema: BusinessSchema) {
  const pagesDir = path.join(siteDir, 'pages')
  
  // Home page
  const homePage = {
    slug: '',
    titleKey: 'home.seo.title',
    descriptionKey: 'home.seo.description',
    sections: [
      { id: 'header', variant: 'standard', content: 'navigation' },
      { id: 'hero', variant: 'image', content: 'home.hero' },
      { id: 'services', variant: 'cards', content: 'home.services' },
      { id: 'portfolio', variant: 'grid', content: 'home.portfolio' },
      { id: 'team', variant: 'cards', content: 'home.team' },
      { id: 'testimonials', variant: 'carousel', content: 'home.testimonials' },
      { id: 'cta-banner', variant: 'gradient', content: 'home.cta' },
      { id: 'contact', variant: 'split', content: 'home.contact' },
      { id: 'footer', variant: 'standard', content: 'footer' },
      { id: 'whatsapp-float', variant: 'standard', content: 'whatsapp' },
    ],
  }
  
  fs.writeFileSync(
    path.join(pagesDir, 'home.json'),
    JSON.stringify(homePage, null, 2)
  )

  // Copy default peluqueria content
  const demoContentDir = path.join(process.cwd(), 'sites', 'demo-peluqueria', 'content')
  const contentDir = path.join(siteDir, 'content')
  
  if (fs.existsSync(demoContentDir)) {
    const files = fs.readdirSync(demoContentDir)
    for (const file of files) {
      const srcPath = path.join(demoContentDir, file)
      const destPath = path.join(contentDir, file)
      
      if (fs.statSync(srcPath).isFile()) {
        let content = fs.readFileSync(srcPath, 'utf-8')
        
        // Replace placeholder business name with actual
        content = content.replace(/Estilo Divino/g, schema.businessName)
        content = content.replace(/hola@estilodivino\.com/g, schema.contact?.email || 'hola@example.com')
        
        fs.writeFileSync(destPath, content)
      }
    }
  }
}
