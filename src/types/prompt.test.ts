import { describe, it, expect } from 'vitest'
import type { Prompt } from './prompt'

describe('Prompt Types', () => {
  it('should create a valid Prompt', () => {
    const prompt: Prompt = {
      name: 'test-prompt',
      title: 'Test Prompt',
      description: 'A test prompt for testing'
    }

    expect(prompt.name).toBe('test-prompt')
    expect(prompt.title).toBe('Test Prompt')
    expect(prompt.description).toBe('A test prompt for testing')
  })
})
