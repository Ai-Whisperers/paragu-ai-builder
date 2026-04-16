/**
 * Business site layout.
 * Responsible for loading business-specific theme tokens
 * and injecting them as CSS variables.
 *
 * TODO: Load tokens from registry based on business type
 * and inject via <style> tag or className on <div>.
 */
export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="business-site">
      {children}
    </div>
  )
}
