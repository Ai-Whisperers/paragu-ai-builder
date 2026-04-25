import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { syncCatalog } from '@/lib/integrations/whatsapp/evolution'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { businessId } = await request.json()
    if (!businessId) return NextResponse.json({ error: 'businessId required' }, { status: 400 })

    const supabase = await createAdminClient()

    // Get business WhatsApp instance
    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, whatsapp_instance')
      .eq('id', businessId)
      .single()

    if (!business?.whatsapp_instance) {
      return NextResponse.json({ error: 'WhatsApp not connected. Connect first via /api/whatsapp/connect' }, { status: 400 })
    }

    // Fetch services from bookings system
    const { data: services } = await supabase
      .from('services')
      .select('name, description, price_cents, category, image_url, duration_minutes')
      .eq('business_id', businessId)
      .eq('is_active', true)

    // Also fetch products from commerce
    const { data: products } = await supabase
      .from('products')
      .select('name, description, price_cents, images, category')
      .eq('business_id', businessId)
      .eq('status', 'active')

    const catalogItems = [
      ...(services || []).map(s => ({
        name: s.name,
        description: s.description || `Duracion: ${s.duration_minutes} min`,
        price: `Gs. ${(s.price_cents || 0).toLocaleString('es-PY')}`,
        imageUrl: s.image_url || '',
      })),
      ...(products || []).map(p => ({
        name: p.name,
        description: p.description || '',
        price: `Gs. ${(p.price_cents || 0).toLocaleString('es-PY')}`,
        imageUrl: (p.images as string[])?.[0] || '',
      })),
    ]

    if (catalogItems.length === 0) {
      return NextResponse.json({ error: 'No services or products found for this business' }, { status: 400 })
    }

    const result = await syncCatalog(business.whatsapp_instance, catalogItems)

    if (result.error) {
      logger.error('Catalog sync failed', { businessId, error: result.error })
      return NextResponse.json({ error: 'Failed to sync catalog' }, { status: 500 })
    }

    logger.info('Catalog synced', { businessId, items: catalogItems.length })

    return NextResponse.json({
      ok: true,
      synced: catalogItems.length,
      message: `Sincronizados ${catalogItems.length} productos/servicios al catalogo de WhatsApp`,
    })
  } catch (error) {
    logger.error('Catalog sync error', { error: String(error) })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
