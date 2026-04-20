'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle, Clock, XCircle, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder'

export interface StockIndicatorProps {
  status: StockStatus
  stockCount?: number
  lowStockThreshold?: number
  preorderDate?: string
  className?: string
  onNotifyMe?: () => void
}

export const STOCK_CONFIG: Record<StockStatus, {
  label: string
  color: string
  bgColor: string
  icon: React.ReactNode
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline'
}> = {
  in_stock: {
    label: 'Disponible',
    color: '#27ae60',
    bgColor: 'bg-green-50',
    icon: <CheckCircle className="w-4 h-4" />,
    badgeVariant: 'default'
  },
  low_stock: {
    label: 'Quedan pocas unidades',
    color: '#f39c12',
    bgColor: 'bg-amber-50',
    icon: <AlertCircle className="w-4 h-4" />,
    badgeVariant: 'secondary'
  },
  out_of_stock: {
    label: 'Agotado temporalmente',
    color: '#e74c3c',
    bgColor: 'bg-red-50',
    icon: <XCircle className="w-4 h-4" />,
    badgeVariant: 'destructive'
  },
  preorder: {
    label: 'Reservar con 24hs anticipacion',
    color: '#3498db',
    bgColor: 'bg-blue-50',
    icon: <Clock className="w-4 h-4" />,
    badgeVariant: 'outline'
  }
}

export function StockIndicator({
  status,
  stockCount,
  lowStockThreshold = 10,
  preorderDate,
  className,
  onNotifyMe
}: StockIndicatorProps) {
  const [showNotifyForm, setShowNotifyForm] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const config = STOCK_CONFIG[status]

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    onNotifyMe?.()
  }

  if (status === 'out_of_stock') {
    return (
      <div className={cn('space-y-3', className)}>
        <Badge 
          variant="destructive" 
          className="flex items-center gap-1.5 px-3 py-1.5"
        >
          {config.icon}
          {config.label}
        </Badge>
        
        {!subscribed ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 mb-3">
              Dejanos tu email y te avisamos cuando tengamos stock:
            </p>
            {showNotifyForm ? (
              <form onSubmit={handleNotifySubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm">
                  <Bell className="w-4 h-4 mr-1" />
                  Avisarme
                </Button>
              </form>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowNotifyForm(true)}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <Bell className="w-4 h-4 mr-1" />
                Avisarme cuando haya
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Te avisaremos a {email} cuando haya stock!
            </p>
          </div>
        )}
      </div>
    )
  }

  if (status === 'preorder') {
    return (
      <div className={cn('space-y-2', className)}>
        <Badge 
          variant="outline" 
          className="flex items-center gap-1.5 px-3 py-1.5 border-blue-500 text-blue-700"
        >
          {config.icon}
          {config.label}
        </Badge>
        {preorderDate && (
          <p className="text-sm text-[var(--text-muted)]">
            Proxima disponibilidad: <span className="font-medium">{preorderDate}</span>
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge 
        variant={config.badgeVariant}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5',
          status === 'in_stock' && 'bg-green-600 hover:bg-green-700'
        )}
      >
        {config.icon}
        {config.label}
      </Badge>
      
      {status === 'low_stock' && stockCount !== undefined && (
        <span className="text-sm text-amber-700 font-medium">
          Solo {stockCount} unidades
        </span>
      )}
      
      {status === 'in_stock' && stockCount !== undefined && stockCount > lowStockThreshold && (
        <span className="text-sm text-[var(--text-muted)]">
          ({stockCount} disponibles)
        </span>
      )}
    </div>
  )
}

export interface ProductStockCardProps {
  productName: string
  status: StockStatus
  stockCount?: number
  price: string
  className?: string
}

export function ProductStockCard({
  productName,
  status,
  stockCount,
  price,
  className
}: ProductStockCardProps) {
  const config = STOCK_CONFIG[status]

  return (
    <div className={cn(
      'border rounded-lg p-4 transition-all duration-200',
      config.bgColor,
      'border-opacity-30',
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-[var(--text)]">{productName}</h4>
          <p className="text-lg font-bold text-[var(--primary)]">{price}</p>
        </div>
        <StockIndicator 
          status={status} 
          stockCount={stockCount}
          className="flex-shrink-0"
        />
      </div>
    </div>
  )
}

export interface StockManagerProps {
  products: Array<{
    id: string
    name: string
    status: StockStatus
    count: number
  }>
  onUpdateStock: (productId: string, newCount: number) => void
}

export function StockManager({ products, onUpdateStock }: StockManagerProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Gestion de Stock</h3>
      <div className="grid gap-3">
        {products.map((product) => (
          <div 
            key={product.id}
            className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-lg"
          >
            <div className="flex items-center gap-3">
              <StockIndicator status={product.status} stockCount={product.count} />
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={product.count}
                onChange={(e) => onUpdateStock(product.id, parseInt(e.target.value) || 0)}
                className="w-20 text-center"
                min={0}
              />
              <span className="text-sm text-[var(--text-muted)]">unidades</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StockIndicator
