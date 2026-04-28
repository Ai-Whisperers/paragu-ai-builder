import { chain } from '@/lib/middleware/chain'
import { correlationMiddleware } from '@/lib/middleware/correlation'
import { tenantRedirectMiddleware } from '@/lib/middleware/tenant-redirect'
import { ageGateMiddleware } from '@/lib/middleware/age-gate'
import { authMiddleware } from '@/lib/middleware/auth'

export default chain([
  correlationMiddleware,
  tenantRedirectMiddleware,
  ageGateMiddleware,
  authMiddleware,
])

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:css|js|mjs|map|woff2?|ttf|eot|otf|svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm)$).*)',
  ],
}
