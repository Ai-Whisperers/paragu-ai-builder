declare module '*.css' {
  const content: Record<string, string>
  export default content
}

// cssesc ships its own JS but no .d.ts. Used by lib/security/sanitize.ts to
// escape user-provided CSS values against injection. Minimal shape — we only
// call the default export as a string escaper.
declare module 'cssesc' {
  interface CssescOptions {
    isIdentifier?: boolean
    quotes?: 'single' | 'double'
    wrap?: boolean
    escapeEverything?: boolean
  }
  function cssesc(value: string, options?: CssescOptions): string
  export default cssesc
}
