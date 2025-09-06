import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PromptDefinition } from '../../types/prompt'
import PromptDetail from './index'
import * as usePromptDetailModule from '../../hooks/usePromptDetail'

// Mock the hooks and components
vi.mock('../../hooks/usePromptDetail')
vi.mock('../../components/PromptRenderer', () => ({
  default: ({ prompt, argumentValues }: { prompt: PromptDefinition; argumentValues: Record<string, string> }) => (
    <div data-testid="prompt-renderer">
      <h3>Prompt: {prompt.title}</h3>
      <p>Arguments: {JSON.stringify(argumentValues)}</p>
    </div>
  ),
}))
vi.mock('../../components/ArgumentsForm', () => ({
  default: ({ 
    arguments: args, 
    values, 
    onChange 
  }: { 
    arguments: any[]; 
    values: Record<string, string>; 
    onChange: (values: Record<string, string>) => void; 
  }) => (
    <div data-testid="arguments-form">
      <h4>Arguments Form</h4>
      {args.map((arg) => (
        <input
          key={arg.name}
          data-testid={`arg-${arg.name}`}
          value={values[arg.name] || ''}
          onChange={(e) => onChange({ ...values, [arg.name]: e.target.value })}
          placeholder={arg.name}
        />
      ))}
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
          text: 'Apply clean code principles to {{code_snippet}}',
        },
      },
    ],
    arguments: [
      {
        name: 'code_snippet',
        description: 'The code to improve',
        required: true,
      },
      {
        name: 'language',
        description: 'Programming language',
        required: false,
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
    expect(screen.getByText('2 arguments')).toBeInTheDocument()

    // Should show navigation
    expect(screen.getByText('Back to prompts')).toBeInTheDocument()
    expect(screen.getByText('Copy Prompt')).toBeInTheDocument()
  })

  it('should render arguments form when prompt has arguments', () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    })

    renderWithRouter('clean-code')

    // Should show arguments form
    expect(screen.getByTestId('arguments-form')).toBeInTheDocument()
    expect(screen.getByTestId('arg-code_snippet')).toBeInTheDocument()
    expect(screen.getByTestId('arg-language')).toBeInTheDocument()
  })

  it('should not render arguments form when prompt has no arguments', () => {
    const promptWithoutArgs = { ...mockPrompt, arguments: [] }
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: promptWithoutArgs,
      loading: false,
      error: null,
    })

    renderWithRouter('clean-code')

    // Should not show arguments form
    expect(screen.queryByTestId('arguments-form')).not.toBeInTheDocument()
    expect(screen.getByText('0 arguments')).toBeInTheDocument()
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

  it('should handle argument value changes and pass to PromptRenderer', async () => {
    const mockedUsePromptDetail = vi.mocked(usePromptDetailModule.usePromptDetail)
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    })

    renderWithRouter('clean-code')

    // Change argument value
    const codeSnippetInput = screen.getByTestId('arg-code_snippet')
    fireEvent.change(codeSnippetInput, { target: { value: 'console.log("test")' } })

    await waitFor(() => {
      // Should update the input value
      expect(screen.getByTestId('arg-code_snippet')).toHaveValue('console.log("test")')
      
      // Should pass updated arguments to PromptRenderer (JSON.stringify is in the output)
      expect(screen.getByText(/code_snippet/)).toBeInTheDocument()
    })
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
        'Apply clean code principles to {{code_snippet}}'
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
})
