import { ExitIntentMount } from './exit-intent-mount'
import { SiteSearch } from '@/components/search/site-search'
import { LiveChatLoader } from '@/components/analytics/live-chat-loader'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string; site: string }>
}

export default async function TenantLayout({ children, params }: Props) {
  const { locale, site } = await params
  return (
    <>
      {children}
      <ExitIntentMount locale={locale} site={site} />
      <LiveChatLoader websiteId={process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID} />
      <SiteSearch siteSlug={site} locale={locale} />
    </>
  )
}
