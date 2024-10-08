import { sendError } from '@/analytics'
import { devError } from '@past3lle/utils'
import React, { ReactNode } from 'react'

export class ErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode | null },
  { hasError: boolean }
> {
  state: { hasError: boolean }

  constructor(props: { fallback: ReactNode; children: ReactNode | null }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error, hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack: string | null | undefined }) {
    devError(error, info.componentStack)
    sendError(error, 'ErrorBoundary')
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}
