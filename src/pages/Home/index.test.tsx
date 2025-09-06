import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Prompt } from '../../types/prompt'
import Home from './index'
import * as usePromptsModule from '../../hooks/usePrompts'

// Mock the usePrompts hook
vi.mock('../../hooks/usePrompts')

// Mock the child components to focus on integration
vi.mock('../../components/PromptCard', () => ({
  default: ({ prompt }: { prompt: Prompt }) => (
    <div data-testid={`prompt-card-${prompt.name}`}>
      <h3>{prompt.title}</h3>
      <p>{prompt.description}</p>
    </div>
  ),
}))

vi.mock('../../components/SearchBox', () => ({
  default: ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) => (
    <input
      data-testid="search-box"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}))

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('Home Page', () => {
  const mockPrompts: Prompt[] = [
    {
      name: 'clean-code',
      title: 'Clean Code Practices',
      description: 'Guidelines for writing maintainable code',
    },
    {
      name: 'tdd-cycle',
      title: 'TDD Red-Green-Refactor',
      description: 'Test-Driven Development methodology',
    },
    {
      name: 'refactoring',
      title: 'Safe Refactoring Techniques',
      description: 'Improve code structure without changing behavior',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading state initially', () => {
    const mockedUsePrompts = vi.mocked(usePromptsModule.usePrompts)
    mockedUsePrompts.mockReturnValue({
      prompts: [],
      loading: true,
      error: null,
    })

    renderWithRouter(<Home />)

    // Should show loading spinner
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should display error state when error occurs', () => {
    const mockedUsePrompts = vi.mocked(usePromptsModule.usePrompts)
    mockedUsePrompts.mockReturnValue({
      prompts: [],
      loading: false,
      error: 'Failed to load prompts',
    })

    renderWithRouter(<Home />)

    expect(screen.getByText(/error loading prompts/i)).toBeInTheDocument()
    expect(screen.getByText(/failed to load prompts/i)).toBeInTheDocument()
  })

  it('should display hero section and search box when loaded', () => {
    const mockedUsePrompts = vi.mocked(usePromptsModule.usePrompts)
    mockedUsePrompts.mockReturnValue({
      prompts: mockPrompts,
      loading: false,
      error: null,
    })

    renderWithRouter(<Home />)

    // Hero section
    expect(screen.getByText('Lean Prompt Garden')).toBeInTheDocument()
    expect(screen.getByText(/curated collection of software gardening prompts/i)).toBeInTheDocument()

    // Search box
    expect(screen.getByTestId('search-box')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search prompts by name/i)).toBeInTheDocument()
  })

  it('should display all prompts when no search query', () => {
    const mockedUsePrompts = vi.mocked(usePromptsModule.usePrompts)
    mockedUsePrompts.mockReturnValue({
      prompts: mockPrompts,
      loading: false,
      error: null,
    })

    renderWithRouter(<Home />)

    // Should show all prompts
    expect(screen.getByTestId('prompt-card-clean-code')).toBeInTheDocument()
    expect(screen.getByTestId('prompt-card-tdd-cycle')).toBeInTheDocument()
    expect(screen.getByTestId('prompt-card-refactoring')).toBeInTheDocument()

    // Should show correct count
    expect(screen.getByText('Found 3 of 3 prompts')).toBeInTheDocument()
  })

  it('should filter prompts based on search query', async () => {
    const mockedUsePrompts = vi.mocked(usePromptsModule.usePrompts)
    mockedUsePrompts.mockReturnValue({
      prompts: mockPrompts,
      loading: false,
      error: null,
    })

    renderWithRouter(<Home />)

    const searchInput = screen.getByTestId('search-box')

    // Search for "TDD"
    fireEvent.change(searchInput, { target: { value: 'TDD' } })

    await waitFor(() => {
      // Should only show TDD-related prompt
      expect(screen.getByTestId('prompt-card-tdd-cycle')).toBeInTheDocument()
      expect(screen.queryByTestId('prompt-card-clean-code')).not.toBeInTheDocument()
      expect(screen.queryByTestId('prompt-card-refactoring')).not.toBeInTheDocument()

      // Should show updated count
      expect(screen.getByText('Found 1 of 3 prompts')).toBeInTheDocument()
    })
  })

  it('should show empty state when no search results found', async () => {
    const mockedUsePrompts = vi.mocked(usePromptsModule.usePrompts)
    mockedUsePrompts.mockReturnValue({
      prompts: mockPrompts,
      loading: false,
      error: null,
    })

    renderWithRouter(<Home />)

    const searchInput = screen.getByTestId('search-box')

    // Search for something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

    await waitFor(() => {
      // Should show empty state
      expect(screen.getByText('No prompts found')).toBeInTheDocument()
      expect(screen.getByText(/try adjusting your search terms/i)).toBeInTheDocument()

      // Should show 0 count
      expect(screen.getByText('Found 0 of 3 prompts')).toBeInTheDocument()

      // Should not show any prompt cards
      expect(screen.queryByTestId('prompt-card-clean-code')).not.toBeInTheDocument()
    })
  })

  it('should search by title, description, and name', async () => {
    const mockedUsePrompts = vi.mocked(usePromptsModule.usePrompts)
    mockedUsePrompts.mockReturnValue({
      prompts: mockPrompts,
      loading: false,
      error: null,
    })

    renderWithRouter(<Home />)

    const searchInput = screen.getByTestId('search-box')

    // Test search by title
    fireEvent.change(searchInput, { target: { value: 'Clean Code' } })
    await waitFor(() => {
      expect(screen.getByTestId('prompt-card-clean-code')).toBeInTheDocument()
      expect(screen.getByText('Found 1 of 3 prompts')).toBeInTheDocument()
    })

    // Test search by description
    fireEvent.change(searchInput, { target: { value: 'methodology' } })
    await waitFor(() => {
      expect(screen.getByTestId('prompt-card-tdd-cycle')).toBeInTheDocument()
      expect(screen.getByText('Found 1 of 3 prompts')).toBeInTheDocument()
    })

    // Test search by name
    fireEvent.change(searchInput, { target: { value: 'refactoring' } })
    await waitFor(() => {
      expect(screen.getByTestId('prompt-card-refactoring')).toBeInTheDocument()
      expect(screen.getByText('Found 1 of 3 prompts')).toBeInTheDocument()
    })
  })
})
