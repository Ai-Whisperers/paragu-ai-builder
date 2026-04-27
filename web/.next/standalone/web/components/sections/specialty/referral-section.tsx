'use client'

import { useState, useEffect } from 'react'
import { Gift, Share2, Copy, CheckCircle, MessageCircle, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'
import { cn } from '@/lib/utils'

export interface ReferralProgramProps {
  phone: string
  businessName: string
  className?: string
}

export function ReferralProgram({ phone, businessName, className }: ReferralProgramProps) {
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [referralCount, setReferralCount] = useState(0)
  const [rewardsEarned, setRewardsEarned] = useState(0)

  useEffect(() => {
    const generateCode = () => {
      const timestamp = Date.now().toString(36).slice(-4).toUpperCase()
      return `CABAL${timestamp}`
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Post-mount generation using Date.now() avoids SSR hydration mismatch.
    setReferralCode(generateCode())
  }, [])

  const referralMessage = `🥚 ¡${businessName} tiene una oferta para vos!

Usá mi código: *${referralCode}*

✅ Vos obtenés: 10% OFF en tu primera compra
✅ Yo obtengo: Un maple de huevos gratis

🛒 Comprar: https://granjacabral.com.py?ref=${referralCode}

O escribime por WhatsApp: ${phone}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(referralMessage)}`
    window.open(url, '_blank')
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="w-5 h-5" />
          Programa de Referidos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--surface)] rounded-lg p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
            <p className="text-2xl font-bold">{referralCount}</p>
            <p className="text-sm text-[var(--text-muted)]">Amigos referidos</p>
          </div>
          <div className="bg-[var(--surface)] rounded-lg p-4 text-center">
            <Gift className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
            <p className="text-2xl font-bold">{rewardsEarned}</p>
            <p className="text-sm text-[var(--text-muted)]">Premios ganados</p>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-3">
          <h4 className="font-medium">Como funciona:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">1</span>
              <span className="text-[var(--text)]">Comparti tu codigo con amigos</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">2</span>
              <span className="text-[var(--text)]">Ellos obtienen 10% OFF en su primera compra</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-medium">3</span>
              <span className="text-[var(--text)]">Vos ganas un maple de huevos GRATIS</span>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-[var(--surface)] rounded-lg p-4">
          <Label className="text-sm text-[var(--text-muted)] mb-2 block">Tu codigo:</Label>
          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="text-center font-mono text-lg tracking-wider"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className={cn(copied && 'text-[var(--success)]')}
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2">
          <Button onClick={shareViaWhatsApp} className="w-full bg-[#25D366] hover:bg-[#128C7E]">
            <MessageCircle className="w-4 h-4 mr-2" />
            Compartir por WhatsApp
          </Button>
          <Button onClick={copyToClipboard} variant="outline" className="w-full">
            <Copy className="w-4 h-4 mr-2" />
            Copiar mensaje
          </Button>
        </div>

        {/* Terms */}
        <p className="text-xs text-center text-[var(--text-muted)]">
          El descuento aplica solo en la primera compra de nuevos clientes. 
          Válido hasta agotar stock de premios.
        </p>
      </CardContent>
    </Card>
  )
}

import { Label } from '@/components/ui/label'

export interface ReferralSectionProps {
  phone: string
  businessName: string
  className?: string
}

export function ReferralSection({ phone, businessName, className }: ReferralSectionProps) {
  return (
    <section className={cn('py-16 bg-[var(--surface)]', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[var(--primary)]">Gana Huevos Gratis</Badge>
          <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">
            Recomienda y Gana
          </Heading>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Comparte {businessName} con tus amigos y familia. 
            Ambos ganan: ellos 10% de descuento y vos un maple de huevos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <ReferralProgram phone={phone} businessName={businessName} />

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                  Ejemplo de Ganancias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text)]">5 amigos referidos</span>
                  <Badge variant="secondary">5 maples gratis</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--text)]">10 amigos referidos</span>
                  <Badge variant="secondary">10 maples gratis</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[var(--text)]">20 amigos referidos</span>
                  <Badge className="bg-[var(--primary)]">20 maples + Premio especial</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[var(--primary)]" />
                  Ideas para Compartir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[var(--text)]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    Comparti en tus grupos de WhatsApp
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    Publica en tu historia de Instagram/Facebook
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    Menciona a {businessName} en tus recetas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                    Recomienda a vecinos y familia
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReferralProgram
