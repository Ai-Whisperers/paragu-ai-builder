'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MiniCartBadge } from './mini-cart-badge'
import { CartDrawer } from './cart-drawer'

export function CommerceHeader({ siteSlug, businessName }: { siteSlug: string; businessName: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href={`/s/es/${siteSlug}`} className="text-lg font-semibold">
            {businessName}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href={`/s/es/${siteSlug}/tienda`} className="hover:underline">
              Tienda
            </Link>
            <MiniCartBadge onClick={() => setOpen(true)} />
          </nav>
        </div>
      </header>
      <CartDrawer siteSlug={siteSlug} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
