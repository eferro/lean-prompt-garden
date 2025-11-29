import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PromptDefinition } from '../../types/prompt'
import PromptDetail from './index'
import * as usePromptDetailModule from '../../hooks/usePromptDetail'

// Mock the hooks and components
vi.mock('../../hooks/usePromptDetail')
vi.mock('../../components/PromptRenderer', () => ({
  default: ({ prompt }: { prompt: PromptDefinition }) => (
    <div data-testid="prompt-renderer">
      <h3>Prompt: {prompt.title}</h3>
    </div>
  ),
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
})

// Helper to render with router and route params
const renderWithRouter = (promptName: string) => {
  return render(
    <MemoryRouter initialEntries={[`/prompt/${promptName}`]}>
      <Routes>
        <Route path="/prompt/:name" element={<PromptDetail />} />
        <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

// Helper to render with specific initial path (for edge cases)
const renderWithPath = (path: string) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/prompt/:name" element={<PromptDetail />} />
        <Route path="/prompt" element={<PromptDetail />} />
        <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PromptDetail Page', () => {
  const mockPrompt: PromptDefinition = {
    name: 'clean-code',
    title: 'Clean Code Practices',
    description: 'Guidelines for writing maintainable code',
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: 'Apply clean code principles',
        },
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading state initially', () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: null,
      loading: true,
      error: null,
    })

    renderWithRouter('clean-code')

    // Should show loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should display error state when error occurs', () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: null,
      loading: false,
      error: 'Failed to load prompt',
    })

    renderWithRouter('clean-code')

    expect(screen.getByText(/error:/i)).toBeInTheDocument()
    expect(screen.getByText(/failed to load prompt/i)).toBeInTheDocument()
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('should display prompt not found when prompt is null', () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: null,
      loading: false,
      error: null,
    })

    renderWithRouter('non-existent')

    expect(screen.getByText(/prompt not found/i)).toBeInTheDocument()
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('should display prompt details when loaded', () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    })

    renderWithRouter('clean-code')

    // Should show prompt info
    expect(screen.getByText('Clean Code Practices')).toBeInTheDocument()
    expect(screen.getByText('Guidelines for writing maintainable code')).toBeInTheDocument()
    expect(screen.getByText('clean-code')).toBeInTheDocument()

    // Should show navigation
    expect(screen.getByText('Back to prompts')).toBeInTheDocument()
    expect(screen.getByText('Copy Prompt')).toBeInTheDocument()
  })

  it('should render prompt content with PromptRenderer', () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    })

    renderWithRouter('clean-code')

    // Should show prompt renderer
    expect(screen.getByTestId('prompt-renderer')).toBeInTheDocument()
    expect(screen.getByText('Prompt: Clean Code Practices')).toBeInTheDocument()
  })

  it('should copy prompt to clipboard when copy button is clicked', async () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    })

    renderWithRouter('clean-code')

    const copyButton = screen.getByText('Copy Prompt')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Apply clean code principles'
      )
      expect(screen.getByText('Copied!')).toBeInTheDocument()
    })

    // Should revert back to "Copy Prompt" after timeout
    await waitFor(
      () => {
        expect(screen.getByText('Copy Prompt')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('should use correct prompt name from URL params', () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    })

    renderWithRouter('test-prompt')

    // Should call usePromptDetail with the prompt name from URL
    expect(mockedUsePromptDetail).toHaveBeenCalledWith('test-prompt')
  })

  describe('Route Parameter Guard', () => {
    it('should redirect to home when name param is undefined', () => {
      renderWithPath('/prompt')

      // Should redirect to home page
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })

    it('should redirect to home when name param is empty string', () => {
      // Empty name in URL path
      renderWithPath('/prompt/')

      // Should redirect to home page  
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  describe('Clipboard Feedback', () => {
    it('should show error state when clipboard API fails', async () => {
      const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
      mockedUsePromptDetail.mockReturnValue({
        prompt: mockPrompt,
        loading: false,
        error: null,
      })

      // Silence console.error for this test (expected error logging)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock clipboard to reject
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('Clipboard failed'))

      renderWithRouter('clean-code')

      const copyButton = screen.getByText('Copy Prompt')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText('Copy failed')).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })

    it('should clear error state after timeout', async () => {
      const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
      mockedUsePromptDetail.mockReturnValue({
        prompt: mockPrompt,
        loading: false,
        error: null,
      })

      // Silence console.error for this test (expected error logging)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock clipboard to reject
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('Clipboard failed'))

      renderWithRouter('clean-code')

      const copyButton = screen.getByText('Copy Prompt')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText('Copy failed')).toBeInTheDocument()
      })

      // Error should clear after timeout
      await waitFor(
        () => {
          expect(screen.getByText('Copy Prompt')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Empty Messages Guard', () => {
    it('should show warning when prompt has empty messages array', async () => {
      const emptyMessagesPrompt: PromptDefinition = {
        name: 'empty-prompt',
        title: 'Empty Prompt',
        description: 'A prompt with no messages',
        messages: [],
      }

      const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
      mockedUsePromptDetail.mockReturnValue({
        prompt: emptyMessagesPrompt,
        loading: false,
        error: null,
      })

      renderWithRouter('empty-prompt')

      const copyButton = screen.getByText('Copy Prompt')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText('Nothing to copy')).toBeInTheDocument()
      })
    })

    it('should show warning when first message has no text content', async () => {
      const resourceOnlyPrompt: PromptDefinition = {
        name: 'resource-prompt',
        title: 'Resource Prompt',
        description: 'A prompt with resource content only',
        messages: [
          {
            role: 'user',
            content: {
              type: 'resource',
              resource: {
                uri: 'file://example.txt',
                name: 'example.txt',
                mimeType: 'text/plain',
              },
            },
          },
        ],
      }

      const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
      mockedUsePromptDetail.mockReturnValue({
        prompt: resourceOnlyPrompt,
        loading: false,
        error: null,
      })

      renderWithRouter('resource-prompt')

      const copyButton = screen.getByText('Copy Prompt')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByText('Nothing to copy')).toBeInTheDocument()
      })
    })
  })
})
