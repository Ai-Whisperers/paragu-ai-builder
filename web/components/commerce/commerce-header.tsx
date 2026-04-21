'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MiniCartBadge } from './mini-cart-badge'
import { CartDrawer } from './cart-drawer'
import { CurrencyToggle } from './currency-toggle'

interface Props {
  siteSlug: string
  businessName: string
  /** Active locale slug from the URL — threaded through to cart links so
   * `/s/pt/...` sites don't get sent back to `/s/es/...`. */
  locale?: string
}

export function CommerceHeader({ siteSlug, businessName, locale = 'es' }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href={`/s/${locale}/${siteSlug}`} className="text-lg font-semibold">
            {businessName}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href={`/s/${locale}/${siteSlug}/tienda`} className="hover:underline">
              Tienda
            </Link>
            <CurrencyToggle />
            <MiniCartBadge onClick={() => setOpen(true)} />
          </nav>
        </div>
      </header>
      <CartDrawer siteSlug={siteSlug} locale={locale} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
