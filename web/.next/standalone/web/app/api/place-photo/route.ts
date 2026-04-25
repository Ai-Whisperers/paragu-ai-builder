import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref')
  const maxwidth = request.nextUrl.searchParams.get('maxwidth') || '800'

  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    const googleUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${ref}&key=${apiKey}`
    const res = await fetch(googleUrl, { redirect: 'follow' })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 502 })
    }

    const blob = await res.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
