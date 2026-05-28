import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')

  if (!domain) return NextResponse.json({ error: 'domain required' }, { status: 400 })

  // Simulate a redeploy — in production this would trigger the actual deploy pipeline
  await new Promise(r => setTimeout(r, 1500))

  return NextResponse.json({
    message: `Redeploy triggered for ${domain}`,
    mode: 'simulated (VPS reconnect needed)',
    timestamp: new Date().toISOString(),
  })
}