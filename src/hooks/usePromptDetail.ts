import { useState, useEffect } from 'react'
import type { PromptDefinition, PromptData } from '../types/prompt'

interface UsePromptDetailResult {
  prompt: PromptDefinition | null
  loading: boolean
  error: string | null
}

export function usePromptDetail(name: string): UsePromptDetailResult {
  const [prompt, setPrompt] = useState<PromptDefinition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPromptDetail() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/prompts.json')
        if (!response.ok) {
          throw new Error(`Failed to load prompts: ${response.statusText}`)
        }
        
        const data: PromptData = await response.json()
        const promptDefinition = data.definitions[name]
        
        if (!promptDefinition) {
          throw new Error(`Prompt "${name}" not found`)
        }
        
        setPrompt(promptDefinition)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load prompt')
        console.error('Error loading prompt detail:', err)
      } finally {
        setLoading(false)
      }
    }

    if (name) {
      loadPromptDetail()
    }
  }, [name])

  return { prompt, loading, error }
}
