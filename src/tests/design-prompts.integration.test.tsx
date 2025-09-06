import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePrompts } from '../hooks/usePrompts';
import { usePromptDetail } from '../hooks/usePromptDetail';

// Mock fetch for prompts.json
const mockPromptsData = {
  prompts: [
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
    }
  ],
  definitions: {
    'gardener_cohesion_analyzer': {
      name: 'gardener_cohesion_analyzer',
      title: 'Gardener · Cohesion Analyzer', 
      description: 'Identify components with mixed responsibilities and extract secondary concerns.',
      messages: [{ role: 'user', content: { type: 'text', text: 'Analyze {{module_or_class_path}} with max {{max_extractions}} extractions and {{max_diff_lines}} changed lines.' } }],
      arguments: [
        { name: 'module_or_class_path', description: 'Target module or class to analyze for cohesion issues', required: true },
        { name: 'max_extractions', description: 'Maximum number of extracted components allowed', required: true },
        { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
      ]
    },
    'gardener_coupling_reducer': {
      name: 'gardener_coupling_reducer',
      title: 'Gardener · Coupling Reducer',
      description: 'Reduce inter-module dependencies through interfaces and dependency injection.',
      messages: [{ role: 'user', content: { type: 'text', text: 'Reduce coupling for {{high_coupling_module}} with max {{max_interfaces}} interfaces and {{max_diff_lines}} changed lines.' } }],
      arguments: [
        { name: 'high_coupling_module', description: 'Target module with tight coupling to analyze and refactor', required: true },
        { name: 'max_interfaces', description: 'Maximum number of new interfaces to introduce', required: true },
        { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
      ]
    },
    'gardener_encapsulation_strengthener': {
      name: 'gardener_encapsulation_strengthener',
      title: 'Gardener · Encapsulation Strengthener',
      description: 'Hide internal details behind meaningful operations and behavior-focused interfaces.',
      messages: [{ role: 'user', content: { type: 'text', text: 'Strengthen encapsulation for {{component_path}} with max {{max_new_methods}} methods and {{max_diff_lines}} changed lines.' } }],
      arguments: [
        { name: 'component_path', description: 'Target component to strengthen encapsulation', required: true },
        { name: 'max_new_methods', description: 'Maximum number of new public methods to introduce', required: true },
        { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
      ]
    },
    'gardener_clarity_enhancer': {
      name: 'gardener_clarity_enhancer',
      title: 'Gardener · Clarity Enhancer',
      description: 'Make code self-explanatory through descriptive naming and predictable interfaces.',
      messages: [{ role: 'user', content: { type: 'text', text: 'Enhance clarity for {{module_or_package}} with max {{max_renames}} renames and {{max_diff_lines}} changed lines.' } }],
      arguments: [
        { name: 'module_or_package', description: 'Target module or package to enhance clarity', required: true },
        { name: 'max_renames', description: 'Maximum number of automated renames allowed', required: true },
        { name: 'max_diff_lines', description: 'Maximum number of changed lines allowed', required: true }
      ]
    },
    'gardener_design_principles_auditor': {
      name: 'gardener_design_principles_auditor',
      title: 'Gardener · Design Principles Auditor',
      description: 'Comprehensive design health check using cohesion, coupling, encapsulation, and clarity principles.',
      messages: [{ role: 'user', content: { type: 'text', text: 'Audit {{codebase_path}} focusing on {{focus_area}} with max {{max_priority_fixes}} priority fixes.' } }],
      arguments: [
        { name: 'codebase_path', description: 'Target codebase path to audit for design principles', required: true },
        { name: 'focus_area', description: 'Focus area for analysis: cohesion, coupling, hiding, clarity, or all', required: true },
        { name: 'max_priority_fixes', description: 'Maximum number of priority fixes to implement', required: true }
      ]
    }
  }
};

describe('Design Prompts Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('prompts.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPromptsData),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  describe('Design Prompts Data Loading', () => {
    it('should load all design prompts via usePrompts hook', async () => {
      const { result } = renderHook(() => usePrompts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const promptNames = result.current.prompts.map(p => p.name);
      expect(promptNames).toContain('gardener_cohesion_analyzer');
      expect(promptNames).toContain('gardener_coupling_reducer');
      expect(promptNames).toContain('gardener_encapsulation_strengthener');
      expect(promptNames).toContain('gardener_clarity_enhancer');
      expect(promptNames).toContain('gardener_design_principles_auditor');

      const promptTitles = result.current.prompts.map(p => p.title);
      expect(promptTitles).toContain('Gardener · Cohesion Analyzer');
      expect(promptTitles).toContain('Gardener · Coupling Reducer');
      expect(promptTitles).toContain('Gardener · Encapsulation Strengthener');
      expect(promptTitles).toContain('Gardener · Clarity Enhancer');
      expect(promptTitles).toContain('Gardener · Design Principles Auditor');

      expect(result.current.error).toBe(null);
    });

    it('should load cohesion analyzer prompt details with correct arguments', async () => {
      const { result } = renderHook(() => usePromptDetail('gardener_cohesion_analyzer'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBeDefined();
      expect(result.current.prompt?.name).toBe('gardener_cohesion_analyzer');
      expect(result.current.prompt?.title).toBe('Gardener · Cohesion Analyzer');
      expect(result.current.prompt?.description).toBe('Identify components with mixed responsibilities and extract secondary concerns.');
      
      const argumentNames = result.current.prompt?.arguments?.map(arg => arg.name) || [];
      expect(argumentNames).toContain('module_or_class_path');
      expect(argumentNames).toContain('max_extractions');
      expect(argumentNames).toContain('max_diff_lines');

      expect(result.current.error).toBe(null);
    });

    it('should load coupling reducer prompt details with correct arguments', async () => {
      const { result } = renderHook(() => usePromptDetail('gardener_coupling_reducer'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBeDefined();
      expect(result.current.prompt?.name).toBe('gardener_coupling_reducer');
      expect(result.current.prompt?.title).toBe('Gardener · Coupling Reducer');
      
      const argumentNames = result.current.prompt?.arguments?.map(arg => arg.name) || [];
      expect(argumentNames).toContain('high_coupling_module');
      expect(argumentNames).toContain('max_interfaces');
      expect(argumentNames).toContain('max_diff_lines');

      expect(result.current.error).toBe(null);
    });

    it('should load encapsulation strengthener prompt details with correct arguments', async () => {
      const { result } = renderHook(() => usePromptDetail('gardener_encapsulation_strengthener'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBeDefined();
      expect(result.current.prompt?.name).toBe('gardener_encapsulation_strengthener');
      expect(result.current.prompt?.title).toBe('Gardener · Encapsulation Strengthener');
      
      const argumentNames = result.current.prompt?.arguments?.map(arg => arg.name) || [];
      expect(argumentNames).toContain('component_path');
      expect(argumentNames).toContain('max_new_methods');
      expect(argumentNames).toContain('max_diff_lines');

      expect(result.current.error).toBe(null);
    });

    it('should load clarity enhancer prompt details with correct arguments', async () => {
      const { result } = renderHook(() => usePromptDetail('gardener_clarity_enhancer'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBeDefined();
      expect(result.current.prompt?.name).toBe('gardener_clarity_enhancer');
      expect(result.current.prompt?.title).toBe('Gardener · Clarity Enhancer');
      
      const argumentNames = result.current.prompt?.arguments?.map(arg => arg.name) || [];
      expect(argumentNames).toContain('module_or_package');
      expect(argumentNames).toContain('max_renames');
      expect(argumentNames).toContain('max_diff_lines');

      expect(result.current.error).toBe(null);
    });

    it('should load design principles auditor prompt details with correct arguments', async () => {
      const { result } = renderHook(() => usePromptDetail('gardener_design_principles_auditor'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBeDefined();
      expect(result.current.prompt?.name).toBe('gardener_design_principles_auditor');
      expect(result.current.prompt?.title).toBe('Gardener · Design Principles Auditor');
      
      const argumentNames = result.current.prompt?.arguments?.map(arg => arg.name) || [];
      expect(argumentNames).toContain('codebase_path');
      expect(argumentNames).toContain('focus_area');
      expect(argumentNames).toContain('max_priority_fixes');

      expect(result.current.error).toBe(null);
    });
  });
});