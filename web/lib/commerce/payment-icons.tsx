import type { ReactNode } from 'react'

const ICONS: Record<string, ReactNode> = {
  bancard: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="#003366" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Bancard</text>
    </svg>
  ),
  pagopar: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="#00A650" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Pagopar</text>
    </svg>
  ),
  mercadopago: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="#009EE3" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">M.Pago</text>
    </svg>
  ),
  tigomoney: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="#E30000" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Tigo</text>
    </svg>
  ),
  personalpay: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="#003D7A" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">P.Pay</text>
    </svg>
  ),
  visa: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VISA</text>
    </svg>
  ),
  mastercard: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="white" stroke="#ccc" />
      <circle cx="18" cy="16" r="7" fill="#EB001B" opacity="0.8" />
      <circle cx="30" cy="16" r="7" fill="#F79E1B" opacity="0.8" />
    </svg>
  ),
  efectivo: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="#2E7D32" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">Efectivo</text>
    </svg>
  ),
  transferencia: (
    <svg viewBox="0 0 48 32" fill="none" className="h-8 w-12">
      <rect width="48" height="32" rx="4" fill="#1565C0" />
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">Transf.</text>
    </svg>
  ),
}

export const PAYMENT_IDS = ['bancard', 'pagopar', 'mercadopago', 'tigomoney', 'personalpay', 'visa', 'mastercard', 'efectivo', 'transferencia'] as const
export type PaymentMethodId = (typeof PAYMENT_IDS)[number]

export const PAYMENT_LABELS: Record<PaymentMethodId, string> = {
  bancard: 'Bancard',
  pagopar: 'Pagopar',
  mercadopago: 'Mercado Pago',
  tigomoney: 'Tigo Money',
  personalpay: 'Personal Pay',
  visa: 'Visa',
  mastercard: 'Mastercard',
  efectivo: 'Efectivo',
  transferencia: 'Transferencia Bancaria',
}

export function PaymentIcon({ method, className }: { method: PaymentMethodId; className?: string }) {
  return <span className={className}>{ICONS[method] || null}</span>
}
