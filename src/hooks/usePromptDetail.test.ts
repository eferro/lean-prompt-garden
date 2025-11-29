import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePromptDetail } from './usePromptDetail'
import type { PromptData, PromptDefinition } from '../types/prompt'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('usePromptDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const mockPromptDefinition: PromptDefinition = {
    name: 'test-prompt',
    title: 'Test Prompt',
    description: 'A test prompt',
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: 'Hello world'
        }
      }
    ]
  }

  const mockData: PromptData = {
    prompts: [],
    definitions: {
      'test-prompt': mockPromptDefinition
    }
  }

  it('should return loading state initially', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() => usePromptDetail('test-prompt'))

    expect(result.current.loading).toBe(true)
    expect(result.current.prompt).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should load prompt detail successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() => usePromptDetail('test-prompt'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompt).toEqual(mockPromptDefinition)
    expect(result.current.error).toBe(null)
  })

  it('should handle prompt not found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() => usePromptDetail('non-existent-prompt'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompt).toBe(null)
    expect(result.current.error).toBe('Prompt "non-existent-prompt" not found')
  })

  it('should handle fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => usePromptDetail('test-prompt'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompt).toBe(null)
    expect(result.current.error).toBe('Network error')
  })

  it('should handle HTTP error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    })

    const { result } = renderHook(() => usePromptDetail('test-prompt'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompt).toBe(null)
    expect(result.current.error).toBe('Failed to load prompts: Not Found')
  })

  it('should not load when name is empty', () => {
    const { result } = renderHook(() => usePromptDetail(''))

    expect(result.current.loading).toBe(true)
    expect(result.current.prompt).toBe(null)
    expect(result.current.error).toBe(null)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should reload when name changes', async () => {
    const anotherPromptDefinition: PromptDefinition = {
      name: 'another-prompt',
      title: 'Another Prompt',
      description: 'Another test prompt',
      messages: []
    }

    const updatedMockData: PromptData = {
      prompts: [],
      definitions: {
        'test-prompt': mockPromptDefinition,
        'another-prompt': anotherPromptDefinition
      }
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => updatedMockData
    })

    const { result, rerender } = renderHook(
      ({ name }) => usePromptDetail(name),
      { initialProps: { name: 'test-prompt' } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompt).toEqual(mockPromptDefinition)

    rerender({ name: 'another-prompt' })

    await waitFor(() => {
      expect(result.current.prompt).toEqual(anotherPromptDefinition)
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})
