import { CookieConsent } from '@/components/ui/cookie-consent'
import { GA4 } from '@/components/analytics/ga4'

/**
 * Business site layout.
 * Wraps generated site pages. Theme injection happens in page.tsx
 * via the composition engine's token resolver.
 */
export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent />
      <GA4 measurementId={process.env.NEXT_PUBLIC_GA4_ID} />
    </>
  )
}
