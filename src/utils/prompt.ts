import type { Prompt } from '../types/prompt'

export function validatePrompt(prompt: Prompt): boolean {
  return !!(prompt.name && prompt.title && prompt.description)
}

export function filterPrompts(prompts: Prompt[], searchTerm: string): Prompt[] {
  if (!searchTerm.trim()) {
    return prompts
  }
  
  const lowercaseSearch = searchTerm.toLowerCase()
  
  return prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(lowercaseSearch) ||
    prompt.description.toLowerCase().includes(lowercaseSearch) ||
    prompt.name.toLowerCase().includes(lowercaseSearch)
  )
}

export function sortPrompts(prompts: Prompt[], sortBy: 'name' | 'title' = 'title'): Prompt[] {
  return [...prompts].sort((a, b) => {
    const aValue = a[sortBy].toLowerCase()
    const bValue = b[sortBy].toLowerCase()
    return aValue.localeCompare(bValue)
  })
}
