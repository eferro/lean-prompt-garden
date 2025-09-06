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
    ],
    arguments: []
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
      messages: [],
      arguments: []
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

  it('should combine arguments from prompts section with definition data', async () => {
    const mockPromptDataWithArguments: PromptData = {
      prompts: [
        {
          name: 'test-prompt-with-args',
          title: 'Test Prompt With Args',
          description: 'A test prompt with arguments',
          arguments: [
            { name: 'arg1', description: 'First argument', required: true },
            { name: 'arg2', description: 'Second argument', required: false }
          ]
        }
      ],
      definitions: {
        'test-prompt-with-args': {
          name: 'test-prompt-with-args',
          title: 'Test Prompt With Args',
          description: 'A test prompt with arguments',
          messages: [{ role: 'user', content: { type: 'text', text: 'Test message with {{arg1}} and {{arg2}}' } }]
        }
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPromptDataWithArguments
    })

    const { result } = renderHook(() => usePromptDetail('test-prompt-with-args'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.prompt).toEqual({
      name: 'test-prompt-with-args',
      title: 'Test Prompt With Args', 
      description: 'A test prompt with arguments',
      messages: [{ role: 'user', content: { type: 'text', text: 'Test message with {{arg1}} and {{arg2}}' } }],
      arguments: [
        { name: 'arg1', description: 'First argument', required: true },
        { name: 'arg2', description: 'Second argument', required: false }
      ]
    })
    expect(result.current.error).toBe(null)
  })
})