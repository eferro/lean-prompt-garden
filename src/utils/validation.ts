import type { PromptData, Prompt } from '../types/prompt'

/**
 * Custom error class for validation failures
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

function assertValidPrompt(prompt: unknown, index: number): asserts prompt is Prompt {
  if (typeof prompt !== 'object' || prompt === null) {
    throw new ValidationError(`Invalid prompt at index ${index}: missing required field`)
  }

  const p = prompt as Prompt & { categories?: unknown }

  if (
    typeof p.name !== 'string' ||
    typeof p.title !== 'string' ||
    typeof p.description !== 'string'
  ) {
    throw new ValidationError(`Invalid prompt at index ${index}: missing required field`)
  }

  if (p.categories === undefined) {
    return
  }

  if (!Array.isArray(p.categories) || !p.categories.every((category) => typeof category === 'string')) {
    throw new ValidationError(
      `Invalid prompt at index ${index}: categories must be an array of strings`
    )
  }
}

/**
 * Validates the structure of PromptData fetched from the server.
 * Throws ValidationError if the data is malformed.
 */
export function validatePromptData(data: unknown): PromptData {
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError('Invalid prompt data: expected an object')
  }

  const obj = data as Record<string, unknown>

  // Check prompts array exists
  if (!('prompts' in obj)) {
    throw new ValidationError('Invalid prompt data: missing prompts array')
  }

  // Check prompts is an array
  if (!Array.isArray(obj.prompts)) {
    throw new ValidationError('Invalid prompt data: prompts must be an array')
  }

  // Check definitions exists
  if (!('definitions' in obj) || typeof obj.definitions !== 'object' || obj.definitions === null) {
    throw new ValidationError('Invalid prompt data: missing definitions object')
  }

  // Validate each prompt
  for (let i = 0; i < obj.prompts.length; i++) {
    assertValidPrompt(obj.prompts[i], i)
  }

  return data as PromptData
}

