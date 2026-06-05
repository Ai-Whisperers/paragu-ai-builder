/**
 * ANNOTATION: FAQJsonLd
 *
 * What it is: FAQPage JSON-LD structured data for Google rich snippets. Renders schema.org FAQPage markup so Google displays FAQs directly in search results.
 *
 * Why your business needs it: FAQ rich snippets increase your search real estate and click-through rate.
 * When people see questions and answers in search results, they trust your site more before clicking.
 *
 * What AI populates from your data: FAQs from content/es/faqs.json and content/en/faqs.json.
 * ParaguAI generates SEO-optimized FAQ content from your business info.
 *
 * Your input: Tell ParaguAI about common customer questions during onboarding.
 *
 * Plan availability: All plans
 */

/**
 * @component FAQJsonLd
 * @description FAQPage JSON-LD structured data generator for Google rich snippets. Renders schema.org FAQPage markup as script tag in page head.
 * @featureFlags core
 * @requires React Head component or script tag injection
 * @implementation dangerouslySetInnerHTML for script injection, @context https://schema.org, @type FAQPage
 */

export function FAQJsonLd({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  if (!faqs?.length) return null
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}