import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { PromptArgument } from '../../types/prompt'
import ArgumentsForm from './index'

describe('ArgumentsForm', () => {
  const mockArguments: PromptArgument[] = [
    {
      name: 'title',
      description: 'The title of the document',
      required: true,
    },
    {
      name: 'author',
      description: 'The author name',
      required: false,
    },
  ]

  it('should render form fields for each argument', () => {
    const mockOnChange = vi.fn()
    const values = {}

    render(
      <ArgumentsForm
        arguments={mockArguments}
        values={values}
        onChange={mockOnChange}
      />
    )

    // Should render title field
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('The title of the document')).toBeInTheDocument()
    
    // Should render author field
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('The author name')).toBeInTheDocument()

    // Should show required indicator for required fields
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should call onChange when input value changes', () => {
    const mockOnChange = vi.fn()
    const values = { title: '', author: '' }

    render(
      <ArgumentsForm
        arguments={mockArguments}
        values={values}
        onChange={mockOnChange}
      />
    )

    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'My Document Title' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      title: 'My Document Title',
      author: '',
    })
  })

  it('should display current values in input fields', () => {
    const mockOnChange = vi.fn()
    const values = { title: 'Current Title', author: 'John Doe' }

    render(
      <ArgumentsForm
        arguments={mockArguments}
        values={values}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByDisplayValue('Current Title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })

  it('should handle empty arguments array', () => {
    const mockOnChange = vi.fn()
    const values = {}

    render(
      <ArgumentsForm
        arguments={[]}
        values={values}
        onChange={mockOnChange}
      />
    )

    // Should still render the container but with no inputs
    expect(screen.getByText('Configure Arguments')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
