import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Home from '../pages/Home';
import { usePrompts } from '../hooks/usePrompts';

// Mock the usePrompts hook
vi.mock('../hooks/usePrompts');

// Mock PromptCard component to simplify testing
vi.mock('../components/PromptCard', () => ({
  default: ({ prompt }: { prompt: any }) => (
    <div data-testid={`prompt-card-${prompt.name}`}>
      <h3>{prompt.title}</h3>
      <p>{prompt.description}</p>
      <span data-testid="prompt-name">{prompt.name}</span>
    </div>
  ),
}));

const mockDesignPrompts = [
  {
    name: 'gardener_cohesion_analyzer',
    title: 'Gardener · Cohesion Analyzer',
    description: 'Identify components with mixed responsibilities and extract secondary concerns.',
    arguments: [
      { name: 'module_or_class_path', description: 'Target module or class to analyze for cohesion issues', required: true },
      { name: 'max_extractions', description: 'Maximum number of extracted components allowed', required: true },
      { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
    ]
  },
  {
    name: 'gardener_coupling_reducer',
    title: 'Gardener · Coupling Reducer',
    description: 'Reduce inter-module dependencies through interfaces and dependency injection.',
    arguments: [
      { name: 'high_coupling_module', description: 'Target module with tight coupling to analyze and refactor', required: true },
      { name: 'max_interfaces', description: 'Maximum number of new interfaces to introduce', required: true },
      { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
    ]
  },
  {
    name: 'gardener_encapsulation_strengthener',
    title: 'Gardener · Encapsulation Strengthener',
    description: 'Hide internal details behind meaningful operations and behavior-focused interfaces.',
    arguments: [
      { name: 'component_path', description: 'Target component to strengthen encapsulation', required: true },
      { name: 'max_new_methods', description: 'Maximum number of new public methods to introduce', required: true },
      { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
    ]
  },
  {
    name: 'gardener_clarity_enhancer',
    title: 'Gardener · Clarity Enhancer',
    description: 'Make code self-explanatory through descriptive naming and predictable interfaces.',
    arguments: [
      { name: 'module_or_package', description: 'Target module or package to enhance clarity', required: true },
      { name: 'max_renames', description: 'Maximum number of automated renames allowed', required: true },
      { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
    ]
  },
  {
    name: 'gardener_design_principles_auditor',
    title: 'Gardener · Design Principles Auditor',
    description: 'Comprehensive design health check using cohesion, coupling, encapsulation, and clarity principles.',
    arguments: [
      { name: 'codebase_path', description: 'Target codebase path to audit for design principles', required: true },
      { name: 'focus_area', description: 'Focus area for analysis: cohesion, coupling, hiding, clarity, or all', required: true },
      { name: 'max_priority_fixes', description: 'Maximum number of priority fixes to implement', required: true }
    ]
  },
  // Add some non-design prompts to test filtering
  {
    name: 'gardener_scout_rule_refactorer',
    title: 'Gardener · Scout-Rule Refactorer',
    description: 'Behavior-preserving micro-refactors in tiny reversible steps.',
    arguments: []
  },
  {
    name: 'gardener_test_suite_gardener',
    title: 'Gardener · Test Gardener',
    description: 'Strengthen tests first; kill flakiness/slow tests; introduce seams safely.',
    arguments: []
  }
];

const renderHome = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
};

describe('Design Prompts Search Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock clipboard API for the API URL copy functionality
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
  });

  it('should find cohesion analyzer by searching for "cohesion"', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // Initially all prompts should be visible
    expect(screen.getByTestId('prompt-card-gardener_cohesion_analyzer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_coupling_reducer')).toBeInTheDocument();

    // Search for "cohesion"
    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    fireEvent.change(searchInput, { target: { value: 'cohesion' } });

    await waitFor(() => {
      expect(screen.getByText('Found 2 of 7 prompts')).toBeInTheDocument();
    });

    // Should find cohesion analyzer (title match) and design principles auditor (description match)
    expect(screen.getByTestId('prompt-card-gardener_cohesion_analyzer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_design_principles_auditor')).toBeInTheDocument();

    // Other design prompts should not be visible
    expect(screen.queryByTestId('prompt-card-gardener_coupling_reducer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prompt-card-gardener_encapsulation_strengthener')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prompt-card-gardener_clarity_enhancer')).not.toBeInTheDocument();
  });

  it('should find coupling reducer by searching for "coupling"', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // Search for "coupling"
    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    fireEvent.change(searchInput, { target: { value: 'coupling' } });

    await waitFor(() => {
      expect(screen.getByText('Found 2 of 7 prompts')).toBeInTheDocument();
    });

    // Should find coupling reducer (title match) and design principles auditor (description match)
    expect(screen.getByTestId('prompt-card-gardener_coupling_reducer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_design_principles_auditor')).toBeInTheDocument();

    // Other prompts should not be visible
    expect(screen.queryByTestId('prompt-card-gardener_cohesion_analyzer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prompt-card-gardener_encapsulation_strengthener')).not.toBeInTheDocument();
  });

  it('should find encapsulation strengthener by searching for "encapsulation"', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // Search for "encapsulation"
    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    fireEvent.change(searchInput, { target: { value: 'encapsulation' } });

    await waitFor(() => {
      expect(screen.getByText('Found 2 of 7 prompts')).toBeInTheDocument();
    });

    // Should find encapsulation strengthener (title match) and design principles auditor (description match)
    expect(screen.getByTestId('prompt-card-gardener_encapsulation_strengthener')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_design_principles_auditor')).toBeInTheDocument();
  });

  it('should find clarity enhancer by searching for "clarity"', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // Search for "clarity"
    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    fireEvent.change(searchInput, { target: { value: 'clarity' } });

    await waitFor(() => {
      expect(screen.getByText('Found 2 of 7 prompts')).toBeInTheDocument();
    });

    // Should find clarity enhancer (title match) and design principles auditor (description match)
    expect(screen.getByTestId('prompt-card-gardener_clarity_enhancer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_design_principles_auditor')).toBeInTheDocument();
  });

  it('should find design principles auditor by searching for "design principles"', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // Search for "design principles"
    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    fireEvent.change(searchInput, { target: { value: 'design principles' } });

    await waitFor(() => {
      expect(screen.getByText('Found 1 of 7 prompts')).toBeInTheDocument();
    });

    // Should find only the design principles auditor
    expect(screen.getByTestId('prompt-card-gardener_design_principles_auditor')).toBeInTheDocument();

    // No other prompts should be visible
    expect(screen.queryByTestId('prompt-card-gardener_cohesion_analyzer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prompt-card-gardener_coupling_reducer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prompt-card-gardener_encapsulation_strengthener')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prompt-card-gardener_clarity_enhancer')).not.toBeInTheDocument();
  });

  it('should find multiple design prompts by searching for "interfaces"', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // Search for "interfaces" (appears in coupling and encapsulation descriptions and clarity description)
    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    fireEvent.change(searchInput, { target: { value: 'interfaces' } });

    await waitFor(() => {
      expect(screen.getByText('Found 3 of 7 prompts')).toBeInTheDocument();
    });

    // Should find coupling reducer, encapsulation strengthener, and clarity enhancer
    expect(screen.getByTestId('prompt-card-gardener_coupling_reducer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_encapsulation_strengthener')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_clarity_enhancer')).toBeInTheDocument();
  });

  it('should be case insensitive when searching', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // Search for "COHESION" in uppercase
    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    fireEvent.change(searchInput, { target: { value: 'COHESION' } });

    await waitFor(() => {
      expect(screen.getByText('Found 2 of 7 prompts')).toBeInTheDocument();
    });

    // Should still find cohesion-related prompts
    expect(screen.getByTestId('prompt-card-gardener_cohesion_analyzer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_design_principles_auditor')).toBeInTheDocument();
  });

  it('should show empty state when no design prompts match search', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent_pattern' } });

    await waitFor(() => {
      expect(screen.getByText('Found 0 of 7 prompts')).toBeInTheDocument();
    });

    // Should show empty state
    expect(screen.getByText('No prompts found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or browse all prompts.')).toBeInTheDocument();

    // No prompt cards should be visible
    expect(screen.queryByTestId('prompt-card-gardener_cohesion_analyzer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prompt-card-gardener_coupling_reducer')).not.toBeInTheDocument();
  });

  it('should clear search results when search is cleared', async () => {
    const mockedUsePrompts = vi.mocked(usePrompts);
    mockedUsePrompts.mockReturnValue({
      prompts: mockDesignPrompts,
      loading: false,
      error: null,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search prompts by name, title, or description...');
    
    // Search for something specific
    fireEvent.change(searchInput, { target: { value: 'cohesion' } });

    await waitFor(() => {
      expect(screen.getByText('Found 2 of 7 prompts')).toBeInTheDocument();
    });

    // Clear the search
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('Found 7 of 7 prompts')).toBeInTheDocument();
    });

    // All prompts should be visible again
    expect(screen.getByTestId('prompt-card-gardener_cohesion_analyzer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_coupling_reducer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_encapsulation_strengthener')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_clarity_enhancer')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-gardener_design_principles_auditor')).toBeInTheDocument();
  });
});