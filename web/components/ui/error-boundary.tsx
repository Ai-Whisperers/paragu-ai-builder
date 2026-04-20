"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { logger } from "@/lib/logger"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetOnChange?: unknown[]
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by ErrorBoundary', {
      action: 'errorBoundary.catch',
      errorName: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetOnChange && this.state.hasError) {
      const hasChanged = this.props.resetOnChange.some(
        (val, index) => val !== prevProps.resetOnChange?.[index]
      )
      if (hasChanged) {
        this.setState({ hasError: false, error: null })
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      )
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({
  error,
  onReset,
}: {
  error: Error | null
  onReset: () => void
}) {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-error-surface)] border border-[var(--color-error)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-[var(--color-error-surface)]">
          <svg
            className="w-5 h-5 text-[var(--color-error)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-error)]">
          Something went wrong
        </h3>
      </div>
      
      <p className="text-sm text-[var(--color-error)] mb-4">
        An error occurred while rendering this component. Please try again.
      </p>
      
      {error && (
        <details className="mb-4">
          <summary className="text-sm text-[var(--color-error)] cursor-pointer hover:text-[var(--color-error)]">
            Error details
          </summary>
          <pre className="mt-2 p-3 bg-[var(--color-error-surface)] rounded text-xs text-[var(--color-error)] overflow-auto">
            {error.message}
            {"\n"}
            {error.stack}
          </pre>
        </details>
      )}
      
      <button
        onClick={onReset}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

// Hook for error boundary in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    logger.error('Error handled by useErrorHandler', {
      action: 'useErrorHandler',
      errorName: error.name,
      message: error.message,
    })
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}
