import { describe, it, expect } from 'vitest'
import { validatePromptData, ValidationError } from './validation'
import type { PromptData } from '../types/prompt'

describe('validatePromptData', () => {
  it('should return valid data when structure is correct', () => {
    const validData: PromptData = {
      prompts: [
        { name: 'test', title: 'Test', description: 'A test prompt' }
      ],
      definitions: {
        test: {
          name: 'test',
          title: 'Test',
          description: 'A test prompt',
          messages: []
        }
      }
    }

    const result = validatePromptData(validData)
    expect(result).toEqual(validData)
  })

  it('should throw ValidationError when prompts array is missing', () => {
    const invalidData = {
      definitions: {}
    }

    expect(() => validatePromptData(invalidData as PromptData))
      .toThrow(ValidationError)
    expect(() => validatePromptData(invalidData as PromptData))
      .toThrow('Invalid prompt data: missing prompts array')
  })

  it('should throw ValidationError when prompts is not an array', () => {
    const invalidData = {
      prompts: 'not an array',
      definitions: {}
    }

    expect(() => validatePromptData(invalidData as unknown as PromptData))
      .toThrow(ValidationError)
    expect(() => validatePromptData(invalidData as unknown as PromptData))
      .toThrow('Invalid prompt data: prompts must be an array')
  })

  it('should throw ValidationError when definitions is missing', () => {
    const invalidData = {
      prompts: []
    }

    expect(() => validatePromptData(invalidData as unknown))
      .toThrow(ValidationError)
    expect(() => validatePromptData(invalidData as unknown))
      .toThrow('Invalid prompt data: missing definitions object')
  })

  it('should throw ValidationError when a prompt is missing required fields', () => {
    const invalidData = {
      prompts: [
        { name: 'test' } // missing title and description
      ],
      definitions: {}
    }

    expect(() => validatePromptData(invalidData as unknown as PromptData))
      .toThrow(ValidationError)
    expect(() => validatePromptData(invalidData as unknown as PromptData))
      .toThrow('Invalid prompt at index 0: missing required field')
  })

  it('should return empty prompts array when valid but empty', () => {
    const validEmptyData: PromptData = {
      prompts: [],
      definitions: {}
    }

    const result = validatePromptData(validEmptyData)
    expect(result.prompts).toEqual([])
  })
})

