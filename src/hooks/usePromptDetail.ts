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
        
        const basePath = process.env.NODE_ENV === 'production' ? '/lean-prompt-garden/' : '/'
        const response = await fetch(basePath + 'prompts.json')
        if (!response.ok) {
          throw new Error(`Failed to load prompts: ${response.statusText}`)
        }
        
        const data: PromptData = await response.json()
        const promptDefinition = data.definitions[name]
        const promptInfo = data.prompts.find(p => p.name === name)
        
        if (!promptDefinition) {
          throw new Error(`Prompt "${name}" not found`)
        }
        
        // Combine arguments from prompts section with messages from definitions section
        const combinedPrompt: PromptDefinition = {
          ...promptDefinition,
          arguments: promptInfo?.arguments || []
        }
        
        setPrompt(combinedPrompt)
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
