'use client'

import { Component, type ReactNode } from 'react'
import { AlertError, ConfirmError } from '@/shared/errors'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  handleDismiss = () => this.setState({ error: null })

  handleConfirm = () => {
    const { error } = this.state
    if (error instanceof ConfirmError) error.onConfirm()
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, fallback } = this.props

    if (!error) return children

    if (error instanceof AlertError) {
      return (
        <div role="alertdialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-xl p-6 mx-4 max-w-sm w-full shadow-lg border border-border">
            <p className="text-foreground mb-4">{error.message}</p>
            <button
              onClick={this.handleDismiss}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm"
            >
              확인
            </button>
          </div>
        </div>
      )
    }

    if (error instanceof ConfirmError) {
      return (
        <div role="alertdialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-xl p-6 mx-4 max-w-sm w-full shadow-lg border border-border">
            <p className="text-foreground mb-4">{error.message}</p>
            <div className="flex gap-2">
              <button
                onClick={this.handleDismiss}
                className="flex-1 border border-input rounded-lg py-2 text-sm text-muted-foreground"
              >
                취소
              </button>
              <button
                onClick={this.handleConfirm}
                className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )
    }

    return fallback ?? (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-sm">오류가 발생했어요. 다시 시도해주세요.</p>
      </div>
    )
  }
}
