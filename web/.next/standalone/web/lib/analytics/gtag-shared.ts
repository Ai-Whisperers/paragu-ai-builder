declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || !window.gtag) return
  try {
    window.gtag(...args)
  } catch {}
}
