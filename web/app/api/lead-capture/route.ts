import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { name, email, country, source, locale, guideType } = await request.json()
    
    if (!email || !name) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    const isSpanish = locale === 'es'
    
    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.LEADS_DIGEST_FROM || 'ParaguAI Leads <leads@paragu-ai.com>'
    const notifyEmail = process.env.LEADS_DIGEST_TO || 'weissvanderpol.ivan@gmail.com'

    if (resendKey) {
      // Send notification to the firm
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: notifyEmail,
          subject: isSpanish
            ? `Nuevo lead: Guía Investor Pass — ${name} (${country || 'país no especificado'})`
            : `New lead: Investor Pass Guide — ${name} (${country || 'country not specified'})`,
          html: `
            <h2>${isSpanish ? 'Nuevo lead — Guía del Investor Pass' : 'New lead — Investor Pass Guide'}</h2>
            <table style="border-collapse:collapse;width:100%;max-width:500px;">
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${isSpanish ? 'Nombre' : 'Name'}</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;">${isSpanish ? 'País' : 'Country'}</td><td style="padding:8px;border:1px solid #ddd;">${country || '—'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;">${isSpanish ? 'Guía' : 'Guide'}</td><td style="padding:8px;border:1px solid #ddd;">${guideType || 'Investor Pass 2026'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;">${isSpanish ? 'Idioma' : 'Locale'}</td><td style="padding:8px;border:1px solid #ddd;">${locale}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;">Source</td><td style="padding:8px;border:1px solid #ddd;">${source || 'website'}</td></tr>
            </table>
            <p style="margin-top:20px;font-size:12px;color:#888;">
              ${isSpanish ? 'Este lead fue capturado automáticamente desde el sitio web.' : 'This lead was automatically captured from the website.'}
            </p>
          `,
        }),
      })

      // Send the guide to the prospect
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: email,
          subject: isSpanish
            ? 'Guía del Investor Pass 2026 — Alejandro Villamayor'
            : 'Investor Pass 2026 Guide — Alejandro Villamayor',
          html: isSpanish
            ? `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                <h1 style="color:#004225;">Guía del Investor Pass 2026</h1>
                <p>Hola ${name},</p>
                <p>Gracias por tu interés en el Paraguay Investor Pass. Adjunto encontrarás la guía completa con requisitos, montos y beneficios del nuevo régimen 2026.</p>
                <p>Si tenés preguntas o querés agendar una evaluación estratégica sin costo, respondé directamente a este correo o escribime por WhatsApp.</p>
                <p style="margin-top:30px;">Saludos,<br><strong>Alejandro Villamayor</strong><br>Abogado — Miembro del CAP<br>
                <a href="https://wa.me/595981324569">+595 981 324 569</a></p>
                <hr style="margin-top:30px;border:none;border-top:1px solid #e6dfd0;">
                <p style="font-size:12px;color:#7a7a7a;">Alejandro Villamayor — Asunción, Paraguay. Miembro del Colegio de Abogados del Paraguay.</p>
              </div>`
            : `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                <h1 style="color:#004225;">Investor Pass 2026 Guide</h1>
                <p>Hello ${name},</p>
                <p>Thank you for your interest in the Paraguay Investor Pass. Attached please find the complete guide with requirements, amounts, and benefits of the new 2026 program.</p>
                <p>If you have any questions or would like to schedule a free strategic evaluation, reply to this email or contact me on WhatsApp.</p>
                <p style="margin-top:30px;">Best regards,<br><strong>Alejandro Villamayor</strong><br>Attorney — CAP Member<br>
                <a href="https://wa.me/595981324569">+595 981 324 569</a></p>
                <hr style="margin-top:30px;border:none;border-top:1px solid #e6dfd0;">
                <p style="font-size:12px;color:#7a7a7a;">Alejandro Villamayor — Asunción, Paraguay. Member of the Paraguayan Bar Association.</p>
              </div>`,
        }),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
