import { Container } from '@/components/ui/container'

/**
 * Legal / compliance disclaimer footer. Render below the main footer.
 * Holds fine-print text (no investment advice / no medical advice / AML /
 * license numbers) per jurisdiction.
 */

export interface ComplianceDisclaimerFooterProps {
  paragraphs: string[]
  licenseNumbers?: Array<{ label: string; number: string }>
  linkText?: string
  linkHref?: string
}

export function ComplianceDisclaimerFooterSection({
  paragraphs,
  licenseNumbers,
  linkText,
  linkHref,
}: ComplianceDisclaimerFooterProps) {
  if (!paragraphs?.length && !licenseNumbers?.length) return null
  return (
    <section className="py-6 bg-background border-t border-[var(--surface-light)]">
      <Container>
        <div className="max-w-4xl mx-auto text-xs text-muted-foreground space-y-2">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {licenseNumbers && licenseNumbers.length > 0 && (
            <p>
              {licenseNumbers.map((ln, i) => (
                <span key={i} className="mr-3">
                  <strong>{ln.label}:</strong> {ln.number}
                </span>
              ))}
            </p>
          )}
          {linkText && linkHref && (
            <p>
              <a href={linkHref} className="underline">
                {linkText}
              </a>
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}
