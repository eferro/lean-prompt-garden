import { describe, it, expect } from 'vitest'
import type { PromptArgument, Prompt } from './prompt'

describe('Prompt Types', () => {
  it('should create a valid PromptArgument', () => {
    const argument: PromptArgument = {
      name: 'testArg',
      description: 'A test argument',
      required: true
    }

    expect(argument.name).toBe('testArg')
    expect(argument.description).toBe('A test argument')
    expect(argument.required).toBe(true)
  })

  it('should create a valid Prompt', () => {
    const prompt: Prompt = {
      name: 'test-prompt',
      title: 'Test Prompt',
      description: 'A test prompt for testing'
    }

    expect(prompt.name).toBe('test-prompt')
    expect(prompt.title).toBe('Test Prompt')
    expect(prompt.description).toBe('A test prompt for testing')
    expect(prompt.arguments).toBeUndefined()
  })

  it('should create a valid Prompt with arguments', () => {
    const prompt: Prompt = {
      name: 'test-prompt-with-args',
      title: 'Test Prompt With Args',
      description: 'A test prompt with arguments',
      arguments: [{
        name: 'input',
        description: 'Input text',
        required: true
      }]
    }

    expect(prompt.arguments).toHaveLength(1)
    expect(prompt.arguments?.[0].name).toBe('input')
  })
})