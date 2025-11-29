import { useState, useEffect } from 'react'
import type { Prompt, PromptData } from '../types/prompt'

interface UsePromptsResult {
  prompts: Prompt[]
  loading: boolean
  error: string | null
}

export function usePrompts(): UsePromptsResult {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPrompts() {
      try {
        setLoading(true)
        setError(null)
        
        const basePath = process.env.NODE_ENV === 'production' ? '/lean-prompt-garden/' : '/'
        const response = await fetch(basePath + 'prompts.json')
        if (!response.ok) {
          throw new Error(`Failed to load prompts: ${response.statusText}`)
        }
        
        const data: PromptData = await response.json()
        setPrompts(data.prompts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load prompts')
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [])

  return { prompts, loading, error }
}
