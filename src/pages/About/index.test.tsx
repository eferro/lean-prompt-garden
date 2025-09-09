import { render, screen } from '@testing-library/react'
import About from './index'

describe('About', () => {
  it('should render the main heading', () => {
    render(<About />)
    
    expect(screen.getByRole('heading', { name: /lean prompt garden/i, level: 1 })).toBeInTheDocument()
  })

  it('should display the main description', () => {
    render(<About />)
    
    expect(screen.getByText(/a curated collection of software gardening prompts/i)).toBeInTheDocument()
  })

  it('should show key sections', () => {
    render(<About />)
    
    expect(screen.getByRole('heading', { name: /what is lean prompt garden/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /key features/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /how to use/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /api integration/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /our philosophy/i })).toBeInTheDocument()
  })

  it('should display the API endpoint section', () => {
    render(<About />)
    
    expect(screen.getAllByText(/api endpoint/i)).toHaveLength(2)
    expect(screen.getByText(/access all prompts programmatically/i)).toBeInTheDocument()
  })
})
