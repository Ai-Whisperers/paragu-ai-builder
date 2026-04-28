import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await requireTenant()
    const supabase = await createClient('service_role')
    const body = await request.json()
    const { products } = body

    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, slug')
      .eq('id', session.businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    let productsCreated = 0
    if (Array.isArray(products)) {
      for (const p of products) {
        const { error } = await supabase.from('products').insert({
          business_id: business.id,
          slug: (p.name as string).toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 80),
          name: p.name as string,
          description: (p.description as string) || null,
          priceCents: Math.round(parseFloat(String(p.price || '0')) * (p.currency === 'PYG' ? 1 : 100)),
          currency: (p.currency as string) || 'PYG',
          status: 'active',
          inventory_policy: 'deny',
          inventory_qty: 999,
          category: (p.category as string) || null,
        })
        if (!error) productsCreated++
      }
    }

    await supabase.from('portal_notifications').insert({
      business_id: business.id,
      type: 'system',
      title: 'Tienda activada',
      body: `Tu tienda online está activa con ${productsCreated} producto${productsCreated !== 1 ? 's' : ''}. Revisá tu panel de pedidos.`,
      action_url: '/orders',
    })

    logger.info('[commerce-activate] store activated', { businessId: business.id, productsCreated })
    return NextResponse.json({ ok: true, productsCreated })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
