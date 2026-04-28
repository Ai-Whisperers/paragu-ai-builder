'use client'

/**
 * Prints the current page via the browser's native dialog. Used on the
 * /orden/[id]/recibo page so shoppers can "Save as PDF" without us
 * shipping a server-side PDF library.
 */
export function ReceiptPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90"
    >
      📄 Descargar / Imprimir recibo
    </button>
  )
}
