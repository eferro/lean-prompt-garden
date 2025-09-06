import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBox from './index'

describe('SearchBox', () => {
  it('should render with default placeholder', () => {
    const mockOnChange = vi.fn()
    render(<SearchBox value="" onChange={mockOnChange} />)

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('should render with custom placeholder', () => {
    const mockOnChange = vi.fn()
    render(<SearchBox value="" onChange={mockOnChange} placeholder="Find prompts..." />)

    expect(screen.getByPlaceholderText('Find prompts...')).toBeInTheDocument()
  })

  it('should display current value', () => {
    const mockOnChange = vi.fn()
    render(<SearchBox value="test query" onChange={mockOnChange} />)

    expect(screen.getByDisplayValue('test query')).toBeInTheDocument()
  })

  it('should call onChange when user types', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    
    render(<SearchBox value="" onChange={mockOnChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(mockOnChange).toHaveBeenCalledWith('t')
    expect(mockOnChange).toHaveBeenCalledWith('e')
    expect(mockOnChange).toHaveBeenCalledWith('s')
    expect(mockOnChange).toHaveBeenCalledWith('t')
  })

  it('should call onChange with correct value when cleared', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    
    render(<SearchBox value="initial" onChange={mockOnChange} />)
    
    const input = screen.getByRole('textbox')
    await user.clear(input)

    expect(mockOnChange).toHaveBeenCalledWith('')
  })

  it('should render search icon', () => {
    const mockOnChange = vi.fn()
    render(<SearchBox value="" onChange={mockOnChange} />)

    const icon = screen.getByRole('textbox').parentElement?.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should have correct input type', () => {
    const mockOnChange = vi.fn()
    render(<SearchBox value="" onChange={mockOnChange} />)

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })
})