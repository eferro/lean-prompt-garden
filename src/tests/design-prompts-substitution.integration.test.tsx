import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PromptDetail from '../pages/PromptDetail';
import { usePromptDetail } from '../hooks/usePromptDetail';
import type { PromptDefinition } from '../types/prompt';

// Mock the hook
vi.mock('../hooks/usePromptDetail');

// Mock the PromptRenderer to capture rendered text
vi.mock('../components/PromptRenderer', () => ({
  default: ({ prompt, argumentValues }: { prompt: PromptDefinition; argumentValues: Record<string, string> }) => {
    // Simple argument substitution similar to what PromptRenderer does
    const text = prompt.messages[0]?.content?.text || '';
    const substitutedText = Object.keys(argumentValues).reduce((result, key) => {
      const value = argumentValues[key] || `{{${key}}}`;
      return result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }, text);
    
    return (
      <div data-testid="rendered-prompt">
        <pre>{substitutedText}</pre>
      </div>
    );
  },
}));

// Mock the ArgumentsForm to allow easy testing
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
          placeholder={arg.description}
        />
      ))}
    </div>
  ),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

const renderPromptDetail = (promptName: string) => {
  return render(
    <MemoryRouter initialEntries={[`/prompt/${promptName}`]}>
      <Routes>
        <Route path="/prompt/:name" element={<PromptDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Design Prompts Argument Substitution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should substitute arguments correctly for cohesion analyzer', async () => {
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
        { name: 'module_or_class_path', description: 'Target module or class to analyze for cohesion issues', required: true },
        { name: 'max_extractions', description: 'Maximum number of extracted components allowed', required: true },
        { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
      ],
    };

    const mockedUsePromptDetail = vi.mocked(usePromptDetail);
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    });

    renderPromptDetail('gardener_cohesion_analyzer');

    // Initially should show placeholders
    await waitFor(() => {
      expect(screen.getByTestId('rendered-prompt')).toBeInTheDocument();
    });

    let renderedText = screen.getByTestId('rendered-prompt').textContent;
    expect(renderedText).toContain('{{module_or_class_path}}');
    expect(renderedText).toContain('{{max_extractions}}');
    expect(renderedText).toContain('{{max_diff_lines}}');

    // Fill in arguments
    fireEvent.change(screen.getByTestId('input-module_or_class_path'), { target: { value: 'src/components/UserService' } });
    fireEvent.change(screen.getByTestId('input-max_extractions'), { target: { value: '3' } });
    fireEvent.change(screen.getByTestId('input-max_diff_lines'), { target: { value: '50' } });

    await waitFor(() => {
      const renderedTextAfter = screen.getByTestId('rendered-prompt').textContent;
      expect(renderedTextAfter).toContain('src/components/UserService');
      expect(renderedTextAfter).toContain('3');
      expect(renderedTextAfter).toContain('50');
      expect(renderedTextAfter).not.toContain('{{module_or_class_path}}');
      expect(renderedTextAfter).not.toContain('{{max_extractions}}');
      expect(renderedTextAfter).not.toContain('{{max_diff_lines}}');
    });
  });

  it('should substitute arguments correctly for coupling reducer', async () => {
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
        { name: 'high_coupling_module', description: 'Target module with tight coupling to analyze and refactor', required: true },
        { name: 'max_interfaces', description: 'Maximum number of new interfaces to introduce', required: true },
        { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
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
      expect(screen.getByTestId('rendered-prompt')).toBeInTheDocument();
    });

    // Fill in arguments
    fireEvent.change(screen.getByTestId('input-high_coupling_module'), { target: { value: 'src/services/PaymentProcessor' } });
    fireEvent.change(screen.getByTestId('input-max_interfaces'), { target: { value: '2' } });
    fireEvent.change(screen.getByTestId('input-max_diff_lines'), { target: { value: '30' } });

    await waitFor(() => {
      const renderedText = screen.getByTestId('rendered-prompt').textContent;
      expect(renderedText).toContain('src/services/PaymentProcessor');
      expect(renderedText).toContain('2');
      expect(renderedText).toContain('30');
      expect(renderedText).not.toContain('{{high_coupling_module}}');
      expect(renderedText).not.toContain('{{max_interfaces}}');
      expect(renderedText).not.toContain('{{max_diff_lines}}');
    });
  });

  it('should substitute arguments correctly for encapsulation strengthener', async () => {
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
        { name: 'max_new_methods', description: 'Maximum number of new public methods to introduce', required: true },
        { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
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
      expect(screen.getByTestId('rendered-prompt')).toBeInTheDocument();
    });

    // Fill in arguments
    fireEvent.change(screen.getByTestId('input-component_path'), { target: { value: 'src/models/User' } });
    fireEvent.change(screen.getByTestId('input-max_new_methods'), { target: { value: '4' } });
    fireEvent.change(screen.getByTestId('input-max_diff_lines'), { target: { value: '40' } });

    await waitFor(() => {
      const renderedText = screen.getByTestId('rendered-prompt').textContent;
      expect(renderedText).toContain('src/models/User');
      expect(renderedText).toContain('4');
      expect(renderedText).toContain('40');
      expect(renderedText).not.toContain('{{component_path}}');
      expect(renderedText).not.toContain('{{max_new_methods}}');
      expect(renderedText).not.toContain('{{max_diff_lines}}');
    });
  });

  it('should substitute arguments correctly for clarity enhancer', async () => {
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
        { name: 'module_or_package', description: 'Target module or package to enhance clarity', required: true },
        { name: 'max_renames', description: 'Maximum number of automated renames allowed', required: true },
        { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
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
      expect(screen.getByTestId('rendered-prompt')).toBeInTheDocument();
    });

    // Fill in arguments
    fireEvent.change(screen.getByTestId('input-module_or_package'), { target: { value: 'src/utils' } });
    fireEvent.change(screen.getByTestId('input-max_renames'), { target: { value: '10' } });
    fireEvent.change(screen.getByTestId('input-max_diff_lines'), { target: { value: '80' } });

    await waitFor(() => {
      const renderedText = screen.getByTestId('rendered-prompt').textContent;
      expect(renderedText).toContain('src/utils');
      expect(renderedText).toContain('10');
      expect(renderedText).toContain('80');
      expect(renderedText).not.toContain('{{module_or_package}}');
      expect(renderedText).not.toContain('{{max_renames}}');
      expect(renderedText).not.toContain('{{max_diff_lines}}');
    });
  });

  it('should substitute arguments correctly for design principles auditor', async () => {
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
        { name: 'codebase_path', description: 'Target codebase path to audit for design principles', required: true },
        { name: 'focus_area', description: 'Focus area for analysis: cohesion, coupling, hiding, clarity, or all', required: true },
        { name: 'max_priority_fixes', description: 'Maximum number of priority fixes to implement', required: true }
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
      expect(screen.getByTestId('rendered-prompt')).toBeInTheDocument();
    });

    // Fill in arguments
    fireEvent.change(screen.getByTestId('input-codebase_path'), { target: { value: './src' } });
    fireEvent.change(screen.getByTestId('input-focus_area'), { target: { value: 'all' } });
    fireEvent.change(screen.getByTestId('input-max_priority_fixes'), { target: { value: '5' } });

    await waitFor(() => {
      const renderedText = screen.getByTestId('rendered-prompt').textContent;
      expect(renderedText).toContain('./src');
      expect(renderedText).toContain('all');
      expect(renderedText).toContain('5');
      expect(renderedText).not.toContain('{{codebase_path}}');
      expect(renderedText).not.toContain('{{focus_area}}');
      expect(renderedText).not.toContain('{{max_priority_fixes}}');
    });
  });
});