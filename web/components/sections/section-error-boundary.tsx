'use client'

import { Component, type ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  sectionId: string
  index: number
}

interface State {
  hasError: boolean
}

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error): void {
    logger.error('Section render error — skipping section', {
      action: 'sectionErrorBoundary',
      sectionId: this.props.sectionId,
      index: this.props.index,
      error: error.message,
      digest: (error as { digest?: string }).digest,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) return null
    return this.props.children
  }
}
