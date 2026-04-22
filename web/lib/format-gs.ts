export function formatGs(n: number): string {
  return (
    new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(
      Math.max(0, Math.round(n)),
    ) + ' Gs'
  )
}
