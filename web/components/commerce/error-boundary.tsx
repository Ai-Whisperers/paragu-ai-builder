'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class CommerceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border border-dashed border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            <p>Algo salio mal al cargar esta seccion.</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
            >
              Intentar de nuevo
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
