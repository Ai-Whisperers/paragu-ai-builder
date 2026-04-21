import type { SVGProps } from 'react'
import type React from 'react'

export type BrandIconProps = SVGProps<SVGSVGElement> & {
  title?: string
}

function BrandIconBase({ title, children, ...props }: BrandIconProps & { children: React.ReactNode }) {
  return (
    <svg aria-label={title} role="img" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  )
}

export function BrandMark({ title = 'ParaguAI', ...props }: BrandIconProps) {
  return (
    <svg viewBox="0 0 512 512" aria-label={title} role="img" {...props}>
      <defs>
        <linearGradient id="brandMarkGradient" x1="0" y1="512" x2="512" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="brandMarkBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1A1A2E" />
          <stop offset="1" stopColor="#0F3460" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="512" height="512" rx="120" fill="url(#brandMarkBg)" />
      <path d="M48 424 L424 48" stroke="url(#brandMarkGradient)" strokeWidth="22" strokeLinecap="round" opacity="0.85" />
      <path d="M72 448 L448 72" stroke="url(#brandMarkGradient)" strokeWidth="18" strokeLinecap="round" opacity="0.65" />
      <path d="M100 468 L468 100" stroke="url(#brandMarkGradient)" strokeWidth="14" strokeLinecap="round" opacity="0.45" />

      <text
        x="256"
        y="312"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
        fontSize="170"
        fontWeight="900"
        fill="#FFFFFF"
      >
        AI
      </text>
    </svg>
  )
}

export function WhatsAppMark({ title = 'WhatsApp', ...props }: BrandIconProps) {
  return (
    <BrandIconBase title={title} viewBox="0 0 24 24" {...props}>
      <path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 20.5 11.8Z" />
      <path d="M8.7 8.8c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.3l.7 1.6c.1.2.1.5 0 .7l-.3.4c-.1.2-.3.4-.1.7.2.4.9 1.6 2 2.5 1.4 1.2 2.5 1.6 2.9 1.7.3.1.5 0 .7-.2l.9-1c.2-.2.4-.2.7-.1l1.6.8c.3.1.3.4.3.6 0 .2-.2 1-1 1.7-.8.7-1.8.8-2.4.7-.6-.1-2-.5-3.8-1.7-2.3-1.6-3.8-3.7-4.2-4.3-.4-.6-1.3-1.8-1.3-3.5 0-1.6.9-2.5 1.2-2.8Z" />
    </BrandIconBase>
  )
}

export function ShieldBadge({ title = 'Confianza', ...props }: BrandIconProps) {
  return (
    <BrandIconBase title={title} viewBox="0 0 24 24" {...props}>
      <path d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z" />
      <path d="m8.5 12 2.2 2.2L15.8 9" />
    </BrandIconBase>
  )
}

export function CalendarMark({ title = 'Calendario', ...props }: BrandIconProps) {
  return (
    <BrandIconBase title={title} viewBox="0 0 24 24" {...props}>
      <path d="M8 2v3M16 2v3" />
      <path d="M3.5 9h17" />
      <path d="M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </BrandIconBase>
  )
}

export function SearchMark({ title = 'Buscar', ...props }: BrandIconProps) {
  return (
    <BrandIconBase title={title} viewBox="0 0 24 24" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </BrandIconBase>
  )
}

export function GlobeMark({ title = 'Globo', ...props }: BrandIconProps) {
  return (
    <BrandIconBase title={title} viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.7 2.6 4.2 6.2 4.2 9S14.7 18.4 12 21c-2.7-2.6-4.2-6.2-4.2-9S9.3 5.6 12 3Z" />
    </BrandIconBase>
  )
}

export function BoltMark({ title = 'Velocidad', ...props }: BrandIconProps) {
  return (
    <BrandIconBase title={title} viewBox="0 0 24 24" {...props}>
      <path d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z" />
    </BrandIconBase>
  )
}

export function CheckBadge({ title = 'Listo', ...props }: BrandIconProps) {
  return (
    <BrandIconBase title={title} viewBox="0 0 24 24" {...props}>
      <path d="M12 2 15 4.5 18.8 4.6 19.6 8.4 22 12l-2.4 3.6-.8 3.8-3.8.1L12 22l-3-2.5-3.8-.1-.8-3.8L2 12l2.4-3.6.8-3.8 3.8-.1L12 2Z" />
      <path d="m8.5 12 2.2 2.2L15.8 9" />
    </BrandIconBase>
  )
}

