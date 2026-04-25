'use client'

import { ExitIntentModal } from '@/components/consent/exit-intent-modal'

/**
 * Locale-aware label map for the exit-intent modal. Kept alongside the
 * mount-point so the label strings don't leak into the shared modal
 * component — each tenant site gets the modal, but only tenants in the
 * relocation vertical benefit from relocation-specific copy.
 *
 * If more tenants onboard with commerce / booking verticals, fork the
 * label strings per vertical here rather than in the modal itself.
 */
const LABELS: Record<string, {
  headline: string
  subheadline: string
  emailPlaceholder: string
  submit: string
  privacy: string
  success: string
  close: string
}> = {
  de: {
    headline: 'Bevor Sie gehen —',
    subheadline: 'Erhalten Sie unseren monatlichen Paraguay-Leitfaden für europäische Investoren. Steuern, Regulierung, Banking — knapp und ehrlich.',
    emailPlaceholder: 'Ihre E-Mail',
    submit: 'Leitfaden anfordern',
    privacy: 'Wir senden nur den Leitfaden und den monatlichen Newsletter. Jederzeit abbestellen.',
    success: 'Danke — die erste E-Mail ist unterwegs.',
    close: 'Schließen',
  },
  en: {
    headline: 'Before you go —',
    subheadline: 'Get our monthly Paraguay guide for European investors. Tax, regulation, banking — concise and honest.',
    emailPlaceholder: 'Your email',
    submit: 'Send me the guide',
    privacy: 'We only send the guide and the monthly newsletter. Unsubscribe any time.',
    success: 'Thanks — the first email is on its way.',
    close: 'Close',
  },
  es: {
    headline: 'Antes de irse —',
    subheadline: 'Reciba nuestra guía mensual de Paraguay para inversores europeos. Impuestos, regulación, banca — concisa y honesta.',
    emailPlaceholder: 'Su email',
    submit: 'Enviarme la guía',
    privacy: 'Solo enviamos la guía y el newsletter mensual. Cancele cuando quiera.',
    success: 'Gracias — el primer email va en camino.',
    close: 'Cerrar',
  },
  nl: {
    headline: 'Voor u gaat —',
    subheadline: 'Ontvang onze maandelijkse Paraguay-gids voor Europese investeerders. Belastingen, regelgeving, bankieren — beknopt en eerlijk.',
    emailPlaceholder: 'Uw e-mail',
    submit: 'Stuur mij de gids',
    privacy: 'We sturen alleen de gids en de maandelijkse nieuwsbrief. Op elk moment opzeggen.',
    success: 'Bedankt — de eerste e-mail is onderweg.',
    close: 'Sluiten',
  },
}

export function ExitIntentMount({ locale, site }: { locale: string; site: string }) {
  const L = LABELS[locale] || LABELS.es
  return (
    <ExitIntentModal
      headline={L.headline}
      subheadline={L.subheadline}
      emailPlaceholder={L.emailPlaceholder}
      submitLabel={L.submit}
      privacyLabel={L.privacy}
      successMessage={L.success}
      closeLabel={L.close}
      fallbackEmail="hola@nexaparaguay.com"
      siteSlug={site}
      locale={locale}
    />
  )
}
