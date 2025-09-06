import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PromptCard from './index'

const samplePrompt = {
  name: 'test-prompt',
  title: 'Test Prompt',
  description: 'A test prompt description',
  arguments: [
    { name: 'arg1', description: 'desc1', required: true },
    { name: 'arg2', description: 'desc2', required: false }
  ]
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
    expect(screen.getByText('2 arguments')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/prompt/test-prompt'
    )
  })
})
