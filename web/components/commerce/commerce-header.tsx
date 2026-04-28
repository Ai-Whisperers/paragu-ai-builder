'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MiniCartBadge } from './mini-cart-badge'
import { CartDrawer } from './cart-drawer'
import { CurrencyToggle } from './currency-toggle'
import { HeaderSearch } from './header-search'
import { WishlistBadge } from './wishlist-badge'
import { DiscreetModeToggle } from './discreet-mode-toggle'
import { getConfig } from '@/lib/commerce/tenant-config'

interface Props {
  siteSlug: string
  businessName: string
  locale?: string
  whatsappNumber?: string
}

export function CommerceHeader({ siteSlug, businessName, locale = 'es', whatsappNumber }: Props) {
  const [open, setOpen] = useState(false)
  const tenantConfig = getConfig(siteSlug)
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[color:var(--border,#e5e7eb)] bg-surface shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href={`/s/${locale}/${siteSlug}`} className="text-lg font-semibold">
            {businessName}
          </Link>
          <nav className="flex items-center gap-3 text-sm sm:gap-4">
            <HeaderSearch siteSlug={siteSlug} locale={locale} />
            <Link href={`/s/${locale}/${siteSlug}/tienda`} className="hover:underline">
              Tienda
            </Link>
            <WishlistBadge siteSlug={siteSlug} locale={locale} />
            <Link
              href={`/s/${locale}/${siteSlug}/buscar-orden`}
              className="hidden text-xs text-[color:var(--text-muted,#6b7280)] hover:underline sm:inline"
            >
              Mi orden
            </Link>
            {!tenantConfig.hideDiscreetMode ? <DiscreetModeToggle /> : null}
            {!tenantConfig.hideCurrencyToggle ? <CurrencyToggle /> : null}
            <MiniCartBadge onClick={() => setOpen(true)} />
          </nav>
        </div>
      </header>
      <CartDrawer
        siteSlug={siteSlug}
        locale={locale}
        open={open}
        onClose={() => setOpen(false)}
        whatsappNumber={whatsappNumber}
        businessName={businessName}
      />
    </>
  )
}
