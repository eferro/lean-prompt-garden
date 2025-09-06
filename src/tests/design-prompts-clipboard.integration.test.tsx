import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PromptDetail from '../pages/PromptDetail';
import { usePromptDetail } from '../hooks/usePromptDetail';
import type { PromptDefinition } from '../types/prompt';

// Mock the hook
vi.mock('../hooks/usePromptDetail');

// Mock PromptRenderer to simplify the test
vi.mock('../components/PromptRenderer', () => ({
  default: ({ prompt, argumentValues }: { prompt: PromptDefinition; argumentValues: Record<string, string> }) => (
    <div data-testid="prompt-renderer">
      <p>Prompt: {prompt.title}</p>
      <p>Args: {JSON.stringify(argumentValues)}</p>
    </div>
  ),
}));

// Mock ArgumentsForm
vi.mock('../components/ArgumentsForm', () => ({
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
      {args.map((arg) => (
        <input
          key={arg.name}
          data-testid={`input-${arg.name}`}
          value={values[arg.name] || ''}
          onChange={(e) => onChange({ ...values, [arg.name]: e.target.value })}
          placeholder={arg.name}
        />
      ))}
    </div>
  ),
}));

const renderPromptDetail = (promptName: string) => {
  return render(
    <MemoryRouter initialEntries={[`/prompt/${promptName}`]}>
      <Routes>
        <Route path="/prompt/:name" element={<PromptDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Design Prompts Copy-to-Clipboard', () => {
  let mockWriteText: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock clipboard API
    mockWriteText = vi.fn(() => Promise.resolve());
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  it('should copy cohesion analyzer prompt with arguments to clipboard', async () => {
    const mockPrompt: PromptDefinition = {
      name: 'gardener_cohesion_analyzer',
      title: 'Gardener · Cohesion Analyzer',
      description: 'Identify components with mixed responsibilities and extract secondary concerns.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Analyze {{module_or_class_path}} with max {{max_extractions}} extractions and {{max_diff_lines}} changed lines.',
          },
        },
      ],
      arguments: [
        { name: 'module_or_class_path', description: 'Target module or class to analyze', required: true },
        { name: 'max_extractions', description: 'Maximum extractions allowed', required: true },
        { name: 'max_diff_lines', description: 'Maximum changed lines allowed', required: true }
      ],
    };

    const mockedUsePromptDetail = vi.mocked(usePromptDetail);
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    });

    renderPromptDetail('gardener_cohesion_analyzer');

    await waitFor(() => {
      expect(screen.getByText('Copy Prompt')).toBeInTheDocument();
    });

    // Fill in some arguments
    fireEvent.change(screen.getByTestId('input-module_or_class_path'), { target: { value: 'src/UserService.js' } });
    fireEvent.change(screen.getByTestId('input-max_extractions'), { target: { value: '3' } });

    // Click copy button
    const copyButton = screen.getByText('Copy Prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        'Analyze src/UserService.js with max 3 extractions and {{max_diff_lines}} changed lines.'
      );
    });

    // Should show "Copied!" temporarily
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    // Should revert back to "Copy Prompt" after timeout
    await waitFor(
      () => {
        expect(screen.getByText('Copy Prompt')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should copy coupling reducer prompt with all arguments filled', async () => {
    const mockPrompt: PromptDefinition = {
      name: 'gardener_coupling_reducer',
      title: 'Gardener · Coupling Reducer',
      description: 'Reduce inter-module dependencies through interfaces and dependency injection.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Reduce coupling for {{high_coupling_module}} with max {{max_interfaces}} interfaces and {{max_diff_lines}} changed lines.',
          },
        },
      ],
      arguments: [
        { name: 'high_coupling_module', description: 'Target module with tight coupling', required: true },
        { name: 'max_interfaces', description: 'Maximum interfaces to introduce', required: true },
        { name: 'max_diff_lines', description: 'Maximum changed lines allowed', required: true }
      ],
    };

    const mockedUsePromptDetail = vi.mocked(usePromptDetail);
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    });

    renderPromptDetail('gardener_coupling_reducer');

    await waitFor(() => {
      expect(screen.getByText('Copy Prompt')).toBeInTheDocument();
    });

    // Fill in all arguments
    fireEvent.change(screen.getByTestId('input-high_coupling_module'), { target: { value: 'src/PaymentService' } });
    fireEvent.change(screen.getByTestId('input-max_interfaces'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('input-max_diff_lines'), { target: { value: '50' } });

    // Click copy button
    const copyButton = screen.getByText('Copy Prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        'Reduce coupling for src/PaymentService with max 2 interfaces and 50 changed lines.'
      );
    });
  });

  it('should copy encapsulation strengthener prompt with placeholders for empty arguments', async () => {
    const mockPrompt: PromptDefinition = {
      name: 'gardener_encapsulation_strengthener',
      title: 'Gardener · Encapsulation Strengthener',
      description: 'Hide internal details behind meaningful operations and behavior-focused interfaces.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Strengthen encapsulation for {{component_path}} with max {{max_new_methods}} methods and {{max_diff_lines}} changed lines.',
          },
        },
      ],
      arguments: [
        { name: 'component_path', description: 'Target component to strengthen encapsulation', required: true },
        { name: 'max_new_methods', description: 'Maximum new public methods', required: true },
        { name: 'max_diff_lines', description: 'Maximum changed lines allowed', required: true }
      ],
    };

    const mockedUsePromptDetail = vi.mocked(usePromptDetail);
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    });

    renderPromptDetail('gardener_encapsulation_strengthener');

    await waitFor(() => {
      expect(screen.getByText('Copy Prompt')).toBeInTheDocument();
    });

    // Don't fill any arguments - should copy with placeholders
    const copyButton = screen.getByText('Copy Prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        'Strengthen encapsulation for {{component_path}} with max {{max_new_methods}} methods and {{max_diff_lines}} changed lines.'
      );
    });
  });

  it('should copy clarity enhancer prompt with mixed filled and empty arguments', async () => {
    const mockPrompt: PromptDefinition = {
      name: 'gardener_clarity_enhancer',
      title: 'Gardener · Clarity Enhancer',
      description: 'Make code self-explanatory through descriptive naming and predictable interfaces.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Enhance clarity for {{module_or_package}} with max {{max_renames}} renames and {{max_diff_lines}} changed lines.',
          },
        },
      ],
      arguments: [
        { name: 'module_or_package', description: 'Target module or package', required: true },
        { name: 'max_renames', description: 'Maximum automated renames allowed', required: true },
        { name: 'max_diff_lines', description: 'Maximum changed lines allowed', required: true }
      ],
    };

    const mockedUsePromptDetail = vi.mocked(usePromptDetail);
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    });

    renderPromptDetail('gardener_clarity_enhancer');

    await waitFor(() => {
      expect(screen.getByText('Copy Prompt')).toBeInTheDocument();
    });

    // Fill only some arguments
    fireEvent.change(screen.getByTestId('input-module_or_package'), { target: { value: 'src/utils' } });
    fireEvent.change(screen.getByTestId('input-max_renames'), { target: { value: '10' } });
    // Leave max_diff_lines empty

    const copyButton = screen.getByText('Copy Prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        'Enhance clarity for src/utils with max 10 renames and {{max_diff_lines}} changed lines.'
      );
    });
  });

  it('should copy design principles auditor prompt correctly', async () => {
    const mockPrompt: PromptDefinition = {
      name: 'gardener_design_principles_auditor',
      title: 'Gardener · Design Principles Auditor',
      description: 'Comprehensive design health check using cohesion, coupling, encapsulation, and clarity principles.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Audit {{codebase_path}} focusing on {{focus_area}} with max {{max_priority_fixes}} priority fixes.',
          },
        },
      ],
      arguments: [
        { name: 'codebase_path', description: 'Target codebase path to audit', required: true },
        { name: 'focus_area', description: 'Focus area for analysis', required: true },
        { name: 'max_priority_fixes', description: 'Maximum priority fixes to implement', required: true }
      ],
    };

    const mockedUsePromptDetail = vi.mocked(usePromptDetail);
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    });

    renderPromptDetail('gardener_design_principles_auditor');

    await waitFor(() => {
      expect(screen.getByText('Copy Prompt')).toBeInTheDocument();
    });

    // Fill all arguments
    fireEvent.change(screen.getByTestId('input-codebase_path'), { target: { value: './src' } });
    fireEvent.change(screen.getByTestId('input-focus_area'), { target: { value: 'coupling' } });
    fireEvent.change(screen.getByTestId('input-max_priority_fixes'), { target: { value: '5' } });

    const copyButton = screen.getByText('Copy Prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        'Audit ./src focusing on coupling with max 5 priority fixes.'
      );
    });
  });

  it('should handle clipboard write errors gracefully', async () => {
    const mockPrompt: PromptDefinition = {
      name: 'gardener_cohesion_analyzer',
      title: 'Gardener · Cohesion Analyzer',
      description: 'Test prompt',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Test prompt text',
          },
        },
      ],
      arguments: [],
    };

    const mockedUsePromptDetail = vi.mocked(usePromptDetail);
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    });

    // Mock clipboard to reject
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockWriteText.mockRejectedValueOnce(new Error('Clipboard not available'));

    renderPromptDetail('gardener_cohesion_analyzer');

    await waitFor(() => {
      expect(screen.getByText('Copy Prompt')).toBeInTheDocument();
    });

    const copyButton = screen.getByText('Copy Prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
    });

    // Button should remain as "Copy Prompt" since copy failed
    expect(screen.getByText('Copy Prompt')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});