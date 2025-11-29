import { useState, useEffect } from 'react'
import type { PromptDefinition } from '../types/prompt'
import { getPromptsUrl } from '../config'
import { validatePromptData } from '../utils/validation'

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
        
        const response = await fetch(getPromptsUrl())
        if (!response.ok) {
          throw new Error(`Failed to load prompts: ${response.statusText}`)
        }
        
        const rawData = await response.json()
        const data = validatePromptData(rawData)
        const promptDefinition = data.definitions[name]
        
        if (!promptDefinition) {
          throw new Error(`Prompt "${name}" not found`)
        }
        
        setPrompt(promptDefinition)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load prompt')
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
