import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PromptCard from './index'

const samplePrompt = {
  name: 'test-prompt',
  title: 'Test Prompt',
  description: 'A test prompt description'
}

describe('PromptCard', () => {
  it('should display prompt information correctly', () => {
    render(
      <MemoryRouter>
        <PromptCard prompt={samplePrompt} />
      </MemoryRouter>
    )

    expect(screen.getByText('Test Prompt')).toBeInTheDocument()
    expect(screen.getByText('A test prompt description')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/prompt/test-prompt'
    )
  })
})
