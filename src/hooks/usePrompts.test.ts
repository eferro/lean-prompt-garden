import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePrompts } from './usePrompts'
import type { PromptData } from '../types/prompt'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('usePrompts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return loading state initially', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ prompts: [] })
    })

    const { result } = renderHook(() => usePrompts())

    expect(result.current.loading).toBe(true)
    expect(result.current.prompts).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('should load prompts successfully', async () => {
    const mockData: PromptData = {
      prompts: [
        {
          name: 'test-prompt',
          title: 'Test Prompt',
          description: 'A test prompt'
        }
      ],
      definitions: {}
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() => usePrompts())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompts).toEqual(mockData.prompts)
    expect(result.current.error).toBe(null)
  })

  it('should handle fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => usePrompts())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompts).toEqual([])
    expect(result.current.error).toBe('Network error')
  })

  it('should handle HTTP error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    })

    const { result } = renderHook(() => usePrompts())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompts).toEqual([])
    expect(result.current.error).toBe('Failed to load prompts: Not Found')
  })

  it('should use correct path for production environment', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ prompts: [] })
    })

    renderHook(() => usePrompts())

    expect(mockFetch).toHaveBeenCalledWith('/lean-prompt-garden/prompts.json')

    process.env.NODE_ENV = originalEnv
  })

  it('should use correct path for development environment', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ prompts: [] })
    })

    renderHook(() => usePrompts())

    expect(mockFetch).toHaveBeenCalledWith('/prompts.json')

    process.env.NODE_ENV = originalEnv
  })
})