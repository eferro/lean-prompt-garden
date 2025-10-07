import type { Prompt, PromptArgument } from '../types/prompt'

export function validatePrompt(prompt: Prompt): boolean {
  if (!prompt.name || !prompt.title || !prompt.description) {
    return false
  }
  
  if (prompt.arguments) {
    return prompt.arguments.every(validateArgument)
  }
  
  return true
}


export function validateArgument(argument: PromptArgument): boolean {
  return !!(argument.name && argument.description && typeof argument.required === 'boolean')
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

export function renderPromptTemplate(
  template: string,
  argumentValues: Record<string, string>
): string {
  return Object.keys(argumentValues).reduce((result, key) => {
    const value = argumentValues[key] || `{{${key}}}`
    return result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }, template)
}
