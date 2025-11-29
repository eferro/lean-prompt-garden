import type { Prompt } from '../types/prompt'

export function filterPrompts(prompts: Prompt[], searchQuery: string, selectedCategory: string | null): Prompt[] {
  const query = searchQuery.trim().toLowerCase()

  return prompts.filter((prompt) => {
    const matchesQuery =
      query.length === 0 ||
      prompt.name.toLowerCase().includes(query) ||
      prompt.title.toLowerCase().includes(query) ||
      prompt.description.toLowerCase().includes(query)

    const categories = prompt.categories ?? []
    const matchesCategory =
      selectedCategory === null ||
      categories.some((category) => category === selectedCategory)

    return matchesQuery && matchesCategory
  })
}
