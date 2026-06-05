/**
 * @component ErrorBoundary
 * 
 * What it is: An alternative error boundary with a retry button and error logging. Catches render errors and gives users a way to recover by re-rendering the failed section.
 * 
 * Why your business needs it: Goes beyond a static fallback by letting visitors retry the failed section, improving user experience when transient errors occur.
 * 
 * What AI populates from your data: ParaguAI wraps critical page sections with this component — no configuration needed.
 * 
 * Your input: Nothing — works automatically.
 * 
 * Plan availability: All plans
 */
"use client"

import { Component, ReactNode } from "react"
import { waLink } from "@/lib/config/config"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
    if (typeof window !== "undefined") {
      console.error("[ErrorBoundary]", error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      const whatsappUrl = waLink("Hola! Tuve un problema cargando la sección. ¿Podés ayudarme?")
      return (
        this.props.fallback ?? (
          <div style={{
            padding: "2rem",
            textAlign: "center",
            color: "hsl(var(--muted-foreground, 220 9% 46%))",
            fontFamily: "system-ui, sans-serif",
          }}>
            <h2 style={{ marginBottom: "0.5rem", color: "hsl(var(--foreground, 0 0% 9%))" }}>
              Algo salió mal
            </h2>
            <p style={{ fontSize: "14px", marginBottom: "1rem" }}>
              Por favor, recargá la página o escribinos por WhatsApp.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => this.setState({ hasError: false })}
                style={{
                  padding: "8px 16px",
                  background: "hsl(var(--primary, 330 80% 50%))",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Intentar de nuevo
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 16px",
                  background: "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}