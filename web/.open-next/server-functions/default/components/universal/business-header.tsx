'use client'

import Link from 'next/link'

interface BusinessHeaderProps {
  name: string
  tagline?: string
  logo?: string
  phone?: string
  email?: string
  address?: string
  showTagline?: boolean
}

export default function BusinessHeader({
  name,
  tagline,
  logo,
  phone,
  email,
  address,
  showTagline = true
}: BusinessHeaderProps) {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {logo && (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img src={logo} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-[var(--primary)]">{name}</h1>
            {showTagline && tagline && (
              <p className="text-sm text-[var(--text-secondary)]">{tagline}</p>
            )}
          </div>
        </div>
        
        {phone && (
          <a 
            href={`tel:${phone}`}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phone}
          </a>
        )}
      </div>
    </header>
  )
}