import { NextResponse } from 'next/server'
import { requireTenant } from '@/lib/auth/tenant'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await requireTenant()
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'file_required' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    if (!allowed.includes(ext)) return NextResponse.json({ error: 'invalid_format' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `blog/${session.businessId}/${Date.now()}.${ext}`
    const supabase = await createClient('service_role')

    const { data: upload, error: uploadErr } = await supabase.storage
      .from('site-assets')
      .upload(fileName, buffer, { contentType: file.type, upsert: false })

    if (uploadErr) {
      logger.error('[blog:upload] storage failed', { error: uploadErr.message })
      return NextResponse.json({ error: 'upload_failed' }, { status: 500 })
    }

    const { data: publicUrl } = supabase.storage.from('site-assets').getPublicUrl(fileName)

    await supabase.from('site_assets').insert({
      business_id: session.businessId,
      type: 'blog_image',
      url: publicUrl.publicUrl,
      storage_path: fileName,
      file_size_bytes: buffer.length,
    })

    return NextResponse.json({ url: publicUrl.publicUrl, fileName })
  } catch (err) {
    if (err instanceof Response) throw err
    return NextResponse.json({ error: 'internal', detail: String(err) }, { status: 500 })
  }
}
