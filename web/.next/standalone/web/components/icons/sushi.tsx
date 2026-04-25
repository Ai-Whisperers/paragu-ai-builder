import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function NigiriIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="32" cy="34" rx="26" ry="8" fill="currentColor" opacity="0.12" />
      <path
        d="M8 30c0-3 2-5 5-5h38c3 0 5 2 5 5v2c0 3-2 5-5 5H13c-3 0-5-2-5-5v-2z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M10 22c2-6 8-10 22-10s20 4 22 10c1 2 0 4-3 4H13c-3 0-4-2-3-4z"
        fill="currentColor"
      />
      <path
        d="M16 18c3-2 8-4 16-4s13 2 16 4"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MakiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.1" />
      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="3" opacity="0.55" />
      <circle cx="32" cy="32" r="18" fill="currentColor" opacity="0.15" />
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="32" cy="32" r="8" fill="currentColor" />
      <circle cx="32" cy="32" r="2.5" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function SashimiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 32c0-4 3-7 7-7h38c4 0 7 3 7 7s-3 7-7 7H13c-4 0-7-3-7-7z"
        fill="currentColor"
      />
      <path
        d="M4 20c0-4 3-7 7-7h38c4 0 7 3 7 7s-3 7-7 7H11c-4 0-7-3-7-7z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M8 10c0-3 2-5 5-5h34c3 0 5 2 5 5s-2 5-5 5H13c-3 0-5-2-5-5z"
        fill="currentColor"
        opacity="0.45"
      />
      <path
        d="M14 32h32M12 20h36"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TemakiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 8L52 24L28 56L12 8z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M18 16L44 26L28 48"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        fill="none"
      />
      <circle cx="34" cy="22" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="30" cy="30" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="38" cy="28" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function SakeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M24 8h16v4l-2 4v14c0 6-3 10-6 10s-6-4-6-10V16l-2-4V8z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M24 8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="32" cy="48" rx="16" ry="3" fill="currentColor" opacity="0.15" />
      <path
        d="M16 50c0 4 3 8 8 8h16c5 0 8-4 8-8l-1-6H17l-1 6z"
        fill="currentColor"
        opacity="0.4"
      />
      <path d="M17 44h30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function TempuraIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 44c2-16 10-28 22-28s18 10 18 22"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 44c2-16 10-28 22-28s18 10 18 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.4"
        fill="none"
      />
      <circle cx="12" cy="48" r="5" fill="currentColor" opacity="0.6" />
      <circle cx="18" cy="50" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="52" cy="40" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="46" cy="20" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function ChopsticksIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10 56L48 8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M18 56L56 8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

export interface SushiPlateProps extends IconProps {
  plateColor?: string
  toppingVariant?: 'nigiri' | 'maki' | 'sashimi'
}

export function SushiPlate({
  plateColor = 'currentColor',
  toppingVariant = 'nigiri',
  ...props
}: SushiPlateProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="72" rx="44" ry="6" fill="black" opacity="0.08" />
      <ellipse cx="50" cy="60" rx="42" ry="10" fill={plateColor} />
      <ellipse cx="50" cy="58" rx="42" ry="10" fill={plateColor} />
      <ellipse cx="50" cy="57" rx="34" ry="7" fill="white" opacity="0.25" />
      <ellipse cx="50" cy="55" rx="30" ry="6" fill="#FAFAF5" />

      {toppingVariant === 'nigiri' && (
        <g transform="translate(30 32)">
          <ellipse cx="20" cy="22" rx="18" ry="5" fill="#F5F0E5" />
          <path
            d="M4 20c0-4 2-7 16-7s16 3 16 7c0 1-1 2-3 2H7c-2 0-3-1-3-2z"
            fill="#F5F0E5"
          />
          <path
            d="M6 14c2-5 8-8 14-8s12 3 14 8c1 2-1 4-3 4H9c-2 0-4-2-3-4z"
            fill="#E67E60"
          />
          <path
            d="M10 10c3-2 6-3 10-3s7 1 10 3"
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      )}

      {toppingVariant === 'maki' && (
        <g transform="translate(32 20)">
          <circle cx="18" cy="18" r="16" fill="#1A1A1A" />
          <circle cx="18" cy="18" r="13" fill="#F5F0E5" />
          <circle cx="18" cy="18" r="6" fill="#E67E60" />
          <circle cx="18" cy="18" r="1.5" fill="#6B4423" opacity="0.4" />
        </g>
      )}

      {toppingVariant === 'sashimi' && (
        <g transform="translate(28 28)">
          <path d="M4 20c0-3 2-5 5-5h26c3 0 5 2 5 5s-2 5-5 5H9c-3 0-5-2-5-5z" fill="#E67E60" />
          <path d="M6 12c0-3 2-5 5-5h22c3 0 5 2 5 5s-2 5-5 5H11c-3 0-5-2-5-5z" fill="#E67E60" opacity="0.75" />
          <path d="M10 8h22" stroke="white" strokeOpacity="0.4" strokeWidth="0.8" />
          <path d="M8 20h24" stroke="white" strokeOpacity="0.4" strokeWidth="0.8" />
        </g>
      )}
    </svg>
  )
}

export interface SeigaihaPatternProps {
  color?: string
  opacity?: number
  className?: string
  id?: string
}

export function SeigaihaPattern({
  color = 'var(--primary)',
  opacity = 0.08,
  className,
  id = 'seigaiha-default',
}: SeigaihaPatternProps) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="1.5" strokeOpacity={opacity}>
            <circle cx="0" cy="40" r="34" />
            <circle cx="0" cy="40" r="22" />
            <circle cx="0" cy="40" r="10" />
            <circle cx="80" cy="40" r="34" />
            <circle cx="80" cy="40" r="22" />
            <circle cx="80" cy="40" r="10" />
            <circle cx="40" cy="0" r="34" />
            <circle cx="40" cy="0" r="22" />
            <circle cx="40" cy="0" r="10" />
            <circle cx="40" cy="80" r="34" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export interface SeigaihaDividerProps {
  flip?: boolean
  className?: string
}

export function SeigaihaDivider({ flip = false, className }: SeigaihaDividerProps) {
  return (
    <div
      className={className}
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="h-12 w-full">
        <path
          d="M0 60 C 100 20, 200 20, 300 60 C 400 20, 500 20, 600 60 C 700 20, 800 20, 900 60 C 1000 20, 1100 20, 1200 60 L1200 0 L0 0 Z"
          fill="var(--surface)"
        />
        <path
          d="M0 60 C 100 30, 200 30, 300 60 C 400 30, 500 30, 600 60 C 700 30, 800 30, 900 60 C 1000 30, 1100 30, 1200 60"
          stroke="var(--primary)"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  )
}
