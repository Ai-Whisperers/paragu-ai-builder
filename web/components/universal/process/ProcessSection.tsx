/**
 * ANNOTATION: ProcessSection
 *
 * What it is: A step-by-step "how it works" section with numbered circles, titles, and descriptions. Accepts customizable steps, title, subtitle, and accent color.
 *
 * Why your business needs it: Reduces uncertainty about what the client experience will be like. Clients who understand the process feel more in control and are less likely to cancel or no-show. Each step shown = higher perceived professionalism.
 *
 * What AI populates from your data: ParaguAI generates process steps from your service type. For a restaurant, steps might be: "Consultation → Color/Cut → Styling → Checkout." AI adapts the language and step count to your actual workflow.
 *
 * Your input: Describe your typical client flow in 3–5 steps via WhatsApp during onboarding.
 *
 * Plan availability: All plans (Prueba, Presencia, Crecimiento, Profesional)
 */

/**
 * ANNOTATION: ProcessSection
 *
 * What it is: A numbered step-by-step "how it works" sequence (e.g. 1. Reservás
 * 2. Te atendemos 3. Disfrutás el resultado).
 *
 * Why your business needs it: First-time customers hesitate when they don't
 * know what to expect. Spelling out the process reduces uncertainty and the
 * fear of an awkward first interaction — which lifts booking conversion.
 *
 * What AI populates from your data: AI generates the steps tailored to your
 * service type (a restaurant flow differs from a consultancy or a gym).
 *
 * Your input: Describe what happens from first contact to finished service.
 *
 * Plan availability: All plans.
 */
interface ProcessStep {
  step: string
  title: string
  description: string
}

export function ProcessSection({
  title,
  subtitle,
  steps,
  accentColor = "primary",
}: {
  title: string
  subtitle?: string
  steps: ProcessStep[]
  accentColor?: "primary" | "accent"
}) {
  const bgClass = accentColor === "accent" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-5xl px-4">
        {title && <h2 className="mb-2 text-center text-3xl font-bold text-foreground">{title}</h2>}
        {subtitle && <p className="mb-12 text-center text-muted-foreground">{subtitle}</p>}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${bgClass}`}>
                {step.step}
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
