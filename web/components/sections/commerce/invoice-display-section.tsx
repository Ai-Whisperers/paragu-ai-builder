import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Download } from 'lucide-react'

export interface Invoice {
  number: string
  date: string
  amount: string
  status: string
  pdfUrl?: string
}

export interface InvoiceDisplaySectionProps {
  title?: string
  invoices?: Invoice[]
  variant?: 'table' | 'card'
  __locale?: string
}

const STATUS_STYLES: Record<string, string> = {
  paid: 'text-green-600 bg-green-50',
  pending: 'text-yellow-600 bg-yellow-50',
  overdue: 'text-red-600 bg-red-50',
  cancelled: 'text-gray-500 bg-gray-50',
}

export function InvoiceDisplaySection({
  title = 'Facturas',
  invoices = [],
  variant = 'table',
}: InvoiceDisplaySectionProps) {
  if (!invoices?.length) return null

  if (variant === 'card') {
    return (
      <Section spacing="md" background="surface">
        <Container>
          <Heading level={2} className="mb-6">{title}</Heading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {invoices.map((inv) => (
              <Card key={inv.number}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[inv.status] || ''}`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{inv.number}</p>
                  <p className="text-xs text-muted-foreground">{inv.date}</p>
                  <p className="mt-2 text-lg font-bold text-foreground">{inv.amount}</p>
                  {inv.pdfUrl && (
                    <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      <Download className="h-3 w-3" /> PDF
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section spacing="md" background="surface">
      <Container>
        <Heading level={2} className="mb-6">{title}</Heading>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-light">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">N° Factura</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Monto</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr key={inv.number} className="hover:bg-surface-light">
                  <td className="px-5 py-3 font-medium text-foreground">{inv.number}</td>
                  <td className="px-5 py-3 text-muted-foreground">{inv.date}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">{inv.amount}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[inv.status] || ''}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {inv.pdfUrl && (
                      <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        <Download className="h-3 w-3" /> PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  )
}
