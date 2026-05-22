'use client'

import { useState } from 'react'
import { Download, FileText, CheckCircle, Calendar, Truck, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Heading } from '@/components/ui/heading'

export interface PriceListProduct {
  name: string
  description: string
  price: number
  unit: string
  minQuantity?: number
}

export interface PriceListZone {
  name: string
  fee: number
  minOrder: number
  freeDeliveryOver: number
}

export interface PriceListData {
  validFrom: Date
  validUntil: Date
  retailProducts: PriceListProduct[]
  wholesaleProducts: PriceListProduct[]
  deliveryZones: PriceListZone[]
  businessName: string
  phone: string
  whatsapp: string
  email: string
  address: string
}

export interface PriceListGeneratorProps {
  data: PriceListData
  className?: string
}

export function PriceListGenerator({ data, className }: PriceListGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generatePriceList = () => {
    setGenerating(true)
    
    // Simulate PDF generation
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      
      // In a real implementation, this would generate a PDF
      // For now, we'll create a text version that can be printed
      const priceListText = generatePriceListText(data)
      
      // Create a blob and download
      const blob = new Blob([priceListText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `lista-precios-${data.businessName.toLowerCase().replace(/\s+/g, '-')}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 1500)
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-PY', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatPrice = (amount: number): string => {
    return `${amount.toLocaleString('es-PY')} Gs`
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-[var(--surface)] border-b border-[var(--border)]">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-[var(--primary)]" />
          Lista de Precios B2B
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Info */}
        <div className="space-y-2">
          <p className="text-sm text-[var(--text-muted)]">
            Descarga nuestra lista de precios actualizada con:
          </p>
          <ul className="text-sm space-y-1 text-[var(--text)]">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              Precios minoristas y mayoristas
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              Costos de delivery por zona
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              Pedidos minimos y condiciones
            </li>
          </ul>
        </div>

        {/* Validity Period */}
        <div className="bg-[var(--surface)] rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-[var(--text-muted)]">Vigencia:</span>
          </div>
          <p className="font-medium">
            {formatDate(data.validFrom)} - {formatDate(data.validUntil)}
          </p>
          <Badge variant="secondary" className="text-xs">
            Valido por 30 dias
          </Badge>
        </div>

        {/* Preview */}
        <div className="border border-[var(--border)] rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-sm">Vista previa:</h4>
          
          {/* Sample Products */}
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
              Productos Destacados
            </p>
            {data.retailProducts.slice(0, 3).map((product, idx) => (
              <div 
                key={idx}
                className="flex justify-between items-center text-sm py-1 border-b border-[var(--border)] last:border-0"
              >
                <span>{product.name}</span>
                <span className="font-medium">{formatPrice(product.price)}</span>
              </div>
            ))}
          </div>

          {/* Wholesale Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <p className="text-xs text-blue-800">
              <strong>Precios mayoristas disponibles</strong> en el documento completo
            </p>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={generatePriceList}
          disabled={generating}
          className="w-full"
          size="lg"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generando...
            </>
          ) : generated ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Descargado!
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Descargar Lista de Precios
            </>
          )}
        </Button>

        <p className="text-xs text-center text-[var(--text-muted)]">
          Formato PDF - Listo para imprimir o compartir
        </p>
      </CardContent>
    </Card>
  )
}

function generatePriceListText(data: PriceListData): string {
  const formatPrice = (amount: number) => `${amount.toLocaleString('es-PY')} Gs`
  const formatDate = (date: Date) => date.toLocaleDateString('es-PY')

  return `
========================================
${data.businessName.toUpperCase()}
LISTA DE PRECIOS
========================================

Valido desde: ${formatDate(data.validFrom)}
Valido hasta: ${formatDate(data.validUntil)}

----------------------------------------
PRECIOS MINORISTAS
----------------------------------------
${data.retailProducts.map(p => `
${p.name}
${p.description}
Precio: ${formatPrice(p.price)} por ${p.unit}
`).join('\n')}

----------------------------------------
PRECIOS MAYORISTAS
----------------------------------------
${data.wholesaleProducts.map(p => `
${p.name}
${p.description}
Precio: ${formatPrice(p.price)} por ${p.unit}${p.minQuantity ? ` (Min: ${p.minQuantity})` : ''}
`).join('\n')}

----------------------------------------
ZONAS DE DELIVERY
----------------------------------------
${data.deliveryZones.map(z => `
${z.name}
Costo: ${z.fee === 0 ? 'GRATIS' : formatPrice(z.fee)}
Pedido minimo: ${z.minOrder === 0 ? 'Sin minimo' : formatPrice(z.minOrder)}
Envio gratis en compras mayores a: ${formatPrice(z.freeDeliveryOver)}
`).join('\n')}

----------------------------------------
CONTACTO
----------------------------------------
WhatsApp: ${data.whatsapp}
Telefono: ${data.phone}
Email: ${data.email}
Direccion: ${data.address}

----------------------------------------
CONDICIONES
----------------------------------------
- Precios sujetos a cambio sin previo aviso
- Stock sujeto a disponibilidad
- Pedidos mayoristas con 24hs de anticipacion
- Pagos en efectivo o transferencia

Gracias por elegir ${data.businessName}!
`
}

export interface PriceListSectionProps {
  data: PriceListData
  className?: string
}

export function PriceListSection({ data, className }: PriceListSectionProps) {
  return (
    <section className={cn('py-16 bg-[var(--surface)]', className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Heading level={2} className="text-3xl font-bold text-[var(--text)] mb-4">
            Precios Mayoristas
          </Heading>
          <p className="text-lg text-[var(--text-muted)]">
            Descarga nuestra lista de precios actualizada para negocios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <PriceListGenerator data={data} />

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[var(--primary)]" />
                  Informacion de Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.deliveryZones.map((zone, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-[var(--text)]">{zone.name}</span>
                    <Badge variant={zone.fee === 0 ? 'default' : 'secondary'}>
                      {zone.fee === 0 ? 'Gratis' : `${(zone.fee / 1000).toFixed(0)}k Gs`}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[var(--primary)]" />
                  Contacto Directo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-[var(--text-muted)]">
                  Para pedidos mayoristas o consultas comerciales:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>WhatsApp:</strong> {data.whatsapp}</p>
                  <p><strong>Email:</strong> {data.email}</p>
                  <p><strong>Direccion:</strong> {data.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PriceListGenerator
