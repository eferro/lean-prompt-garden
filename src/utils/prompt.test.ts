import { describe, it, expect } from 'vitest'
import {
  validatePrompt,
  filterPrompts,
  sortPrompts,
} from './prompt'
import type { Prompt } from '../types/prompt'

describe('validatePrompt', () => {
  it('should return true for valid prompt', () => {
    const prompt: Prompt = {
      name: 'test-prompt',
      title: 'Test Prompt',
      description: 'A test prompt'
    }

    expect(validatePrompt(prompt)).toBe(true)
  })

  it('should return false for prompt missing name', () => {
    const prompt = {
      title: 'Test Prompt',
      description: 'A test prompt'
    } as Prompt

    expect(validatePrompt(prompt)).toBe(false)
  })

  it('should return false for prompt missing title', () => {
    const prompt = {
      name: 'test-prompt',
      description: 'A test prompt'
    } as Prompt

    expect(validatePrompt(prompt)).toBe(false)
  })

  it('should return false for prompt missing description', () => {
    const prompt = {
      name: 'test-prompt',
      title: 'Test Prompt'
    } as Prompt

    expect(validatePrompt(prompt)).toBe(false)
  })
})

describe('filterPrompts', () => {
  const prompts: Prompt[] = [
    {
      name: 'email-template',
      title: 'Email Template',
      description: 'Generate professional email templates'
    },
    {
      name: 'code-review',
      title: 'Code Review',
      description: 'Review code for best practices and bugs'
    },
    {
      name: 'blog-post',
      title: 'Blog Post Writer',
      description: 'Create engaging blog posts on any topic'
    }
  ]

  it('should return all prompts when search term is empty', () => {
    expect(filterPrompts(prompts, '')).toEqual(prompts)
    expect(filterPrompts(prompts, '   ')).toEqual(prompts)
  })

  it('should filter prompts by title', () => {
    const result = filterPrompts(prompts, 'email')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('email-template')
  })

  it('should filter prompts by description', () => {
    const result = filterPrompts(prompts, 'blog posts')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('blog-post')
  })

  it('should filter prompts by name', () => {
    const result = filterPrompts(prompts, 'code-review')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('code-review')
  })

  it('should be case insensitive', () => {
    const result = filterPrompts(prompts, 'EMAIL')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('email-template')
  })

  it('should return multiple matches', () => {
    const result = filterPrompts(prompts, 'review')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('code-review')
  })

  it('should return empty array when no matches found', () => {
    const result = filterPrompts(prompts, 'nonexistent')
    expect(result).toHaveLength(0)
  })
})

describe('sortPrompts', () => {
  const prompts: Prompt[] = [
    {
      name: 'zebra-prompt',
      title: 'Zebra Title',
      description: 'Description Z'
    },
    {
      name: 'alpha-prompt',
      title: 'Alpha Title',
      description: 'Description A'
    },
    {
      name: 'beta-prompt',
      title: 'Beta Title',
      description: 'Description B'
    }
  ]

  it('should sort prompts by title by default', () => {
    const result = sortPrompts(prompts)
    expect(result.map(p => p.title)).toEqual(['Alpha Title', 'Beta Title', 'Zebra Title'])
  })

  it('should sort prompts by name when specified', () => {
    const result = sortPrompts(prompts, 'name')
    expect(result.map(p => p.name)).toEqual(['alpha-prompt', 'beta-prompt', 'zebra-prompt'])
  })

  it('should not mutate original array', () => {
    const originalOrder = [...prompts]
    sortPrompts(prompts)
    expect(prompts).toEqual(originalOrder)
  })

  it('should handle case insensitive sorting', () => {
    const mixedCasePrompts: Prompt[] = [
      { name: 'Z-prompt', title: 'z-title', description: 'desc' },
      { name: 'a-prompt', title: 'A-title', description: 'desc' },
      { name: 'B-prompt', title: 'b-title', description: 'desc' }
    ]

    const result = sortPrompts(mixedCasePrompts, 'title')
    expect(result.map(p => p.title)).toEqual(['A-title', 'b-title', 'z-title'])
  })
})
