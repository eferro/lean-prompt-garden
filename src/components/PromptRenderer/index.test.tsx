import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PromptRenderer from './index'
import type { PromptDefinition } from '../../types/prompt'

const samplePrompt: PromptDefinition = {
  name: 'greet',
  title: 'Greet',
  description: 'greeting prompt',
  messages: [
    { role: 'user', content: { type: 'text', text: 'Hello {{name}}' } },
    { role: 'assistant', content: { type: 'text', text: 'Hi {{name}}, nice to meet you.' } }
  ]
}

describe('PromptRenderer', () => {
  it('should render prompt content with arguments', () => {
    const argumentValues = { name: 'Alice' }

    render(<PromptRenderer prompt={samplePrompt} argumentValues={argumentValues} />)

    expect(screen.getByText('Hello Alice')).toBeInTheDocument()
    expect(screen.getByText('Hi Alice, nice to meet you.')).toBeInTheDocument()
  })
})
