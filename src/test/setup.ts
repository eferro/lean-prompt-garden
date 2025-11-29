import '@testing-library/jest-dom'
import { beforeAll, afterAll } from 'vitest'

// Suppress React act() warnings during tests
// These warnings are expected when testing hooks that update state asynchronously
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = args[0]
    if (
      typeof message === 'string' &&
      message.includes('not wrapped in act')
    ) {
      return
    }
    originalError.apply(console, args)
  }
})

afterAll(() => {
  console.error = originalError
})
