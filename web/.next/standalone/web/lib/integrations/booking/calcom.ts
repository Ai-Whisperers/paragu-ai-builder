import type { BookingAdapter } from './types'

export const calcomAdapter: BookingAdapter = {
  name: 'cal.com',
  buildEmbed(url, opts) {
    const qs = new URLSearchParams()
    if (opts?.prefill?.name) qs.set('name', opts.prefill.name)
    if (opts?.prefill?.email) qs.set('email', opts.prefill.email)
    if (opts?.locale) qs.set('locale', opts.locale)
    const src = qs.toString() ? `${url}?${qs.toString()}` : url
    const html = `<iframe src="${src}" width="100%" height="720" frameborder="0" title="Cal.com" loading="lazy"></iframe>`
    return { provider: 'cal.com', html, fallbackUrl: url }
  },
}
