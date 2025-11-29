import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PromptRenderer from './index'
import type { PromptDefinition } from '../../types/prompt'

const samplePrompt: PromptDefinition = {
  name: 'greet',
  title: 'Greet',
  description: 'greeting prompt',
  messages: [
    { role: 'user', content: { type: 'text', text: 'Hello world' } },
    { role: 'assistant', content: { type: 'text', text: 'Hi there, nice to meet you.' } }
  ]
}

describe('PromptRenderer', () => {
  it('should render prompt content', () => {
    render(<PromptRenderer prompt={samplePrompt} />)

    expect(screen.getByText('Hello world')).toBeInTheDocument()
    expect(screen.getByText('Hi there, nice to meet you.')).toBeInTheDocument()
  })
})
