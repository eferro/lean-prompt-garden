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
  default: ({ prompt }: { prompt: PromptDefinition }) => (
    <div data-testid="prompt-renderer">
      <p>Prompt: {prompt.title}</p>
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
  let mockWriteText: ReturnType<typeof vi.fn>;

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

  it('should copy prompt text to clipboard', async () => {
    const mockPrompt: PromptDefinition = {
      name: 'analyst_review',
      title: 'Analyst · Code Review',
      description: 'XP-style review of pending changes.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Review the pending changes for quality and maintainability.',
          },
        },
      ],
    };

    const mockedUsePromptDetail = vi.mocked(usePromptDetail);
    mockedUsePromptDetail.mockReturnValue({
      prompt: mockPrompt,
      loading: false,
      error: null,
    });

    renderPromptDetail('analyst_review');

    await waitFor(() => {
      expect(screen.getByText('Copy Prompt')).toBeInTheDocument();
    });

    // Click copy button
    const copyButton = screen.getByText('Copy Prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        'Review the pending changes for quality and maintainability.'
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

  it('should handle clipboard write errors gracefully', async () => {
    const mockPrompt: PromptDefinition = {
      name: 'gardener_refactor',
      title: 'Gardener · Refactor',
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

    renderPromptDetail('gardener_refactor');

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
