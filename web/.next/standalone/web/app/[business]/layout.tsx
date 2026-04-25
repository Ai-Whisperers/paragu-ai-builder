/**
 * Business site layout.
 * Wraps generated site pages. Theme injection happens in page.tsx
 * via the composition engine's token resolver.
 */
export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
