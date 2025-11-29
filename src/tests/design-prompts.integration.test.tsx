import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePrompts } from '../hooks/usePrompts';
import { usePromptDetail } from '../hooks/usePromptDetail';

// Mock fetch for prompts.json
const mockPromptsData = {
  prompts: [
    {
      name: 'gardener_refactor',
      title: 'Gardener · Refactor',
      description: 'Small, safe, behavior-preserving micro-refactors.'
    },
    {
      name: 'analyst_review',
      title: 'Analyst · Code Review',
      description: 'XP-style review of pending changes.'
    },
    {
      name: 'planner_mikado',
      title: 'Planner · Mikado Method',
      description: 'Break complex changes into safe, incremental steps.'
    }
  ],
  definitions: {
    'gardener_refactor': {
      name: 'gardener_refactor',
      title: 'Gardener · Refactor', 
      description: 'Small, safe, behavior-preserving micro-refactors.',
      messages: [{ role: 'user', content: { type: 'text', text: 'Identify refactoring opportunities.' } }]
    },
    'analyst_review': {
      name: 'analyst_review',
      title: 'Analyst · Code Review',
      description: 'XP-style review of pending changes.',
      messages: [{ role: 'user', content: { type: 'text', text: 'Review the pending changes.' } }]
    },
    'planner_mikado': {
      name: 'planner_mikado',
      title: 'Planner · Mikado Method',
      description: 'Break complex changes into safe, incremental steps.',
      messages: [{ role: 'user', content: { type: 'text', text: 'Apply Mikado method.' } }]
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
    it('should load all prompts via usePrompts hook', async () => {
      const { result } = renderHook(() => usePrompts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const promptNames = result.current.prompts.map(p => p.name);
      expect(promptNames).toContain('gardener_refactor');
      expect(promptNames).toContain('analyst_review');
      expect(promptNames).toContain('planner_mikado');

      expect(result.current.error).toBe(null);
    });

    it('should load gardener refactor prompt details', async () => {
      const { result } = renderHook(() => usePromptDetail('gardener_refactor'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBeDefined();
      expect(result.current.prompt?.name).toBe('gardener_refactor');
      expect(result.current.prompt?.title).toBe('Gardener · Refactor');
      expect(result.current.error).toBe(null);
    });

    it('should load analyst review prompt details', async () => {
      const { result } = renderHook(() => usePromptDetail('analyst_review'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBeDefined();
      expect(result.current.prompt?.name).toBe('analyst_review');
      expect(result.current.prompt?.title).toBe('Analyst · Code Review');
      expect(result.current.error).toBe(null);
    });

    it('should load planner mikado prompt details', async () => {
      const { result } = renderHook(() => usePromptDetail('planner_mikado'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBeDefined();
      expect(result.current.prompt?.name).toBe('planner_mikado');
      expect(result.current.prompt?.title).toBe('Planner · Mikado Method');
      expect(result.current.error).toBe(null);
    });

    it('should return error for non-existent prompt', async () => {
      const { result } = renderHook(() => usePromptDetail('non_existent'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt).toBe(null);
      expect(result.current.error).toBe('Prompt "non_existent" not found');
    });

    it('should have correct message content in prompt definitions', async () => {
      const { result } = renderHook(() => usePromptDetail('gardener_refactor'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.prompt?.messages).toHaveLength(1);
      expect(result.current.prompt?.messages[0].role).toBe('user');
      expect(result.current.prompt?.messages[0].content.text).toBe('Identify refactoring opportunities.');
    });
  });
});
