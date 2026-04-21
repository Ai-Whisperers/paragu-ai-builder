import { ExitIntentMount } from './exit-intent-mount'

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
    </>
  )
}
