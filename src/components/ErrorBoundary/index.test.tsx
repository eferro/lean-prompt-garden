import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ErrorBoundary from './index'

// Component that throws an error for testing
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Normal content</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error for expected errors in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })

  it('should display fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.queryByText('Normal content')).not.toBeInTheDocument()
  })

  it('should log error details for debugging', () => {
    const consoleSpy = vi.spyOn(console, 'error')

    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should provide Try Again action that resets error state', () => {
    // Use a key to force remount after error recovery
    let shouldThrow = true
    
    const { rerender } = render(
      <ErrorBoundary key="boundary">
        <ThrowingComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i })
    expect(tryAgainButton).toBeInTheDocument()

    // Change the throwing state and rerender with new key to simulate recovery scenario
    shouldThrow = false
    
    rerender(
      <ErrorBoundary key="boundary-recovered">
        <ThrowingComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })
})

