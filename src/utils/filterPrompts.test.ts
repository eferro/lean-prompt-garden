import { describe, it, expect } from 'vitest'
import { filterPrompts } from './filterPrompts'
import type { Prompt } from '../types/prompt'

describe('filterPrompts', () => {
  const prompts: Prompt[] = [
    { name: 'analyst_review', title: 'Analyst Review', description: 'Code review prompt', categories: ['Analyst'] },
    { name: 'gardener_prune', title: 'Gardener Prune', description: 'Cleanup prompt', categories: ['Gardener'] },
    { name: 'planner_mikado', title: 'Planner Mikado Method', description: 'Planning prompt', categories: ['Planner'] },
    { name: 'clarity_naming', title: 'Clarity Naming', description: 'Improve naming' }
  ]

  it('returns all prompts when no search query or category is applied', () => {
    const result = filterPrompts(prompts, '', null)
    expect(result).toHaveLength(prompts.length)
  })

  it('filters prompts by search query across name, title, and description', () => {
    const result = filterPrompts(prompts, 'prune', null)
    expect(result).toEqual([
      { name: 'gardener_prune', title: 'Gardener Prune', description: 'Cleanup prompt', categories: ['Gardener'] }
    ])
  })

  it('filters prompts by selected category', () => {
    const result = filterPrompts(prompts, '', 'Analyst')
    expect(result).toEqual([
      { name: 'analyst_review', title: 'Analyst Review', description: 'Code review prompt', categories: ['Analyst'] }
    ])
  })

  it('applies both search and category filters together', () => {
    const result = filterPrompts(prompts, 'prompt', 'Gardener')
    expect(result).toEqual([
      { name: 'gardener_prune', title: 'Gardener Prune', description: 'Cleanup prompt', categories: ['Gardener'] }
    ])
  })

  it('treats missing categories as empty arrays when filtering', () => {
    const result = filterPrompts(prompts, '', 'Clarity')
    expect(result).toEqual([])
  })
})
